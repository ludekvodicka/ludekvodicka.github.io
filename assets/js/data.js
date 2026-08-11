/* =========================================================================
   Portfolio - data layer
   All page content: the product diagram, projects, open-source repos, stack,
   word cloud, process and timeline.
   ========================================================================= */

/* --- product-focused, LAYERED: client (left) · what we built (centre) ·
       AI services (top-right) · external infra & services (bottom-right).
       Docker isn't a node - it wraps everything (badge top-right). --- */
const MAP_PRODUCT = {
  groups: [
    { id: "built",    label: "Built by us · our code",        accent: "34,211,238" },
    { id: "ai",       label: "AI services",                   accent: "244,114,182" },
    { id: "external", label: "External infra & services",     accent: "148,163,184" },
  ],
  groupLinks: [
    { from: "g:built", to: "g:ai", kind: "flow", ret: true }, // the product calls AI
  ],
  badge: { icon: "docker", label: "everything dockerized" },
  hint: "client &rarr; what <b>we built</b> &rarr; external services + AI",
  nodes: [
    { id: "client",    role: "Client",           icon: "glyph:user",   x: 5,  y: 47, tier: "edge", big: true },
    // BUILT BY US - interfaces (left col) + our logic (right col)
    // top row: frontend · api · contracts; bottom row: engine · backend;
    // cli sits mid-left so its lines to engine and backend clear the chips
    { id: "frontend",  role: "Web frontend",     icon: "next",  sub: ["react"],        x: 16, y: 35, tier: "web",  group: "built", big: true },
    { id: "api",       role: "API server",       icon: "node",  sub: ["ts", "express"], x: 36, y: 35, tier: "api",  group: "built", big: true, hub: true },
    { id: "contracts", role: "Smart contracts",  icon: "solidity",     x: 56, y: 35, tier: "web3",  group: "built" },
    { id: "cli",       role: "CLI · tools",      icon: "glyph:tools",  x: 16, y: 50, tier: "infra", group: "built" },
    { id: "engine",    role: "High-perf engine", icon: "cpp",          x: 36, y: 63, tier: "core",  group: "built" },
    { id: "backend",   role: "Backend & workers",icon: "glyph:server", sub: ["ts"], x: 56, y: 63, tier: "core",  group: "built" },
    // AI SERVICES - top-right
    { id: "llm",       role: "LLM / AI",         icon: "glyph:llm",    x: 70, y: 16, tier: "ai", group: "ai", big: true },
    { id: "vector",    role: "Vector · RAG",     icon: "glyph:vector", x: 88, y: 16, tier: "ai", group: "ai" },
    { id: "agents",    role: "AI agents",        icon: "glyph:swarm",  x: 79, y: 28, tier: "ai", group: "ai" },
    // EXTERNAL INFRA & SERVICES - bottom-right (things we use, not built)
    { id: "db",        role: "Databases",        icon: "mongo", sub: ["pg"], x: 79, y: 82, tier: "data",  group: "external" },
    { id: "queue",     role: "Event queue",      icon: "glyph:queue",  x: 88, y: 54, tier: "infra", group: "external" },
    { id: "mqtt",      role: "MQTT broker",      icon: "glyph:mqtt",   x: 70, y: 69, tier: "infra", group: "external" },
    { id: "storage",   role: "Object storage",   icon: "glyph:storage",x: 88, y: 69, tier: "infra", group: "external" },
    { id: "chain",     role: "EVM chains",       icon: "web3",         x: 70, y: 54, tier: "web3",  group: "external" },
  ],
  edges: [
    // the client talks only to the left-hand interfaces: web + CLI
    { from: "client", to: "frontend", ret: true },
    { from: "client", to: "cli",      ret: true },
    // inside "built" - the request path
    { from: "frontend", to: "api",      ret: true },
    { from: "api",      to: "backend",  ret: true },
    { from: "api",      to: "engine",   ret: true },   // API also calls the high-perf engine
    { from: "backend",  to: "engine",   ret: true },
    { from: "cli",      to: "backend",  ret: true },   // CLI drives backend & workers…
    { from: "cli",      to: "engine",   ret: true },   // …and the engine
    { from: "api",      to: "contracts",ret: true },
    // built → external services (each its own colour)
    { from: "backend",  to: "db",       ret: true },   // store data
    { from: "backend",  to: "queue",    ret: true },   // publish events
    { from: "backend",  to: "mqtt",     ret: true },   // device / IoT messaging
    { from: "backend",  to: "storage",  ret: true },   // object storage
    { from: "contracts",to: "chain",    ret: true },   // settle on EVM chains
    // inside AI services
    { from: "llm",      to: "vector",   ret: true },
    { from: "agents",   to: "llm" },
  ],
};

/* =========================================================================
   WORD CLOUD - everything in my toolbox, pulled from the whole CV + projects.
   [text, weight] grouped by category; assembled into WORDCLOUD.words below.
   ========================================================================= */
const WC_CATS = [
  { id: "web3",    label: "Web3 & DeFi",     color: "#a78bfa" },
  { id: "backend", label: "Backend",         color: "#22d3ee" },
  { id: "ai",      label: "AI & LLM",        color: "#f472b6" },
  { id: "web",     label: "Web & Frontend",  color: "#60a5fa" },
  { id: "data",    label: "Databases",       color: "#34d399" },
  { id: "infra",   label: "DevOps & Cloud",  color: "#94a3b8" },
  { id: "cpp",     label: "C++ & Systems",   color: "#fbbf24" },
  { id: "concept", label: "Craft & domain",  color: "#e879f9" },
];

