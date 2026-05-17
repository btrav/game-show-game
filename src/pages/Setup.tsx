import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getBoard } from "../lib/storage"
import { useGameStore } from "../stores/game"
import type { Board, Team, TeamColor } from "../types"

const TEAM_COLORS: { color: TeamColor; label: string; cssVar: string }[] = [
  { color: "team-1", label: "Crimson", cssVar: "var(--color-team-1)" },
  { color: "team-2", label: "Cobalt", cssVar: "var(--color-team-2)" },
  { color: "team-3", label: "Emerald", cssVar: "var(--color-team-3)" },
  { color: "team-4", label: "Violet", cssVar: "var(--color-team-4)" },
]

const DEFAULT_KEYS = ["1", "2", "3", "4"]

export default function Setup() {
  const { id } = useParams()
  const navigate = useNavigate()
  const startGame = useGameStore((s) => s.startGame)
  const [board, setBoard] = useState<Board | null>(null)
  const [activeCount, setActiveCount] = useState(2)
  const [teamConfig, setTeamConfig] = useState<Omit<Team, "score">[]>(
    TEAM_COLORS.map((tc, i) => ({
      id: `team-${i}`,
      name: `Team ${i + 1}`,
      color: tc.color,
      key: DEFAULT_KEYS[i],
    }))
  )

  useEffect(() => {
    if (!id) return
    const b = getBoard(id)
    if (!b) navigate("/", { replace: true })
    else setBoard(b)
  }, [id, navigate])

  const updateTeam = (idx: number, patch: Partial<Team>) => {
    setTeamConfig((prev) =>
      prev.map((t, i) => (i === idx ? { ...t, ...patch } : t))
    )
  }

  const handleStart = () => {
    if (!board) return
    const activeTeams = teamConfig.slice(0, activeCount)
    const keys = new Set(activeTeams.map((t) => t.key))
    if (keys.size !== activeTeams.length) {
      alert("Each team needs a unique buzzer key.")
      return
    }
    if (activeTeams.some((t) => !t.name.trim())) {
      alert("Each team needs a name.")
      return
    }
    startGame(board.id, activeTeams)
    navigate(`/play/${board.id}`)
  }

  if (!board) return null

  return (
    <div className="min-h-full flex flex-col">
      <header className="px-8 py-5 flex items-center gap-4 border-b border-ink-faint">
        <button
          onClick={() => navigate(`/builder/${board.id}`)}
          className="text-ink-dim hover:text-ink transition text-sm"
        >
          ← Back
        </button>
        <h1 className="font-serif text-2xl text-ink flex-1">{board.title}</h1>
      </header>

      <main className="flex-1 px-8 py-12 max-w-3xl mx-auto w-full">
        <h2 className="text-sm uppercase tracking-widest text-ink-dim mb-2">
          Teams
        </h2>
        <p className="text-ink-dim text-sm mb-8">
          Each team has a buzzer key. When buzzers open, the first key pressed
          wins.
        </p>

        <div className="flex gap-2 mb-6">
          {[2, 3, 4].map((n) => (
            <button
              key={n}
              onClick={() => setActiveCount(n)}
              className={`px-4 py-2 rounded-md text-sm transition ${
                activeCount === n
                  ? "bg-amber text-bg font-medium"
                  : "border border-ink-faint text-ink-dim hover:text-ink hover:border-ink-dim"
              }`}
            >
              {n} teams
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {teamConfig.slice(0, activeCount).map((team, idx) => {
            const colorMeta = TEAM_COLORS.find((c) => c.color === team.color)!
            return (
              <div
                key={team.id}
                className="flex items-center gap-4 bg-bg-elev rounded-md p-4"
              >
                <span
                  className="w-3 h-12 rounded-full"
                  style={{ background: colorMeta.cssVar }}
                />
                <input
                  value={team.name}
                  onChange={(e) => updateTeam(idx, { name: e.target.value })}
                  className="flex-1 text-lg"
                  placeholder="Team name"
                />
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase tracking-widest text-ink-dim">
                    Key
                  </span>
                  <input
                    value={team.key}
                    maxLength={1}
                    onChange={(e) =>
                      updateTeam(idx, { key: e.target.value.toLowerCase() })
                    }
                    className="w-12 h-12 text-center font-serif text-2xl bg-bg rounded-md border border-ink-faint focus:border-amber transition"
                  />
                </div>
              </div>
            )
          })}
        </div>

        <button
          onClick={handleStart}
          className="mt-10 px-8 py-4 bg-amber text-bg font-medium text-lg rounded-md hover:bg-amber-soft transition"
        >
          Start game →
        </button>
      </main>
    </div>
  )
}
