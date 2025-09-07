// @ts-nocheck

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";

const STORAGE_KEY = "pftc_data";
const BLOB_ID = "1413950116561346560";
// Use the API endpoint for programmatic access
const BLOB_API_URL = `https://jsonblob.com/api/jsonBlob/${BLOB_ID}`;

function normalizeName(name) {
  return (name || "").trim().toLowerCase();
}

function formatDateUK(isoDate) {
  if (!isoDate || typeof isoDate !== "string") return isoDate || "";
  const parts = isoDate.split("-");
  if (parts.length !== 3) return isoDate;
  const [y, m, d] = parts;
  const yy = String(y).slice(2);
  const mm = String(m).padStart(2, "0");
  const dd = String(d).padStart(2, "0");
  return `${dd}/${mm}/${yy}`;
}

function uuid() {
  if (typeof crypto !== "undefined" && crypto.randomUUID)
    return crypto.randomUUID();
  return "id-" + Math.random().toString(16).slice(2) + Date.now().toString(16);
}

function ensureShape(x) {
  const data = x && typeof x === "object" ? x : {};
  return {
    sessions: Array.isArray(data.sessions) ? data.sessions : [],
    scores: Array.isArray(data.scores) ? data.scores : [],
  };
}

function computeLeaderboard(data, view, { penalty = 50, sessionId } = {}) {
  const sessions = [...data.sessions].sort((a, b) =>
    a.date.localeCompare(b.date)
  );
  const scores = data.scores;

  if (view === "session") {
    const sid = sessionId || sessions[0]?.id;
    const session = sessions.find((s) => s.id === sid);
    const rows = scores
      .filter((s) => s.session === sid)
      .map((s) => ({ name: s.name, score: s.score }))
      .sort((a, b) => a.score - b.score || a.name.localeCompare(b.name));
    return {
      title: session
        ? `Session: ${formatDateUK(session.date)} — ${session.distance}`
        : "Session",
      rows,
      columns: ["Rank", "Name", "Score"],
    };
  }

  const users = Array.from(
    new Map(
      data.scores.map((s) => [normalizeName(s.name), s.name.trim()])
    ).values()
  );

  if (view === "best") {
    const rows = users
      .map((name) => {
        const userScores = scores.filter(
          (s) => normalizeName(s.name) === normalizeName(name)
        );
        const best = Math.min(...userScores.map((s) => s.score));
        return { name, score: best, extra: `${userScores.length} session(s)` };
      })
      .sort((a, b) => a.score - b.score || a.name.localeCompare(b.name));
    return {
      title: "All-Time Best (per user)",
      rows,
      columns: ["Rank", "Name", "Best Score", "Sessions"],
    };
  }

  if (view === "cumulative") {
    const sessionIds = sessions.map((s) => s.id);
    const rows = users
      .map((name) => {
        const norm = normalizeName(name);
        let total = 0;
        let completed = 0;
        for (const sid of sessionIds) {
          const sc = scores.find(
            (s) => normalizeName(s.name) === norm && s.session === sid
          );
          if (sc) {
            total += sc.score;
            completed += 1;
          } else {
            total += penalty;
          }
        }
        const missing = sessionIds.length - completed;
        return {
          name,
          score: total,
          extra: `${completed} done, ${missing} missed`,
        };
      })
      .sort((a, b) => a.score - b.score || a.name.localeCompare(b.name));
    return {
      title: `All-Time Cumulative (penalty ${penalty})`,
      rows,
      columns: ["Rank", "Name", "Total Score", "Progress"],
    };
  }

  return { title: "Leaderboard", rows: [], columns: ["Rank", "Name", "Score"] };
}

