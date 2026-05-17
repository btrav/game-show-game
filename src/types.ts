export const VALUES = [200, 400, 600, 800, 1000] as const
export type Value = (typeof VALUES)[number]

export const COLUMNS = 6
export const ROWS = 5

export interface Clue {
  prompt: string
  answer: string
}

export interface Category {
  title: string
  clues: [Clue, Clue, Clue, Clue, Clue]
}

export interface Board {
  id: string
  title: string
  description?: string
  categories: [Category, Category, Category, Category, Category, Category]
  createdAt: number
  updatedAt: number
}

export type TeamColor = "team-1" | "team-2" | "team-3" | "team-4"

export interface Team {
  id: string
  name: string
  color: TeamColor
  key: string
  score: number
}

export type CellId = `${number}-${number}`

export interface ScoringEvent {
  cellId: CellId
  teamId: string
  delta: number
  prevScore: number
}

export type GameView =
  | { kind: "board" }
  | {
      kind: "clue"
      cellId: CellId
      phase: "reading" | "buzzing" | "buzzed" | "revealed"
      buzzedTeamId: string | null
      lockedOutTeamIds: string[]
    }
  | { kind: "end" }

export interface GameState {
  boardId: string
  teams: Team[]
  usedCells: CellId[]
  view: GameView
  lastScoring: ScoringEvent | null
  startedAt: number
}
