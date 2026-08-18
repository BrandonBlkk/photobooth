const COLORS = [
  '#f9a8d4', '#c4b5fd', '#93c5fd', '#5eead4', '#fdba74',
  '#fbbf24', '#f472b6', '#a78bfa', '#60a5fa', '#34d399',
]

const seededRandom = (seed) => {
  const value = Math.sin(seed) * 10000
  return value - Math.floor(value)
}

const PIECES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  color: COLORS[i % COLORS.length],
  left: seededRandom(i + 1) * 100,
  delay: seededRandom(i + 19) * 12,
  duration: 8 + seededRandom(i + 37) * 10,
  size: 10 + seededRandom(i + 55) * 6,
}))

export default function Confetti() {
  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {PIECES.map((piece) => (
        <span
          key={piece.id}
          className="absolute animate-confetti opacity-40"
          style={{
            left: `${piece.left}%`,
            color: piece.color,
            fontSize: `${piece.size}px`,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
          }}
        >
          ●
        </span>
      ))}
    </div>
  )
}