export const ParForTheCourse = () => {
  const defaultDistance = "600m";
  const defaultPenalty = 50;
  const [data, setData] = useState(() => {
    try {
      const raw =
        typeof window !== "undefined"
          ? window.localStorage.getItem(STORAGE_KEY)
          : null;
      return ensureShape(raw ? JSON.parse(raw) : {});
    } catch {
      return ensureShape();
    }
  });

  const [viewMode, setViewMode] = useState("session");
  // Ensure the first session is selected on first render (from localStorage if present)
  const [selectedSessionId, setSelectedSessionId] = useState(() => {
    try {
      if (typeof window === "undefined") return "";
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const initial = ensureShape(raw ? JSON.parse(raw) : {});
      const sorted = [...initial.sessions].sort((a, b) => a.date.localeCompare(b.date));
      return sorted[0]?.id || "";
    } catch {
      return "";
    }
  });
  const [penalty] = useState(defaultPenalty);
  const [todayIso] = useState(() => new Date().toISOString().slice(0, 10));

  const [syncStatus, setSyncStatus] = useState("");
  const syncingRef = useRef(false);

  async function fetchRemote() {
    const res = await fetch(BLOB_API_URL, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Remote GET failed: ${res.status}`);
    return await res.json();
  }

  async function pushRemote(nextData) {
    if (syncingRef.current) return; // simple in-flight guard
    try {
      syncingRef.current = true;
      setSyncStatus("Saving…");
      const res = await fetch(BLOB_API_URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(ensureShape(nextData)),
      });
      if (!res.ok) throw new Error(`Remote PUT failed: ${res.status}`);
      setSyncStatus("Saved");
    } catch (e) {
      console.warn("Failed to save remotely", e);
      setSyncStatus("Save failed (local only)");
    } finally {
      syncingRef.current = false;
    }
  }

  // Seed first session if none (local) and ensure a valid selection exists
  useEffect(() => {
    if (data.sessions.length === 0) {
      const first = {
        id: "session_001",
        distance: defaultDistance,
        date: todayIso,
      };
      setData((d) => ({ ...d, sessions: [first] }));
      setSelectedSessionId(first.id);
      return;
    }

    // Ensure the selected session is valid; if not, pick the first (earliest)
    const sorted = [...data.sessions].sort((a, b) => a.date.localeCompare(b.date));
    const currentIsValid = sorted.some((s) => s.id === selectedSessionId);
    if (!currentIsValid && sorted[0]) {
      setSelectedSessionId(sorted[0].id);
    }
  }, [data.sessions, selectedSessionId]);

  // Persist to localStorage
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(ensureShape(data))
        );
      }
    } catch {}
  }, [data]);

  // Initial remote sync
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setSyncStatus("Syncing…");
        const remote = ensureShape(await fetchRemote());
        if (!mounted) return;
        if (
          (remote.sessions?.length ?? 0) === 0 &&
          (remote.scores?.length ?? 0) === 0
        ) {
          // If remote empty, push local (seeded) up after ensuring shape
          const next = ensureShape(data);
          if (next.sessions.length === 0) {
            // ensure we have at least one session
            const first = {
              id: "session_001",
              distance: defaultDistance,
              date: todayIso,
            };
            setData({ sessions: [first], scores: [] });
            await pushRemote({ sessions: [first], scores: [] });
          } else {
            await pushRemote(next);
          }
          setSyncStatus("Synced");
        } else {
          // Prefer remote as source of truth
          setData(remote);
          setSyncStatus("Synced");
        }
      } catch (e) {
        console.warn("Remote sync failed", e);
        if (!mounted) return;
        setSyncStatus("Offline (using local)");
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const nameSuggestions = useMemo(() => {
    const map = new Map();
    for (const s of data.scores) {
      const norm = normalizeName(s.name);
      if (!map.has(norm)) map.set(norm, s.name.trim());
    }
    return Array.from(map.values());
  }, [data.scores]);

  const sessionsSorted = useMemo(
    () => [...data.sessions].sort((a, b) => a.date.localeCompare(b.date)),
    [data.sessions]
  );

  const leaderboard = useMemo(
    () =>
      computeLeaderboard(data, viewMode, {
        penalty,
        sessionId: selectedSessionId,
      }),
    [data, viewMode, penalty, selectedSessionId]
  );

  function handleAddSession(e) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const distance = String(fd.get("distance") || "").trim();
    const date = String(fd.get("date") || "").trim();
    if (!distance || !date) return;
    const id = `session_${String(data.sessions.length + 1).padStart(3, "0")}`;
    const next = {
      ...data,
      sessions: [...data.sessions, { id, distance, date }],
    };
    setData(next);
    pushRemote(next);
    setSelectedSessionId(id);
    e.currentTarget.reset();
  }

  function handleAddScore(e) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") || "").trim();
    const score = Number(fd.get("score"));
    const session = String(fd.get("session") || "").trim();

    if (!name) return alert("Name is required");
    if (!session) return alert("Session is required");
    if (Number.isNaN(score) || score < 0)
      return alert("Score must be a non-negative number");

    const norm = normalizeName(name);
    const existsForSession = data.scores.some(
      (s) => normalizeName(s.name) === norm && s.session === session
    );
    if (existsForSession)
      return alert("This user already has a score for the selected session");

    // Canonical casing
    let canonical = name;
    const first = data.scores.find((s) => normalizeName(s.name) === norm);
    if (first) canonical = first.name.trim();

    const newScore = {
      id: uuid(),
      name: canonical,
      score: Number(score),
      session,
    };
    const next = { ...data, scores: [...data.scores, newScore] };
    setData(next);
    pushRemote(next);
    e.currentTarget.reset();
  }

  return (
    <div className="w-full max-w-[1000px] mx-auto full-bleed">
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow mb-4">
        <h2 className="text-lg font-semibold">
          Leaderboard <span>- {syncStatus || "Ready"}</span>
        </h2>
        <div className="mt-3 flex flex-wrap gap-3 items-end">
          <label className="grid gap-1 font-semibold">
            <Label>View</Label>
            <Select
              value={viewMode}
              onValueChange={(value) => setViewMode(value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="session">By Session</SelectItem>
                <SelectItem value="best">All-Time Best (per user)</SelectItem>
                <SelectItem value="cumulative">
                  All-Time Cumulative (penalty for missing)
                </SelectItem>
              </SelectContent>
            </Select>
          </label>

          {viewMode === "session" && (
            <label className="grid gap-1 font-semibold">
              <Label>Session</Label>
              <Select
                value={selectedSessionId}
                onValueChange={(value) => setSelectedSessionId(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sessionsSorted.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {formatDateUK(s.date)} — {s.distance}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>
          )}
        </div>

        <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          {leaderboard.title}
        </div>

        <div className="mt-3 overflow-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-white/70 dark:bg-slate-900/70">
                <th className="sticky top-0 text-left border-b border-slate-200 dark:border-slate-700 px-3 py-2 w-16 text-slate-500 font-medium">
                  Rank
                </th>
                <th className="sticky top-0 text-left border-b border-slate-200 dark:border-slate-700 px-3 py-2">
                  Name
                </th>
                <th className="sticky top-0 text-left border-b border-slate-200 dark:border-slate-700 px-3 py-2">
                  {viewMode === "best"
                    ? "Best Score"
                    : viewMode === "cumulative"
                      ? "Total Score"
                      : "Score"}
                </th>
                <th className="sticky top-0 text-left border-b border-slate-200 dark:border-slate-700 px-3 py-2 text-slate-500 font-normal">
                  {viewMode === "best"
                    ? "Sessions"
                    : viewMode === "cumulative"
                      ? "Progress"
                      : ""}
                </th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.rows.map((row, idx) => (
                <tr
                  key={row.name + idx}
                  className="odd:bg-slate-50/60 dark:odd:bg-slate-800/40 hover:bg-slate-100/80 dark:hover:bg-slate-800/70"
                >
                  <td className="px-3 py-2 border-b border-slate-200 dark:border-slate-700 text-slate-500">
                    {idx + 1}
                  </td>
                  <td className="px-3 py-2 border-b border-slate-200 dark:border-slate-700">
                    {row.name}
                  </td>
                  <td className="px-3 py-2 border-b border-slate-200 dark:border-slate-700">
                    {row.score}
                  </td>
                  <td className="px-3 py-2 border-b border-slate-200 dark:border-slate-700 text-slate-500">
                    {row.extra || ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow mb-4">
        <h2 className="text-lg font-semibold">Add Score</h2>
        <form onSubmit={handleAddScore} className="mt-2">
          <div className="flex flex-wrap gap-3 items-end">
            <label className="grid gap-1 font-semibold">
              <span className="text-sm">Name</span>
              <Input
                name="name"
                type="text"
                list="pftc-names"
                placeholder="Use the same name each session"
                required
              />
              <datalist id="pftc-names">
                {nameSuggestions.map((n) => (
                  <option key={n} value={n} />
                ))}
              </datalist>
            </label>

            <label className="grid gap-1 font-semibold">
              <span className="text-sm">Score</span>
              <Input
                name="score"
                type="number"
                min="0"
                step="1"
                placeholder="e.g. 7"
                required
              />
            </label>

            <label className="grid gap-1 font-semibold">
              <span className="text-sm">Session</span>
              <Select
                required
                name="session"
                value={selectedSessionId}
                onValueChange={(value) => setSelectedSessionId(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sessionsSorted.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {formatDateUK(s.date)} — {s.distance}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>

            <Button type="submit">Add Score</Button>
          </div>
          <p className="mt-2 text-sm text-slate-500">
            Use the exact same name across sessions to keep results together.
            One score per user per session.
          </p>
        </form>
      </section>

      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow">
        <h2 className="text-lg font-semibold">Add Session</h2>
        <form onSubmit={handleAddSession} className="mt-2">
          <div className="flex flex-wrap gap-3 items-end">
            <label className="grid gap-1 font-semibold">
              <span className="text-sm">Distance</span>
              <Input
                name="distance"
                type="text"
                defaultValue={defaultDistance}
                required
              />
            </label>
            <label className="grid gap-1 font-semibold">
              <span className="text-sm">Date</span>
              <Input name="date" type="date" defaultValue={todayIso} required />
            </label>
            <Button type="submit">Add Session</Button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default ParForTheCourse;
