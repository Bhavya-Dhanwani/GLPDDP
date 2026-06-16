import BadRequest from "../../../shared/errors/badrequest.error.js";
import Conflict from "../../../shared/errors/conflict.error.js";
import NotFound from "../../../shared/errors/notfound.error.js";
import { MATCH_STATUS } from "../../../shared/constants/match.constatnts.js";
import {
  BOUNDARY_TYPES,
  COMMENTARY_TYPES,
  DISMISSAL_TYPES,
  INNINGS_STATUS,
} from "../../../shared/constants/scoring.constants.js";
import { MatchRepository } from "../../../shared/repositories/match.repository.js";
import { InningsRepository } from "../../../shared/repositories/innings.repository.js";
import { DeliveryRepository } from "../../../shared/repositories/delivery.repository.js";
import { CommentaryRepository } from "../../../shared/repositories/commentary.repository.js";
import { emitMatchEvent } from "../../../socket/socket.server.js";

const idOf = (value) => String(value?._id ?? value);
const emptyExtras = () => ({
  wides: 0,
  noBalls: 0,
  byes: 0,
  legByes: 0,
  penalties: 0,
});

export class ScoringService {
  constructor() {
    this.matchRepository = new MatchRepository();
    this.inningsRepository = new InningsRepository();
    this.deliveryRepository = new DeliveryRepository();
    this.commentaryRepository = new CommentaryRepository();
  }

  async startInnings(matchId, payload, userId) {
    const match = await this.matchRepository.findById(matchId);
    if (!match) throw new NotFound("Match not found");
    if (match.status !== MATCH_STATUS.LIVE) {
      throw new Conflict("Only a live match can start an innings");
    }

    const existingInnings = await this.inningsRepository.findByMatch(matchId);
    const inningsNumber = existingInnings.length + 1;
    if (inningsNumber > 2 || inningsNumber !== match.currentInnings) {
      throw new Conflict("The requested innings cannot be started");
    }

    const battingTeamId = idOf(payload.battingTeamId);
    const teamIds = [idOf(match.team1), idOf(match.team2)];
    if (!teamIds.includes(battingTeamId)) {
      throw new BadRequest("Batting team must be one of the match teams");
    }
    if (inningsNumber === 2 && battingTeamId === idOf(existingInnings[0].battingTeamId)) {
      throw new BadRequest("The second innings batting team must be different");
    }
    if (inningsNumber === 1 && battingTeamId !== this.getTossBattingTeamId(match)) {
      throw new BadRequest("First innings batting team does not match the toss decision");
    }

    const bowlingTeamId = teamIds.find((teamId) => teamId !== battingTeamId);
    const battingXI = this.getPlayingXI(match, battingTeamId);
    const bowlingXI = this.getPlayingXI(match, bowlingTeamId);
    if (idOf(payload.strikerId) === idOf(payload.nonStrikerId)) {
      throw new BadRequest("Opening batters must be different");
    }
    this.assertPlayerInXI(payload.strikerId, battingXI, "Striker");
    this.assertPlayerInXI(payload.nonStrikerId, battingXI, "Non-striker");
    this.assertPlayerInXI(payload.bowlerId, bowlingXI, "Bowler");

    const innings = await this.inningsRepository.create({
      matchId,
      inningsNumber,
      battingTeamId,
      bowlingTeamId,
      strikerId: payload.strikerId,
      nonStrikerId: payload.nonStrikerId,
      currentBowlerId: payload.bowlerId,
      battingScorecard: [{ player: payload.strikerId }, { player: payload.nonStrikerId }],
      bowlingScorecard: [{ player: payload.bowlerId }],
      target: inningsNumber === 2 ? existingInnings[0].runs + 1 : undefined,
      createdBy: userId,
    });

    emitMatchEvent(matchId, "innings:started", await this.getSnapshot(matchId));
    return innings;
  }

