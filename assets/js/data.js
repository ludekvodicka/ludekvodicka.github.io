/* =========================================================================
   Portfolio v2 — data layer
   Tech-skill network graph + content. Emphasis on the CURRENT stack
   (AI swarms · TypeScript · Web3 · Next.js) with C++/SQL as the foundation.
   ========================================================================= */

/* ---- SYSTEM MAP (grouped) ----------------------------------------------
   The story: I (the architect) sit on top. There are TWO different AIs:

     1. AI coding swarm  — the agents I DIRECT to build & maintain everything
                           (Claude Code, MCP, agent swarm, parallel agents).
     2. Runtime AI       — the AI the PRODUCTS themselves use at run-time
                           (LLM API, vector / RAG).

   Nodes are grouped into boxes (TECHMAP_GROUPS). Relationships between whole
   groups are TECHMAP_GROUP_LINKS; node-level edges (TECHMAP_EDGES) are the
   flows INSIDE each group.

   Edge/packet kinds:  flow (cyan/pink) · control (gold, I direct) · assist
   (violet, the coding swarm builds it).
   ----------------------------------------------------------------------- */
const TECHMAP_NODES = [
  // The human + the end user — standalone, no group box
  { id: "you",       role: "You · architect",  icon: "glyph:architect", x: 7, y: 9,  tier: "human", big: true, hero: true },
  { id: "client",    role: "Client",           icon: "glyph:user",      x: 5, y: 63, tier: "edge" },

  // GROUP 1 — AI coding swarm (I direct it; it builds the products)
  { id: "orch",      role: "Claude Code",      icon: "claude",      x: 38, y: 17, tier: "ai", group: "swarm" },
  { id: "mcp",       role: "MCP tools",        icon: "glyph:mcp",   x: 29, y: 26, tier: "ai", group: "swarm" },
  { id: "swarm",     role: "Agent swarm",      icon: "glyph:swarm", x: 52, y: 16, tier: "ai", group: "swarm", big: true },
  { id: "agents",    role: "Parallel agents",  icon: "glyph:orch",  x: 62, y: 25, tier: "ai", group: "swarm" },

  // GROUP 2 — Products · the running system
  { id: "frontend",  role: "Web frontend",     icon: "next",  sub: ["react"],        x: 16, y: 55, tier: "web",   group: "products", big: true },
  { id: "api",       role: "API server",       icon: "node",  sub: ["ts", "express"], x: 30, y: 58, tier: "api",   group: "products", big: true, hub: true },
  { id: "backend",   role: "Backend & workers",icon: "glyph:server", sub: ["ts"], x: 44, y: 60, tier: "core",  group: "products" },
  { id: "engine",    role: "High-perf engine", icon: "cpp",         x: 57, y: 54, tier: "core",  group: "products" },
  { id: "tools",     role: "Tools · CLI",      icon: "glyph:tools",  x: 18, y: 71, tier: "infra", group: "products" },
  { id: "db",        role: "Databases",        icon: "mongo", sub: ["pg"], x: 32, y: 75, tier: "data",  group: "products" },
  { id: "contracts", role: "Smart contracts",  icon: "solidity",    x: 47, y: 77, tier: "web3",  group: "products" },
  { id: "chain",     role: "EVM chains",       icon: "web3",        x: 60, y: 80, tier: "web3",  group: "products" },
  { id: "infra",     role: "Infra · Docker",   icon: "docker",      x: 18, y: 86, tier: "infra", group: "products" },

  // GROUP 3 — Runtime AI (the AI the products use at run-time)
  { id: "llm",       role: "LLM API",          icon: "glyph:llm",    x: 80, y: 52, tier: "ai", group: "runtimeai" },
  { id: "vector",    role: "Vector · RAG",     icon: "glyph:vector", x: 87, y: 66, tier: "ai", group: "runtimeai" },
];

