// Purely decorative backdrop: soft gradient blobs for the light "Aurora
// Minimal" theme, plus drifting particles layered on top that only become
// visible in dark mode ("Dark • Live Motion"). Pointer-events are disabled
// throughout so it never interferes with the form above it.
const particles = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: `${(i * 53.7) % 100}%`,
  size: 3 + ((i * 7) % 5),
  delay: `${(i % 9) * 0.9}s`,
  duration: `${9 + (i % 6) * 2}s`,
}));

export default function BackgroundFX() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Base wash */}
      <div className="absolute inset-0 bg-gradient-to-b from-orange-50 via-white to-indigo-50 dark:from-[#0b0f1e] dark:via-[#0a0d18] dark:to-[#0b0f1e]" />

      {/* Large soft blobs */}
      <div className="fx-orb absolute -left-20 top-24 h-72 w-72 rounded-full bg-indigo-200/50 blur-3xl dark:bg-indigo-500/10" />
      <div className="fx-orb-slow absolute right-[-4rem] top-10 h-80 w-80 rounded-full bg-orange-200/50 blur-3xl dark:bg-orange-500/10" />
      <div className="fx-orb absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-pink-100/60 blur-3xl dark:bg-fuchsia-500/5" />

      {/* Small floating accent dots, echoing the screenshot's orange spheres */}
      <div className="fx-orb-slow absolute left-[8%] top-[45%] h-4 w-4 rounded-full bg-orange-400/70 shadow-lg shadow-orange-500/30 dark:bg-orange-400/80" />
      <div className="fx-orb absolute right-[12%] top-[18%] h-3 w-3 rounded-full bg-orange-400/60 dark:bg-orange-400/70" />
      <div className="fx-orb-slow absolute bottom-[12%] right-[22%] h-5 w-5 rounded-full bg-orange-400/50 dark:bg-orange-400/60" />
      <div className="fx-orb absolute bottom-[22%] left-[6%] h-6 w-6 rounded-full bg-indigo-400/30 dark:bg-indigo-400/40" />

      {/* Live-motion particle field: dark theme only */}
      <div className="absolute inset-0 hidden dark:block">
        {particles.map((p) => (
          <span
            key={p.id}
            className="fx-particle absolute bottom-[-5%] rounded-full bg-orange-300/70"
            style={{
              left: p.left,
              width: p.size,
              height: p.size,
              animationDelay: p.delay,
              animationDuration: p.duration,
            }}
          />
        ))}
      </div>
    </div>
  );
}