  async recordDelivery(inningsId, payload, userId) {
    const innings = await this.inningsRepository.findById(inningsId);
    if (!innings) throw new NotFound("Innings not found");
    if (innings.status !== INNINGS_STATUS.LIVE) {
      throw new Conflict("This innings is already completed");
    }
    if (innings.revision !== payload.expectedRevision) {
      throw new Conflict("Score changed since it was loaded. Refresh the innings state");
    }

    const match = await this.matchRepository.findById(innings.matchId);
    if (!match || match.status !== MATCH_STATUS.LIVE) {
      throw new Conflict("Match is not live");
    }

    const extras = { ...emptyExtras(), ...payload.extras };
    const isLegalDelivery = extras.wides === 0 && extras.noBalls === 0;
    const batterRuns = payload.batterRuns ?? 0;
    const totalRuns = batterRuns + Object.values(extras).reduce((sum, value) => sum + value, 0);
    this.validateDeliveryValues(batterRuns, extras, payload.boundaryType);
    const bowlerId = this.resolveBowler(innings, payload.bowlerId, match);
    const wicket = this.normalizeWicket(payload.wicket);
    this.validateWicket(innings, wicket, payload.nextBatterId, match, {
      isLegalDelivery,
      totalRuns,
    });

    const lastDelivery = await this.deliveryRepository.findLastByInnings(inningsId);
    const sequenceNumber = (lastDelivery?.sequenceNumber ?? 0) + 1;
    const delivery = await this.deliveryRepository.create({
      matchId: innings.matchId,
      inningsId,
      sequenceNumber,
      legalBallsBefore: innings.legalBalls,
      isLegalDelivery,
      strikerId: innings.strikerId,
      nonStrikerId: innings.nonStrikerId,
      bowlerId,
      batterRuns,
      totalRuns,
      boundaryType: payload.boundaryType ?? BOUNDARY_TYPES.NONE,
      extras,
      wicket,
      createdBy: userId,
    });

    this.applyDelivery(innings, {
      batterRuns,
      totalRuns,
      extras,
      isLegalDelivery,
      boundaryType: payload.boundaryType ?? BOUNDARY_TYPES.NONE,
      bowlerId,
      wicket,
      nextBatterId: payload.nextBatterId,
      maxLegalBalls: match.oversPerInnings * 6,
    });
    innings.updatedBy = userId;
    innings.revision += 1;
    await innings.save();

    if (innings.status === INNINGS_STATUS.COMPLETED && innings.inningsNumber === 1) {
      await this.matchRepository.updateById(innings.matchId, {
        status: MATCH_STATUS.INNINGS_BREAK,
        updatedBy: userId,
      });
    }

    const commentary = await this.commentaryRepository.create({
      matchId: innings.matchId,
      inningsId,
      deliveryId: delivery._id,
      sequenceNumber,
      text: this.generateCommentary(delivery),
      types: this.getCommentaryTypes(delivery, innings),
      createdBy: userId,
    });

    const snapshot = await this.getSnapshot(innings.matchId);
    emitMatchEvent(idOf(innings.matchId), "score:updated", { delivery, commentary, snapshot });

    if (innings.status === INNINGS_STATUS.COMPLETED) {
      emitMatchEvent(idOf(innings.matchId), "innings:completed", {
        inningsNumber: innings.inningsNumber,
        snapshot,
      });
    }

    return { delivery, commentary, innings };
  }

  async updateCurrentPlayers(inningsId, payload, userId) {
    const innings = await this.inningsRepository.findById(inningsId);
    if (!innings) throw new NotFound("Innings not found");
    if (innings.status !== INNINGS_STATUS.LIVE) {
      throw new Conflict("Current players can only be changed for a live innings");
    }
    if (innings.revision !== payload.expectedRevision) {
      throw new Conflict("Score changed since it was loaded. Refresh the innings state");
    }

    const match = await this.matchRepository.findById(innings.matchId);
    const battingXI = this.getPlayingXI(match, innings.battingTeamId);
    const bowlingXI = this.getPlayingXI(match, innings.bowlingTeamId);
    if (idOf(payload.strikerId) === idOf(payload.nonStrikerId)) {
      throw new BadRequest("Striker and non-striker must be different");
    }
    this.assertPlayerInXI(payload.strikerId, battingXI, "Striker");
    this.assertPlayerInXI(payload.nonStrikerId, battingXI, "Non-striker");
    this.assertPlayerInXI(payload.bowlerId, bowlingXI, "Bowler");
    this.assertActiveBatter(innings, payload.strikerId, "Striker");
    this.assertActiveBatter(innings, payload.nonStrikerId, "Non-striker");

    innings.strikerId = payload.strikerId;
    innings.nonStrikerId = payload.nonStrikerId;
    innings.currentBowlerId = payload.bowlerId;
    innings.updatedBy = userId;
    innings.revision += 1;
    await innings.save();

    emitMatchEvent(idOf(innings.matchId), "players:updated", {
      snapshot: await this.getSnapshot(innings.matchId),
    });
    return innings;
  }

  async getSnapshot(matchId) {
    const [match, innings, deliveries, commentary] = await Promise.all([
      this.matchRepository.findById(matchId),
      this.inningsRepository.findByMatch(matchId),
      this.deliveryRepository.findRecentByMatch(matchId, 12),
      this.commentaryRepository.findRecentByMatch(matchId, 30),
    ]);
    if (!match) throw new NotFound("Match not found");
    return { match, innings, deliveries, commentary };
  }

