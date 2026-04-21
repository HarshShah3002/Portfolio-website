"use strict";

// theme toggle
(function () {
  const html = document.documentElement;
  const toggle = document.getElementById("theme-toggle");

  // apply saved preference, or follow system default
  var _stored = localStorage.getItem("portfolio-theme");
  if (_stored === "light") {
    html.setAttribute("data-theme", "light");
  } else if (!_stored && window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
    html.setAttribute("data-theme", "light");
  }

  toggle.addEventListener("click", function () {
    if (html.getAttribute("data-theme") === "light") {
      html.removeAttribute("data-theme");
      localStorage.setItem("portfolio-theme", "dark");
    } else {
      html.setAttribute("data-theme", "light");
      localStorage.setItem("portfolio-theme", "light");
    }
  });
}());

// element toggle function
const elementToggleFunc = function (elem) {
  elem.classList.toggle("active");
};

// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () {
  elementToggleFunc(sidebar);
});

// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

select.addEventListener("click", function () {
  elementToggleFunc(this);
});

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {
    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);
  });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {
  for (let i = 0; i < filterItems.length; i++) {
    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }
  }
};

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {
  filterBtn[i].addEventListener("click", function () {
    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;
  });
}

// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {
    // check form validation
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }
  });
}

// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {
    for (let i = 0; i < pages.length; i++) {
      if (this.innerHTML.toLowerCase() === pages[i].dataset.page) {
        pages[i].classList.add("active");
        navigationLinks[i].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[i].classList.remove("active");
        navigationLinks[i].classList.remove("active");
      }
    }
  });
}

// skills modal
(function () {
  const skillsData = {
    technical: {
      title: "Technical Skills",
      tags: ["Python", "SQL", "JavaScript", "Java", "HTML / CSS", "Machine Learning", "A/B Testing", "Data Analysis & Visualization"],
      cert: false
    },
    tools: {
      title: "Tools & Platforms",
      tags: ["Tableau", "Power BI", "Streamlit", "Git", "Jira", "Jupyter Notebook", "Google Analytics", "AWS", "MySQL", "Google Colab", "Notion", "Slack"],
      cert: false
    },
    certifications: {
      title: "Certifications",
      tags: [
        "Professional Scrum Master (PSM 1) - Scrum.org",
        "Engineering Project Management - TAMU",
        "IIT Bombay Incubation & Entrepreneurship - Top 1%"
      ],
      cert: true
    }
  };

  const overlay = document.querySelector("[data-skills-overlay]");
  const modalTitle = document.querySelector("[data-skills-modal-title]");
  const modalBody = document.querySelector("[data-skills-modal-body]");
  const closeBtn = document.querySelector("[data-skills-modal-close]");

  function openModal(type) {
    const data = skillsData[type];
    modalTitle.textContent = data.title;
    modalBody.innerHTML = data.tags
      .map(tag => `<span class="skill-tag${data.cert ? " skill-tag--cert" : ""}">${tag}</span>`)
      .join("");
    overlay.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    overlay.classList.remove("active");
    document.body.style.overflow = "";
  }

  document.querySelectorAll("[data-skills-card]").forEach(function (card) {
    card.addEventListener("click", function () {
      openModal(card.dataset.skillsCard);
    });
  });

  closeBtn.addEventListener("click", closeModal);
  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeModal();
  });
}());