const WC_RAW = {
  ai: [
    ["AI agent swarms", 10], ["Claude", 9], ["Claude Code", 9], ["MCP servers", 8],
    ["Multi-agent orchestration", 8], ["Anthropic SDK", 7], ["OpenAI", 6], ["LLM tooling", 7],
    ["Adversarial verification", 5], ["RAG", 5], ["Whisper", 6], ["Parakeet", 3], ["Ollama", 5],
    ["onnx-asr", 3], ["Tesseract OCR", 4], ["Prompt engineering", 5], ["DirectML", 3], ["CUDA", 3],
    ["Voice-to-text", 5], ["Image generation", 4], ["Figma-to-React", 4], ["Electron", 6],
    ["xterm.js", 3], ["node-pty", 3], ["Agent SDK", 7], ["Jamat", 8], ["ScreenMCP", 5],
    ["Codex", 5], ["Open source", 6],
  ],
  web3: [
    ["Solidity", 9], ["Web3", 9], ["EVM", 8], ["Ethereum", 8], ["Hardhat", 8], ["OpenZeppelin", 7],
    ["Ethers.js", 7], ["Wagmi", 7], ["Viem", 7], ["Merkle proofs", 7], ["Uniswap", 7], ["DeFi", 7],
    ["Solana", 7], ["Cosmos", 6], ["CosmJS", 5], ["Injective", 4], ["Launchpad", 7], ["IDO / presale", 6],
    ["Vesting", 5], ["Airdrops", 6], ["Sniping bots", 6], ["Smart Order Router", 5], ["KYC", 4],
    ["Gnosis Safe", 4], ["PRBMath", 4], ["zkSync", 4], ["Arbitrum", 5], ["BSC", 4], ["AngelsSquad", 6],
    ["CCXT", 6], ["SecretKeeper", 6],
  ],
  backend: [
    ["Node.js", 10], ["TypeScript", 10], ["Express", 8], ["REST APIs", 8], ["WebSockets", 7],
    ["Telegram bots", 6], ["Grammy.js", 5], ["Discord.js", 4], ["Puppeteer", 5], ["Commander.js", 4],
    ["Zod", 4], ["Swagger", 3], ["Notion API", 4], ["Gmail API", 4], ["Trading bots", 6],
    ["Automation", 7], ["Microservices", 6], ["Message broker", 5], ["JavaScript", 7], ["esbuild", 5],
  ],
  web: [
    ["Next.js", 9], ["React", 9], ["MUI", 7], ["Directus CMS", 7], ["NextAuth", 5], ["React Flow", 5],
    ["Emotion", 4], ["Braintree", 4], ["HTML", 5], ["CSS", 5], ["Responsive design", 5], ["Swiper", 3],
    ["Admin dashboards", 6], ["dApps", 6],
  ],
  data: [
    ["MongoDB", 8], ["PostgreSQL", 7], ["MySQL", 6], ["SQLite", 6], ["MSSQL", 4], ["Redis", 4],
    ["Knex", 4], ["SQL", 6], ["ORM design", 7], ["AQL", 4], ["Schema design", 5], ["Vector / RAG", 4],
  ],
  infra: [
    ["Docker", 9], ["CI/CD", 7], ["Jenkins", 6], ["Azure", 6], ["AWS", 6], ["S3", 4], ["SES", 3],
    ["SQS", 3], ["Git", 7], ["SVN", 5], ["ESXi", 4], ["Hyper-V", 3], ["Graylog", 3], ["Dozzle", 3],
    ["Linux", 5], ["Windows", 4], ["macOS", 4], ["Code signing", 4], ["Notarization", 3], ["NSIS", 3],
    ["VS Code extensions", 4], ["Bash", 4],
  ],
  cpp: [
    ["C++", 10], ["Qt", 9], ["Boost", 7], ["STL", 6], ["Multithreading", 8], ["High-performance", 8],
    ["DLL injection", 6], ["API hooking", 6], ["WinAPI", 5], ["MFC", 4], ["RAII", 4], ["Pimpl", 3],
    ["XSLT", 6], ["libxml2", 4], ["RapidJSON", 4], ["OpenSSL", 4], ["libcurl", 4], ["Breakpad", 4],
    ["Mongoose", 4], ["QScriptEngine", 3], ["qmake / CMake", 4], ["Cross-platform", 6], ["QML", 4],
  ],
  concept: [
    ["Architecture", 9], ["System design", 8], ["Full-stack", 8], ["TDD", 7], ["Design patterns", 6],
    ["Dependency Injection", 6], ["Performance tuning", 8], ["Scalability", 6], ["Distributed systems", 6],
    ["Clean code", 5], ["Code review", 5], ["Refactoring", 4], ["Async", 5], ["Caching", 5],
    ["Technical leadership", 6], ["Due diligence", 4], ["Mentoring", 3], ["Remote-first", 5],
    ["Skipper", 7], ["Moonhill Capital", 7], ["Inventic", 6], ["Atomix framework", 6], ["CryptoTracker", 5],
    ["CoinScorer", 5], ["CTO", 6], ["Self-taught", 4],
  ],
};

const WORDCLOUD = {
  cats: WC_CATS,
  words: Object.keys(WC_RAW).reduce(function (acc, cat) {
    WC_RAW[cat].forEach(function (w) { acc.push({ text: w[0], cat: cat, weight: w[1] }); });
    return acc;
  }, []),
};