  async getCommentary(matchId, options) {
    const match = await this.matchRepository.exists(matchId);
    if (!match) throw new NotFound("Match not found");
    return this.commentaryRepository.findByMatch(matchId, options);
  }

  getTossBattingTeamId(match) {
    const tossWinnerId = idOf(match.tossWinner);
    if (match.tossDecision === "BAT") return tossWinnerId;
    return idOf(match.team1) === tossWinnerId ? idOf(match.team2) : idOf(match.team1);
  }

  getPlayingXI(match, teamId) {
    const teamKey = idOf(match.team1) === idOf(teamId) ? "team1" : "team2";
    return match.playingXI[teamKey].map(({ player }) => idOf(player));
  }

  assertPlayerInXI(playerId, playingXI, label) {
    if (!playingXI.includes(idOf(playerId))) {
      throw new BadRequest(`${label} must be selected in the Playing XI`);
    }
  }

  assertActiveBatter(innings, playerId, label) {
    const batter = innings.battingScorecard.find(
      ({ player }) => idOf(player) === idOf(playerId)
    );
    if (!batter || batter.isOut) {
      throw new BadRequest(`${label} must be an active batter in this innings`);
    }
  }

  resolveBowler(innings, requestedBowlerId, match) {
    const isNewOver = innings.legalBalls > 0 && innings.legalBalls % 6 === 0;
    const currentBowlerId = idOf(innings.currentBowlerId);
    if (isNewOver && !requestedBowlerId) {
      throw new BadRequest("A bowler is required at the start of a new over");
    }
    if (!isNewOver && requestedBowlerId && idOf(requestedBowlerId) !== currentBowlerId) {
      throw new BadRequest("Bowler can only be changed at the start of an over");
    }

    const bowlerId = requestedBowlerId ?? currentBowlerId;
    this.assertPlayerInXI(bowlerId, this.getPlayingXI(match, innings.bowlingTeamId), "Bowler");
    if (isNewOver && idOf(bowlerId) === currentBowlerId) {
      throw new BadRequest("A bowler cannot bowl consecutive overs");
    }
    return bowlerId;
  }

  normalizeWicket(wicket = {}) {
    if (!wicket.occurred) return { occurred: false };
    const notCreditedToBowler = [
      DISMISSAL_TYPES.RUN_OUT,
      DISMISSAL_TYPES.RETIRED_HURT,
      DISMISSAL_TYPES.OBSTRUCTING_FIELD,
    ];
    return {
      occurred: true,
      playerOutId: wicket.playerOutId,
      dismissalType: wicket.dismissalType,
      fielderId: wicket.fielderId,
      countsAsTeamWicket:
        wicket.countsAsTeamWicket ?? wicket.dismissalType !== DISMISSAL_TYPES.RETIRED_HURT,
      creditedToBowler:
        wicket.creditedToBowler ?? !notCreditedToBowler.includes(wicket.dismissalType),
    };
  }

  validateDeliveryValues(batterRuns, extras, boundaryType = BOUNDARY_TYPES.NONE) {
    if (extras.wides > 0 && extras.noBalls > 0) {
      throw new BadRequest("A delivery cannot be both a wide and a no-ball");
    }
    if (extras.byes > 0 && extras.legByes > 0) {
      throw new BadRequest("A delivery cannot contain both byes and leg-byes");
    }
    if ((extras.wides > 0 || extras.byes > 0 || extras.legByes > 0) && batterRuns > 0) {
      throw new BadRequest("Batter runs cannot be combined with wides, byes, or leg-byes");
    }
    if (boundaryType === BOUNDARY_TYPES.FOUR && batterRuns !== 4) {
      throw new BadRequest("A FOUR boundary must contain four batter runs");
    }
    if (boundaryType === BOUNDARY_TYPES.SIX && batterRuns !== 6) {
      throw new BadRequest("A SIX boundary must contain six batter runs");
    }
  }

  validateWicket(innings, wicket, nextBatterId, match, delivery) {
    if (!wicket.occurred) return;
    if (!wicket.playerOutId || !wicket.dismissalType) {
      throw new BadRequest("Player out and dismissal type are required for a wicket");
    }
    if (![idOf(innings.strikerId), idOf(innings.nonStrikerId)].includes(idOf(wicket.playerOutId))) {
      throw new BadRequest("Player out must be one of the current batters");
    }

    const finalWicket = wicket.countsAsTeamWicket && innings.wickets + 1 >= 10;
    const finalBall =
      delivery.isLegalDelivery &&
      innings.legalBalls + 1 >= match.oversPerInnings * 6;
    const targetReached =
      innings.target && innings.runs + delivery.totalRuns >= innings.target;
    if (!finalWicket && !finalBall && !targetReached && !nextBatterId) {
      throw new BadRequest("Next batter is required after a wicket");
    }
    if (nextBatterId) {
      this.assertPlayerInXI(
        nextBatterId,
        this.getPlayingXI(match, innings.battingTeamId),
        "Next batter"
      );
      if (innings.battingScorecard.some(({ player }) => idOf(player) === idOf(nextBatterId))) {
        throw new BadRequest("Next batter has already batted");
      }
    }
  }

