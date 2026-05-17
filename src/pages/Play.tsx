import { useCallback, useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { getBoard } from "../lib/storage"
import { useGameStore, valueForRow } from "../stores/game"
import type { Board, CellId, Team, TeamColor } from "../types"
import { COLUMNS, ROWS, VALUES } from "../types"

const colorVar = (color: TeamColor) => `var(--color-${color})`

export default function Play() {
  const { id } = useParams()
  const navigate = useNavigate()
  const state = useGameStore((s) => s.state)
  const hydrate = useGameStore((s) => s.hydrate)
  const selectCell = useGameStore((s) => s.selectCell)
  const openBuzzers = useGameStore((s) => s.openBuzzers)
  const buzzIn = useGameStore((s) => s.buzzIn)
  const resolve = useGameStore((s) => s.resolve)
  const revealOnly = useGameStore((s) => s.revealOnly)
  const skipClue = useGameStore((s) => s.skipClue)
  const backToBoard = useGameStore((s) => s.backToBoard)
  const undoLast = useGameStore((s) => s.undoLast)
  const endGame = useGameStore((s) => s.endGame)
  const clearGame = useGameStore((s) => s.clearGame)
  const [board, setBoard] = useState<Board | null>(null)
  const [keyboardCursor, setKeyboardCursor] = useState<{ col: number; row: number }>({
    col: 0,
    row: 0,
  })

  useEffect(() => {
    if (!id) return
    const b = getBoard(id)
    if (!b) {
      navigate("/", { replace: true })
      return
    }
    setBoard(b)
    hydrate()
  }, [id, navigate, hydrate])

  useEffect(() => {
    if (board && !state) {
      navigate(`/setup/${board.id}`, { replace: true })
    }
    if (state && board && state.boardId !== board.id) {
      navigate(`/setup/${board.id}`, { replace: true })
    }
  }, [board, state, navigate])

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (!state || !board) return
      const k = e.key

      if (state.view.kind === "board") {
        if (k === "ArrowLeft")
          setKeyboardCursor((c) => ({ ...c, col: Math.max(0, c.col - 1) }))
        else if (k === "ArrowRight")
          setKeyboardCursor((c) => ({ ...c, col: Math.min(COLUMNS - 1, c.col + 1) }))
        else if (k === "ArrowUp")
          setKeyboardCursor((c) => ({ ...c, row: Math.max(0, c.row - 1) }))
        else if (k === "ArrowDown")
          setKeyboardCursor((c) => ({ ...c, row: Math.min(ROWS - 1, c.row + 1) }))
        else if (k === "Enter") {
          const id = `${keyboardCursor.col}-${keyboardCursor.row}` as CellId
          if (!state.usedCells.includes(id)) selectCell(id)
        } else if (k === "z" && (e.metaKey || e.ctrlKey)) {
          e.preventDefault()
          undoLast()
        } else if (k === "Escape") {
          if (confirm("End the game now?")) endGame()
        }
        return
      }

      if (state.view.kind === "clue") {
        if (k === " " || k === "Spacebar") {
          e.preventDefault()
          if (state.view.phase === "reading") openBuzzers()
        } else if (k === "Escape") {
          backToBoard()
        } else if (k === "r" || k === "R") {
          revealOnly()
        } else if (k === "s" || k === "S") {
          skipClue()
        } else if (state.view.phase === "buzzed") {
          if (k === "y" || k === "Y") resolve(true)
          else if (k === "n" || k === "N") resolve(false)
        } else if (state.view.phase === "buzzing") {
          const team = state.teams.find((t) => t.key === k.toLowerCase())
          if (team) buzzIn(team.id)
        } else if (state.view.phase === "revealed") {
          if (k === "Enter") backToBoard()
        }
        return
      }
    },
    [
      state,
      board,
      keyboardCursor,
      selectCell,
      openBuzzers,
      buzzIn,
      resolve,
      revealOnly,
      skipClue,
      backToBoard,
      undoLast,
      endGame,
    ]
  )

  useEffect(() => {
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [handleKey])

  if (!board || !state) return null

  const view = state.view

  return (
    <div className="h-full flex flex-col">
      <ExitBar onExit={() => navigate("/")} onUndo={undoLast} canUndo={!!state.lastScoring} />

      <div className="flex-1 relative overflow-hidden">
        {view.kind === "board" && (
          <BoardView
            board={board}
            usedCells={state.usedCells}
            cursor={keyboardCursor}
            onSelect={(cellId) => selectCell(cellId)}
            onCursorChange={(c) => setKeyboardCursor(c)}
          />
        )}
        {view.kind === "clue" && (
          <ClueView
            board={board}
            cellId={view.cellId}
            phase={view.phase}
            buzzedTeam={
              view.buzzedTeamId
                ? state.teams.find((t) => t.id === view.buzzedTeamId) ?? null
                : null
            }
            teams={state.teams}
            lockedOutTeamIds={view.lockedOutTeamIds}
            onOpenBuzzers={openBuzzers}
            onResolve={resolve}
            onReveal={revealOnly}
            onSkip={skipClue}
            onBack={backToBoard}
          />
        )}
        {view.kind === "end" && (
          <EndView
            teams={state.teams}
            onPlayAgain={() => {
              clearGame()
              navigate(`/setup/${board.id}`)
            }}
            onHome={() => {
              clearGame()
              navigate("/")
            }}
          />
        )}
      </div>

      <Scoreboard teams={state.teams} />
    </div>
  )
}