/* drawn glyphs for concepts without a brand logo (monochrome, currentColor) */
const ICON_GLYPHS = {
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="8" r="3.4"/><path d="M5.5 19.5a6.5 6.5 0 0 1 13 0"/></svg>',
  architect: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="10" cy="8" r="3.2"/><path d="M4 19.5a6 6 0 0 1 11.2-3"/><path d="M18.5 13.5v5M16 16h5"/></svg>',
  swarm: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="12" cy="12" r="2.4"/><circle cx="12" cy="4" r="1.6"/><circle cx="12" cy="20" r="1.6"/><circle cx="4.5" cy="7.5" r="1.6"/><circle cx="19.5" cy="7.5" r="1.6"/><circle cx="4.5" cy="16.5" r="1.6"/><circle cx="19.5" cy="16.5" r="1.6"/><path d="M12 9.6V5.6M12 14.4v4M9.9 10.6 5.9 8.4M14.1 10.6l4-2.2M9.9 13.4l-4 2.2M14.1 13.4l4 2.2"/></svg>',
  mcp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M4 12h6"/><rect x="10" y="8.5" width="7" height="7" rx="1.6"/><path d="M13.5 8.5V5.5M17 12h3"/><circle cx="4" cy="12" r="1.4"/></svg>',
  orch: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="5" cy="12" r="2"/><circle cx="19" cy="5.5" r="2"/><circle cx="19" cy="12" r="2"/><circle cx="19" cy="18.5" r="2"/><path d="M7 12h2M9 12l8-6M9 12h8M9 12l8 6"/></svg>',
  server: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="4" y="4" width="16" height="6" rx="1.5"/><rect x="4" y="14" width="16" height="6" rx="1.5"/><path d="M7.5 7h.01M7.5 17h.01"/></svg>',
  tools: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 9l3 3-3 3M13 15h4"/></svg>',
  llm: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="4" y="5" width="16" height="12" rx="2.2"/><path d="M7.5 9h9M7.5 12h6"/><path d="M9 17l-1.5 2.5M15 17l1.5 2.5"/></svg>',
  vector: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="10" cy="10" r="6"/><path d="M14.5 14.5 20 20"/><path d="M10 7.5v5M7.5 10h5"/></svg>',
  mqtt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="6" cy="18" r="1.6"/><path d="M5 13a8 8 0 0 1 6 6"/><path d="M5 8.5a12.5 12.5 0 0 1 10.5 10.5"/></svg>',
  queue: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="4" y="5" width="14" height="3.2" rx="1"/><rect x="4" y="10.4" width="14" height="3.2" rx="1"/><rect x="4" y="15.8" width="10" height="3.2" rx="1"/><path d="M17 17.4l3 0M20 17.4l-2 -2M20 17.4l-2 2"/></svg>',
  storage: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><ellipse cx="12" cy="6" rx="7" ry="2.6"/><path d="M5 6v12c0 1.4 3.1 2.6 7 2.6s7-1.2 7-2.6V6"/><path d="M5 12c0 1.4 3.1 2.6 7 2.6s7-1.2 7-2.6"/></svg>',
};

const WORKSHIFT = [
  { pct: 50, label: "architecture, plans & task briefs", note: "designing the system, writing the plan, briefing the agents" },
  { pct: 20, label: "writing code by hand",              note: "the swarm I built types the rest" },
  { pct: 30, label: "reviewing agent output",            note: "every diff gets read before it ships" },
];

/* ---- How a feature actually gets built (the loop I run) --------------- */
const PROCESS = [
  { n: "01", title: "Architect & plan", desc: "I design the system and write the plan. No code until the plan is right." },
  { n: "02", title: "Brief & dispatch", desc: "I split the work into well-specified tasks and hand them to parallel agents." },
  { n: "03", title: "Review & verify", desc: "Agents cross-check each other's output; I read the result and sign off." },
  { n: "04", title: "Ship & own", desc: "I deploy, wire up CI and monitoring, and own the outcome in production." },
];

/* ---- Stack, grouped by era (current first) ---------------------------- */
const STACK = [
  {
    era: "core",
    tag: "Core · my daily driver",
    title: "Full-stack TypeScript & Solidity, Web2 & Web3",
    blurb: "The stack I ship on every day: backends, smart contracts, bots and Next.js products.",
    tags: ["TypeScript", "Node.js", "Next.js", "React 19", "Solidity", "Wagmi / Viem", "MongoDB", "PostgreSQL", "Express", "MUI"],
  },
  {
    era: "now",
    tag: "Force multiplier · tooling I built",
    title: "AI-assisted delivery, on my own toolchain",
    blurb: "I built my own multi-agent tooling (Jamat, ScreenMCP, custom Claude Code agents). It does the heavy typing; the architecture and the decision to ship stay with me.",
    tags: ["Claude Agent SDK", "MCP servers", "Multi-agent orchestration", "Human-in-the-loop", "Adversarial verification", "Local ASR · Whisper", "Python"],
  },
  {
    era: "infra",
    tag: "Delivery · how it ships",
    title: "Cloud, DevOps & delivery",
    blurb: "From first commit to a signed, deployed, monitored product.",
    tags: ["Docker", "Azure", "AWS · SES/SQS/S3", "Jenkins CI", "ESXi", "Git", "Code signing"],
  },
  {
    era: "foundation",
    tag: "Foundation · where I come from",
    title: "C++ systems engineering",
    blurb: "25 years of low-level, high-performance native software. This is where my habits around performance and correctness come from.",
    tags: ["C++ 11–20", "Qt", "Boost", "Multithreading", "High-performance", "DLL injection / API hooking", "MySQL"],
  },
];