  applyDelivery(innings, event) {
    innings.runs += event.totalRuns;
    Object.keys(event.extras).forEach((key) => {
      innings.extras[key] += event.extras[key];
    });
    if (event.isLegalDelivery) innings.legalBalls += 1;
    innings.currentBowlerId = event.bowlerId;

    this.updateBattingFigures(innings, event);
    this.updateBowlingFigures(innings, event);
    this.applyWicket(innings, event);

    if (event.totalRuns % 2 === 1) this.swapStrike(innings);
    if (event.isLegalDelivery && innings.legalBalls % 6 === 0) this.swapStrike(innings);

    if (
      innings.wickets >= 10 ||
      innings.legalBalls >= event.maxLegalBalls ||
      (innings.target && innings.runs >= innings.target)
    ) {
      innings.status = INNINGS_STATUS.COMPLETED;
      innings.completedAt = new Date();
    }
  }

  updateBattingFigures(innings, event) {
    const batter = innings.battingScorecard.find(
      ({ player }) => idOf(player) === idOf(innings.strikerId)
    );
    batter.runs += event.batterRuns;
    if (event.extras.wides === 0) batter.balls += 1;
    if (event.boundaryType === BOUNDARY_TYPES.FOUR) batter.fours += 1;
    if (event.boundaryType === BOUNDARY_TYPES.SIX) batter.sixes += 1;
  }

  updateBowlingFigures(innings, event) {
    let bowler = innings.bowlingScorecard.find(
      ({ player }) => idOf(player) === idOf(event.bowlerId)
    );
    if (!bowler) {
      innings.bowlingScorecard.push({ player: event.bowlerId });
      bowler = innings.bowlingScorecard.at(-1);
    }
    if (event.isLegalDelivery) bowler.legalBalls += 1;
    bowler.runsConceded += event.batterRuns + event.extras.wides + event.extras.noBalls;
    bowler.wides += event.extras.wides;
    bowler.noBalls += event.extras.noBalls;
    if (event.wicket.occurred && event.wicket.creditedToBowler) bowler.wickets += 1;
  }

  applyWicket(innings, event) {
    if (!event.wicket.occurred) return;
    if (event.wicket.countsAsTeamWicket) innings.wickets += 1;

    const batter = innings.battingScorecard.find(
      ({ player }) => idOf(player) === idOf(event.wicket.playerOutId)
    );
    batter.isOut = true;
    batter.dismissalType = event.wicket.dismissalType;

    if (!event.nextBatterId || innings.wickets >= 10) return;
    innings.battingScorecard.push({ player: event.nextBatterId });
    if (idOf(innings.strikerId) === idOf(event.wicket.playerOutId)) {
      innings.strikerId = event.nextBatterId;
    } else {
      innings.nonStrikerId = event.nextBatterId;
    }
  }

  swapStrike(innings) {
    const striker = innings.strikerId;
    innings.strikerId = innings.nonStrikerId;
    innings.nonStrikerId = striker;
  }

  generateCommentary(delivery) {
    const ball = `${Math.floor(delivery.legalBallsBefore / 6)}.${(delivery.legalBallsBefore % 6) + 1}`;
    if (delivery.wicket.occurred) return `${ball}: WICKET!`;
    if (delivery.boundaryType === BOUNDARY_TYPES.SIX) return `${ball}: SIX!`;
    if (delivery.boundaryType === BOUNDARY_TYPES.FOUR) return `${ball}: FOUR!`;
    if (delivery.extras.wides > 0) return `${ball}: ${delivery.extras.wides} wide run(s).`;
    if (delivery.extras.noBalls > 0) return `${ball}: No-ball, ${delivery.totalRuns} total run(s).`;
    return `${ball}: ${delivery.totalRuns} run(s).`;
  }

  getCommentaryTypes(delivery, innings) {
    const types = [COMMENTARY_TYPES.NORMAL];
    if (delivery.wicket.occurred) types.push(COMMENTARY_TYPES.WICKET);
    if (delivery.boundaryType === BOUNDARY_TYPES.FOUR) types.push(COMMENTARY_TYPES.FOUR);
    if (delivery.boundaryType === BOUNDARY_TYPES.SIX) types.push(COMMENTARY_TYPES.SIX);
    if (innings.status === INNINGS_STATUS.COMPLETED) types.push(COMMENTARY_TYPES.INNINGS_END);
    return types;
  }
}