function ExitBar({
  onExit,
  onUndo,
  canUndo,
}: {
  onExit: () => void
  onUndo: () => void
  canUndo: boolean
}) {
  return (
    <div className="absolute top-3 right-3 z-30 flex gap-2">
      <button
        onClick={onUndo}
        disabled={!canUndo}
        className="px-3 py-1 text-xs text-ink-dim hover:text-ink transition disabled:opacity-30 disabled:cursor-not-allowed"
      >
        ⟲ Undo
      </button>
      <button
        onClick={() => {
          if (confirm("Leave the game? Progress is kept in this tab.")) onExit()
        }}
        className="px-3 py-1 text-xs text-ink-dim hover:text-ink transition"
      >
        Exit
      </button>
    </div>
  )
}

function BoardView({
  board,
  usedCells,
  cursor,
  onSelect,
  onCursorChange,
}: {
  board: Board
  usedCells: CellId[]
  cursor: { col: number; row: number }
  onSelect: (cellId: CellId) => void
  onCursorChange: (c: { col: number; row: number }) => void
}) {
  return (
    <div className="h-full p-8 flex flex-col gap-4">
      <div
        className="grid gap-3 flex-1"
        style={{
          gridTemplateColumns: `repeat(${COLUMNS}, minmax(0, 1fr))`,
          gridTemplateRows: `auto repeat(${ROWS}, minmax(0, 1fr))`,
        }}
      >
        {board.categories.map((cat, ci) => (
          <div
            key={`cat-${ci}`}
            className="text-center text-sm uppercase tracking-widest text-ink py-4 font-medium"
          >
            {cat.title}
          </div>
        ))}

        {Array.from({ length: ROWS }).map((_, ri) =>
          Array.from({ length: COLUMNS }).map((_, ci) => {
            const cellId = `${ci}-${ri}` as CellId
            const isUsed = usedCells.includes(cellId)
            const isCursor = cursor.col === ci && cursor.row === ri
            return (
              <button
                key={cellId}
                onClick={() => {
                  onCursorChange({ col: ci, row: ri })
                  if (!isUsed) onSelect(cellId)
                }}
                onMouseEnter={() => onCursorChange({ col: ci, row: ri })}
                disabled={isUsed}
                className={`relative font-serif text-6xl rounded-md transition-all ${
                  isUsed
                    ? "bg-bg-elev opacity-10 cursor-default"
                    : isCursor
                      ? "bg-bg-elev ring-2 ring-amber text-amber"
                      : "bg-bg-elev text-amber hover:bg-[#1d1d22]"
                }`}
              >
                {isUsed ? "" : `$${VALUES[ri]}`}
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}

function ClueView({
  board,
  cellId,
  phase,
  buzzedTeam,
  teams,
  lockedOutTeamIds,
  onOpenBuzzers,
  onResolve,
  onReveal,
  onSkip,
  onBack,
}: {
  board: Board
  cellId: CellId
  phase: "reading" | "buzzing" | "buzzed" | "revealed"
  buzzedTeam: Team | null
  teams: Team[]
  lockedOutTeamIds: string[]
  onOpenBuzzers: () => void
  onResolve: (correct: boolean) => void
  onReveal: () => void
  onSkip: () => void
  onBack: () => void
}) {
  const [colStr, rowStr] = cellId.split("-")
  const col = Number(colStr)
  const row = Number(rowStr)
  const category = board.categories[col]
  const clue = category.clues[row]
  const value = valueForRow(row)

  const flashColor =
    phase === "buzzed" && buzzedTeam ? colorVar(buzzedTeam.color) : null

  return (
    <div className="h-full relative flex flex-col items-center justify-center px-12">
      {flashColor && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 pointer-events-none"
          style={{
            boxShadow: `inset 0 0 100px 20px ${flashColor}`,
          }}
        />
      )}

      <div className="absolute top-6 left-8 text-sm uppercase tracking-widest text-ink-dim">
        {category.title}
      </div>
      <div className="absolute top-6 right-8 font-serif text-3xl text-amber">
        ${value}
      </div>

      <AnimatePresence mode="wait">
        {phase !== "revealed" ? (
          <motion.div
            key="prompt"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="font-serif text-6xl leading-tight text-center max-w-5xl text-ink"
          >
            {clue.prompt}
          </motion.div>
        ) : (
          <motion.div
            key="answer"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="text-xs uppercase tracking-widest text-ink-dim mb-4">
              Answer
            </div>
            <div className="font-serif text-5xl text-amber max-w-4xl">
              {clue.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-6 left-0 right-0 flex justify-center">
        <HostControls
          phase={phase}
          buzzedTeam={buzzedTeam}
          teams={teams}
          lockedOutTeamIds={lockedOutTeamIds}
          onOpenBuzzers={onOpenBuzzers}
          onResolve={onResolve}
          onReveal={onReveal}
          onSkip={onSkip}
          onBack={onBack}
        />
      </div>
    </div>
  )
}

function HostControls({
  phase,
  buzzedTeam,
  teams,
  lockedOutTeamIds,
  onOpenBuzzers,
  onResolve,
  onReveal,
  onSkip,
  onBack,
}: {
  phase: "reading" | "buzzing" | "buzzed" | "revealed"
  buzzedTeam: Team | null
  teams: Team[]
  lockedOutTeamIds: string[]
  onOpenBuzzers: () => void
  onResolve: (correct: boolean) => void
  onReveal: () => void
  onSkip: () => void
  onBack: () => void
}) {
  if (phase === "reading") {
    return (
      <div className="flex items-center gap-6 text-sm text-ink-dim">
        <button
          onClick={onOpenBuzzers}
          className="px-6 py-3 bg-amber text-bg font-medium rounded-md hover:bg-amber-soft transition"
        >
          Open buzzers <kbd className="ml-2 opacity-70">Space</kbd>
        </button>
        <button onClick={onReveal} className="hover:text-ink transition">
          Reveal answer <kbd className="ml-1 opacity-70">R</kbd>
        </button>
        <button onClick={onSkip} className="hover:text-ink transition">
          Skip <kbd className="ml-1 opacity-70">S</kbd>
        </button>
      </div>
    )
  }

  if (phase === "buzzing") {
    return (
      <div className="flex items-center gap-6 text-sm text-ink-dim">
        <div className="flex items-center gap-3">
          <span className="uppercase tracking-widest text-xs">Buzzers open</span>
          <div className="flex gap-2">
            {teams.map((t) => (
              <div
                key={t.id}
                className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs ${
                  lockedOutTeamIds.includes(t.id) ? "opacity-30" : ""
                }`}
                style={{ color: colorVar(t.color) }}
              >
                <kbd className="px-1.5 py-0.5 bg-bg-elev rounded">{t.key}</kbd>
                {t.name}
              </div>
            ))}
          </div>
        </div>
        <button onClick={onReveal} className="hover:text-ink transition">
          Reveal answer <kbd className="ml-1 opacity-70">R</kbd>
        </button>
      </div>
    )
  }

  if (phase === "buzzed" && buzzedTeam) {
    return (
      <div className="flex items-center gap-6">
        <span
          className="font-serif text-2xl"
          style={{ color: colorVar(buzzedTeam.color) }}
        >
          {buzzedTeam.name}
        </span>
        <button
          onClick={() => onResolve(true)}
          className="px-6 py-3 bg-team-3 text-bg font-medium rounded-md hover:opacity-90 transition"
          style={{ background: "var(--color-team-3)" }}
        >
          Correct <kbd className="ml-2 opacity-70">Y</kbd>
        </button>
        <button
          onClick={() => onResolve(false)}
          className="px-6 py-3 font-medium rounded-md hover:opacity-90 transition text-bg"
          style={{ background: "var(--color-team-1)" }}
        >
          Incorrect <kbd className="ml-2 opacity-70">N</kbd>
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-6 text-sm text-ink-dim">
      <button
        onClick={onBack}
        className="px-6 py-3 bg-amber text-bg font-medium rounded-md hover:bg-amber-soft transition"
      >
        Back to board <kbd className="ml-2 opacity-70">Enter</kbd>
      </button>
    </div>
  )
}

function Scoreboard({ teams }: { teams: Team[] }) {
  return (
    <footer className="border-t border-ink-faint px-8 py-4 flex items-center justify-center gap-12">
      {teams.map((t) => (
        <div key={t.id} className="flex items-center gap-3">
          <span
            className="w-2 h-8 rounded-full"
            style={{ background: colorVar(t.color) }}
          />
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-widest text-ink-dim">
              {t.name}
            </span>
            <motion.span
              key={t.score}
              initial={{ scale: 1.15 }}
              animate={{ scale: 1 }}
              className={`font-serif text-2xl ${
                t.score < 0 ? "text-team-1" : "text-amber"
              }`}
              style={t.score < 0 ? { color: "var(--color-team-1)" } : undefined}
            >
              ${t.score}
            </motion.span>
          </div>
        </div>
      ))}
    </footer>
  )
}

function EndView({
  teams,
  onPlayAgain,
  onHome,
}: {
  teams: Team[]
  onPlayAgain: () => void
  onHome: () => void
}) {
  const sorted = useMemo(() => [...teams].sort((a, b) => b.score - a.score), [teams])
  const winner = sorted[0]

  return (
    <div className="h-full flex flex-col items-center justify-center px-12">
      <div className="text-sm uppercase tracking-widest text-ink-dim mb-4">
        Final
      </div>
      <div
        className="font-serif text-7xl mb-2"
        style={{ color: colorVar(winner.color) }}
      >
        {winner.name}
      </div>
      <div className="font-serif text-3xl text-amber mb-12">
        ${winner.score}
      </div>

      <ul className="space-y-3 mb-12 min-w-[20rem]">
        {sorted.slice(1).map((t) => (
          <li key={t.id} className="flex items-center justify-between gap-8">
            <div className="flex items-center gap-3">
              <span
                className="w-2 h-6 rounded-full"
                style={{ background: colorVar(t.color) }}
              />
              <span className="text-ink">{t.name}</span>
            </div>
            <span className="font-serif text-xl text-ink-dim">${t.score}</span>
          </li>
        ))}
      </ul>

      <div className="flex gap-3">
        <button
          onClick={onPlayAgain}
          className="px-6 py-3 bg-amber text-bg font-medium rounded-md hover:bg-amber-soft transition"
        >
          Play again
        </button>
        <button
          onClick={onHome}
          className="px-6 py-3 border border-ink-faint text-ink rounded-md hover:border-ink-dim transition"
        >
          Home
        </button>
      </div>
    </div>
  )
}