/* ---- Project tiers + filters (top-tier shown by default) -------------- */
const FILTERS = [
  { id: "all",    label: "All" },
  { id: "top",    label: "★ Top-tier" },
  { id: "ai",     label: "AI & agents" },
  { id: "crypto", label: "Crypto & Web3" },
  { id: "coding", label: "Coding & tooling" },
  { id: "hobby",  label: "Hobby" },
];

/* category → badge label shown on each card */
const CAT_LABELS = {
  ai: "AI & agents", web3: "Web3 & DeFi", backend: "Backend & Bots",
  web: "Web & Frontend", desktop: "C++ Foundation", iot: "Home & IoT", tools: "Dev tooling",
  company: "Company & team",
};

/* project name → tier (anything not listed defaults to "side").
   Top-tier = made money / flagship / named references. */
const PROJECT_TIERS = {
  "DEUSS / IDA": "top",
  "AngelsSquad Launchpad": "top",
  "Moonhill Capital Platform": "top",
  "Skipper": "top",
  "CryptoTracker": "top",
  "Inventic s.r.o.": "top",
  "Jamat": "top",
  "Moonhill Crypto Operations": "top",
  "SecretKeeper": "top",
  "Local Voice-to-Text": "hobby",
  "Home & IoT automation": "hobby",
  "CoinScorer": "hobby",
};

