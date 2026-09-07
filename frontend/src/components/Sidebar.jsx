const features = [
  {
    title: "Secure & Private",
    body: "Your data is encrypted and safe with us.",
    tone: "indigo",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
        <path
          d="M12 2.5 4.5 5.5v5.2c0 4.86 3.2 9.16 7.5 10.3 4.3-1.14 7.5-5.44 7.5-10.3V5.5L12 2.5Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path d="M9 12.3 11.1 14.4 15.2 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Smart Automation",
    body: "AI helps speed up form filling.",
    tone: "orange",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
        <path
          d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    title: "Save & Continue",
    body: "Save your progress and resume anytime.",
    tone: "emerald",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
        <path d="M8 12.5 10.5 15 16 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

const toneClasses = {
  indigo:
    "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300",
  orange:
    "bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-300",
  emerald:
    "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300",
};

export default function Sidebar() {
  return (
    <aside className="relative hidden w-full max-w-[260px] shrink-0 flex-col lg:flex">
      <div className="relative z-10 mb-2">
        <span className="inline-flex items-center rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-orange-600 dark:border-orange-500/30 dark:bg-orange-500/10 dark:text-orange-300">
          Intake form
        </span>
      </div>

      <h1 className="relative z-10 text-3xl font-black leading-tight tracking-tight text-slate-900 dark:text-white">
        Welcome!
        <br />
        <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
          Let&rsquo;s get started
        </span>
      </h1>

      <p className="relative z-10 mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
        We&rsquo;ll collect some basic information to help you get the best experience.
      </p>

      <ul className="relative z-10 mt-8 flex flex-col gap-6">
        {features.map((feature) => (
          <li key={feature.title} className="flex items-start gap-3">
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${toneClasses[feature.tone]}`}
            >
              {feature.icon}
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {feature.title}
              </p>
              <p className="mt-0.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                {feature.body}
              </p>
            </div>
          </li>
        ))}
      </ul>

      {/* Decorative shield illustration, anchored near the bottom of the rail */}
      <div className="relative z-0 mt-10 flex flex-1 items-end justify-center pb-2">
        <svg viewBox="0 0 200 200" className="h-40 w-40 opacity-90">
          <defs>
            <linearGradient id="shieldGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#4f46e5" />
            </linearGradient>
          </defs>
          <circle cx="100" cy="100" r="92" className="fill-indigo-50 dark:fill-white/5" />
          <path
            d="M100 34 156 54v40c0 40-24 68-56 78-32-10-56-38-56-78V54l56-20Z"
            fill="url(#shieldGrad)"
            opacity="0.92"
          />
          <rect x="78" y="96" width="44" height="34" rx="7" fill="white" opacity="0.92" />
          <path
            d="M86 96v-12a14 14 0 1 1 28 0v12"
            stroke="white"
            strokeWidth="6"
            fill="none"
            opacity="0.92"
          />
        </svg>
      </div>
    </aside>
  );
}
