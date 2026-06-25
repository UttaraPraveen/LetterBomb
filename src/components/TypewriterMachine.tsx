import type { Theme } from "../types/letter";

interface TypewriterMachineProps {
  theme: Theme;
  vibrate: boolean;
}

export function TypewriterMachine({ theme, vibrate }: TypewriterMachineProps) {
  return (
    <div
      className="absolute -bottom-[2vh] left-1/2 w-[min(900px,120vw)] z-20 pointer-events-none transition-transform duration-[90ms] ease-out"
      style={{
        transform: vibrate
          ? "translateX(-50%) translate(0.6px, -0.4px)"
          : "translateX(-50%)",
      }}
    >
      <svg
        viewBox="0 0 900 340"
        className="w-full block drop-shadow-[0_18px_24px_rgba(0,0,0,0.5)]"
      >
        <ellipse cx={450} cy={320} rx={420} ry={22} fill="rgba(0,0,0,0.35)" />

        {/* main housing */}
        <rect x={60} y={150} width={780} height={150} rx={26} fill={theme.machineBody} />
        <rect x={60} y={150} width={780} height={40} rx={20} fill={theme.machineBodyDark} opacity={0.35} />

        {/* side scoops */}
        <path
          d="M 60 200 Q 10 210 0 260 L 0 300 Q 0 320 30 320 L 100 320 L 100 220 Z"
          fill={theme.machineBodyDark}
        />
        <path
          d="M 840 200 Q 890 210 900 260 L 900 300 Q 900 320 870 320 L 800 320 L 800 220 Z"
          fill={theme.machineBodyDark}
        />

        {/* carriage rail */}
        <rect x={110} y={130} width={680} height={22} rx={8} fill={theme.machineAccent} />
        <circle cx={110} cy={141} r={16} fill={theme.machineBodyDark} />
        <circle cx={790} cy={141} r={16} fill={theme.machineBodyDark} />

        {/* paper feed slot */}
        <rect x={330} y={118} width={240} height={18} rx={4} fill="#1a1a1a" opacity={0.55} />

        {/* platen knobs */}
        <circle cx={80} cy={141} r={10} fill={theme.machineAccent} />
        <circle cx={820} cy={141} r={10} fill={theme.machineAccent} />

        {/* ribbon spool covers */}
        <circle cx={280} cy={195} r={28} fill={theme.machineBodyDark} />
        <circle cx={280} cy={195} r={18} fill={theme.machineAccent} />
        <circle cx={620} cy={195} r={28} fill={theme.machineBodyDark} />
        <circle cx={620} cy={195} r={18} fill={theme.machineAccent} />

        {/* type-bar basket hint */}
        <path d="M 380 220 L 450 270 L 520 220 Z" fill={theme.machineAccent} opacity={0.5} />

        {/* brand plate */}
        <rect x={380} y={245} width={140} height={26} rx={5} fill={theme.machineBodyDark} />
        <text
          x={450}
          y={263}
          textAnchor="middle"
          fontFamily="sans-serif"
          fontSize={13}
          fontWeight={500}
          letterSpacing={3}
          fill="rgba(255,255,255,0.65)"
        >
          LETTER BOMBED
        </text>

        {/* keyboard deck */}
        <rect x={90} y={300} width={720} height={40} rx={18} fill={theme.machineBodyDark} />

        {/* keys */}
        {Array.from({ length: 14 }).map((_, i) => (
          <circle
            key={i}
            cx={130 + i * 48}
            cy={326}
            r={14}
            fill={theme.machineAccent}
            opacity={0.85}
          />
        ))}
      </svg>
    </div>
  );
}