/* ---- Projects (top-tier first) ---------------------------------------- */
const PROJECTS = [
  {
    name: "DEUSS / IDA",
    cat: "web3",
    source: "online",
    groups: ["crypto", "ai"],
    flag: "ČVUT · reference project",
    metric: "Market surveillance",
    blurb:
      "IDA (Internal Diligence Agent): a real-time market-surveillance & compliance platform for DEUSS, a blockchain bond-trading marketplace. A plugin-based, config-driven event pipeline ingests on-chain bond-contract events and external feeds; AI detection agents flag market abuse such as wash trading, spoofing, position concentration and spoof/cancel bursts. Built with ČVUT, MAMA AI and VŠE.",
    tech: ["TypeScript", "Node.js", "Foundry / Solidity", "Real-time events", "AI detectors", "Plugin architecture"],
    highlight: "On-chain surveillance · 8 abuse-detection scenarios",
    links: [{ label: "deussblockchain.eu", url: "https://deussblockchain.eu/" }],
  },
  {
    name: "Skipper",
    cat: "desktop",
    source: "online",
    flag: "Flagship · 12+ years",
    metric: "$1M+ revenue",
    blurb:
      "A visual ORM designer & multi-framework code generator sold globally to developers. Design your database visually, generate clean ORM code for Doctrine, Laravel, Symfony, Hibernate and more. My foundation product, still selling today.",
    tech: ["C++17", "Qt", "XSLT", "Boost", "Jenkins CI"],
    highlight: "6,500+ files · Windows / Linux / macOS",
    links: [{ label: "skipper18.com", url: "https://skipper18.com/" }],
  },
  {
    name: "Claude Skill & Swarm Ecosystem",
    cat: "ai",
    source: "internal",
    flag: "Self-built AI swarm",
    metric: "20+ agents",
    blurb:
      "A library of custom Claude Code skills and sub-agents I built, tuned and direct: a multi-agent project planner (plan / work / review), researchers, reviewers and debuggers, running in parallel under my orchestration, with adversarial verification before anything ships.",
    tech: ["Claude Agent SDK", "MCP servers", "Multi-agent", "Parallel fan-out", "TypeScript"],
    highlight: "Every agent's output goes through my review",
  },  {
    name: "SvnTea",
    cat: "tools",
    source: "internal",
    flag: "Internal platform · not public yet",
    metric: "AI-first forge",
    blurb:
      "A modern web forge for Subversion, built because Gitea and Forgejo are Git-only. Repository browsing, diffs, blame and code search read straight from SVN; issues, milestones, labels and API keys live in the forge's own database. Every action the UI can perform is also one scoped REST call, so AI agents can file issues and coordinate in the comment threads.",
    tech: ["Next.js 16", "React 19", "MUI 7", "Drizzle ORM", "SQLite", "NextAuth v5", "svn CLI"],
    highlight: "Every UI action is a scoped REST call · agents coordinate in issue threads",
  },
  {
    name: "ScreenMCP",
    cat: "ai",
    source: "oss",
    flag: "Open source · MIT",
    metric: "Human-gated desktop vision",
    blurb:
      "Desktop vision for coding agents, with the human holding the switch. One monitor, window or region is shared at a time; an MCP client sees that source and nothing else, through an authenticated endpoint that never leaves localhost. A visible STOP control, redaction masks and a local audit trail keep it from turning into a screen recorder.",
    tech: ["TypeScript", "Electron", "MCP server", "Node.js", "GitHub Actions"],
    highlight: "Localhost-only · bearer auth · redaction masks · audit trail",
    links: [{ label: "github.com/ludekvodicka/ScreenMCP", url: "https://github.com/ludekvodicka/ScreenMCP" }],
  },
  {
    name: "Local Voice-to-Text",
    cat: "ai",
    source: "oss",
    flag: "Open source · personal tool",
    metric: "100% local",
    blurb:
      "A privacy-first hold-to-talk dictation tool running entirely on my own GPU: Whisper/Parakeet ASR with optional LLM filler-cleanup via Ollama. Press a hotkey, speak, release, and the text pastes into any app.",
    tech: ["Python", "Whisper / Parakeet", "onnx-asr", "Ollama", "DirectML / CUDA"],
    highlight: "100+ languages · no cloud, ever",
    links: [{ label: "local-dictate", url: "https://github.com/ludekvodicka/local-dictate" }],
  },
  {
    name: "Content & Marketing AI",
    cat: "ai",
    source: "internal",
    flag: "Client work · content automation",
    metric: "Automation",
    blurb:
      "AI content pipelines built to order: specialised LinkedIn strategies with a strategist trained on the client's own edits, plus SQL-segmented email campaigns for Skipper customers via the Gmail API, with humanising passes that strip the AI tells.",
    tech: ["Claude agents", "MySQL segmentation", "Gmail API", "Humanizer"],
    highlight: "Voice-matched drafts · read-only customer DB",
  },
  {
    name: "VS Code Source-Control Extensions",
    cat: "tools",
    source: "oss",
    flag: "Open source · MIT",
    metric: "Two editor extensions",
    blurb:
      "Two published VS Code extensions bridging TortoiseGit and TortoiseSVN into the editor (pull, push, commit, log, blame, diff), auto-detecting the install from the Windows registry, with multi-root support.",
    tech: ["VS Code API", "TypeScript", "WinAPI", "Registry detection"],
    highlight: "Windows-native source control inside VS Code",
    links: [
      { label: "TortoiseGit", url: "https://github.com/ludekvodicka/vscode-tortoise-git" },
      { label: "TortoiseSVN", url: "https://github.com/ludekvodicka/vscode-tortoise-svn" },
    ],
  },

  {
    name: "AngelsSquad Launchpad",
    cat: "web3",
    source: "online",
    flag: "Moonhill Capital · as CTO",
    metric: "$10M+ raised",
    blurb:
      "A full Web3 fundraising & token-distribution platform I built as CTO (public dApp plus operator backoffice) and the Solidity core behind it: on-chain deal management, presales, vesting and gas-efficient Merkle-proof claim distribution, with role-based access, KYC and wallet connect across EVM and non-EVM chains.",
    tech: ["Solidity", "Hardhat", "OpenZeppelin", "Next.js", "Wagmi / Viem", "Merkle proofs", "Solana", "KYC"],
    highlight: "40+ raises · EVM + non-EVM · AccessControl · SafeERC20 · ReentrancyGuard",
    links: [{ label: "angelssquad.com", url: "https://angelssquad.com/" }],
  },
  {
    name: "Moonhill Crypto Operations",
    cat: "web3",
    source: "internal",
    flag: "Moonhill Capital · as CTO",
    metric: "Treasury automation",
    blurb:
      "The automation behind the fund's day-to-day crypto operations. Multisig treasury runs check balances, propose batch transactions, collect the signatures and execute on chain, then settle through an exchange and pay out on schedule, with a reconciliation report at the end. The same runner drives node operations and scheduled protocol tasks across EVM, Solana and Cosmos.",
    tech: ["TypeScript", "Ethers", "CosmJS", "Solana web3.js", "Multisig", "MongoDB"],
    highlight: "Step-based tasks with their own state, scheduled or run on demand",
  },
  {
    name: "SecretKeeper",
    cat: "web3",
    source: "internal",
    flag: "Internal platform · custody & signing",
    metric: "Zero keys in code",
    blurb:
      "A custody and signing service that keeps private keys and API secrets out of application code. Secrets are encrypted at rest and released through an approval broker: a caller requests access, a human approves or denies it, and every grant is written to an audit log. Signing runs inside the service on isolated signers for EVM, Cosmos and Solana, so callers receive a signature and never the key.",
    tech: ["TypeScript", "Node.js", "Encrypted storage", "Approval broker", "Audit log", "SSE", "EVM · Cosmos · Solana signers", "MongoDB"],
    highlight: "Callers get a signature, never a key · every grant approved and logged",
  },
  {
    name: "Jamat",
    cat: "ai",
    source: "oss",
    flag: "Open source · MIT",
    metric: "Multi-agent terminal",
    blurb:
      "An open-source desktop control center for running many Claude Code and Codex sessions in one tiling workspace, and for reaching the sessions on my other machines over the network, including letting one agent operate another's tab. It shows which agent is working and which is waiting on me. Self-hosted, own keys, nothing proxied. Built over five months and used every day.",
    tech: ["TypeScript", "Electron", "React", "xterm.js", "node-pty", "pnpm monorepo"],
    highlight: "Installers for Windows · macOS · Linux · auto-update from GitHub Releases",
    links: [{ label: "github.com/ludekvodicka/jamat", url: "https://github.com/ludekvodicka/jamat" }],
  },
  {
    name: "CosmosBot",
    cat: "web3",
    source: "internal",
    flag: "Freelance · cross-chain engine",
    metric: "4+ chains",
    blurb:
      "A multi-blockchain transaction engine that signs and broadcasts across Cosmos, Solana, Ethereum and Injective, handling HD key derivation, cross-standard address encoding and exchange integration.",
    tech: ["CosmJS", "Solana web3.js", "Ethers", "Injective", "CCXT"],
    highlight: "Cross-chain key derivation & signing",
  },
  {
    name: "Autonomous DeFi Bots",
    cat: "web3",
    source: "internal",
    flag: "Freelance · on-chain automation",
    metric: "24/7 on-chain",
    blurb:
      "Autonomous airdrop-farming and token-sniping bots: Uniswap smart-order routing for pricing, stealth scraping, EVM proxy/factory detection and Merkle-proof farming, across testnets and mainnets with 100+ wallets.",
    tech: ["Ethers", "Uniswap SOR", "Puppeteer (stealth)", "Multi-chain"],
    highlight: "Tier-1 sniping · 0G · Aethir · CARV",
  },
  {
    name: "TelegramCryptoBot",
    cat: "web3",
    source: "internal",
    flag: "Freelance · trading bot",
    metric: "Multi-chain trading",
    blurb:
      "A production Telegram trading bot with rich menus and conversations: Uniswap V2/V3 swaps, Solana SPL, Serum DEX and natural-language deadline parsing. It handles Solana blockhash expiry with retries.",
    tech: ["Grammy.js", "Uniswap SDK", "Solana", "Serum", "MongoDB"],
    highlight: "Menus + conversations · tx retry handling",
    groups: ["crypto", "hobby"],
  },

  {
    name: "AtomixToolsV2",
    cat: "backend",
    source: "internal",
    flag: "Internal platform",
    metric: "Powers every TS app",
    blurb:
      "A custom global CLI toolchain (axtoolsv2) for my Node.js stack: git-externals sync with live symlinks, Docker deploy, scaffolding, encrypted backups and Directus migrations. Cross-platform, Windows & POSIX.",
    tech: ["TypeScript", "Commander.js", "esbuild", "Docker"],
    highlight: "Live shared-code propagation across projects",
  },
  {
    name: "Atomix V2 Backend Framework",
    cat: "backend",
    source: "internal",
    flag: "Internal platform",
    metric: "Service framework",
    blurb:
      "A reusable Node/Express service framework with a clean lifecycle (AxApp start/stop), health-checked REST services, structured logging and a git-externals architecture sharing a common core. Dockerised and tested.",
    tech: ["TypeScript", "Express", "MongoDB", "Docker", "Mocha"],
    highlight: "The backbone under my backend services",
  },
  {
    name: "Portfolio & Tax Suite",
    cat: "backend",
    source: "internal",
    flag: "Personal · crypto accounting",
    metric: "100+ exchanges",
    blurb:
      "Services for multi-chain portfolio tracking and crypto tax accounting: real-time pricing from 100+ exchanges via CCXT, cost-basis and gain/loss calculation, Notion sync and CSV tax-report export.",
    tech: ["CCXT", "Node.js", "MongoDB", "Notion API"],
    highlight: "Multi-chain + CEX, unified view",
    groups: ["crypto", "hobby"],
  },

  {
    name: "Moonhill Capital Platform",
    cat: "web",
    source: "online",
    flag: "Moonhill Capital · as CTO",
    metric: "Investor portal",
    blurb:
      "The web surface of a VC/token fund: investor portals with impersonation, admin ops with on-chain wallet integration, a node-graph 'labs' workspace, plus news/CMS, email and PDF, all in one design system.",
    tech: ["Next.js 16", "React 19", "MUI 7", "Directus", "Wagmi / Viem", "React Flow"],
    highlight: "Public · admin · labs · investor portal",
    links: [{ label: "moonhill.capital", url: "https://moonhill.capital/" }],
  },
  {
    name: "Node Infra Platforms",
    cat: "web",
    source: "internal",
    flag: "Two products · shared codebase",
    metric: "SaaS · 3-part",
    blurb:
      "Mirabia & Nodera: node-network infrastructure SaaS, each a three-part product (public site + operator admin + user app) with React-Flow deployment visualisation, a custom image pipeline and shared code.",
    tech: ["Next.js", "React Flow", "Directus", "MongoDB", "Express"],
    highlight: "Public + admin + app, shared codebase",
  },
  {
    name: "Skipper Web & Client Sites",
    cat: "web",
    source: "online",
    flag: "Inventic · commercial web",
    metric: "Live products",
    blurb:
      "Commercial web around Skipper plus company and client sites: Next.js + Directus marketing sites and an e-commerce/payment flow with Braintree, reCAPTCHA and transaction management for the product store.",
    tech: ["Next.js", "Directus CMS", "Braintree", "NextAuth"],
    highlight: "Marketing + e-commerce + payments",
    links: [{ label: "skipper18.com", url: "https://skipper18.com/" }],
  },

  {
    name: "Inventic s.r.o.",
    cat: "company",
    source: "online",
    flag: "Founder & owner · since 2006",
    metric: "Team of 5–10",
    blurb:
      "The software company I founded and run since 2006. Beyond my own products, we delivered websites and warehouse/inventory systems for clients. That meant hiring and leading a team of 5–10, managing people and running projects end to end: scoping, estimates, delivery and support.",
    tech: ["Team leadership", "People management", "Project management", "Client delivery", "Hiring", "Web & warehouse systems"],
    highlight: "Hiring, people & project management",
    links: [{ label: "inventic.eu", url: "https://inventic.eu/" }],
  },
  {
    name: "CryptoTracker",
    cat: "desktop",
    source: "internal",
    flag: "Foundation · C++ engine",
    metric: "Millions of trades/sec",
    blurb:
      "A high-performance market-data engine: a multithreaded message broker aggregates and processes millions of trades and prices per second, feeding a fast evaluation-tree engine for technical indicators.",
    tech: ["C++", "Multithreading", "WebSockets", "Message broker"],
    highlight: "The performance roots behind today's bots",
  },
  {
    name: "Atomix C++ Framework",
    cat: "desktop",
    source: "internal",
    flag: "Internal platform · C++",
    metric: "Powers 10+ apps",
    blurb:
      "My own modular C++ application framework: DI container, plugin system, ORM/AQL layer, HTTP & WebSocket clients, crash reporting and auto-update. The backbone under every native product I've shipped.",
    tech: ["C++17", "Qt", "Dependency Injection", "Plugins", "OpenSSL"],
    highlight: "axCore · axQt · axApplication · axPlugins",
  },
  {
    name: "ParalelBuilds & Licensing",
    cat: "desktop",
    source: "internal",
    flag: "Systems work · C++",
    metric: "Systems-level",
    blurb:
      "Distributed build system (Incredibuild-style, via DLL injection & API hooking) plus dockerised C++ licensing microservices on Azure/AWS. The kind of systems work that taught me how software really runs.",
    tech: ["C++", "DLL injection", "API hooking", "Docker", "Azure"],
    highlight: "Process injection · remote execution · licensing",
  },

  {
    name: "CoinScorer",
    cat: "web3",
    source: "oss",
    flag: "Personal · free alpha",
    metric: "Crypto trading app",
    blurb:
      "A desktop trading app for crypto: portfolio and trade history with fast search, a trade analyser that groups positions by profitability, a market scanner with custom rules, alerts on price or multi-indicator expressions, impermanent-loss simulation and automated orders with several take-profit and stop-loss levels. Client/server, Windows, macOS and Linux, Binance spot only. Released free as an alpha and left there.",
    tech: ["Binance API", "Technical indicators", "Client / server", "Windows / macOS / Linux"],
    highlight: "Free alpha · built in spare time",
    links: [{ label: "github.com/CoinScorer", url: "https://github.com/CoinScorer/CoinScorer" }],
  },
  {
    name: "Home & IoT automation",
    cat: "iot",
    source: "internal",
    flag: "Personal · hobby",
    metric: "My own smart home",
    blurb:
      "My house runs on a stack I wired and program myself: Loxone as the core, Home Assistant and Node-RED for logic and dashboards, Zigbee and MQTT for devices, ESP8266/Arduino for custom sensors and controllers, plus solar (FVE) integration and a UniFi network. Hardware to dashboards: real systems engineering, just for the fun of it.",
    tech: ["Loxone", "Home Assistant", "Node-RED", "Zigbee", "MQTT", "ESP8266 / Arduino", "Tasmota", "UniFi"],
    highlight: "The hobby that keeps me close to the metal",
  },
];

