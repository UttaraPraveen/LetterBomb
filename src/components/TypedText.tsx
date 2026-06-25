import { useMemo } from "react";

interface TypedTextProps {
  text: string;
}

// Deterministic pseudo-random generator seeded by index, so jitter stays
// stable across re-renders instead of reshuffling and causing flicker.
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
}

export function TypedText({ text }: TypedTextProps) {
  const chars = useMemo(() => text.split(""), [text]);

  return (
    <>
      {chars.map((ch, i) => {
        if (ch === "\n") return <br key={i} />;

        const r1 = seededRandom(i * 1.37);
        const r2 = seededRandom(i * 2.91 + 0.5);
        const r3 = seededRandom(i * 4.13 + 0.2);

        const rotate = (r1 - 0.5) * 3.2;
        const translateY = (r2 - 0.5) * 1.6;
        const opacity = 0.78 + r3 * 0.22;

        return (
          <span
            key={i}
            className="inline-block will-change-transform"
            style={{
              transform: `translateY(${translateY}px) rotate(${rotate}deg)`,
              opacity,
            }}
          >
            {ch === " " ? "\u00A0" : ch}
          </span>
        );
      })}
    </>
  );
}
