export function Background() {
  return (
    <>
      <div
        className="absolute inset-0 pointer-events-none z-[5]"
        style={{
          mixBlendMode: "overlay",
          opacity: 0.5,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none z-[6]"
        style={{
          background:
            "radial-gradient(ellipse at 50% 38%, transparent 35%, rgba(0,0,0,0.55) 100%)",
        }}
      />
    </>
  );
}
