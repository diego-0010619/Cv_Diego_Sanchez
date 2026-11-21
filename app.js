(() => {
  "use strict";

  const state = {
    lang: localStorage.getItem("cv_lang") || "es",
    theme: localStorage.getItem("cv_theme") || "light",
    domainFilter: "all",
    skillFilter: null,
    activeArch: "arch-gco",
    metricsAnimated: false,
  };

  const ICONS = {
    layers: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>',
    cloud: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>',
    database: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5"/><path d="M3 12a9 3 0 0 0 18 0"/></svg>',
    cpu: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2m0 16v2M2 15h2m16 0h2M2 9h2m16 0h2M9 2v2m0 16v2"/></svg>',
  };

  const $ = (id) => document.getElementById(id);

  function getContent() {
    return window.CV_CONTENT[state.lang];
  }

  function applyTheme(theme) {
    state.theme = theme;
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("cv_theme", theme);
  }

  function showToast(msg) {
    const toast = $("toast");
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove("show"), 2300);
  }

  function renderText() {
    const c = getContent();
    document.documentElement.lang = state.lang;
    document.title = c.meta.pageTitle;
    $("langLabel").textContent = state.lang === "es" ? "EN" : "ES";

    $("heroStatus").textContent = c.meta.status;
    $("heroRole").textContent = c.meta.role;
    $("heroSummary").textContent = c.meta.summary;
    $("ctaExperience").querySelector("span").textContent = c.meta.ctaExperience;
    $("ctaDownload").textContent = c.meta.ctaDownload;
    $("copyEmailLabel").textContent = c.meta.copyEmail;

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const [group, key] = el.dataset.i18n.split(".");
      if (c[group] && c[group][key]) el.textContent = c[group][key];
    });

    $("expEyebrow").textContent = c.sections.experienceEyebrow;
    $("expTitle").textContent = c.sections.experienceTitle;
    $("expDesc").textContent = c.sections.experienceDesc;
    $("activeFilterPrefix").textContent = c.sections.activeFilterPrefix;
    $("clearSkillFilter").textContent = c.sections.clearFilter;

    $("archEyebrow").textContent = c.sections.archEyebrow;
    $("archTitle").textContent = c.sections.archTitle;
    $("archDesc").textContent = c.sections.archDesc;

    $("skillsEyebrow").textContent = c.sections.skillsEyebrow;
    $("skillsTitle").textContent = c.sections.skillsTitle;
    $("skillsDesc").textContent = c.sections.skillsDesc;
    $("radarTitle").textContent = c.sections.radarTitle;
    $("languagesTitle").textContent = c.sections.languagesTitle;

    $("eduEyebrow").textContent = c.sections.educationEyebrow;
    $("eduTitle").textContent = c.sections.educationTitle;

    $("refEyebrow").textContent = c.sections.referencesEyebrow;
    $("refTitle").textContent = c.sections.referencesTitle;
    $("refPrivacyNote").textContent = c.sections.referencesPrivacyNote;

    $("contactTitle").textContent = c.sections.contactTitle;
    $("contactSubtitle").textContent = c.sections.contactSubtitle;
    $("jsonLinkLabel").textContent = c.sections.jsonLinkLabel;
    $("cmdInput").placeholder = c.palette.placeholder;
  }

  function renderMetrics() {
    const c = getContent();
    $("metricsGrid").innerHTML = c.metrics
      .map(
        (m, i) => `
      <article class="metric-card">
        <div class="metric-value" data-target="${m.value}" data-suffix="${m.suffix}" id="metricVal${i}">
          ${m.value}<span>${m.suffix}</span>
        </div>
        <div class="metric-label">${m.label}</div>
        <div class="metric-detail">${m.detail}</div>
      </article>`
      )
      .join("");
  }

  function animateMetrics() {
    if (state.metricsAnimated || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    state.metricsAnimated = true;
    const c = getContent();
    c.metrics.forEach((m, i) => {
      const el = $(`metricVal${i}`);
      if (!el) return;
      const duration = 550;
      const start = performance.now();
      function tick(now) {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const current = Math.max(1, Math.round(m.value * eased));
        el.innerHTML = `${current}<span>${m.suffix}</span>`;
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }

  function renderFilters() {
    const c = getContent();
    $("filterBar").innerHTML = c.filters
      .map(
        (f) => `
      <button type="button" class="filter-btn ${state.domainFilter === f.id && !state.skillFilter ? "active" : ""}" data-domain="${f.id}">
        ${f.label}
      </button>`
      )
      .join("");

    $("filterBar").querySelectorAll(".filter-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.domainFilter = btn.dataset.domain;
        state.skillFilter = null;
        renderFilters();
        renderExperience();
        renderSkills();
      });
    });
  }

  function selectSkillFilter(skill, scrollToExp = false) {
    if (state.skillFilter === skill) {
      state.skillFilter = null;
    } else {
      state.skillFilter = skill;
      state.domainFilter = "all";
    }
    renderFilters();
    renderExperience();
    renderSkills();
    if (scrollToExp && state.skillFilter) {
      $("experience").scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function renderExperience() {
    const c = getContent();
    const banner = $("activeSkillBanner");
    if (state.skillFilter) {
      banner.classList.remove("hidden");
      $("activeSkillName").textContent = state.skillFilter;
    } else {
      banner.classList.add("hidden");
    }

    const filtered = c.experience.filter((item) => {
      if (state.skillFilter) {
        return item.skills.some((s) => s.toLowerCase() === state.skillFilter.toLowerCase());
      }
      if (state.domainFilter === "all") return true;
      return item.domains.includes(state.domainFilter);
    });

    $("experienceList").innerHTML = filtered
      .map(
        (exp) => `
      <article class="exp-card ${state.skillFilter ? "highlighted" : ""}" id="exp-${exp.id}">
        <div class="exp-header">
          <div>
            <h3 class="exp-company">${exp.company}</h3>
            <p class="exp-role">${exp.role}</p>
          </div>
          <div class="exp-meta">
            <span class="exp-badge">${exp.badge}</span>
            <span class="exp-period">${exp.period} · ${exp.location}</span>
          </div>
        </div>
        <ul class="exp-bullets">
          ${exp.bullets.map((b) => `<li>${b}</li>`).join("")}
        </ul>
        <div class="skill-tags">
          ${exp.skills
            .map(
              (s) =>
                `<button type="button" class="skill-pill ${state.skillFilter === s ? "active" : ""}" data-skill="${s}">${s}</button>`
            )
            .join("")}
        </div>
      </article>`
      )
      .join("");

    $("experienceList").querySelectorAll(".skill-pill").forEach((pill) => {
      pill.addEventListener("click", () => selectSkillFilter(pill.dataset.skill, false));
    });
  }

  function renderArchitectures() {
    const c = getContent();
    const current = c.architectures.find((a) => a.id === state.activeArch) || c.architectures[0];

    $("archTabs").innerHTML = c.architectures
      .map(
        (a) => `
      <button type="button" class="arch-tab ${a.id === current.id ? "active" : ""}" data-arch="${a.id}">
        ${a.tab}
      </button>`
      )
      .join("");

    $("archTabs").querySelectorAll(".arch-tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        state.activeArch = tab.dataset.arch;
        renderArchitectures();
      });
    });

    $("archStage").innerHTML = `
      <div class="arch-meta-bar">
        <p class="arch-subtitle">${current.subtitle}</p>
        <span class="arch-impact-pill">${current.impact}</span>
      </div>
      <div class="arch-flow">
        ${current.nodes
          .map(
            (n) => `
          <div class="arch-node">
            <div class="arch-step">STAGE ${n.step}</div>
            <h3 class="arch-node-title">${n.title}</h3>
            <span class="arch-node-tech">${n.tech}</span>
            <p class="arch-node-desc">${n.desc}</p>
          </div>`
          )
          .join("")}
      </div>`;
  }

  function renderRadarSvg(pillars) {
    const size = 280;
    const cx = size / 2;
    const cy = size / 2;
    const radius = 92;
    const n = pillars.length;

    const getPoint = (idx, ratio) => {
      const angle = (Math.PI * 2 * idx) / n - Math.PI / 2;
      return [cx + Math.cos(angle) * radius * ratio, cy + Math.sin(angle) * radius * ratio];
    };

    const gridLevels = [0.25, 0.5, 0.75, 1];
    const gridPolys = gridLevels
      .map((lvl) => {
        const pts = pillars.map((_, i) => getPoint(i, lvl).join(",")).join(" ");
        return `<polygon points="${pts}" fill="none" stroke="var(--border-strong)" stroke-width="1" />`;
      })
      .join("");

    const axes = pillars
      .map((_, i) => {
        const [x, y] = getPoint(i, 1);
        return `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="var(--border)" stroke-width="1" />`;
      })
      .join("");

    const dataPts = pillars.map((p, i) => getPoint(i, p.score / 100));
    const polyString = dataPts.map((pt) => pt.join(",")).join(" ");

    const dots = dataPts
      .map(
        ([x, y], i) =>
          `<circle cx="${x}" cy="${y}" r="4.5" fill="var(--accent)" stroke="var(--surface)" stroke-width="2"><title>${pillars[i].label}: ${pillars[i].score}%</title></circle>`
      )
      .join("");

    const labels = pillars
      .map((p, i) => {
        const [x, y] = getPoint(i, 1.24);
        const anchor = Math.abs(x - cx) < 10 ? "middle" : x > cx ? "start" : "end";
        return `<text x="${x}" y="${y}" text-anchor="${anchor}" dominant-baseline="middle" fill="var(--ink-muted)" font-size="10.5" font-family="var(--font-mono)" font-weight="600">${p.label}</text>`;
      })
      .join("");

    return `
      <svg class="radar-svg" viewBox="-56 -16 392 312" role="img" aria-label="Competency radar">
        ${gridPolys}
        ${axes}
        <polygon points="${polyString}" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="2.2" />
        ${dots}
        ${labels}
      </svg>`;
  }

  function renderSkills() {
    const c = getContent();
    $("skillsGroups").innerHTML = c.skillGroups
      .map(
        (g) => `
      <article class="card">
        <h3 class="skill-group-title">
          <span class="skill-icon">${ICONS[g.icon] || ICONS.layers}</span>
          <span>${g.title}</span>
        </h3>
        <div class="skill-tags">
          ${g.items
            .map(
              (skill) =>
                `<button type="button" class="skill-pill ${state.skillFilter === skill ? "active" : ""}" data-skill="${skill}">${skill}</button>`
            )
            .join("")}
        </div>
      </article>`
      )
      .join("");

    $("skillsGroups").querySelectorAll(".skill-pill").forEach((pill) => {
      pill.addEventListener("click", () => selectSkillFilter(pill.dataset.skill, true));
    });

    $("radarContainer").innerHTML = renderRadarSvg(c.radarPillars);

    $("languagesList").innerHTML = c.languages
      .map(
        (l) => `
      <div>
        <div class="lang-row">
          <span class="lang-name">${l.name}</span>
          <span class="lang-level">${l.level}</span>
        </div>
        <div class="lang-bar"><div class="lang-fill" style="width:${l.pct}%"></div></div>
      </div>`
      )
      .join("");
  }

  function renderEducation() {
    const c = getContent();
    $("educationGrid").innerHTML = c.education
      .map(
        (ed) => `
      <article class="edu-card">
        <div class="edu-top">
          <div>
            <h3 class="edu-degree">${ed.degree}</h3>
            <p class="edu-inst">${ed.institution} · ${ed.location}</p>
          </div>
          <span class="edu-period">${ed.period}</span>
        </div>
        ${ed.highlight ? `<span class="edu-highlight">${ed.highlight}</span>` : ""}
      </article>`
      )
      .join("");
  }

  function renderReferences() {
    const c = getContent();
    $("referencesGrid").innerHTML = c.references
      .map(
        (r) => `
      <article class="ref-card">
        <div>
          <div class="ref-head">
            <div class="ref-avatar">${r.initials}</div>
            <div>
              <h3 class="ref-name">${r.name}</h3>
              <span class="ref-company">${r.company}</span>
            </div>
          </div>
          <p class="ref-role">${r.role}</p>
        </div>
        <a class="ref-btn" href="mailto:DiegoUsbMed@gmail.com?subject=Solicitud%20referencia%20-%20${encodeURIComponent(r.name)}">
          ${c.sections.requestRefBtn}
        </a>
      </article>`
      )
      .join("");
  }

  /* Command Palette (Ctrl + K) */
  function openCmd() {
    $("cmdBackdrop").classList.remove("hidden");
    $("cmdInput").value = "";
    renderCmdResults("");
    setTimeout(() => $("cmdInput").focus(), 20);
  }

  function closeCmd() {
    $("cmdBackdrop").classList.add("hidden");
  }

  function renderCmdResults(query) {
    const c = getContent();
    const q = query.trim().toLowerCase();

    const actions = [
      { label: c.meta.copyEmail, meta: "DiegoUsbMed@gmail.com", run: () => copyEmail() },
      { label: c.meta.ctaDownload, meta: "PDF / Print", run: () => window.print() },
      { label: "LinkedIn", meta: "Diego Alexander Sánchez Henao", run: () => window.open("https://www.linkedin.com/in/diego-alexander-s%C3%A1nchez-henao-2733401b5/", "_blank") },
      { label: "GitHub", meta: "github.com/diego-0010619", run: () => window.open("https://github.com/diego-0010619", "_blank") },
    ].filter((a) => !q || a.label.toLowerCase().includes(q) || a.meta.toLowerCase().includes(q));

    const roles = c.experience
      .filter((e) => !q || e.company.toLowerCase().includes(q) || e.role.toLowerCase().includes(q) || e.bullets.join(" ").toLowerCase().includes(q))
      .map((e) => ({
        label: `${e.company} — ${e.role}`,
        meta: e.period,
        run: () => {
          state.skillFilter = null;
          state.domainFilter = "all";
          renderFilters();
          renderExperience();
          const el = $(`exp-${e.id}`);
          if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
        },
      }));

    const allSkills = [...new Set(c.experience.flatMap((e) => e.skills))];
    const skills = allSkills
      .filter((s) => !q || s.toLowerCase().includes(q))
      .slice(0, 8)
      .map((s) => ({
        label: s,
        meta: "Skill",
        run: () => selectSkillFilter(s, true),
      }));

    const container = $("cmdResults");
    container.innerHTML = "";
    const appendGroup = (title, items) => {
      if (!items.length) return;
      const lbl = document.createElement("div");
      lbl.className = "cmd-group-label";
      lbl.textContent = title;
      container.appendChild(lbl);
      items.forEach((it) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "cmd-item";
        btn.innerHTML = `<span>${it.label}</span><small>${it.meta}</small>`;
        btn.addEventListener("click", () => {
          closeCmd();
          it.run();
        });
        container.appendChild(btn);
      });
    };

    appendGroup(c.palette.actionsTitle, actions);
    appendGroup(c.palette.rolesTitle, roles);
    appendGroup(c.palette.skillsTitle, skills);

    if (!container.children.length) {
      container.innerHTML = `<div class="cmd-group-label">${c.palette.empty}</div>`;
    }
  }

  function copyEmail() {
    navigator.clipboard?.writeText("DiegoUsbMed@gmail.com").catch(() => {});
    showToast(getContent().meta.copied);
  }

  /* Lightweight Interactive Data Mesh Canvas */
  function initDataCanvas() {
    const canvas = $("dataCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w = 0;
    let h = 0;
    const mouse = { x: -999, y: -999 };
    const nodes = Array.from({ length: 34 }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.00032,
      vy: (Math.random() - 0.5) * 0.00032,
    }));

    function resize() {
      w = canvas.width = canvas.offsetWidth * devicePixelRatio;
      h = canvas.height = canvas.offsetHeight * devicePixelRatio;
    }
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = (e.clientX - rect.left) * devicePixelRatio;
      mouse.y = (e.clientY - rect.top) * devicePixelRatio;
    });

    function draw() {
      ctx.clearRect(0, 0, w, h);
      const isDark = state.theme === "dark";
      const strokeRgb = isDark ? "45, 212, 191" : "13, 148, 136";
      const maxDist = 155 * devicePixelRatio;

      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > 1) n.vx *= -1;
        if (n.y < 0 || n.y > 1) n.vy *= -1;
      }

      for (let i = 0; i < nodes.length; i++) {
        const ax = nodes[i].x * w;
        const ay = nodes[i].y * h;
        for (let j = i + 1; j < nodes.length; j++) {
          const bx = nodes[j].x * w;
          const by = nodes[j].y * h;
          const dist = Math.hypot(ax - bx, ay - by);
          if (dist < maxDist) {
            ctx.strokeStyle = `rgba(${strokeRgb}, ${(1 - dist / maxDist) * 0.22})`;
            ctx.lineWidth = 1 * devicePixelRatio;
            ctx.beginPath();
            ctx.moveTo(ax, ay);
            ctx.lineTo(bx, by);
            ctx.stroke();
          }
        }
        const mDist = Math.hypot(ax - mouse.x, ay - mouse.y);
        if (mDist < maxDist * 1.1) {
          ctx.strokeStyle = `rgba(${strokeRgb}, ${(1 - mDist / (maxDist * 1.1)) * 0.38})`;
          ctx.beginPath();
          ctx.moveTo(ax, ay);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
        ctx.fillStyle = `rgba(${strokeRgb}, 0.55)`;
        ctx.beginPath();
        ctx.arc(ax, ay, 2.2 * devicePixelRatio, 0, Math.PI * 2);
        ctx.fill();
      }
      requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
  }

  function initObservers() {
    const revealObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            revealObs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach((el) => revealObs.observe(el));

    const metricsEl = $("metricsGrid");
    if (metricsEl) {
      const mObs = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            animateMetrics();
            mObs.disconnect();
          }
        },
        { threshold: 0.2 }
      );
      mObs.observe(metricsEl);
    }

    window.addEventListener("scroll", () => {
      const doc = document.documentElement;
      const pct = (doc.scrollTop / (doc.scrollHeight - doc.clientHeight || 1)) * 100;
      $("scrollProgress").style.width = `${Math.min(100, Math.max(0, pct))}%`;
    });
  }

  function renderAll() {
    renderText();
    renderMetrics();
    renderFilters();
    renderExperience();
    renderArchitectures();
    renderSkills();
    renderEducation();
    renderReferences();
  }

  function init() {
    $("yearNow").textContent = new Date().getFullYear();
    applyTheme(state.theme);
    renderAll();
    initObservers();
    initDataCanvas();

    $("themeToggle").addEventListener("click", () => {
      applyTheme(state.theme === "light" ? "dark" : "light");
    });

    $("langToggle").addEventListener("click", () => {
      state.lang = state.lang === "es" ? "en" : "es";
      localStorage.setItem("cv_lang", state.lang);
      renderAll();
    });

    $("printBtn").addEventListener("click", () => window.print());
    $("copyEmailBtn").addEventListener("click", copyEmail);
    $("clearSkillFilter").addEventListener("click", () => {
      state.skillFilter = null;
      renderFilters();
      renderExperience();
      renderSkills();
    });

    $("cmdOpenBtn").addEventListener("click", openCmd);
    $("cmdCloseBtn").addEventListener("click", closeCmd);
    $("cmdBackdrop").addEventListener("click", (e) => {
      if (e.target === $("cmdBackdrop")) closeCmd();
    });
    $("cmdInput").addEventListener("input", (e) => renderCmdResults(e.target.value));

    window.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        openCmd();
      } else if (e.key === "Escape") {
        closeCmd();
      }
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
