import { create } from "zustand"
import type { Board } from "../types"
import {
  deleteBoard as delBoard,
  loadBoards,
  upsertBoard as up,
} from "../lib/storage"

interface BoardsStore {
  boards: Board[]
  refresh: () => void
  upsert: (board: Board) => void
  remove: (id: string) => void
}

export const useBoardsStore = create<BoardsStore>((set) => ({
  boards: loadBoards(),
  refresh: () => set({ boards: loadBoards() }),
  upsert: (board) => {
    up(board)
    set({ boards: loadBoards() })
  },
  remove: (id) => {
    delBoard(id)
    set({ boards: loadBoards() })
  },
}))