// Intro overlay — particle canvas + text animation + disperse-on-dismiss
(function () {
  var overlay = document.getElementById("intro-overlay");
  if (!overlay) return;

  /* Skip intro when coming back from a project page via the Back button.
     The flag is set by the project page on link click, then immediately cleared
     here so any subsequent reload will show the animation normally. */
  if (sessionStorage.getItem("skip-intro")) {
    sessionStorage.removeItem("skip-intro");
    overlay.style.display = "none";
    return;
  }
  /* Also skip on browser back/forward navigation */
  var _navEntry = performance.getEntriesByType("navigation")[0];
  if (_navEntry && _navEntry.type === "back_forward") {
    overlay.style.display = "none";
    return;
  }

  /* ── Text: split name into staggered char spans ── */
  var nameEl = document.getElementById("intro-name");
  var rawText = nameEl.textContent.trim();
  nameEl.innerHTML = "";
  var delay = 0.6;
  rawText.split("").forEach(function (char) {
    if (char === " ") {
      var sp = document.createElement("span");
      sp.className = "char-space";
      nameEl.appendChild(sp);
    } else {
      var s = document.createElement("span");
      s.className = "char";
      s.textContent = char;
      s.style.animationDelay = delay + "s";
      nameEl.appendChild(s);
      delay += 0.055;
    }
  });

  /* ── Canvas particle network ── */
  var canvas = document.getElementById("intro-canvas");
  var ctx    = canvas ? canvas.getContext("2d") : null;
  var raf;
  var W, H;
  var mouse      = { x: -9999, y: -9999 };
  var particles  = [];
  var dispersing = false;

  var COUNT     = 85;
  var HUB_COUNT = 7;
  var MAX_DIST  = 145;
  var MOUSE_R   = 110;

  /* Colours adapt to current theme */
  var _light    = document.documentElement.getAttribute("data-theme") === "light";
  var DOT_H     = _light ? "38,90%,38%"  : "45,100%,62%";
  var LINE_H    = _light ? "38,90%,38%"  : "45,100%,59%";
  var BLOOM_H   = _light ? "38,90%,38%"  : "45,100%,59%";
  var BLOOM_A   = _light ? 0.07          : 0.055;
  var LINE_BASE = _light ? 0.38          : 0.18;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function makeParticle(hub) {
    return {
      x:       Math.random() * W,
      y:       Math.random() * H,
      vx:      (Math.random() - 0.5) * (hub ? 0.18 : 0.32),
      vy:      (Math.random() - 0.5) * (hub ? 0.18 : 0.32),
      r:       hub ? (Math.random() * 1.8 + 2.2) : (Math.random() * 0.9 + 0.6),
      opacity: hub
        ? (Math.random() * 0.2  + (_light ? 0.8  : 0.55))
        : (Math.random() * 0.25 + (_light ? 0.55 : 0.18)),
      hub:     hub,
      life:    1.0
    };
  }

  function clampSpeed(p, max) {
    var spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
    if (spd > max) { p.vx = p.vx / spd * max; p.vy = p.vy / spd * max; }
  }

  function startDisperse() {
    dispersing = true;
    var cx = W / 2, cy = H / 2;

    /* Blast existing particles outward from centre */
    for (var i = 0; i < particles.length; i++) {
      var p  = particles[i];
      var dx = p.x - cx, dy = p.y - cy;
      var d  = Math.sqrt(dx * dx + dy * dy) || 1;
      var spd = (p.hub ? 6 : 4.5) + Math.random() * 8;
      var ang = Math.atan2(dy, dx) + (Math.random() - 0.5) * 0.9;
      p.vx   = Math.cos(ang) * spd;
      p.vy   = Math.sin(ang) * spd;
      p.life = 1.0;
    }

    /* Spawn burst particles radiating from centre */
    for (var j = 0; j < 70; j++) {
      var ang2  = Math.random() * Math.PI * 2;
      var spd2  = 4 + Math.random() * 11;
      var spawn = Math.random() * 200;
      particles.push({
        x:       cx + Math.cos(ang2) * spawn,
        y:       cy + Math.sin(ang2) * spawn,
        vx:      Math.cos(ang2) * spd2,
        vy:      Math.sin(ang2) * spd2,
        r:       Math.random() * 2.5 + 0.4,
        opacity: Math.random() * 0.45 + 0.5,
        hub:     Math.random() < 0.1,
        life:    1.0
      });
    }
  }

  function drawFrame() {
    ctx.clearRect(0, 0, W, H);

    if (!dispersing) {
      /* Centre ambient bloom */
      var cx    = W / 2, cy = H / 2;
      var bloom = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(W, H) * 0.48);
      bloom.addColorStop(0, "hsla(" + BLOOM_H + "," + BLOOM_A + ")");
      bloom.addColorStop(1, "hsla(" + BLOOM_H + ",0)");
      ctx.fillStyle = bloom;
      ctx.fillRect(0, 0, W, H);

      /* Connection lines */
      for (var i = 0; i < particles.length; i++) {
        for (var j = i + 1; j < particles.length; j++) {
          var pi = particles[i], pj = particles[j];
          var dx = pi.x - pj.x, dy = pi.y - pj.y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            var base  = (1 - dist / MAX_DIST) * LINE_BASE;
            var alpha = (pi.hub && pj.hub) ? base * 2.2 : base;
            ctx.beginPath();
            ctx.moveTo(pi.x, pi.y);
            ctx.lineTo(pj.x, pj.y);
            ctx.strokeStyle = "hsla(" + LINE_H + "," + alpha + ")";
            ctx.lineWidth   = (pi.hub || pj.hub) ? 0.9 : 0.4;
            ctx.stroke();
          }
        }
      }
    }

    /* Draw & update dots */
    for (var k = particles.length - 1; k >= 0; k--) {
      var p = particles[k];

      if (dispersing) {
        p.life -= 0.011;
        if (p.life <= 0) { particles.splice(k, 1); continue; }

        p.x  += p.vx;
        p.y  += p.vy;
        p.vx *= 0.991;
        p.vy *= 0.991;

        var drawOp = p.opacity * p.life;

        if (p.hub) {
          var g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 5);
          g.addColorStop(0, "hsla(" + DOT_H + "," + (drawOp * 0.4) + ")");
          g.addColorStop(1, "hsla(" + DOT_H + ",0)");
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 5, 0, Math.PI * 2);
          ctx.fillStyle = g;
          ctx.fill();
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(p.r * p.life, 0.2), 0, Math.PI * 2);
        ctx.fillStyle = "hsla(" + DOT_H + "," + drawOp + ")";
        ctx.fill();

      } else {
        if (p.hub) {
          var g2 = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 6);
          g2.addColorStop(0, "hsla(" + DOT_H + "," + (p.opacity * 0.35) + ")");
          g2.addColorStop(1, "hsla(" + DOT_H + ",0)");
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 6, 0, Math.PI * 2);
          ctx.fillStyle = g2;
          ctx.fill();
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "hsla(" + DOT_H + "," + p.opacity + ")";
        ctx.fill();

        /* Drift & bounce */
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < p.r)     { p.x = p.r;     p.vx =  Math.abs(p.vx); }
        if (p.x > W - p.r) { p.x = W - p.r; p.vx = -Math.abs(p.vx); }
        if (p.y < p.r)     { p.y = p.r;     p.vy =  Math.abs(p.vy); }
        if (p.y > H - p.r) { p.y = H - p.r; p.vy = -Math.abs(p.vy); }

        /* Mouse repulsion */
        var mdx = p.x - mouse.x, mdy = p.y - mouse.y;
        var md  = Math.sqrt(mdx * mdx + mdy * mdy);
        if (md < MOUSE_R && md > 0) {
          var f = (1 - md / MOUSE_R) * 0.45;
          p.vx += mdx / md * f;
          p.vy += mdy / md * f;
          clampSpeed(p, p.hub ? 1.4 : 2.0);
        }
      }
    }

    raf = requestAnimationFrame(drawFrame);
  }

  if (ctx) {
    resize();
    for (var n = 0; n < COUNT; n++) { particles.push(makeParticle(n < HUB_COUNT)); }
    drawFrame();
    canvas.addEventListener("mousemove", function (e) { mouse.x = e.clientX; mouse.y = e.clientY; });
    window.addEventListener("resize", resize);
  }

  /* ── Dismiss: disperse everything, reveal portfolio ── */
  function dismiss() {
    overlay.removeEventListener("click", dismiss);
    document.removeEventListener("keydown", dismiss);

    /* Fade text + corners out immediately */
    var content = overlay.querySelector(".intro-content");
    if (content) { content.style.transition = "opacity 0.18s ease"; content.style.opacity = "0"; }
    var corners = overlay.querySelectorAll(".intro-corner");
    for (var c = 0; c < corners.length; c++) {
      corners[c].style.transition = "opacity 0.18s ease";
      corners[c].style.opacity    = "0";
    }

    /* Transparent background — reveals portfolio beneath */
    overlay.classList.add("dispersing");

    /* Explode particles */
    if (ctx) { startDisperse(); }

    /* Remove overlay once particles have faded */
    setTimeout(function () {
      cancelAnimationFrame(raf);
      overlay.style.display = "none";
    }, 1700);
  }

  overlay.addEventListener("click", dismiss);
  document.addEventListener("keydown", dismiss, { once: true });
}());

// Scroll-to-top button
(function () {
  const btn = document.getElementById("scroll-top-btn");
  if (!btn) return;

  window.addEventListener("scroll", function () {
    if (window.scrollY > 200) {
      btn.classList.add("visible");
    } else {
      btn.classList.remove("visible");
    }
  }, { passive: true });

  btn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}());
