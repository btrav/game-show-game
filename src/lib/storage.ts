import type { Board, Category, Clue } from "../types"
import { ROWS, COLUMNS } from "../types"

const BOARDS_KEY = "gsg.boards.v1"

export function loadBoards(): Board[] {
  try {
    const raw = localStorage.getItem(BOARDS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as Board[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveBoards(boards: Board[]): void {
  localStorage.setItem(BOARDS_KEY, JSON.stringify(boards))
}

export function getBoard(id: string): Board | undefined {
  return loadBoards().find((b) => b.id === id)
}

export function upsertBoard(board: Board): void {
  const all = loadBoards()
  const idx = all.findIndex((b) => b.id === board.id)
  const next = { ...board, updatedAt: Date.now() }
  if (idx === -1) all.push(next)
  else all[idx] = next
  saveBoards(all)
}

export function deleteBoard(id: string): void {
  saveBoards(loadBoards().filter((b) => b.id !== id))
}

const emptyClue = (): Clue => ({ prompt: "", answer: "" })

const emptyCategory = (): Category => ({
  title: "",
  clues: [emptyClue(), emptyClue(), emptyClue(), emptyClue(), emptyClue()],
})

export function emptyBoard(): Board {
  const now = Date.now()
  return {
    id: crypto.randomUUID(),
    title: "Untitled board",
    description: "",
    categories: [
      emptyCategory(),
      emptyCategory(),
      emptyCategory(),
      emptyCategory(),
      emptyCategory(),
      emptyCategory(),
    ],
    createdAt: now,
    updatedAt: now,
  }
}

export function isValidBoard(value: unknown): value is Board {
  if (!value || typeof value !== "object") return false
  const b = value as Partial<Board>
  if (typeof b.id !== "string") return false
  if (typeof b.title !== "string") return false
  if (!Array.isArray(b.categories) || b.categories.length !== COLUMNS) return false
  return b.categories.every(
    (cat) =>
      cat &&
      typeof cat.title === "string" &&
      Array.isArray(cat.clues) &&
      cat.clues.length === ROWS &&
      cat.clues.every(
        (c) => typeof c.prompt === "string" && typeof c.answer === "string"
      )
  )
}

export function exportBoard(board: Board): void {
  const blob = new Blob([JSON.stringify(board, null, 2)], {
    type: "application/json",
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  const safeName = board.title.replace(/[^a-z0-9-]+/gi, "-").toLowerCase() || "board"
  a.href = url
  a.download = `${safeName}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export async function importBoardFile(file: File): Promise<Board> {
  const text = await file.text()
  const parsed = JSON.parse(text)
  if (!isValidBoard(parsed)) throw new Error("Invalid board file")
  return {
    ...parsed,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
}
