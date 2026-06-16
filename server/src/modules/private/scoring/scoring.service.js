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
import PlayerRepository from "../../../shared/repositories/player.repository.js";
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
    this.playerRepository = new PlayerRepository();
  }

  async startInnings(matchId, payload, userId) {
    const match = await this.matchRepository.findById(matchId);
    if (!match) throw new NotFound("Match not found");
    const existingInnings = await this.inningsRepository.findByMatch(matchId);
    const inningsNumber = existingInnings.length + 1;
    const canStartFirstInnings =
      inningsNumber === 1 &&
      match.currentInnings === 1 &&
      match.status === MATCH_STATUS.LIVE;
    const canStartSecondInnings =
      inningsNumber === 2 &&
      match.currentInnings === 2 &&
      [MATCH_STATUS.LIVE, MATCH_STATUS.INNINGS_BREAK].includes(match.status);

    if (inningsNumber > 2 || (!canStartFirstInnings && !canStartSecondInnings)) {
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

    if (inningsNumber === 2 && match.status === MATCH_STATUS.INNINGS_BREAK) {
      await this.matchRepository.updateById(matchId, {
        status: MATCH_STATUS.LIVE,
        currentInnings: 2,
        updatedBy: userId,
      });
    }

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
      batterRuns,
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
      nextBatterId: payload.nextBatterId,
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

    if (innings.status === INNINGS_STATUS.COMPLETED) {
      await this.applyPlayerStatsForInnings(innings);
    }

    await this.advanceMatchAfterCompletedInnings(innings, userId);

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
      if (snapshot.match?.status === MATCH_STATUS.COMPLETED) {
        emitMatchEvent(idOf(innings.matchId), "match:completed", snapshot.match);
      }
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
    const [match, innings] = await Promise.all([
      this.matchRepository.findById(matchId),
      this.inningsRepository.findByMatch(matchId),
    ]);
    if (!match) throw new NotFound("Match not found");
    const inningsIds = innings.map((item) => idOf(item));
    const [deliveries, recentDeliveries, commentary] = await Promise.all([
      this.deliveryRepository.findByMatch(matchId, inningsIds),
      this.deliveryRepository.findRecentByMatch(matchId, 240, inningsIds),
      this.commentaryRepository.findRecentByMatch(matchId, 100),
    ]);
    const deliveriesByInnings = deliveries.reduce((groups, delivery) => {
      const inningsId = idOf(delivery.inningsId);
      groups.set(inningsId, [...(groups.get(inningsId) || []), delivery]);
      return groups;
    }, new Map());

    return {
      match,
      innings: innings.map((item) => this.enrichInnings(item, deliveriesByInnings.get(idOf(item)) || [], match)),
      deliveries: recentDeliveries,
      commentary,
    };
  }

  enrichInnings(innings, deliveries = [], match = null) {
    const plainInnings = typeof innings.toJSON === "function" ? innings.toJSON() : innings;
    const reconciledInnings = deliveries.length
      ? this.reconcileInningsFromDeliveries(plainInnings, deliveries)
      : plainInnings;
    const legalBalls = reconciledInnings.legalBalls || 0;
    const maxLegalBalls = (match?.oversPerInnings || 0) * 6;
    const isOversComplete = maxLegalBalls > 0 && legalBalls >= maxLegalBalls;
    const isAllOut = (reconciledInnings.wickets || 0) >= 10;
    const isTargetReached = reconciledInnings.target && reconciledInnings.runs >= reconciledInnings.target;
    const status =
      [INNINGS_STATUS.COMPLETED, INNINGS_STATUS.LIVE].includes(reconciledInnings.status) &&
      (isOversComplete || isAllOut || isTargetReached)
        ? INNINGS_STATUS.COMPLETED
        : reconciledInnings.status;

    return {
      ...reconciledInnings,
      status,
      overs: `${Math.floor(legalBalls / 6)}.${legalBalls % 6}`,
      runRate: legalBalls ? Number(((reconciledInnings.runs * 6) / legalBalls).toFixed(2)) : 0,
      battingScorecard: (reconciledInnings.battingScorecard || []).map((row) => ({
        ...row,
        strikeRate: row.balls ? Number(((row.runs * 100) / row.balls).toFixed(2)) : 0,
      })),
      bowlingScorecard: (reconciledInnings.bowlingScorecard || []).map((row) => ({
        ...row,
        overs: `${Math.floor((row.legalBalls || 0) / 6)}.${(row.legalBalls || 0) % 6}`,
        economy: row.legalBalls ? Number(((row.runsConceded * 6) / row.legalBalls).toFixed(2)) : 0,
      })),
    };
  }

  reconcileInningsFromDeliveries(innings, deliveries) {
    const extras = emptyExtras();
    const battingRows = new Map();
    const bowlingRows = new Map();
    const ensureBattingRow = (player) => {
      const playerId = idOf(player);
      if (!playerId) return null;
      if (!battingRows.has(playerId)) {
        battingRows.set(playerId, {
          player,
          runs: 0,
          balls: 0,
          fours: 0,
          sixes: 0,
          isOut: false,
        });
      }
      return battingRows.get(playerId);
    };
    const ensureBowlingRow = (player) => {
      const playerId = idOf(player);
      if (!playerId) return null;
      if (!bowlingRows.has(playerId)) {
        bowlingRows.set(playerId, {
          player,
          legalBalls: 0,
          runsConceded: 0,
          wickets: 0,
          wides: 0,
          noBalls: 0,
        });
      }
      return bowlingRows.get(playerId);
    };

    (innings.battingScorecard || []).forEach((row) => {
      if (!idOf(row.player)) return;
      battingRows.set(idOf(row.player), {
        player: row.player,
        runs: 0,
        balls: 0,
        fours: 0,
        sixes: 0,
        isOut: false,
        dismissalType: row.dismissalType,
      });
    });
    (innings.bowlingScorecard || []).forEach((row) => {
      if (!idOf(row.player)) return;
      bowlingRows.set(idOf(row.player), {
        player: row.player,
        legalBalls: 0,
        runsConceded: 0,
        wickets: 0,
        wides: 0,
        noBalls: 0,
      });
    });

    let runs = 0;
    let wickets = 0;
    let legalBalls = 0;
    const orderedDeliveries = [...deliveries].sort((a, b) => a.sequenceNumber - b.sequenceNumber);
    const firstDelivery = orderedDeliveries[0];
    let currentStrikerId = idOf(firstDelivery?.strikerId || innings.strikerId);
    let currentNonStrikerId = idOf(firstDelivery?.nonStrikerId || innings.nonStrikerId);
    let currentStriker = firstDelivery?.strikerId || innings.strikerId;
    let currentNonStriker = firstDelivery?.nonStrikerId || innings.nonStrikerId;
    let currentBowler = innings.currentBowlerId;
    const swapCurrentBatters = () => {
      const strikerId = currentStrikerId;
      const striker = currentStriker;
      currentStrikerId = currentNonStrikerId;
      currentStriker = currentNonStriker;
      currentNonStrikerId = strikerId;
      currentNonStriker = striker;
    };

    orderedDeliveries.forEach((delivery) => {
      const deliveryExtras = { ...emptyExtras(), ...(delivery.extras?.toJSON?.() || delivery.extras || {}) };
      const batterRuns = Number(delivery.batterRuns || 0);
      const totalRuns = Number(delivery.totalRuns || 0);
      const batter = ensureBattingRow(currentStriker || delivery.strikerId);
      const bowler = ensureBowlingRow(delivery.bowlerId);
      currentBowler = delivery.bowlerId || currentBowler;

      runs += totalRuns;
      Object.keys(extras).forEach((key) => {
        extras[key] += Number(deliveryExtras[key] || 0);
      });
      if (delivery.isLegalDelivery) legalBalls += 1;

      if (batter) {
        batter.runs += batterRuns;
        if (!deliveryExtras.wides) batter.balls += 1;
        if (delivery.boundaryType === BOUNDARY_TYPES.FOUR || batterRuns === 4) batter.fours += 1;
        if (delivery.boundaryType === BOUNDARY_TYPES.SIX || batterRuns === 6) batter.sixes += 1;
      }

      if (bowler) {
        if (delivery.isLegalDelivery) bowler.legalBalls += 1;
        bowler.runsConceded += batterRuns + Number(deliveryExtras.wides || 0) + Number(deliveryExtras.noBalls || 0);
        bowler.wides += Number(deliveryExtras.wides || 0);
        bowler.noBalls += Number(deliveryExtras.noBalls || 0);
      }

      if (delivery.wicket?.occurred) {
        const outRow = ensureBattingRow(delivery.wicket.playerOutId);
        if (outRow) {
          outRow.isOut = true;
          outRow.dismissalType = delivery.wicket.dismissalType;
        }
        if (delivery.wicket.countsAsTeamWicket !== false) wickets += 1;
        if (bowler && delivery.wicket.creditedToBowler !== false) bowler.wickets += 1;
        if (delivery.nextBatterId) {
          if (idOf(delivery.wicket.playerOutId) === currentStrikerId) {
            currentStriker = delivery.nextBatterId;
            currentStrikerId = idOf(delivery.nextBatterId);
            ensureBattingRow(delivery.nextBatterId);
          } else if (idOf(delivery.wicket.playerOutId) === currentNonStrikerId) {
            currentNonStriker = delivery.nextBatterId;
            currentNonStrikerId = idOf(delivery.nextBatterId);
            ensureBattingRow(delivery.nextBatterId);
          }
        }
      }

      if (totalRuns % 2 === 1) swapCurrentBatters();
      if (delivery.isLegalDelivery && legalBalls % 6 === 0) swapCurrentBatters();
    });

    return {
      ...innings,
      runs,
      wickets,
      legalBalls,
      extras,
      strikerId: currentStriker,
      nonStrikerId: currentNonStriker,
      currentBowlerId: currentBowler,
      battingScorecard: [...battingRows.values()],
      bowlingScorecard: [...bowlingRows.values()],
    };
  }

  async getCommentary(matchId, options) {
    const match = await this.matchRepository.exists(matchId);
    if (!match) throw new NotFound("Match not found");
    return this.commentaryRepository.findByMatch(matchId, options);
  }

  async addManualCommentary(matchId, payload, userId) {
    const match = await this.matchRepository.exists(matchId);
    if (!match) throw new NotFound("Match not found");

    const innings = await this.inningsRepository.findLiveByMatch(matchId);
    if (!innings) {
      throw new BadRequest("Start an innings before adding commentary");
    }

    const latest = await this.commentaryRepository.findLatestByInnings(idOf(innings));
    const commentary = await this.commentaryRepository.create({
      matchId,
      inningsId: idOf(innings),
      sequenceNumber: (latest?.sequenceNumber || 0) + 1,
      text: payload.text,
      types: [COMMENTARY_TYPES.NORMAL],
      createdBy: userId,
    });
    const snapshot = await this.getSnapshot(matchId);

    emitMatchEvent(matchId, "commentary:added", { commentary, snapshot });
    return commentary;
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
    if (delivery.batterRuns > 0) {
      throw new BadRequest("Batter runs cannot be added on a wicket delivery");
    }
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
    const noNextBatterAvailable = this.getAvailableNextBatters(innings, match).length === 0;
    if (!finalWicket && !finalBall && !targetReached && !noNextBatterAvailable && !nextBatterId) {
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

    const inningsEndedByNoNextBatter =
      event.wicket.occurred &&
      event.wicket.countsAsTeamWicket &&
      !event.nextBatterId &&
      this.countActiveBatters(innings) < 2;

    if (
      innings.wickets >= 10 ||
      inningsEndedByNoNextBatter ||
      innings.legalBalls >= event.maxLegalBalls ||
      (innings.target && innings.runs >= innings.target)
    ) {
      innings.status = INNINGS_STATUS.COMPLETED;
      innings.completedAt = new Date();
    }
  }

  getAvailableNextBatters(innings, match) {
    const battingXI = this.getPlayingXI(match, innings.battingTeamId);
    const usedBatters = new Set((innings.battingScorecard || []).map((row) => idOf(row.player)));
    return battingXI.filter((playerId) => !usedBatters.has(idOf(playerId)));
  }

  countActiveBatters(innings) {
    return (innings.battingScorecard || []).filter((row) => !row.isOut).length;
  }

  async applyPlayerStatsForInnings(innings) {
    if (innings.statsApplied) return;

    const battingUpdates = (innings.battingScorecard || []).map((row) => ({
      playerId: row.player,
      inc: {
        "stats.matches": 1,
        "stats.innings": 1,
        "stats.notOuts": row.isOut ? 0 : 1,
        "stats.runs": row.runs || 0,
        "stats.ballsFaced": row.balls || 0,
        "stats.fours": row.fours || 0,
        "stats.sixes": row.sixes || 0,
      },
      max: {
        "stats.highestScore": row.runs || 0,
      },
    }));

    const bowlingUpdates = (innings.bowlingScorecard || []).map((row) => ({
      playerId: row.player,
      inc: {
        "stats.wickets": row.wickets || 0,
        "stats.ballsBowled": row.legalBalls || 0,
        "stats.runsConceded": row.runsConceded || 0,
        "stats.wides": row.wides || 0,
        "stats.noBalls": row.noBalls || 0,
      },
    }));

    await this.playerRepository.applyInningsStats([...battingUpdates, ...bowlingUpdates]);
    innings.statsApplied = true;
    await innings.save();
  }

  async advanceMatchAfterCompletedInnings(innings, userId) {
    if (innings.status !== INNINGS_STATUS.COMPLETED) return;

    if (innings.inningsNumber === 1) {
      await this.matchRepository.updateById(innings.matchId, {
        status: MATCH_STATUS.INNINGS_BREAK,
        currentInnings: 2,
        updatedBy: userId,
      });
      return;
    }

    if (innings.inningsNumber === 2) {
      const allInnings = await this.inningsRepository.findByMatch(innings.matchId);
      const firstInnings = allInnings.find((item) => item.inningsNumber === 1);
      const secondInnings = allInnings.find((item) => item.inningsNumber === 2);
      if (!firstInnings || !secondInnings) return;

      const result = this.getMatchResult(firstInnings, secondInnings);
      await this.matchRepository.updateById(innings.matchId, {
        status: MATCH_STATUS.COMPLETED,
        winner: result.winner,
        result: result.text,
        endTime: new Date(),
        updatedBy: userId,
      });
    }
  }

  getMatchResult(firstInnings, secondInnings) {
    const firstRuns = Number(firstInnings.runs || 0);
    const secondRuns = Number(secondInnings.runs || 0);
    const firstTeam = firstInnings.battingTeamId;
    const secondTeam = secondInnings.battingTeamId;

    if (secondRuns > firstRuns) {
      const wicketsRemaining = Math.max(10 - Number(secondInnings.wickets || 0), 0);
      return {
        winner: idOf(secondTeam),
        text: `${this.teamName(secondTeam)} won by ${wicketsRemaining} wicket${wicketsRemaining === 1 ? "" : "s"}`,
      };
    }

    if (firstRuns > secondRuns) {
      const runMargin = firstRuns - secondRuns;
      return {
        winner: idOf(firstTeam),
        text: `${this.teamName(firstTeam)} won by ${runMargin} run${runMargin === 1 ? "" : "s"}`,
      };
    }

    return {
      winner: undefined,
      text: "Match tied",
    };
  }

  teamName(team) {
    return team?.shortName || team?.name || "Team";
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