/* node-level flows INSIDE the groups (+ the client hitting the products) */
const TECHMAP_EDGES = [
  // running system — request in, response back
  { from: "client",    to: "frontend",  ret: true },
  { from: "frontend",  to: "api",       ret: true },
  { from: "api",       to: "backend",   ret: true },
  { from: "api",       to: "contracts", ret: true },
  { from: "contracts", to: "chain",     ret: true },
  { from: "backend",   to: "engine",    ret: true },
  { from: "backend",   to: "db",        ret: true },
  { from: "tools",     to: "infra" },
  { from: "infra",     to: "api" },
  { from: "infra",     to: "backend" },
  // inside the AI coding swarm
  { from: "orch",      to: "mcp" },
  { from: "orch",      to: "swarm" },
  { from: "mcp",       to: "swarm" },
  { from: "swarm",     to: "agents",    ret: true },
  // inside runtime AI
  { from: "llm",       to: "vector",    ret: true },
];

/* the group boxes */
const TECHMAP_GROUPS = [
  { id: "swarm",     label: "AI coding swarm — I direct it",     accent: "167,139,250" },
  { id: "products",  label: "Products — the running system",     accent: "34,211,238" },
  { id: "runtimeai", label: "Runtime AI — used by the products", accent: "244,114,182" },
];

/* relationships between whole groups (and from the You node).
   anchor "g:<id>" = a group box; otherwise a node id. */
const TECHMAP_GROUP_LINKS = [
  { from: "you",        to: "g:swarm",     kind: "control" }, // I direct the coding swarm
  { from: "you",        to: "g:products",  kind: "control" }, // I architect the products
  { from: "g:swarm",    to: "g:products",  kind: "assist" },  // the swarm builds the products
  { from: "g:swarm",    to: "g:runtimeai", kind: "assist" },  // …and builds their runtime AI
  { from: "g:products", to: "g:runtimeai", kind: "flow", ret: true }, // products call runtime AI
];

/* =========================================================================
   CHART GALLERY — several variants, kept side by side to iterate on.
   MAP_V3 reuses the grouped data above; the others are self-contained.
   ========================================================================= */
const MAP_V3 = {
  nodes: TECHMAP_NODES, edges: TECHMAP_EDGES, groups: TECHMAP_GROUPS, groupLinks: TECHMAP_GROUP_LINKS,
  hint: "two AIs: a <b>coding swarm I direct</b> builds the products &middot; the products use their own <b>runtime AI</b>",
};

/* --- v2 — a request flowing through the system (no You, no groups) --- */
const MAP_V2 = {
  groups: [], groupLinks: [],
  hint: "v2 — a request flowing through the running system",
  nodes: [
    { id: "client",    role: "Client",           icon: "glyph:user",  x: 6,  y: 50, tier: "edge" },
    { id: "frontend",  role: "Web frontend",     icon: "next",  sub: ["react"],        x: 22, y: 50, tier: "web", big: true },
    { id: "api",       role: "API server",       icon: "node",  sub: ["ts", "express"], x: 40, y: 50, tier: "api", big: true, hub: true },
    { id: "ai",        role: "AI orchestrator",  icon: "claude", sub: ["python"],       x: 60, y: 16, tier: "ai" },
    { id: "engine",    role: "High-perf engine", icon: "cpp",         x: 58, y: 38, tier: "core" },
    { id: "contracts", role: "Smart contracts",  icon: "solidity",    x: 60, y: 63, tier: "web3" },
    { id: "db",        role: "Databases",        icon: "mongo", sub: ["pg"], x: 61, y: 85, tier: "data" },
    { id: "mcp",       role: "MCP tools",        icon: "glyph:mcp",   x: 80, y: 9,  tier: "ai" },
    { id: "swarm",     role: "Agent swarm",      icon: "glyph:swarm", x: 90, y: 25, tier: "ai", hero: true, big: true },
    { id: "agents",    role: "Parallel agents",  icon: "glyph:orch",  x: 90, y: 44, tier: "ai" },
    { id: "chain",     role: "EVM chains",       icon: "web3",        x: 80, y: 71, tier: "web3" },
    { id: "infra",     role: "Infra · Docker",   icon: "docker",      x: 40, y: 88, tier: "infra" },
  ],
  edges: [
    { from: "client", to: "frontend", ret: true }, { from: "frontend", to: "api", ret: true },
    { from: "api", to: "ai", ret: true }, { from: "api", to: "engine", ret: true },
    { from: "api", to: "contracts", ret: true }, { from: "api", to: "db", ret: true },
    { from: "ai", to: "mcp" }, { from: "ai", to: "swarm" }, { from: "mcp", to: "swarm" },
    { from: "swarm", to: "agents", ret: true }, { from: "contracts", to: "chain", ret: true },
    { from: "infra", to: "api" }, { from: "infra", to: "db" },
  ],
};