/* ---- Open source - my public repos ------------------------------------ */
const OSS_REPOS = [
  {
    repo: "jamat",
    name: "Jamat",
    lang: "TypeScript",
    tag: "flagship",
    desc: "Multi-agent terminal: many Claude Code & Codex sessions in one tiling workspace, across machines. MIT, installers for all three platforms.",
  },
  {
    repo: "ScreenMCP",
    name: "ScreenMCP",
    lang: "TypeScript",
    tag: "MCP server",
    desc: "Human-controlled desktop vision for AI agents: you pick the monitor, window or region. Localhost-only, bearer auth, redaction masks, audit trail.",
  },
  {
    repo: "MeetingRecorder",
    name: "MeetingRecorder",
    lang: "Python",
    tag: "tool",
    desc: "Dual-track meeting recorder (system audio + mic) with transcription, speaker labels, live translated subtitles and AI summaries.",
  },
  {
    repo: "VifitoDesktop",
    name: "VifitoDesktop",
    lang: "TypeScript",
    tag: "hardware",
    desc: "A desktop app to drive VIFITO Rio 45 iR infrared devices, and probably the rest of the family.",
  },
  {
    repo: "vscode-tortoise-git",
    name: "vscode-tortoise-git",
    lang: "TypeScript",
    tag: "extension",
    desc: "TortoiseGit inside VS Code: commit, log, blame and diff, with the install auto-detected from the Windows registry.",
  },
  {
    repo: "vscode-tortoise-svn",
    name: "vscode-tortoise-svn",
    lang: "TypeScript",
    tag: "extension",
    desc: "The same bridge for TortoiseSVN, with multi-root workspace support.",
  },
  {
    repo: "ikamand",
    name: "ikamand",
    lang: "HTML",
    tag: "hobby",
    desc: "A replacement app for the iKamand grill controller, written for the barbecue rather than for the CV.",
  },
];

