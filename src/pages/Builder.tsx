import { useEffect, useMemo, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { exportBoard, getBoard, upsertBoard } from "../lib/storage"
import { useBoardsStore } from "../stores/boards"
import type { Board, CellId } from "../types"
import { COLUMNS, ROWS, VALUES } from "../types"

export default function Builder() {
  const { id } = useParams()
  const navigate = useNavigate()
  const refresh = useBoardsStore((s) => s.refresh)
  const [board, setBoard] = useState<Board | null>(null)
  const [selected, setSelected] = useState<CellId>("0-0")
  const cluePromptRef = useRef<HTMLTextAreaElement>(null)
  const answerRef = useRef<HTMLTextAreaElement>(null)
  const saveTimer = useRef<number | null>(null)

  useEffect(() => {
    if (!id) return
    const b = getBoard(id)
    if (!b) navigate("/", { replace: true })
    else setBoard(b)
  }, [id, navigate])

  useEffect(() => {
    if (!board) return
    if (saveTimer.current) window.clearTimeout(saveTimer.current)
    saveTimer.current = window.setTimeout(() => {
      upsertBoard(board)
      refresh()
    }, 300)
    return () => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current)
    }
  }, [board, refresh])

  const [colStr, rowStr] = selected.split("-")
  const col = Number(colStr)
  const row = Number(rowStr)
  const value = VALUES[row]

  const selectedClue = useMemo(() => {
    if (!board) return null
    return board.categories[col].clues[row]
  }, [board, col, row])

  const selectedCategory = useMemo(
    () => board?.categories[col].title ?? "",
    [board, col]
  )

  const moveSelection = (dx: number, dy: number) => {
    const nc = Math.max(0, Math.min(COLUMNS - 1, col + dx))
    const nr = Math.max(0, Math.min(ROWS - 1, row + dy))
    setSelected(`${nc}-${nr}` as CellId)
  }

  const nextCell = () => {
    let nr = row
    let nc = col + 1
    if (nc >= COLUMNS) {
      nc = 0
      nr = (row + 1) % ROWS
    }
    setSelected(`${nc}-${nr}` as CellId)
    setTimeout(() => cluePromptRef.current?.focus(), 0)
  }

  const updateClue = (field: "prompt" | "answer", val: string) => {
    if (!board) return
    setBoard({
      ...board,
      categories: board.categories.map((cat, ci) =>
        ci !== col
          ? cat
          : {
              ...cat,
              clues: cat.clues.map((c, ri) =>
                ri !== row ? c : { ...c, [field]: val }
              ) as typeof cat.clues,
            }
      ) as Board["categories"],
    })
  }

  const updateCategory = (ci: number, title: string) => {
    if (!board) return
    setBoard({
      ...board,
      categories: board.categories.map((cat, idx) =>
        idx !== ci ? cat : { ...cat, title }
      ) as Board["categories"],
    })
  }

  const updateTitle = (title: string) => {
    if (!board) return
    setBoard({ ...board, title })
  }

  if (!board) return null

  const filledCount = board.categories.reduce(
    (total, cat) =>
      total +
      cat.clues.filter((c) => c.prompt.trim() && c.answer.trim()).length,
    0
  )
  const hasTitles = board.categories.every((c) => c.title.trim())
  const canPlay = filledCount === 30 && hasTitles

  return (
    <div className="min-h-full flex flex-col">
      <header className="px-8 py-5 flex items-center gap-4 border-b border-ink-faint">
        <button
          onClick={() => navigate("/")}
          className="text-ink-dim hover:text-ink transition text-sm"
        >
          ← Home
        </button>
        <input
          value={board.title}
          onChange={(e) => updateTitle(e.target.value)}
          className="font-serif text-2xl text-ink flex-1 min-w-0"
          placeholder="Untitled board"
        />
        <div className="text-sm text-ink-dim">
          {filledCount}/30 clues
        </div>
        <button
          onClick={() => exportBoard(board)}
          className="px-3 py-1.5 text-sm border border-ink-faint text-ink rounded-md hover:border-ink-dim transition"
        >
          Export
        </button>
        <button
          onClick={() => navigate(`/setup/${board.id}`)}
          disabled={!canPlay}
          className="px-4 py-1.5 text-sm bg-amber text-bg font-medium rounded-md hover:bg-amber-soft transition disabled:opacity-30 disabled:cursor-not-allowed"
          title={canPlay ? "" : "Fill all 30 clues and 6 category titles to play"}
        >
          Play →
        </button>
      </header>

      <main className="flex-1 flex flex-col px-8 py-6 gap-6">
        <div
          className="grid gap-2"
          style={{
            gridTemplateColumns: `repeat(${COLUMNS}, minmax(0, 1fr))`,
            gridTemplateRows: `auto repeat(${ROWS}, minmax(0, 1fr))`,
            minHeight: "55vh",
          }}
        >
          {Array.from({ length: COLUMNS }).map((_, ci) => (
            <input
              key={`cat-${ci}`}
              value={board.categories[ci].title}
              onChange={(e) => updateCategory(ci, e.target.value)}
              placeholder="CATEGORY"
              className="text-center text-xs uppercase tracking-widest text-ink-dim placeholder:text-ink-faint py-3 border-b border-ink-faint focus:text-ink focus:border-amber transition"
            />
          ))}

          {Array.from({ length: ROWS }).map((_, ri) =>
            Array.from({ length: COLUMNS }).map((_, ci) => {
              const cellId = `${ci}-${ri}` as CellId
              const isSelected = cellId === selected
              const clue = board.categories[ci].clues[ri]
              const isFilled = !!(clue.prompt.trim() && clue.answer.trim())
              return (
                <button
                  key={cellId}
                  onClick={() => {
                    setSelected(cellId)
                    setTimeout(() => cluePromptRef.current?.focus(), 0)
                  }}
                  className={`relative font-serif text-3xl text-amber rounded-md transition ${
                    isSelected
                      ? "bg-bg-elev ring-2 ring-amber"
                      : "bg-bg-elev hover:bg-[#1d1d22]"
                  }`}
                >
                  ${VALUES[ri]}
                  {isFilled && (
                    <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-amber" />
                  )}
                </button>
              )
            })
          )}
        </div>

        <div className="border-t border-ink-faint pt-5 grid grid-cols-2 gap-6">
          <div>
            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-xs uppercase tracking-widest text-ink-dim">
                {selectedCategory || "Category"}
              </span>
              <span className="font-serif text-lg text-amber">${value}</span>
            </div>
            <label className="block text-xs uppercase tracking-widest text-ink-dim mb-1">
              Clue
            </label>
            <textarea
              ref={cluePromptRef}
              value={selectedClue?.prompt ?? ""}
              onChange={(e) => updateClue("prompt", e.target.value)}
              placeholder="This Civil War general later became the 18th U.S. president"
              className="w-full min-h-[6rem] bg-bg-elev rounded-md p-3 placeholder:text-ink-faint resize-none"
              onKeyDown={(e) => {
                if (e.key === "Tab" && !e.shiftKey) {
                  e.preventDefault()
                  answerRef.current?.focus()
                }
              }}
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase tracking-widest text-ink-dim">
                Navigate
              </span>
              <div className="flex gap-1">
                <button
                  onClick={() => moveSelection(-1, 0)}
                  className="w-7 h-7 rounded text-ink-dim hover:text-ink hover:bg-bg-elev transition"
                  aria-label="Previous column"
                >
                  ←
                </button>
                <button
                  onClick={() => moveSelection(0, -1)}
                  className="w-7 h-7 rounded text-ink-dim hover:text-ink hover:bg-bg-elev transition"
                  aria-label="Previous row"
                >
                  ↑
                </button>
                <button
                  onClick={() => moveSelection(0, 1)}
                  className="w-7 h-7 rounded text-ink-dim hover:text-ink hover:bg-bg-elev transition"
                  aria-label="Next row"
                >
                  ↓
                </button>
                <button
                  onClick={() => moveSelection(1, 0)}
                  className="w-7 h-7 rounded text-ink-dim hover:text-ink hover:bg-bg-elev transition"
                  aria-label="Next column"
                >
                  →
                </button>
              </div>
            </div>
            <label className="block text-xs uppercase tracking-widest text-ink-dim mb-1">
              Answer
            </label>
            <textarea
              ref={answerRef}
              value={selectedClue?.answer ?? ""}
              onChange={(e) => updateClue("answer", e.target.value)}
              placeholder="Who is Ulysses S. Grant?"
              className="w-full min-h-[6rem] bg-bg-elev rounded-md p-3 placeholder:text-ink-faint resize-none"
              onKeyDown={(e) => {
                if (e.key === "Tab" && !e.shiftKey) {
                  e.preventDefault()
                  nextCell()
                }
              }}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
