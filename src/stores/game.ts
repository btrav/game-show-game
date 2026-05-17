import { create } from "zustand"
import type { CellId, GameState, Team, TeamColor, Value } from "../types"
import { VALUES } from "../types"

const SESSION_KEY = "gsg.game.v1"

function loadSession(): GameState | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (!raw) return null
    return JSON.parse(raw) as GameState
  } catch {
    return null
  }
}

function saveSession(state: GameState | null) {
  if (!state) sessionStorage.removeItem(SESSION_KEY)
  else sessionStorage.setItem(SESSION_KEY, JSON.stringify(state))
}

export const valueForRow = (row: number): Value => VALUES[row]

interface GameStore {
  state: GameState | null
  startGame: (boardId: string, teams: Omit<Team, "score">[]) => void
  endGame: () => void
  clearGame: () => void
  selectCell: (cellId: CellId) => void
  openBuzzers: () => void
  buzzIn: (teamId: string) => void
  resolve: (correct: boolean) => void
  revealOnly: () => void
  skipClue: () => void
  backToBoard: () => void
  undoLast: () => void
  hydrate: () => void
}

export const useGameStore = create<GameStore>((set, get) => ({
  state: loadSession(),

  hydrate: () => set({ state: loadSession() }),

  startGame: (boardId, teams) => {
    const next: GameState = {
      boardId,
      teams: teams.map((t) => ({ ...t, score: 0 })),
      usedCells: [],
      view: { kind: "board" },
      lastScoring: null,
      startedAt: Date.now(),
    }
    saveSession(next)
    set({ state: next })
  },

  endGame: () => {
    const s = get().state
    if (!s) return
    const next: GameState = { ...s, view: { kind: "end" } }
    saveSession(next)
    set({ state: next })
  },

  clearGame: () => {
    saveSession(null)
    set({ state: null })
  },

  selectCell: (cellId) => {
    const s = get().state
    if (!s || s.view.kind !== "board") return
    if (s.usedCells.includes(cellId)) return
    const next: GameState = {
      ...s,
      view: {
        kind: "clue",
        cellId,
        phase: "reading",
        buzzedTeamId: null,
        lockedOutTeamIds: [],
      },
    }
    saveSession(next)
    set({ state: next })
  },

  openBuzzers: () => {
    const s = get().state
    if (!s || s.view.kind !== "clue") return
    if (s.view.phase !== "reading") return
    const next: GameState = {
      ...s,
      view: { ...s.view, phase: "buzzing" },
    }
    saveSession(next)
    set({ state: next })
  },

  buzzIn: (teamId) => {
    const s = get().state
    if (!s || s.view.kind !== "clue") return
    if (s.view.phase !== "buzzing") return
    if (s.view.lockedOutTeamIds.includes(teamId)) return
    const next: GameState = {
      ...s,
      view: { ...s.view, phase: "buzzed", buzzedTeamId: teamId },
    }
    saveSession(next)
    set({ state: next })
  },

  resolve: (correct) => {
    const s = get().state
    if (!s || s.view.kind !== "clue") return
    if (s.view.phase !== "buzzed" || !s.view.buzzedTeamId) return
    const teamId = s.view.buzzedTeamId
    const [, rowStr] = s.view.cellId.split("-")
    const row = Number(rowStr)
    const value = valueForRow(row)
    const delta = correct ? value : -value
    const team = s.teams.find((t) => t.id === teamId)
    if (!team) return

    const updatedTeams = s.teams.map((t) =>
      t.id === teamId ? { ...t, score: t.score + delta } : t
    )
    const scoring = {
      cellId: s.view.cellId,
      teamId,
      delta,
      prevScore: team.score,
    }

    if (correct) {
      const usedCells = [...s.usedCells, s.view.cellId]
      const isLast = usedCells.length >= 30
      const next: GameState = {
        ...s,
        teams: updatedTeams,
        usedCells,
        lastScoring: scoring,
        view: isLast ? { kind: "end" } : { kind: "board" },
      }
      saveSession(next)
      set({ state: next })
    } else {
      const lockedOut = [...s.view.lockedOutTeamIds, teamId]
      const allLockedOut = lockedOut.length >= s.teams.length
      const next: GameState = {
        ...s,
        teams: updatedTeams,
        lastScoring: scoring,
        view: allLockedOut
          ? { ...s.view, phase: "revealed", buzzedTeamId: null, lockedOutTeamIds: lockedOut }
          : { ...s.view, phase: "buzzing", buzzedTeamId: null, lockedOutTeamIds: lockedOut },
      }
      saveSession(next)
      set({ state: next })
    }
  },

  revealOnly: () => {
    const s = get().state
    if (!s || s.view.kind !== "clue") return
    const next: GameState = {
      ...s,
      view: { ...s.view, phase: "revealed", buzzedTeamId: null },
    }
    saveSession(next)
    set({ state: next })
  },

  skipClue: () => {
    const s = get().state
    if (!s || s.view.kind !== "clue") return
    const usedCells = [...s.usedCells, s.view.cellId]
    const isLast = usedCells.length >= 30
    const next: GameState = {
      ...s,
      usedCells,
      view: isLast ? { kind: "end" } : { kind: "board" },
    }
    saveSession(next)
    set({ state: next })
  },

  backToBoard: () => {
    const s = get().state
    if (!s) return
    if (s.view.kind !== "clue") return
    const next: GameState = { ...s, view: { kind: "board" } }
    saveSession(next)
    set({ state: next })
  },

  undoLast: () => {
    const s = get().state
    if (!s || !s.lastScoring) return
    const { teamId, prevScore, cellId, delta } = s.lastScoring
    const wasCorrect = delta > 0
    const usedCells = wasCorrect ? s.usedCells.filter((c) => c !== cellId) : s.usedCells
    const teams = s.teams.map((t) =>
      t.id === teamId ? { ...t, score: prevScore } : t
    )
    const next: GameState = {
      ...s,
      teams,
      usedCells,
      lastScoring: null,
      view: { kind: "board" },
    }
    saveSession(next)
    set({ state: next })
  },
}))

export const teamColorVar = (color: TeamColor): string => `var(--color-${color})`