const OSS_GH_USER = "ludekvodicka";

/* ---- Home page - the things a visitor can install or clone today -------
   Each row names exactly one of `project` (joins PROJECTS by name) or `repo`
   (joins OSS_REPOS by repo), so the description is never retyped here.
   `release` marks a repo that publishes GitHub releases: the row renders one
   button per platform, and main.js upgrades them to direct asset URLs.       */
const HOME = {
  downloads: [
    {
      name: "Jamat",
      project: "Jamat",
      kind: "Desktop app · installers",
      url: "https://github.com/ludekvodicka/jamat/releases",
      release: { owner: "ludekvodicka", repo: "jamat" },
    },
    {
      name: "Skipper",
      project: "Skipper",
      kind: "Free trial",
      url: "https://skipper18.com/",
    },
    {
      name: "ScreenMCP",
      project: "ScreenMCP",
      kind: "MCP server · installers",
      url: "https://github.com/ludekvodicka/ScreenMCP/releases",
      release: { owner: "ludekvodicka", repo: "ScreenMCP" },
    },
    {
      name: "Local Voice-to-Text",
      project: "Local Voice-to-Text",
      kind: "Python tool · clone",
      url: "https://github.com/ludekvodicka/local-dictate",
    },
    {
      name: "vscode-tortoise-git",
      repo: "vscode-tortoise-git",
      kind: "VS Code extension",
      url: "https://github.com/ludekvodicka/vscode-tortoise-git",
    },
    {
      name: "vscode-tortoise-svn",
      repo: "vscode-tortoise-svn",
      kind: "VS Code extension",
      url: "https://github.com/ludekvodicka/vscode-tortoise-svn",
    },
  ],
};

