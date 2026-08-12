/* =========================================================================
   Portfolio - rendering & interactions
   Print-style rendering: datasheet figure diagram, repo index, spec rows,
   ruled timeline, word cloud. Vanilla JS only.
   ========================================================================= */
(function () {
  "use strict";
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const SVGNS = "http://www.w3.org/2000/svg";
  const LOGO = "assets/logos/";

  /* ---- light-adapted palettes (facts stay in data.js; colours are ours) -- */
  const CHAN = {
    user: "#b45309", app: "#0e7490", data: "#047857",
    chain: "#4338ca", ai: "#be185d", infra: "#64748b",
  };
  const GROUP_ACCENTS = { // rgb triplets for the dashed group boxes
    built: "14,116,144", ai: "190,24,93", external: "100,116,139",
    swarm: "109,40,217", products: "14,116,144", runtimeai: "190,24,93",
  };
  const WC_COLORS = {
    ai: "#be185d", web3: "#6d28d9", backend: "#0e7490", web: "#0ea5e9",
    data: "#047857", infra: "#57606e", cpp: "#b45309", concept: "#a21caf",
  };
  const LANG_COLORS = { TypeScript: "#3178c6", Python: "#3572a5", HTML: "#e34c26" };

  /* ---- icon markup (logo file or drawn glyph) ------------------------- */
  function iconMarkup(icon, label) {
    if (icon && icon.indexOf("glyph:") === 0) {
      const g = (typeof ICON_GLYPHS !== "undefined" && ICON_GLYPHS[icon.slice(6)]) || "";
      return `<span class="ic ic--glyph">${g}</span>`;
    }
    return `<img class="ic" src="${LOGO}${icon}.svg" alt="${label}" loading="lazy" decoding="async" />`;
  }

  /* ====================================================================
     ARCHITECTURE MAP — datasheet figure: dashed group frames, channel-
     coloured connectors, dark component chips, travelling packets.
     ==================================================================== */
  function renderMap(box, D) {
    if (!box || !D || !D.nodes) return;
    if (box._stopPackets) { box._stopPackets(); box._stopPackets = null; }
    box.textContent = "";
    // narrow containers: squeeze x into 9–91% so edge nodes don't clip
    const narrow = box.clientWidth > 0 && box.clientWidth < 640;
    const nodes = narrow ? D.nodes.map((n) => Object.assign({}, n, { x: 9 + n.x * 0.82 })) : D.nodes;
    const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
    const adj = Object.fromEntries(nodes.map((n) => [n.id, new Set()]));
    const groups = D.groups || [];
    const groupLinks = D.groupLinks || [];

    // group bounding boxes from member node positions
    const bboxes = {};
    groups.forEach((g) => {
      const mem = nodes.filter((n) => n.group === g.id);
      if (!mem.length) return;
      let minX = 100, minY = 100, maxX = 0, maxY = 0;
      mem.forEach((n) => { minX = Math.min(minX, n.x); maxX = Math.max(maxX, n.x); minY = Math.min(minY, n.y); maxY = Math.max(maxY, n.y); });
      const bx = Math.max(minX - 6, 0.5), by = Math.max(minY - 13, 1.5);
      bboxes[g.id] = { x: bx, y: by, w: Math.min(maxX + 6, 99.5) - bx, h: Math.min(maxY + 9, 99) - by };
    });

    groups.forEach((g) => {
      const b = bboxes[g.id]; if (!b) return;
      const el = document.createElement("div");
      el.className = "arch-group group-" + g.id;
      el.style.left = b.x + "%"; el.style.top = b.y + "%";
      el.style.width = b.w + "%"; el.style.height = b.h + "%";
      el.style.setProperty("--gacc", GROUP_ACCENTS[g.id] || g.accent);
      el.innerHTML = `<span class="arch-group__label">${g.label}</span>`;
      box.appendChild(el);
    });

    // anchor helpers for group-level links
    const ctrOf = (ep) => ep.indexOf("g:") === 0
      ? { x: bboxes[ep.slice(2)].x + bboxes[ep.slice(2)].w / 2, y: bboxes[ep.slice(2)].y + bboxes[ep.slice(2)].h / 2 }
      : { x: byId[ep].x, y: byId[ep].y };
    const borderPt = (b, t) => {
      const cx = b.x + b.w / 2, cy = b.y + b.h / 2, dx = t.x - cx, dy = t.y - cy;
      if (!dx && !dy) return { x: cx, y: cy };
      const s = Math.min(dx ? (b.w / 2) / Math.abs(dx) : 1e9, dy ? (b.h / 2) / Math.abs(dy) : 1e9);
      return { x: cx + dx * s, y: cy + dy * s };
    };
    const ptOf = (ep, towards) => ep.indexOf("g:") === 0 ? borderPt(bboxes[ep.slice(2)], towards) : { x: byId[ep].x, y: byId[ep].y };

    // connector lines
    const svg = document.createElementNS(SVGNS, "svg");
    svg.setAttribute("class", "archmap__lines");
    svg.setAttribute("viewBox", "0 0 100 100");
    svg.setAttribute("preserveAspectRatio", "none");
    svg.setAttribute("aria-hidden", "true");
    const lineEls = [];
    const drawLine = (a, b, kind, grouplink) => {
      const ln = document.createElementNS(SVGNS, "line");
      ln.setAttribute("x1", a.x); ln.setAttribute("y1", a.y);
      ln.setAttribute("x2", b.x); ln.setAttribute("y2", b.y);
      ln.setAttribute("vector-effect", "non-scaling-stroke");
      ln.setAttribute("class", "archmap__line " + (kind !== "flow" ? "kind-" + kind : "tier-flow") + (grouplink ? " is-grouplink" : ""));
      svg.appendChild(ln);
      return ln;
    };
    (D.edges || []).forEach((e) => {
      const a = byId[e.from], b = byId[e.to];
      if (!a || !b) return;
      adj[e.from].add(e.to); adj[e.to].add(e.from);
      const ln = drawLine(a, b, e.kind || "flow", false);
      ln.classList.remove("tier-flow");
      ln.classList.add("tier-" + channelTier(a, b));
      lineEls.push({ el: ln, a: e.from, b: e.to });
    });
    groupLinks.forEach((gl) => {
      const A = ptOf(gl.from, ctrOf(gl.to));
      const B = ptOf(gl.to, ctrOf(gl.from));
      drawLine(A, B, gl.kind || "flow", true);
      gl._A = A; gl._B = B;
    });
    box.appendChild(svg);

    // component nodes
    const nodeEls = {};
    nodes.forEach((n) => {
      const el = document.createElement("div");
      el.className = "arch-node tier-" + n.tier + (n.big ? " is-big" : "") + (n.hub ? " is-hub" : "");
      el.style.left = n.x + "%"; el.style.top = n.y + "%";
      el.dataset.id = n.id;
      const subs = (n.sub || []).map((s) => `<img class="ic ic--sub" src="${LOGO}${s}.svg" alt="${s}" loading="lazy" decoding="async"/>`).join("");
      el.innerHTML =
        `<span class="arch-chip">${iconMarkup(n.icon, n.role)}</span>` +
        (subs ? `<span class="arch-subs">${subs}</span>` : "") +
        `<span class="arch-role">${n.role}</span>`;
      box.appendChild(el);
      nodeEls[n.id] = el;
      el.addEventListener("mouseenter", () => highlight(n.id));
      el.addEventListener("mouseleave", clearHi);
    });

    function highlight(id) {
      box.classList.add("has-hover");
      Object.entries(nodeEls).forEach(([nid, el]) => {
        el.classList.toggle("is-hot", nid === id);
        el.classList.toggle("is-lit", adj[id].has(nid));
      });
      lineEls.forEach((l) => l.el.classList.toggle("is-lit", l.a === id || l.b === id));
    }
    function clearHi() {
      box.classList.remove("has-hover");
      Object.values(nodeEls).forEach((el) => el.classList.remove("is-hot", "is-lit"));
      lineEls.forEach((l) => l.el.classList.remove("is-lit"));
    }

    if (D.badge) {
      const bd = document.createElement("div");
      bd.className = "arch-badge";
      bd.innerHTML = `<span class="arch-badge__ic">${iconMarkup(D.badge.icon, D.badge.label)}</span><span class="arch-badge__label">${D.badge.label}</span>`;
      box.appendChild(bd);
    }

    if (D.hint) {
      const hint = document.createElement("div");
      hint.className = "archmap__hint";
      hint.innerHTML = D.hint;
      box.appendChild(hint);
    }

    // travelling packets — skipped entirely under prefers-reduced-motion
    if (!reduce) {
      const layer = document.createElement("div");
      layer.className = "arch-packets";
      box.appendChild(layer);
      const packets = [];
      const addPackets = (a, b, ret, kind, i, opts) => {
        const color = packetColor(kind, opts.fromN, opts.toN, opts.accent);
        packets.push(makePacket(layer, a, b, (i * 0.11) % 1, { color, kind, big: opts.big }));
        if (ret) packets.push(makePacket(layer, b, a, (i * 0.17 + 0.55) % 1, { color, kind, big: opts.big, ret: true }));
      };
      (D.edges || []).forEach((e, i) => {
        const a = byId[e.from], b = byId[e.to];
        if (a && b) addPackets(a, b, e.ret, e.kind || "flow", i, { fromN: a, toN: b, big: false });
      });
      groupLinks.forEach((gl, i) => {
        const gid = (typeof gl.to === "string" && gl.to.indexOf("g:") === 0) ? gl.to.slice(2) : null;
        const acc = gid ? (GROUP_ACCENTS[gid] || null) : null;
        addPackets(gl._A, gl._B, gl.ret, gl.kind || "flow", i + 40, { accent: acc, big: true });
      });
      box._stopPackets = runPackets(packets);
    }
  }

  function channelTier(fromN, toN) {
    if ((fromN && fromN.id === "client") || (toN && toN.id === "client")) return "user";
    const t = [fromN && fromN.tier, toN && toN.tier];
    if (t.includes("web3")) return "web3";
    if (t.includes("data")) return "data";
    if (t.includes("ai")) return "ai";
    if (t.includes("infra")) return "infra";
    return "flow";
  }
  function flowChannel(fromN, toN) {
    if ((fromN && fromN.id === "client") || (toN && toN.id === "client")) return CHAN.user;
    const t = [fromN && fromN.tier, toN && toN.tier];
    if (t.includes("web3")) return CHAN.chain;
    if (t.includes("data")) return CHAN.data;
    if (t.includes("ai")) return CHAN.ai;
    if (t.includes("infra")) return CHAN.infra;
    return CHAN.app;
  }
  function packetColor(kind, fromN, toN, accent) {
    if (fromN || toN) return flowChannel(fromN, toN);
    return accent ? "rgb(" + accent + ")" : CHAN.app;
  }

  function makePacket(layer, from, to, t0, opts) {
    opts = opts || {};
    const el = document.createElement("span");
    el.className = "arch-packet";
    const sz = opts.ret ? (opts.big ? 6 : 5) : (opts.big ? 8 : 7);
    el.style.width = el.style.height = sz + "px";
    if (opts.color) {
      el.style.background = opts.color;
      if (opts.ret) el.style.opacity = "0.65";
    }
    layer.appendChild(el);
    const len = Math.hypot(to.x - from.x, to.y - from.y) || 1;
    return { el, fx: from.x, fy: from.y, dx: to.x - from.x, dy: to.y - from.y, t: t0, sp: Math.min(18 / len, 0.42) };
  }

  /* single RAF loop; paused while the tab is hidden; returns a stop fn */
  function runPackets(packets) {
    let raf, last = 0, stopped = false;
    function tick(now) {
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0;
      last = now;
      for (const p of packets) {
        p.t += dt * p.sp;
        if (p.t > 1) p.t -= 1;
        const e = p.t * p.t * (3 - 2 * p.t); // ease-in-out: packets settle at nodes
        p.el.style.left = (p.fx + p.dx * e) + "%";
        p.el.style.top = (p.fy + p.dy * e) + "%";
      }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    const onVis = () => {
      if (stopped) return;
      if (document.hidden) cancelAnimationFrame(raf);
      else { last = 0; raf = requestAnimationFrame(tick); }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => { stopped = true; cancelAnimationFrame(raf); document.removeEventListener("visibilitychange", onVis); };
  }

  /* ====================================================================
     CONTENT RENDERERS
     ==================================================================== */
  function renderWorkshift() {
    const box = $("#workshift");
    if (!box || typeof WORKSHIFT === "undefined") return;
    box.innerHTML =
      WORKSHIFT.map((w, i) =>
        '<div class="workshift__row" style="--d:' + (i * 140) + 'ms">' +
          '<span class="workshift__pct wf-' + i + '">' + w.pct + '%</span>' +
          '<div class="workshift__track"><span class="workshift__fill wf-' + i + '" style="--w:' + Math.min(w.pct, 100) + '%"></span></div>' +
          '<span class="workshift__label">' + w.label + '<em>' + w.note + '</em></span>' +
        '</div>').join("");
  }

  function renderProcess() {
    const el = $("#processFlow");
    if (!el || typeof PROCESS === "undefined") return;
    el.innerHTML = PROCESS.map((p, i) => `
      <li class="process__step reveal" style="--d:${i * 90}ms">
        <span class="process__num" aria-hidden="true">${p.n}</span>
        <h4 class="process__title">${p.title}</h4>
        <p class="process__desc">${p.desc}</p>
      </li>`).join("");
  }

  function renderStack() {
    const el = $("#stackGrid");
    if (!el || typeof STACK === "undefined") return;
    el.innerHTML = STACK.map((s, i) => `
      <article class="stack-row stack-row--${s.era} reveal" style="--d:${i * 70}ms">
        <span class="stack-row__era">${s.tag}</span>
        <div class="stack-row__body">
          <h3 class="stack-row__title">${s.title}</h3>
          <p class="stack-row__blurb">${s.blurb}</p>
          <ul class="stack-row__tags">${s.tags.map((t) => `<li>${t}</li>`).join("")}</ul>
        </div>
      </article>`).join("");
  }

  function catLabel(id) {
    return (typeof CAT_LABELS !== "undefined" && CAT_LABELS[id]) || id;
  }
  function tierOf(p) {
    return (typeof PROJECT_TIERS !== "undefined" && PROJECT_TIERS[p.name]) || "side";
  }
  function renderFilters() {
    const bar = $("#workFilters");
    if (!bar || typeof FILTERS === "undefined") return;
    bar.innerHTML = FILTERS.map((f) => {
      const on = f.id === "top";
      return `<button type="button" class="chip-filter${on ? " is-active" : ""}" data-filter="${f.id}" aria-pressed="${on}">${f.label}</button>`;
    }).join("");
  }
  /* one card, one markup - shared by the dossier grid and the grouped catalog */
  function pcardHTML(p, i, hidden) {
    const tier = tierOf(p);
    return `
      <article class="pcard pcard--${p.cat} tier-${tier} reveal${hidden ? " is-hidden" : ""}" data-cat="${p.cat}" data-tier="${tier}" data-groups="${groupsOf(p)}" style="--d:${(i % 6) * 55}ms">
        <div class="pcard__top"><span class="pcard__cat">${catLabel(p.cat)}</span>${p.metric ? `<span class="pcard__metric">${p.metric}</span>` : ""}</div>
        ${tier === "top" ? `<span class="pcard__tier">★ top-tier</span>` : ""}
        ${p.flag ? `<span class="pcard__flag">${p.flag}</span>` : ""}
        <h3 class="pcard__name">${p.name}</h3>
        <p class="pcard__blurb">${p.blurb}</p>
        ${p.highlight ? `<p class="pcard__highlight">▹ ${p.highlight}</p>` : ""}
        <ul class="pcard__tech">${p.tech.map((t) => `<li>${t}</li>`).join("")}</ul>
        ${(p.links && p.links.length) ? `<div class="pcard__links">${p.links.map((l) => `<a href="${l.url}" class="pcard__link" target="_blank" rel="noopener">${l.label}<svg viewBox="0 0 24 24" width="11" height="11" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></a>`).join("")}</div>` : ""}
      </article>`;
  }
  function renderProjects() {
    const grid = $("#workGrid");
    if (!grid || typeof PROJECTS === "undefined") return;
    grid.innerHTML = PROJECTS.map((p, i) => pcardHTML(p, i, tierOf(p) !== "top")).join("");
  }
  function groupsOf(p) {
    if (p.groups && p.groups.length) return p.groups.join(" ");
    if (p.cat === "ai") return "ai coding";
    if (p.cat === "web3") return "crypto";
    if (p.cat === "iot") return "hobby";
    return "coding";
  }
  function matchFilter(f, c) {
    if (f === "all") return true;
    if (f === "top") return c.dataset.tier === "top";
    const inGroup = (c.dataset.groups || "").split(" ").indexOf(f) !== -1;
    if (f === "hobby") return inGroup || c.dataset.tier === "hobby";
    return inGroup;
  }
  function initFilters() {
    const bar = $("#workFilters"), grid = $("#workGrid");
    if (!bar || !grid) return;
    bar.addEventListener("click", (e) => {
      const btn = e.target.closest(".chip-filter");
      if (!btn) return;
      const f = btn.dataset.filter;
      $$(".chip-filter", bar).forEach((b) => { const on = b === btn; b.classList.toggle("is-active", on); b.setAttribute("aria-pressed", on); });
      $$(".pcard", grid).forEach((c) => {
        const show = matchFilter(f, c);
        c.classList.toggle("is-hidden", !show);
        if (show) c.classList.add("is-visible");
      });
    });
  }

  /* ---- open source — repo index --------------------------------------- */
  function renderOss() {
    const list = $("#ossList");
    if (!list || typeof OSS_REPOS === "undefined") return;
    list.innerHTML = OSS_REPOS.map((r, i) => `
      <a class="oss-row reveal" href="https://github.com/${OSS_GH_USER}/${r.repo}" target="_blank" rel="noopener" style="--d:${(i % 4) * 45}ms">
        <div class="oss-row__head">
          <h3 class="oss-row__name">${r.name}</h3>
          <span class="oss-row__tag">${r.tag}</span>
        </div>
        <div class="oss-row__side">
          <span class="oss-row__lang"><i style="background:${LANG_COLORS[r.lang] || "#64748b"}"></i>${r.lang}</span>
        </div>
        <p class="oss-row__desc">${r.desc}</p>
        <span class="oss-row__go">view on GitHub ↗</span>
      </a>`).join("");
  }

  /* ====================================================================
     DOWNLOADS (home) — static rows first, real installer links after paint
     ==================================================================== */
  /* same one-liner as cv.js; the two files are separate IIFEs, nothing to share */
  const firstSentence = (t) => (t.match(/^.*?\.(?=\s|$)/) || [t])[0];

  /* electron-builder artifact conventions. Windows is "an .exe that is not portable":
     the four repos name their installer either -Setup-*.exe or plain -x64.exe, and only
     the portable builds must be skipped. .blockmap/.yml/.zip/.deb/.tar.gz/checksums
     match nothing; .deb is left out so Linux stays one button. */
  const DL_PLATFORMS = [
    { id: "windows", label: "Windows", match: /^(?!.*portable).*\.exe$/i },
    { id: "macos", label: "macOS", note: "Apple Silicon", match: /\.dmg$/i },
    { id: "linux", label: "Linux", match: /\.appimage$/i },
  ];

  function renderDownloads() {
    const list = $("#downloadsList");
    if (!list || typeof HOME === "undefined") return;
    list.innerHTML = HOME.downloads.map((d, i) => {
      const src = d.project
        ? firstSentence((PROJECTS.find((p) => p.name === d.project) || { blurb: "" }).blurb)
        : (OSS_REPOS.find((r) => r.repo === d.repo) || { desc: "" }).desc;
      // release rows: one button per platform, href points at the releases page until
      // upgradeDownloadLinks() swaps in the direct asset URL
      const actions = d.release
        ? DL_PLATFORMS.map((pl) => `
          <a class="dl-btn" data-dl="${d.release.repo}:${pl.id}" href="https://github.com/${d.release.owner}/${d.release.repo}/releases/latest" target="_blank" rel="noopener">
            <span class="dl-btn__plat">${pl.label}${pl.note ? `<em class="dl-btn__note">${pl.note}</em>` : ""}</span>
            <span class="dl-btn__meta">latest release</span>
          </a>`).join("")
        : `<a class="dl-btn dl-btn--single" href="${d.url}" target="_blank" rel="noopener">
            <span class="dl-btn__plat">Get it</span>
            <span class="dl-btn__meta">${d.kind}</span>
          </a>`;
      return `
      <article class="dl-row reveal" style="--d:${i * 45}ms">
        <div class="dl-row__body">
          <div class="dl-row__head">
            <h3 class="dl-row__name">${d.name}</h3>
            <span class="dl-row__kind">${d.kind}</span>
          </div>
          <p class="dl-row__desc">${src}</p>
        </div>
        <div class="dl-row__actions">${actions}</div>
      </article>`;
    }).join("");
  }

  /* Runs after first paint, never during boot. Failure keeps the releases-page
     hrefs that are already in the DOM, so there is nothing to report. */
  function upgradeDownloadLinks() {
    if (typeof HOME === "undefined" || !$("#downloadsList")) return;
    HOME.downloads.filter((d) => d.release).forEach((d) => {
      fetch(`https://api.github.com/repos/${d.release.owner}/${d.release.repo}/releases/latest`)
        .then((r) => (r.ok ? r.json() : Promise.reject()))
        .then((rel) => {
          DL_PLATFORMS.forEach((pl) => {
            const asset = (rel.assets || []).find((a) => pl.match.test(a.name));
            const btn = asset && $(`[data-dl="${d.release.repo}:${pl.id}"]`);
            if (!btn) return;
            btn.href = asset.browser_download_url;
            btn.querySelector(".dl-btn__meta").textContent =
              `${rel.tag_name} · ${Math.max(1, Math.round(asset.size / 1048576))} MB`;
          });
        })
        .catch(() => {});
    });
  }

  /* The dossier used to live at "/", so its section anchors are shared and
     bookmarked. #contact is not remapped: home has its own contact panel. */
  function redirectLegacyHash() {
    if (document.body.dataset.page !== "home") return;
    const legacy = ["work", "oss", "security", "system", "stack", "toolbox", "method", "journey", "looking"];
    const h = location.hash.slice(1);
    if (legacy.indexOf(h) !== -1) location.replace("cv.html#" + h);
  }

  function renderTimeline() {
    const el = $("#timeline");
    if (!el || typeof TIMELINE === "undefined") return;
    el.innerHTML = TIMELINE.map((t, i) => `
      <div class="tl-item tl-item--${t.era} reveal" style="--d:${i * 55}ms">
        <div class="tl-item__dot" aria-hidden="true"></div>
        <span class="tl-item__period">${t.period}</span>
        <h3 class="tl-item__role">${t.role}</h3>
        <span class="tl-item__org">${t.org}</span>
        <p class="tl-item__desc">${t.desc}</p>
        <ul class="tl-item__tags">${t.tags.map((x) => `<li>${x}</li>`).join("")}</ul>
      </div>`).join("");
  }

  /* ---- reveal + counters ---------------------------------------------- */
  function initReveal() {
    const els = $$(".reveal");
    if (reduce || !("IntersectionObserver" in window)) {
      els.forEach((e) => e.classList.add("is-visible"));
      $$(".counter").forEach((c) => (c.textContent = c.dataset.target + (c.dataset.suffix || "")));
      return;
    }
    const io = new IntersectionObserver((ents, obs) => {
      ents.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add("is-visible");
          $$(".counter", en.target).forEach(animateCounter);
          obs.unobserve(en.target);
        }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });
    els.forEach((e) => io.observe(e));
  }
  function animateCounter(el) {
    if (el.dataset.done) return;
    el.dataset.done = "1";
    const target = parseFloat(el.dataset.target), suffix = el.dataset.suffix || "";
    const start = performance.now(), dur = 1400;
    (function tick(now) {
      const t = Math.min((now - start) / dur, 1);
      el.textContent = Math.round((1 - Math.pow(1 - t, 3)) * target) + (t === 1 ? suffix : "");
      if (t < 1) requestAnimationFrame(tick);
    })(start);
  }

  /* ---- topbar: progress + scroll-spy ---------------------------------- */
  function initNav() {
    const progress = $("#progress");
    function onScroll() {
      if (progress) {
        const h = document.documentElement.scrollHeight - innerHeight;
        progress.style.transform = `scaleX(${h > 0 ? window.scrollY / h : 0})`;
      }
    }
    addEventListener("scroll", onScroll, { passive: true }); onScroll();

    const sections = $$("main section[id]"), navLinks = $$(".topnav a");
    if ("IntersectionObserver" in window && sections.length) {
      const spy = new IntersectionObserver((ents) => {
        ents.forEach((en) => {
          if (en.isIntersecting) navLinks.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === "#" + en.target.id));
        });
      }, { rootMargin: "-40% 0px -55% 0px" });
      sections.forEach((s) => spy.observe(s));
    }
  }

  /* ---- hero rotator --------------------------------------------------- */
  function initRotator() {
    const el = $("#roleRotator");
    if (!el) return;
    const words = [
      "complete systems, end to end.",
      "TypeScript & Node.js backends.",
      "Web3 platforms & Solidity contracts.",
      "Next.js products.",
      "faster, with an AI swarm I wrote myself.",
      "…on 25 years of C++ foundations.",
    ];
    if (reduce) { el.textContent = words[0]; return; }
    let wi = 0, ci = 0, del = false;
    (function step() {
      const w = words[wi];
      ci += del ? -1 : 1;
      el.textContent = w.slice(0, ci);
      let d = del ? 36 : 68;
      if (!del && ci === w.length) { d = 1500; del = true; }
      else if (del && ci === 0) { del = false; wi = (wi + 1) % words.length; d = 320; }
      setTimeout(step, d);
    })();
  }

  /* ---- smooth scroll -------------------------------------------------- */
  function initSmoothScroll() {
    document.addEventListener("click", (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href");
      if (id.length < 2) return;
      const tgt = document.querySelector(id);
      if (!tgt) return;
      e.preventDefault();
      tgt.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      if (!tgt.hasAttribute("tabindex")) tgt.setAttribute("tabindex", "-1");
      tgt.focus({ preventScroll: true });
      history.replaceState(null, "", id);
    });
  }

  /* ====================================================================
     WORD CLOUD — d3-cloud, light print palette (graceful chip fallback)
     ==================================================================== */
  function renderWordCloud() {
    const stage = $("#wcStage");
    if (!stage || typeof WORDCLOUD === "undefined") return;
    const legend = $("#wcLegend"), tip = $("#wcTip");
    const cats = WORDCLOUD.cats, ws = WORDCLOUD.words;
    const catColor = (id) => WC_COLORS[id] || (cats.find((x) => x.id === id) || {}).color || "#57606e";
    if (legend) legend.innerHTML = cats.map((c) => `<span><i style="background:${catColor(c.id)}"></i>${c.label}</span>`).join("");

    // fallback: no d3 → render weighted chips
    if (!window.d3 || !d3.layout || !d3.layout.cloud) {
      const max = Math.max.apply(null, ws.map((w) => w.weight));
      stage.innerHTML = '<div class="wc-fallback">' + ws.slice().sort((a, b) => b.weight - a.weight).map((w) =>
        `<span style="color:${catColor(w.cat)};font-size:${12 + (w.weight / max) * 26}px;font-weight:${w.weight > max * 0.6 ? 700 : 500}">${w.text}</span>`).join("") + '</div>';
      return;
    }

    const ext = d3.extent(ws, (d) => d.weight);
    let layout;
    function build() {
      const W = stage.clientWidth, H = stage.clientHeight;
      if (W < 10 || H < 10) return;
      // scale type size with stage width so narrow screens still fit the set
      const maxS = Math.max(20, Math.min(44, W / 15));
      const sizeScale = d3.scaleSqrt().domain(ext).range([Math.max(9, maxS / 3.6), maxS]);
      const opOf = (d) => (d.size > maxS * 0.77 ? 0.95 : d.size > maxS * 0.5 ? 0.72 : 0.5);
      if (layout) { try { layout.stop(); } catch (e) { } }
      d3.select(stage).selectAll("svg").remove();
      const svg = d3.select(stage).append("svg").attr("width", "100%").attr("height", "100%").attr("viewBox", [0, 0, W, H]);
      const g = svg.append("g").attr("transform", `translate(${W / 2},${H / 2})`);
      const words = ws.map((d) => ({ text: d.text, cat: d.cat, weight: d.weight, size: sizeScale(d.weight) }));
      layout = d3.layout.cloud().size([W, H]).words(words).padding(2.6).font("IBM Plex Sans")
        .fontSize((d) => d.size).rotate((d, i) => (i % 6 === 0 ? 90 : 0)).on("end", draw).start();
      function draw(placed) {
        const sel = g.selectAll("text").data(placed).join("text")
          .attr("text-anchor", "middle").attr("dominant-baseline", "middle")
          .attr("font-family", "IBM Plex Sans, sans-serif")
          .attr("font-weight", (d) => (d.size > 34 ? "650" : "500"))
          .attr("font-size", (d) => d.size + "px")
          .attr("fill", (d) => catColor(d.cat))
          .attr("transform", (d) => `translate(${d.x},${d.y}) rotate(${d.rotate})`)
          .style("cursor", "default").style("user-select", "none")
          .text((d) => d.text);
        if (!reduce) sel.attr("opacity", 0).transition().delay((d, i) => i * 7).duration(340).attr("opacity", opOf);
        else sel.attr("opacity", opOf);
        sel.on("mouseenter", function (e, d) {
          d3.select(this).raise().attr("opacity", 1);
          g.selectAll("text").filter((n) => n.cat !== d.cat).attr("opacity", 0.08);
          if (tip) { const c = cats.find((x) => x.id === d.cat); tip.innerHTML = "<b>" + d.text + "</b><br>" + (c ? c.label : ""); tip.classList.add("is-on"); }
        }).on("mousemove", function (e) { if (tip) { tip.style.left = e.clientX + "px"; tip.style.top = e.clientY + "px"; } })
          .on("mouseleave", function () { g.selectAll("text").attr("opacity", opOf); if (tip) tip.classList.remove("is-on"); });
      }
    }
    build();
    if ("ResizeObserver" in window) {
      const ro = new ResizeObserver(() => { clearTimeout(stage._t); stage._t = setTimeout(build, 250); });
      ro.observe(stage);
    }
  }

  /* ---- boot ----------------------------------------------------------- */
  function boot() {
    redirectLegacyHash();
    if (typeof MAP_PRODUCT !== "undefined") {
      renderMap($("#mapProduct"), MAP_PRODUCT);
      let mrt;
      addEventListener("resize", () => {
        clearTimeout(mrt);
        mrt = setTimeout(() => renderMap($("#mapProduct"), MAP_PRODUCT), 250);
      });
    }
    renderWordCloud();
    renderWorkshift();
    renderProcess(); renderStack();
    renderFilters(); renderProjects(); renderOss(); renderTimeline();
    renderDownloads();
    initFilters(); initReveal(); initNav(); initRotator(); initSmoothScroll();
    const y = $("#year"); if (y) y.textContent = new Date().getFullYear();
    // installer links are a nice-to-have: fetch them once the page is on screen
    if ("requestIdleCallback" in window) requestIdleCallback(upgradeDownloadLinks, { timeout: 4000 });
    else setTimeout(upgradeDownloadLinks, 1500);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
