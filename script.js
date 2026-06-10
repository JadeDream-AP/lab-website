const body = document.body;
const nav = document.querySelector("[data-nav]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const mobilePanel = document.querySelector("[data-mobile-panel]");
const progress = document.querySelector("[data-scroll-progress]");
const paperLinks = document.querySelectorAll("[data-paper-link]");
const pdfViewer = document.querySelector("[data-pdf-viewer]");
const pdfFrame = document.querySelector("[data-pdf-frame]");
const pdfTitle = document.querySelector("[data-pdf-title]");
const pdfOpen = document.querySelector("[data-pdf-open]");
const pdfCloseButtons = document.querySelectorAll("[data-pdf-close]");
const langSwitches = document.querySelectorAll("[data-lang-switch]");
const langToggles = document.querySelectorAll("[data-lang-toggle]");
const translatedText = document.querySelectorAll("[data-i18n-zh][data-i18n-en]");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const sectionIds = ["profile", "experience", "honors", "publications", "students"];
const sections = sectionIds
  .map((id) => document.getElementById(id))
  .filter((section) => section instanceof HTMLElement);
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
const portrait = document.querySelector(".portrait-wrap img");
let currentLang = localStorage.getItem("site-language") || "zh";

const setHeaderState = () => {
  nav?.classList.toggle("is-scrolled", window.scrollY > 12);
};

const setScrollProgress = () => {
  if (!progress) return;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const amount = scrollable > 0 ? window.scrollY / scrollable : 0;
  progress.style.transform = `scaleX(${Math.min(Math.max(amount, 0), 1)})`;
};

const setActiveNav = () => {
  const current = [...sections].reverse().find((section) => {
    return section.getBoundingClientRect().top <= 140;
  });

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    link.classList.toggle("is-active", Boolean(current && href === `#${current.id}`));
  });
};

const setHeroMotion = () => {
  if (!portrait || reduceMotion) return;
  const progressY = Math.min(window.scrollY / 520, 1);
  portrait.style.transform = `translateY(${progressY * 14}px) scale(${1 + progressY * 0.012})`;
};

const refreshRevealTargets = () => {
  document.querySelectorAll(".reveal").forEach((element) => {
    element.classList.remove("reveal", "is-visible");
    element.style.removeProperty("--reveal-delay");
  });

  document
    .querySelectorAll(".profile-card, .portrait-wrap, .text-section h2, .text-section p, .simple-list li, .publication-list li, .student-stats div, .student-card")
    .forEach((element, index) => {
      const isHidden = element.closest("[hidden]");
      if (isHidden) return;
      element.classList.add("reveal");
      element.style.setProperty("--reveal-delay", `${Math.min(index % 6, 5) * 45}ms`);
    });

  if (reduceMotion) {
    document.querySelectorAll(".reveal").forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.14 },
  );

  document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));
};

const setLanguage = (lang) => {
  currentLang = lang === "en" ? "en" : "zh";
  document.documentElement.lang = currentLang === "en" ? "en" : "zh-CN";
  localStorage.setItem("site-language", currentLang);

  document.querySelectorAll("[data-lang]").forEach((element) => {
    element.hidden = element.getAttribute("data-lang") !== currentLang;
  });

  translatedText.forEach((element) => {
    const value = element.getAttribute(`data-i18n-${currentLang}`);
    if (value) element.textContent = value;
  });

  langSwitches.forEach((button) => {
    const isActive = button.getAttribute("data-lang-switch") === currentLang;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  langToggles.forEach((button) => {
    const nextLang = currentLang === "zh" ? "en" : "zh";
    button.textContent = currentLang === "zh" ? "EN" : "中文";
    button.setAttribute("aria-label", currentLang === "zh" ? "Switch to English" : "切换到中文");
    button.setAttribute("aria-pressed", "false");
    button.dataset.nextLang = nextLang;
  });

  menuToggle?.setAttribute("aria-label", currentLang === "en" ? "Open menu" : "打开导航");
  refreshRevealTargets();
  updateScrollState();
};

const updateScrollState = () => {
  setHeaderState();
  setScrollProgress();
  setActiveNav();
  setHeroMotion();
};

menuToggle?.addEventListener("click", () => {
  const isOpen = body.classList.toggle("menu-open");
  menuToggle.setAttribute(
    "aria-label",
    isOpen
      ? currentLang === "en"
        ? "Close menu"
        : "关闭导航"
      : currentLang === "en"
        ? "Open menu"
        : "打开导航",
  );
});

mobilePanel?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    body.classList.remove("menu-open");
    menuToggle?.setAttribute("aria-label", currentLang === "en" ? "Open menu" : "打开导航");
  }
});

langSwitches.forEach((button) => {
  button.addEventListener("click", () => {
    const lang = button.getAttribute("data-lang-switch");
    setLanguage(lang || "zh");
    body.classList.remove("menu-open");
  });
});

langToggles.forEach((button) => {
  button.addEventListener("click", () => {
    setLanguage(currentLang === "zh" ? "en" : "zh");
    body.classList.remove("menu-open");
  });
});

const closePdfViewer = () => {
  if (!pdfViewer) return;
  pdfViewer.hidden = true;
  body.classList.remove("pdf-open");
  if (pdfFrame instanceof HTMLIFrameElement) {
    pdfFrame.removeAttribute("src");
  }
};

paperLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    if (!(link instanceof HTMLAnchorElement) || !pdfViewer) return;
    event.preventDefault();

    const paperUrl = link.href;
    const paperTitle = link.dataset.paperTitle || "论文 PDF";

    if (pdfTitle) pdfTitle.textContent = paperTitle;
    if (pdfOpen instanceof HTMLAnchorElement) pdfOpen.href = paperUrl;
    if (pdfFrame instanceof HTMLIFrameElement) pdfFrame.src = paperUrl;

    pdfViewer.hidden = false;
    body.classList.add("pdf-open");
  });
});

pdfCloseButtons.forEach((button) => {
  button.addEventListener("click", closePdfViewer);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !pdfViewer?.hidden) {
    closePdfViewer();
  }
});

setLanguage(currentLang);
window.addEventListener("scroll", updateScrollState, { passive: true });
window.addEventListener("resize", updateScrollState);
window.addEventListener("hashchange", updateScrollState);
window.addEventListener("load", () => window.setTimeout(updateScrollState, 0));