/* --- product-focused, LAYERED — client (left) · what we built (centre) ·
       AI services (top-right) · external infra & services (bottom-right).
       Docker isn't a node — it wraps everything (badge top-right). --- */
const MAP_PRODUCT = {
  groups: [
    { id: "built",    label: "Built by us — our code",        accent: "34,211,238" },
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
    // BUILT BY US — interfaces (left col) + our logic (right col)
    // symmetric 3×2 grid — API server centred on top, mirrored left/right
    { id: "frontend",  role: "Web frontend",     icon: "next",  sub: ["react"],        x: 16, y: 35, tier: "web",  group: "built", big: true },
    { id: "api",       role: "API server",       icon: "node",  sub: ["ts", "express"], x: 36, y: 35, tier: "api",  group: "built", big: true, hub: true },
    { id: "engine",    role: "High-perf engine", icon: "cpp",          x: 56, y: 35, tier: "core",  group: "built" },
    { id: "cli",       role: "CLI · tools",      icon: "glyph:tools",  x: 16, y: 63, tier: "infra", group: "built" },
    { id: "backend",   role: "Backend & workers",icon: "glyph:server", sub: ["ts"], x: 36, y: 63, tier: "core",  group: "built" },
    { id: "contracts", role: "Smart contracts",  icon: "solidity",     x: 56, y: 63, tier: "web3",  group: "built" },
    // AI SERVICES — top-right
    { id: "llm",       role: "LLM / AI",         icon: "glyph:llm",    x: 70, y: 16, tier: "ai", group: "ai", big: true },
    { id: "vector",    role: "Vector · RAG",     icon: "glyph:vector", x: 88, y: 16, tier: "ai", group: "ai" },
    { id: "agents",    role: "AI agents",        icon: "glyph:swarm",  x: 79, y: 28, tier: "ai", group: "ai" },
    // EXTERNAL INFRA & SERVICES — bottom-right (things we use, not built)
    { id: "db",        role: "Databases",        icon: "mongo", sub: ["pg"], x: 70, y: 54, tier: "data",  group: "external" },
    { id: "queue",     role: "Event queue",      icon: "glyph:queue",  x: 88, y: 54, tier: "infra", group: "external" },
    { id: "mqtt",      role: "MQTT broker",      icon: "glyph:mqtt",   x: 70, y: 69, tier: "infra", group: "external" },
    { id: "storage",   role: "Object storage",   icon: "glyph:storage",x: 88, y: 69, tier: "infra", group: "external" },
    { id: "chain",     role: "EVM chains",       icon: "web3",         x: 79, y: 82, tier: "web3",  group: "external" },
  ],
  edges: [
    // the client talks only to the left-hand interfaces: web + CLI
    { from: "client", to: "frontend", ret: true },
    { from: "client", to: "cli",      ret: true },
    // inside "built" — the request path
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
   WORD CLOUD — everything in my toolbox, pulled from the whole CV + projects.
   [text, weight] grouped by category; assembled into WORDCLOUD.words below.
   ========================================================================= */
const WC_CATS = [
  { id: "ai",      label: "AI & LLM",        color: "#f472b6" },
  { id: "web3",    label: "Web3 & DeFi",     color: "#a78bfa" },
  { id: "backend", label: "Backend",         color: "#22d3ee" },
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
    ["xterm.js", 3], ["node-pty", 3], ["Agent SDK", 7],
  ],
  web3: [
    ["Solidity", 9], ["Web3", 9], ["EVM", 8], ["Ethereum", 8], ["Hardhat", 8], ["OpenZeppelin", 7],
    ["Ethers.js", 7], ["Wagmi", 7], ["Viem", 7], ["Merkle proofs", 7], ["Uniswap", 7], ["DeFi", 7],
    ["Solana", 7], ["Cosmos", 6], ["CosmJS", 5], ["Injective", 4], ["Launchpad", 7], ["IDO / presale", 6],
    ["Vesting", 5], ["Airdrops", 6], ["Sniping bots", 6], ["Smart Order Router", 5], ["KYC", 4],
    ["Gnosis Safe", 4], ["PRBMath", 4], ["zkSync", 4], ["Arbitrum", 5], ["BSC", 4], ["AngelsSquad", 6],
    ["$10M+ raised", 6], ["CCXT", 6],
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
    ["CoinScorer", 5], ["CTO", 6], ["25 years shipping", 6], ["$1M+ revenue", 5], ["Self-taught", 4],
  ],
};

const WORDCLOUD = {
  cats: WC_CATS,
  words: Object.keys(WC_RAW).reduce(function (acc, cat) {
    WC_RAW[cat].forEach(function (w) { acc.push({ text: w[0], cat: cat, weight: w[1] }); });
    return acc;
  }, []),
};

/* --- the very first idea — a living, drifting tech network --- */
const FLUID_NODES = [
  { label: "C++", c: [148, 163, 184] }, { label: "Qt", c: [148, 163, 184] },
  { label: "TypeScript", c: [34, 211, 238] }, { label: "Node.js", c: [34, 211, 238] },
  { label: "Next.js", c: [96, 165, 250] }, { label: "React", c: [96, 165, 250] },
  { label: "Solidity", c: [167, 139, 250] }, { label: "Web3", c: [167, 139, 250] },
  { label: "Docker", c: [148, 163, 184] }, { label: "MongoDB", c: [52, 211, 153] },
  { label: "Postgres", c: [52, 211, 153] }, { label: "Python", c: [34, 211, 238] },
  { label: "Claude", c: [244, 114, 182] }, { label: "MCP", c: [244, 114, 182] },
  { label: "AI swarm", c: [244, 114, 182] }, { label: "Whisper", c: [244, 114, 182] },
];

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

/* ---- AI swarm — agent roles for the swarm schematic ------------------- */
const SWARM_AGENTS = [
  "Planner", "Researcher", "Reviewer", "Debugger", "Builder", "Verifier", "Synthesizer",
];

/* ---- How AI changed the shape of my day (from my own LinkedIn note) ---- */
const WORKSHIFT = [
  { pct: 10,  label: "writing code by hand",   note: "the agents type most of it now" },
  { pct: 90,  label: "reviewing & directing",  note: "reading, steering, catching mistakes early" },
];

/* ---- How a feature actually gets built (the loop I run) --------------- */
const PROCESS = [
  { n: "01", title: "Architect & plan", desc: "I design the system and write a precise, peer-reviewed plan. No code gets written until the plan is right." },
  { n: "02", title: "Brief & dispatch", desc: "I split the work and hand well-specified slices to parallel agents, briefed like a sharp mid-level team that never gets lazy." },
  { n: "03", title: "Review & verify", desc: "Agents adversarially check each other; I read and sign off every line. Nothing ships on AI's judgement alone." },
  { n: "04", title: "Ship & own", desc: "Architecture to deploy, CI to monitoring. One person, full ownership of the outcome — same bar, far faster." },
];

/* ---- "Now" focus chips (current emphasis) ----------------------------- */
const NOW_STACK = [
  "Directing AI swarms", "TypeScript", "Node.js", "Next.js", "Solidity",
  "Web3 / EVM", "MCP servers", "Claude Code", "Docker", "MongoDB",
];

/* ---- How I work with AI (human-in-control) ---------------------------- */
const SWARM_POINTS = [
  {
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 4v16h16"/><path d="M4 20 20 4"/><path d="M4 13h5M4 9h3"/></svg>',
    title: "I architect — agents execute",
    desc: "Every system design, data model and hard trade-off is mine; the swarm only executes the well-specified parts I hand it. A powerful helper but a poor master — brilliant on a short leash, dangerous off it — so nothing it writes reaches production without passing my review first.",
  },
  {
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="9" cy="8" r="3"/><path d="M3.5 19a5.5 5.5 0 0 1 11 0"/><circle cx="17.5" cy="9" r="2.2"/><path d="M16.5 14.4a4.4 4.4 0 0 1 4.5 4.6"/></svg>',
    title: "Directed like a team",
    desc: "An agent is like a mid-level dev who follows every instruction, every time, and never gets lazy — if you brief it well. Precise specs, clear boundaries, tight feedback. Managed well they're remarkably effective; left to decide alone, they drift.",
  },
  {
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z"/><path d="M9 12l2 2 4-4.2"/></svg>',
    title: "Verify, then trust",
    desc: "I don't take one model's word for anything. Agents adversarially check each other, and I hold the final sign-off — so the speed never comes at the cost of correctness.",
  },
  {
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><path d="M13 2 4 14h6l-1 8 9-12h-6z"/></svg>',
    title: "Faster delivery — oversight matters more",
    desc: "The swarm compresses the grunt work — boilerplate, research, refactors, test scaffolding — so the same standard ships far faster. But code that's quick to write is just as quick to rot: with AI a bad architectural call gets baked in before you'd catch it by hand. So oversight and sound architecture matter more than ever — exactly where decades of experience pay off.",
  },
];

/* ---- Stack, grouped by era (current first) ---------------------------- */
const STACK = [
  {
    era: "now",
    tag: "Frontier · my force-multiplier",
    title: "AI-leveraged engineering",
    blurb: "I direct multi-agent swarms to amplify my output — staying the architect, the decision-maker and the reviewer. AI does the heavy lifting; the judgement stays human.",
    tags: ["Claude Agent SDK", "MCP servers", "Multi-agent orchestration", "Human-in-the-loop", "Adversarial verification", "Local ASR · Whisper", "Python"],
  },
  {
    era: "core",
    tag: "Core · my daily driver",
    title: "TypeScript, Web3 & the modern web",
    blurb: "The stack I ship on every day — backends, smart contracts, bots and Next.js products.",
    tags: ["TypeScript", "Node.js", "Next.js", "React 19", "Solidity", "Wagmi / Viem", "MongoDB", "PostgreSQL", "Express", "MUI"],
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
    blurb: "25 years of low-level, high-performance native software. The reason everything above is built right.",
    tags: ["C++ 11–20", "Qt", "Boost", "Multithreading", "High-performance", "DLL injection / API hooking", "MySQL"],
  },
];

/* ---- Project tiers + filters (top-tier shown by default) -------------- */
const FILTERS = [
  { id: "all",    label: "All" },
  { id: "top",    label: "★ Top-tier" },
  { id: "crypto", label: "Crypto & Web3" },
  { id: "coding", label: "Coding & tooling" },
  { id: "hobby",  label: "Hobby" },
];

/* category → badge label shown on each card */
const CAT_LABELS = {
  ai: "AI & Swarms", web3: "Web3 & DeFi", backend: "Backend & Bots",
  web: "Web & Frontend", desktop: "C++ Foundation", iot: "Home & IoT",
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
  "Local Voice-to-Text": "hobby",
  "VS Code Source-Control Extensions": "hobby",
  "Content & Marketing AI": "hobby",
  "Home & IoT automation": "hobby",
};

/* ---- Projects (top-tier first) ---------------------------------------- */
const PROJECTS = [
  {
    name: "DEUSS / IDA",
    cat: "web3",
    flag: "ČVUT · reference project",
    metric: "Market surveillance",
    blurb:
      "IDA (Internal Diligence Agent) — a real-time market-surveillance & compliance platform for DEUSS, a blockchain bond-trading marketplace. A plugin-based, config-driven event pipeline ingests on-chain bond-contract events and external feeds; AI detection agents flag market abuse — wash trading, spoofing, position concentration, spoof/cancel bursts. Built with ČVUT, MAMA AI and VŠE.",
    tech: ["TypeScript", "Node.js", "Foundry / Solidity", "Real-time events", "AI detectors", "Plugin architecture"],
    highlight: "On-chain surveillance · 8 abuse-detection scenarios",
  },
  {
    name: "Skipper",
    cat: "desktop",
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
    flag: "Self-built AI swarm",
    metric: "20+ agents",
    blurb:
      "A library of custom Claude Code skills and sub-agents I built, tuned and direct: a multi-agent project planner (plan / work / review), researchers, reviewers and debuggers — running in parallel under my orchestration, with adversarial verification before anything ships.",
    tech: ["Claude Agent SDK", "MCP servers", "Multi-agent", "Parallel fan-out", "TypeScript"],
    highlight: "I orchestrate & review — agents don't decide alone",
  },
  {
    name: "Claude Code Manager",
    cat: "ai",
    flag: "AI tooling",
    metric: "Desktop + TUI + API",
    blurb:
      "A unified manager for AI coding sessions exposed three ways from one core: terminal TUI, Electron desktop app and a REST API for mobile. Real-time agent status, session search, file editing and diff views.",
    tech: ["TypeScript", "Electron", "React 19", "xterm.js", "node-pty"],
    highlight: "IPC architecture · JSONL transcripts as audit log",
  },
  {
    name: "Local Voice-to-Text",
    cat: "ai",
    metric: "100% local",
    blurb:
      "A privacy-first hold-to-talk dictation tool running entirely on my own GPU — Whisper/Parakeet ASR with optional LLM filler-cleanup via Ollama. Press a hotkey, speak, release, and the text pastes into any app.",
    tech: ["Python", "Whisper / Parakeet", "onnx-asr", "Ollama", "DirectML / CUDA"],
    highlight: "100+ languages · no cloud, ever",
  },
  {
    name: "Content & Marketing AI",
    cat: "ai",
    metric: "Automation",
    blurb:
      "AI pipelines around my own products: a LinkedIn strategist trained on my real edits, plus SQL-segmented email campaigns for Skipper customers via the Gmail API — with humanising passes that strip the AI tells.",
    tech: ["Claude agents", "MySQL segmentation", "Gmail API", "Humanizer"],
    highlight: "Voice-matched drafts · read-only customer DB",
  },
  {
    name: "VS Code Source-Control Extensions",
    cat: "ai",
    metric: "Published",
    blurb:
      "Two published VS Code extensions bridging TortoiseGit and TortoiseSVN into the editor — pull, push, commit, log, blame, diff — auto-detecting the install from the Windows registry, with multi-root support.",
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
    flag: "Moonhill Capital · as CTO",
    metric: "$10M+ raised",
    blurb:
      "A full Web3 fundraising & token-distribution platform I built as CTO — public dApp plus operator backoffice — and the Solidity core behind it: on-chain deal management, presales, vesting and gas-efficient Merkle-proof claim distribution, with role-based access, KYC and wallet connect across EVM and non-EVM chains.",
    tech: ["Solidity", "Hardhat", "OpenZeppelin", "Next.js", "Wagmi / Viem", "Merkle proofs", "Solana", "KYC"],
    highlight: "40+ raises · EVM + non-EVM · AccessControl · SafeERC20 · ReentrancyGuard",
    links: [{ label: "angelssquad.com", url: "https://angelssquad.com/" }],
  },
  {
    name: "CosmosBot",
    cat: "web3",
    metric: "4+ chains",
    blurb:
      "A multi-blockchain transaction engine that signs and broadcasts across Cosmos, Solana, Ethereum and Injective — handling HD key derivation, cross-standard address encoding and exchange integration.",
    tech: ["CosmJS", "Solana web3.js", "Ethers", "Injective", "CCXT"],
    highlight: "Cross-chain key derivation & signing",
  },
  {
    name: "Autonomous DeFi Bots",
    cat: "web3",
    metric: "24/7 on-chain",
    blurb:
      "Autonomous airdrop-farming and token-sniping bots: Uniswap smart-order routing for pricing, stealth scraping, EVM proxy/factory detection and Merkle-proof farming — across testnets and mainnets, 100+ wallets.",
    tech: ["Ethers", "Uniswap SOR", "Puppeteer (stealth)", "Multi-chain"],
    highlight: "Tier-1 sniping · 0G · Aethir · CARV",
  },
  {
    name: "TelegramCryptoBot",
    cat: "web3",
    metric: "Multi-chain trading",
    blurb:
      "A production Telegram trading bot with rich menus and conversations — Uniswap V2/V3 swaps, Solana SPL, Serum DEX and natural-language deadline parsing, with resilient Solana blockhash-expiry handling.",
    tech: ["Grammy.js", "Uniswap SDK", "Solana", "Serum", "MongoDB"],
    highlight: "Menus + conversations · resilient tx retry",
    groups: ["crypto", "hobby"],
  },

  {
    name: "AtomixToolsV2",
    cat: "backend",
    flag: "Internal platform",
    metric: "Powers every TS app",
    blurb:
      "A custom global CLI toolchain (axtoolsv2) for my Node.js stack: git-externals sync with live symlinks, Docker deploy, scaffolding, encrypted backups and Directus migrations — cross-platform Windows & POSIX.",
    tech: ["TypeScript", "Commander.js", "esbuild", "Docker"],
    highlight: "Live shared-code propagation across projects",
  },
  {
    name: "Atomix V2 Backend Framework",
    cat: "backend",
    metric: "Service framework",
    blurb:
      "A reusable Node/Express service framework with a clean lifecycle (AxApp start/stop), health-checked REST services, structured logging and a git-externals architecture sharing a common core — Dockerised, tested.",
    tech: ["TypeScript", "Express", "MongoDB", "Docker", "Mocha"],
    highlight: "The backbone under my backend services",
  },
  {
    name: "Portfolio & Tax Suite",
    cat: "backend",
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
    flag: "As CTO",
    metric: "Investor portal",
    blurb:
      "The web surface of a VC/token fund: investor portals with impersonation, admin ops with on-chain wallet integration, a node-graph 'labs' workspace, plus news/CMS, email and PDF — one design system.",
    tech: ["Next.js 16", "React 19", "MUI 7", "Directus", "Wagmi / Viem", "React Flow"],
    highlight: "Public · admin · labs · investor portal",
    links: [{ label: "moonhill.capital", url: "https://moonhill.capital/" }],
  },
  {
    name: "Node Infra Platforms",
    cat: "web",
    metric: "SaaS · 3-part",
    blurb:
      "Mirabia & Nodera — node-network infrastructure SaaS, each a three-part product (public site + operator admin + user app) with React-Flow deployment visualisation, a custom image pipeline and shared code.",
    tech: ["Next.js", "React Flow", "Directus", "MongoDB", "Express"],
    highlight: "Public + admin + app, shared codebase",
  },
  {
    name: "Skipper Web & Client Sites",
    cat: "web",
    metric: "Live products",
    blurb:
      "Commercial web around Skipper plus company and client sites — Next.js + Directus marketing sites and an e-commerce/payment flow with Braintree, reCAPTCHA and transaction management for the product store.",
    tech: ["Next.js", "Directus CMS", "Braintree", "NextAuth"],
    highlight: "Marketing + e-commerce + payments",
    links: [{ label: "skipper18.com", url: "https://skipper18.com/" }],
  },

  {
    name: "Inventic s.r.o.",
    cat: "company",
    flag: "Founder & owner · since 2006",
    metric: "Team of 5–10",
    blurb:
      "The software company I founded and run since 2006. Beyond my own products, we delivered websites and warehouse/inventory systems for clients — which meant hiring and leading a team of 5–10, managing people and running projects end to end: scoping, estimates, delivery and support.",
    tech: ["Team leadership", "People management", "Project management", "Client delivery", "Hiring", "Web & warehouse systems"],
    highlight: "Hiring, people & project management — not just code",
    links: [{ label: "inventic.eu", url: "https://inventic.eu/" }],
  },
  {
    name: "CryptoTracker",
    cat: "desktop",
    metric: "Millions of trades/sec",
    blurb:
      "A high-performance market-data engine: a multithreaded message broker aggregates and processes millions of trades and prices per second, feeding a fast evaluation-tree engine for technical indicators.",
    tech: ["C++", "Multithreading", "WebSockets", "Message broker"],
    highlight: "The performance roots behind today's bots",
  },
  {
    name: "Atomix C++ Framework",
    cat: "desktop",
    metric: "Powers 10+ apps",
    blurb:
      "My own modular C++ application framework — DI container, plugin system, ORM/AQL layer, HTTP & WebSocket clients, crash reporting and auto-update — the backbone under every native product I've shipped.",
    tech: ["C++17", "Qt", "Dependency Injection", "Plugins", "OpenSSL"],
    highlight: "axCore · axQt · axApplication · axPlugins",
  },
  {
    name: "ParalelBuilds & Licensing",
    cat: "desktop",
    metric: "Systems-level",
    blurb:
      "Distributed build system (Incredibuild-style, via DLL injection & API hooking) plus dockerised C++ licensing microservices on Azure/AWS — the kind of deep systems work that taught me how software really runs.",
    tech: ["C++", "DLL injection", "API hooking", "Docker", "Azure"],
    highlight: "Process injection · remote execution · licensing",
  },

  {
    name: "Home & IoT automation",
    cat: "iot",
    flag: "Personal · hobby",
    metric: "My own smart home",
    blurb:
      "My house runs on a stack I wired and program myself: Loxone as the core, Home Assistant and Node-RED for logic and dashboards, Zigbee and MQTT for devices, ESP8266/Arduino for custom sensors and controllers, plus solar (FVE) integration and a UniFi network. Hardware to dashboards: real systems engineering, just for the fun of it.",
    tech: ["Loxone", "Home Assistant", "Node-RED", "Zigbee", "MQTT", "ESP8266 / Arduino", "Tasmota", "UniFi"],
    highlight: "The hobby that keeps me close to the metal",
  },
];

/* ---- Career evolution (now → roots) ----------------------------------- */
const TIMELINE = [
  {
    period: "2025 → now",
    role: "Directing AI agent swarms",
    org: "Freelance · Inventic",
    desc: "Using self-built multi-agent swarms as a force-multiplier — I architect and review, agents execute under direction — to ship classification & reporting pipelines, Telegram community intelligence, and a whole ecosystem of custom Claude Code agents and MCP servers, far faster than before.",
    tags: ["AI leverage", "Agent swarms", "MCP"],
    era: "now",
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
    desc: "Designed and built Skipper, a cross-platform visual ORM editor & code generator sold globally — Qt GUI, XSLT code generation, TDD and a full Jenkins CI pipeline with signing and notarisation.",
    tags: ["C++", "Qt", "CI/CD"],
    era: "foundation",
  },
  {
    period: "2006 → now",
    role: "Owner & Chief Developer",
    org: "Inventic s.r.o.",
    desc: "Founded and run my own software company — from a C++/MFC warehouse system and high-performance trading engines, growing into developer tooling, infrastructure and a full Web2/Web3/AI stack.",
    tags: ["Founder", "C++", "Full-stack"],
    era: "foundation",
  },
  {
    period: "2000 → 2006",
    role: "Developer · Consultant",
    org: "Self-employed",
    desc: "The start of a professional career that began as a kid writing code — early development, consulting and project management that set the foundation for everything since.",
    tags: ["Roots"],
    era: "foundation",
  },
];
