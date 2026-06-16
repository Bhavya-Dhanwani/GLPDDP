"use client";

import { useEffect, useMemo, useState } from "react";
import { useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import getSocket from "@/lib/socket";
import { getLiveSnapshot } from "../api/cricket.api";

const idOf = (value) => {
    if (!value) return "";
    if (typeof value === "string" || typeof value === "number") return String(value);
    if (value.$oid) return String(value.$oid);
    if (value.id) return idOf(value.id);
    if (value._id) return idOf(value._id);
    return "";
};

const matchIdOf = (match) => idOf(match);

const upsertMatch = (queryClient, updatedMatch, liveSnapshot) => {
    const id = matchIdOf(updatedMatch);
    if (!id) return;

    queryClient.setQueryData(["matches", id], (current) => ({
        ...(current || {}),
        ...updatedMatch,
        liveSnapshot: liveSnapshot || current?.liveSnapshot,
    }));

    queryClient.setQueryData(["live-match", id], (current) =>
        current
            ? {
                  ...current,
                  match: {
                      ...current.match,
                      ...updatedMatch,
                  },
              }
            : current
    );

    queryClient.setQueriesData({ queryKey: ["matches"] }, (current) => {
        if (!Array.isArray(current)) return current;

        return current.map((match) =>
            matchIdOf(match) === id
                ? {
                      ...match,
                      ...updatedMatch,
                      liveSnapshot: liveSnapshot || match.liveSnapshot,
                  }
                : match
        );
    });
};

const applySnapshot = (queryClient, snapshot) => {
    const match = snapshot?.match;
    const id = matchIdOf(match);
    if (!id) return;

    queryClient.setQueryData(["live-match", id], snapshot);
    upsertMatch(queryClient, match, snapshot);
};

const normalizeMatchIds = (matchIds) =>
    [...new Set((matchIds || []).map((id) => String(id || "")).filter(Boolean))];

const defer = (callback) => {
    if (typeof queueMicrotask === "function") {
        queueMicrotask(callback);
        return;
    }
    setTimeout(callback, 0);
};

export const useLiveMatch = (matchId, options = {}) => {
    const { enabled = true } = options;
    const queryClient = useQueryClient();
    const id = matchId ? String(matchId) : "";
    const [connectionState, setConnectionState] = useState("idle");

    const snapshotQuery = useQuery({
        queryKey: ["live-match", id],
        queryFn: () => getLiveSnapshot(id),
        enabled: enabled && Boolean(id),
        refetchOnWindowFocus: true,
    });

    useEffect(() => {
        if (!enabled || !id) return undefined;

        const socket = getSocket();

        const handleConnect = () => setConnectionState("connected");
        const handleDisconnect = () => setConnectionState("disconnected");
        const handleConnectError = () => setConnectionState("error");
        const handleMatchUpdate = (match) => upsertMatch(queryClient, match);
        const handleSnapshotEvent = (payload) => {
            const snapshot = payload?.snapshot || payload;
            applySnapshot(queryClient, snapshot);
        };

        socket.on("connect", handleConnect);
        socket.on("disconnect", handleDisconnect);
        socket.on("connect_error", handleConnectError);
        socket.on("match:updated", handleMatchUpdate);
        socket.on("match:completed", handleMatchUpdate);
        socket.on("innings:started", handleSnapshotEvent);
        socket.on("score:updated", handleSnapshotEvent);
        socket.on("commentary:added", handleSnapshotEvent);
        socket.on("innings:completed", handleSnapshotEvent);
        socket.on("players:updated", handleSnapshotEvent);

        if (!socket.connected) {
            defer(() => setConnectionState("connecting"));
            socket.connect();
        } else {
            defer(() => setConnectionState("connected"));
        }

        socket.emit("match:join", { matchId: id }, (ack) => {
            if (!ack?.success) setConnectionState("error");
        });

        return () => {
            socket.emit("match:leave", id);
            socket.off("connect", handleConnect);
            socket.off("disconnect", handleDisconnect);
            socket.off("connect_error", handleConnectError);
            socket.off("match:updated", handleMatchUpdate);
            socket.off("match:completed", handleMatchUpdate);
            socket.off("innings:started", handleSnapshotEvent);
            socket.off("score:updated", handleSnapshotEvent);
            socket.off("commentary:added", handleSnapshotEvent);
            socket.off("innings:completed", handleSnapshotEvent);
            socket.off("players:updated", handleSnapshotEvent);
        };
    }, [enabled, id, queryClient]);

    return {
        ...snapshotQuery,
        connectionState,
    };
};

export const useLiveMatchRooms = (matchIds, options = {}) => {
    const { enabled = true } = options;
    const queryClient = useQueryClient();
    const ids = useMemo(() => normalizeMatchIds(matchIds), [matchIds]);
    const snapshots = useQueries({
        queries: ids.map((matchId) => ({
            queryKey: ["live-match", matchId],
            queryFn: async () => {
                const snapshot = await getLiveSnapshot(matchId);
                applySnapshot(queryClient, snapshot);
                return snapshot;
            },
            enabled: enabled && Boolean(matchId),
            staleTime: 1000 * 15,
        })),
        combine: (results) => results.map((result) => result.data).filter(Boolean),
    });

    useEffect(() => {
        if (!enabled || !ids.length) return undefined;

        const socket = getSocket();
        const handleMatchUpdate = (match) => upsertMatch(queryClient, match);
        const handleSnapshotEvent = (payload) => {
            const snapshot = payload?.snapshot || payload;
            applySnapshot(queryClient, snapshot);
        };

        socket.on("match:updated", handleMatchUpdate);
        socket.on("match:completed", handleMatchUpdate);
        socket.on("innings:started", handleSnapshotEvent);
        socket.on("score:updated", handleSnapshotEvent);
        socket.on("commentary:added", handleSnapshotEvent);
        socket.on("innings:completed", handleSnapshotEvent);
        socket.on("players:updated", handleSnapshotEvent);

        if (!socket.connected) socket.connect();
        ids.forEach((matchId) => socket.emit("match:join", { matchId }));

        return () => {
            ids.forEach((matchId) => socket.emit("match:leave", matchId));
            socket.off("match:updated", handleMatchUpdate);
            socket.off("match:completed", handleMatchUpdate);
            socket.off("innings:started", handleSnapshotEvent);
            socket.off("score:updated", handleSnapshotEvent);
            socket.off("commentary:added", handleSnapshotEvent);
            socket.off("innings:completed", handleSnapshotEvent);
            socket.off("players:updated", handleSnapshotEvent);
        };
    }, [enabled, ids, queryClient]);

    return snapshots;
};