/* ---- Career evolution (now → roots) ----------------------------------- */
const TIMELINE = [
  {
    period: "2025 → now",
    role: "Building modern web, Web3 & AI applications",
    org: "Freelance · Inventic",
    desc: "Shipping products with my own agent tooling: the DEUSS/IDA market-surveillance platform, classification & reporting pipelines, Telegram community intelligence, and an ecosystem of custom Claude Code agents and MCP servers.",
    tags: ["TypeScript", "Web3", "AI tooling"],
    era: "now",
  },
  {
    period: "2024 → now",
    role: "Crypto operations & automation",
    org: "Moonhill Capital",
    desc: "Automating the fund's crypto operations: multisig treasury runs, exchange settlement, scheduled distribution with reconciliation reporting, plus node operations and protocol tasks across EVM, Solana and Cosmos.",
    tags: ["Treasury ops", "Multi-chain", "Automation"],
    era: "core",
  },
  {
    period: "2022 → now",
    role: "CTO · AngelsSquad Platform",
    org: "Moonhill Capital",
    desc: "Own technology end to end: secure infrastructure, Solidity fund-collection & distribution contracts on EVM and non-EVM chains, the Web3 platform and Next.js apps, plus technical due diligence. 40+ raises.",
    tags: ["Web3", "Solidity", "Next.js", "Leadership"],
    era: "core",
  },
  {
    period: "2021 → now",
    role: "Web3 Engineer",
    org: "Freelance",
    desc: "DEX LP sniping, contract-scanning bots, presale/NFT sniping on tier-1 projects, Merkle-proof farming automation, autonomous airdrop bots and Cosmos staking automation across 100+ wallets.",
    tags: ["DeFi", "Bots", "Multi-chain"],
    era: "core",
  },
  {
    period: "2014 → now",
    role: "C++ Engineer · Skipper",
    org: "Inventic s.r.o.",
    desc: "Designed and built Skipper, a cross-platform visual ORM editor & code generator sold globally: Qt GUI, XSLT code generation, TDD and a full Jenkins CI pipeline with signing and notarisation.",
    tags: ["C++", "Qt", "CI/CD"],
    era: "foundation",
  },
  {
    period: "2006 → now",
    role: "Owner & Chief Developer",
    org: "Inventic s.r.o.",
    desc: "Founded and run my own software company, from a C++/MFC warehouse system and high-performance trading engines, growing into developer tooling, infrastructure and a full Web2/Web3/AI stack.",
    tags: ["Founder", "C++", "Full-stack"],
    era: "foundation",
  },
  {
    period: "2000 → 2006",
    role: "Developer · Consultant",
    org: "Self-employed",
    desc: "The start of a professional career that began as a kid writing code: early development, consulting and project management that set the foundation for everything since.",
    tags: ["Roots"],
    era: "foundation",
  },
];

/* ---- CV-only facts (rendered by cv.js on cv.html; not used by main.js) --- */
const CV = {
  name: "Ludek Vodicka",
  title: "Senior Full-Stack Engineer",
  tagline: "TypeScript · Node.js · Web3 · Solidity · Next.js · deep C++ roots",
  contact: {
    email: "ludek.vodicka@gmail.com",
    linkedin: "linkedin.com/in/ludekvodicka",
    github: "github.com/ludekvodicka",
    web: "ludekvodicka.github.io",
    location: "Czech Republic",
  },
  profile:
    "Senior full-stack engineer with 25 years of shipped production code, covering architecture, " +
    "implementation, testing, CI/CD and production operations. Current stack: TypeScript, Node.js, " +
    "Next.js and Solidity/Web3 on deep C++/Qt foundations. Founder and owner of Inventic s.r.o. and " +
    "author of Skipper, a visual ORM tool with $1M+ lifetime revenue; as CTO at Moonhill Capital " +
    "built the Web3 platforms behind $10M+ raised across 40+ token sales. Day-to-day delivery is " +
    "accelerated by multi-agent AI tooling I built and maintain myself; the architecture and the " +
    "responsibility for what ships stay with me.",
  /* labels for STACK eras as rendered in the CV Skills section (tags come from STACK[].tags) */
  skillLabels: {
    core: "Core stack",
    now: "AI-assisted delivery",
    infra: "Cloud & DevOps",
    foundation: "C++ & systems",
  },
  /* whitelist of OSS_REPOS[].repo rendered in the Open Source section */
  ossRepos: ["jamat", "ScreenMCP", "vscode-tortoise-git", "vscode-tortoise-svn"],
  education: [
    { period: "2004-2007", degree: "Master's degree, Applied Informatics",
      school: "Masaryk University, Faculty of Informatics, Brno" },
    { period: "2000-2004", degree: "Bachelor's degree, Applied Informatics",
      school: "Masaryk University, Faculty of Informatics, Brno" },
  ],
  languages: ["English: daily working language", "Czech: native"],
  cooperation: [
    "B2B contract work, project by project",
    "Remote-native · CET · not actively job hunting, open to interesting contracts",
  ],
};
