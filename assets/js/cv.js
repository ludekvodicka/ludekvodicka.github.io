/* =========================================================================
   CV renderer - fills cv.html from the same data.js that drives the site.
   Employment, projects, skills and open source have no second copy here;
   CV-only facts live in the CV block of data.js.
   ========================================================================= */
(function () {
  "use strict";
  const $ = (s) => document.querySelector(s);
  const body = (id) => $(id + " .cv-body");

  /* first sentence of a blurb - keeps the site copy as the single source */
  const firstSentence = (t) => (t.match(/^.*?\.(?=\s|$)/) || [t])[0];

  function renderHead() {
    if (typeof CV === "undefined") return;
    const c = CV.contact;
    $("#cvHead").innerHTML = `
      <h1>${CV.name}</h1>
      <p class="cv-title">${CV.title}</p>
      <p class="cv-tagline">${CV.tagline}</p>
      <p class="cv-contact">${c.email} · ${c.linkedin} · ${c.github} · ${c.web} · ${c.location}</p>`;
  }

  function renderProfile() {
    if (typeof CV === "undefined") return;
    body("#cvProfile").innerHTML = `<p>${CV.profile}</p>`;
  }

  function renderSkills() {
    if (typeof STACK === "undefined" || typeof CV === "undefined") return;
    body("#cvSkills").innerHTML = STACK.map((s) => `
      <div class="cv-skillrow">
        <span class="cv-label">${CV.skillLabels[s.era] || s.era}</span>
        <span>${s.tags.join(" · ")}</span>
      </div>`).join("");
  }

  function renderEmployment() {
    if (typeof TIMELINE === "undefined") return;
    body("#cvEmployment").innerHTML = TIMELINE.map((t) => `
      <div class="cv-entry cv-entry--indent">
        <div class="cv-entry__head">
          <span class="cv-period">${t.period}</span>
          <h3>${t.role}</h3>
          <span class="cv-org">${t.org}</span>
        </div>
        <p>${t.desc}</p>
      </div>`).join("");
  }

  function renderProjects() {
    if (typeof PROJECTS === "undefined" || typeof PROJECT_TIERS === "undefined") return;
    const top = PROJECTS.filter(
      (p) => PROJECT_TIERS[p.name] === "top" && p.name !== "Inventic s.r.o."
    );
    body("#cvProjects").innerHTML = top.map((p) => `
      <div class="cv-entry">
        <div class="cv-entry__head">
          <h3>${p.name}</h3>
          ${p.metric ? `<span class="cv-metric">${p.metric}</span>` : ""}
        </div>
        <p>${firstSentence(p.blurb)}</p>
        <p class="cv-tech">${p.tech.join(" · ")}</p>
      </div>`).join("");
  }

  function renderOss() {
    if (typeof OSS_REPOS === "undefined" || typeof CV === "undefined") return;
    const rows = CV.ossRepos
      .map((name) => OSS_REPOS.find((r) => r.repo === name))
      .filter(Boolean);
    body("#cvOss").innerHTML = rows.map((r) => `
      <div class="cv-ossrow">
        <span class="cv-label">${OSS_GH_USER}/${r.repo}</span>
        <span>${r.desc}</span>
      </div>`).join("");
  }

  function renderEducation() {
    if (typeof CV === "undefined") return;
    body("#cvEducation").innerHTML = CV.education.map((e) => `
      <div class="cv-entry">
        <span class="cv-period">${e.period}</span>
        <p>${e.degree}<br>${e.school}</p>
      </div>`).join("");
  }

  function renderLists() {
    if (typeof CV === "undefined") return;
    body("#cvLanguages").innerHTML = CV.languages.map((l) => `<p>${l}</p>`).join("");
    body("#cvCooperation").innerHTML = CV.cooperation.map((c) => `<p>${c}</p>`).join("");
  }

  function renderFoot() {
    const d = new Date().toLocaleDateString("en-GB", {
      day: "numeric", month: "short", year: "numeric",
    });
    $("#cvFoot").textContent = `Generated ${d} from ludekvodicka.github.io`;
  }

  renderHead();
  renderProfile();
  renderSkills();
  renderEmployment();
  renderProjects();
  renderOss();
  renderEducation();
  renderLists();
  renderFoot();
})();
