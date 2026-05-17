import { useNavigate } from "react-router-dom"
import { useRef } from "react"
import { useBoardsStore } from "../stores/boards"
import { emptyBoard, importBoardFile, upsertBoard } from "../lib/storage"
import { STARTER_META, buildStarterBoard } from "../lib/starters"
import type { Board } from "../types"

function timeAgo(ts: number): string {
  const diff = Date.now() - ts
  const m = Math.floor(diff / 60000)
  if (m < 1) return "just now"
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  if (d < 30) return `${d}d ago`
  return new Date(ts).toLocaleDateString()
}

export default function Home() {
  const navigate = useNavigate()
  const { boards, refresh, remove } = useBoardsStore()
  const fileInput = useRef<HTMLInputElement>(null)

  const handleNew = () => {
    const board = emptyBoard()
    upsertBoard(board)
    refresh()
    navigate(`/builder/${board.id}`)
  }

  const handleImport = async (file: File) => {
    try {
      const board = await importBoardFile(file)
      upsertBoard(board)
      refresh()
      navigate(`/builder/${board.id}`)
    } catch (e) {
      alert(`Couldn't import: ${(e as Error).message}`)
    }
  }

  const handleDelete = (b: Board) => {
    if (confirm(`Delete "${b.title}"?`)) remove(b.id)
  }

  const handleStarter = (slug: string) => {
    const board = buildStarterBoard(slug)
    if (!board) return
    upsertBoard(board)
    refresh()
    navigate(`/builder/${board.id}`)
  }

  const sorted = [...boards].sort((a, b) => b.updatedAt - a.updatedAt)

  return (
    <div className="min-h-full flex flex-col">
      <header className="px-12 pt-16 pb-8">
        <h1 className="font-serif text-5xl text-ink tracking-tight">
          Game Show <span className="text-amber">Game</span>
        </h1>
        <p className="text-ink-dim mt-2 text-lg">
          Build a board. Play in the room. No accounts, no setup.
        </p>
      </header>

      <main className="flex-1 px-12 pb-16 max-w-5xl">
        <div className="flex gap-3 mb-12">
          <button
            onClick={handleNew}
            className="px-6 py-3 bg-amber text-bg font-medium rounded-md hover:bg-amber-soft transition"
          >
            + New board
          </button>
          <button
            onClick={() => fileInput.current?.click()}
            className="px-6 py-3 border border-ink-faint text-ink rounded-md hover:border-ink-dim transition"
          >
            Import board
          </button>
          <input
            ref={fileInput}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) handleImport(f)
              e.target.value = ""
            }}
          />
        </div>

        <div className="mb-12">
          <h2 className="text-sm uppercase tracking-widest text-ink-dim mb-4">
            Starter boards
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {STARTER_META.map((s) => (
              <li key={s.slug}>
                <button
                  onClick={() => handleStarter(s.slug)}
                  className="w-full text-left bg-bg-elev hover:bg-[#1d1d22] rounded-md p-4 transition group"
                >
                  <div className="font-serif text-xl text-ink group-hover:text-amber transition">
                    {s.title}
                  </div>
                  <div className="text-sm text-ink-dim mt-1">
                    {s.description}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm uppercase tracking-widest text-ink-dim mb-4">
            Your boards
          </h2>

          {sorted.length === 0 ? (
            <p className="text-ink-dim italic">
              No boards yet. Pick a starter above or create your own.
            </p>
          ) : (
            <ul className="divide-y divide-ink-faint">
              {sorted.map((b) => (
                <li
                  key={b.id}
                  className="flex items-center gap-4 py-4 group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-ink font-medium truncate">
                      {b.title}
                    </div>
                    <div className="text-sm text-ink-dim">
                      Edited {timeAgo(b.updatedAt)}
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/builder/${b.id}`)}
                    className="px-3 py-1.5 text-sm text-ink-dim hover:text-ink transition opacity-0 group-hover:opacity-100"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => navigate(`/setup/${b.id}`)}
                    className="px-3 py-1.5 text-sm text-amber hover:text-amber-soft transition"
                  >
                    Play →
                  </button>
                  <button
                    onClick={() => handleDelete(b)}
                    className="px-3 py-1.5 text-sm text-ink-dim hover:text-team-1 transition opacity-0 group-hover:opacity-100"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  )
}
