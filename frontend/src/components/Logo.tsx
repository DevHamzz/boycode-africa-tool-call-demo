/**
 * CoinStackLogo — 5-layer coin stack with Arabic "ٱللَّٰه" (Allah) on top.
 * All colours follow CSS custom properties so the logo adapts to every theme.
 */
export default function CoinStackLogo({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 90"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="GenZpt AI logo"
    >
      {/* ── 5 coin layers ── */}
      {[0, 1, 2, 3, 4].map((i) => {
        const y      = 10 + i * 14
        const isTop  = i === 0
        const op     = 1 - i * 0.10
        return (
          <g key={i}>
            {/* cylinder side */}
            <rect x="6" y={y + 6} width="68" height="10" rx="5"
              fill="var(--accent)" opacity={op} />
            {/* top ellipse */}
            <ellipse cx="40" cy={y + 6} rx="34" ry="7"
              fill={isTop ? 'var(--accent-light)' : 'var(--accent)'}
              opacity={op} />
          </g>
        )
      })}

      {/* ── Arabic "ٱللَّٰه" (Allah) on the top coin ── */}
      <text
        x="40"
        y="21"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="17"
        fontWeight="700"
        fill="white"
        /* Arabic needs a font that ships with the OS — fallback chain covers all platforms */
        fontFamily="'Amiri','Scheherazade New','Traditional Arabic','Arial Unicode MS',serif"
        style={{ direction: 'rtl' }}
      >
        ﷲ
      </text>
    </svg>
  )
}
