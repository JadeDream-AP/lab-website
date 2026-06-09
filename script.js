const body = document.body;
document.documentElement.classList.add("motion-ready");

const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const setHeaderState = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 24);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

navToggle?.addEventListener("click", () => {
  const isOpen = body.classList.toggle("nav-open");
  navToggle.setAttribute("aria-label", isOpen ? "关闭导航" : "打开导航");
});

nav?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    body.classList.remove("nav-open");
    navToggle?.setAttribute("aria-label", "打开导航");
  }
});

const revealItems = [...document.querySelectorAll(".reveal")];
revealItems.forEach((item, index) => {
  item.style.setProperty("--delay", `${Math.min(index % 5, 4) * 70}ms`);
});

if (!reduceMotion) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -8% 0px" },
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const magneticItems = [...document.querySelectorAll(".magnetic")];
if (!reduceMotion) {
  magneticItems.forEach((item) => {
    item.addEventListener("pointermove", (event) => {
      const rect = item.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      item.style.transform = `translate(${x * 0.08}px, ${y * 0.14}px)`;
    });

    item.addEventListener("pointerleave", () => {
      item.style.transform = "";
    });
  });
}

const heroImage = document.querySelector(".hero-media img");
if (heroImage && !reduceMotion) {
  window.addEventListener(
    "scroll",
    () => {
      const progress = Math.min(window.scrollY / window.innerHeight, 1);
      heroImage.style.transform = `scale(${1.05 + progress * 0.035}) translateY(${progress * 18}px)`;
    },
    { passive: true },
  );
}

const canvas = document.querySelector("#flow-field");
const context = canvas?.getContext("2d");
let width = 0;
let height = 0;
let raf = 0;
let tick = 0;

const resizeCanvas = () => {
  if (!canvas || !context) return;
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  const rect = canvas.getBoundingClientRect();
  width = Math.floor(rect.width);
  height = Math.floor(rect.height);
  canvas.width = Math.floor(width * ratio);
  canvas.height = Math.floor(height * ratio);
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
};

const drawFlow = () => {
  if (!context || !canvas) return;
  context.clearRect(0, 0, width, height);
  context.lineWidth = 1;

  for (let i = 0; i < 9; i += 1) {
    const offset = i * 56;
    const phase = tick * 0.006 + i * 0.52;
    context.beginPath();
    context.strokeStyle = i % 3 === 0 ? "rgba(216, 95, 69, 0.22)" : "rgba(11, 90, 91, 0.18)";

    for (let x = -80; x <= width + 100; x += 18) {
      const base = height * 0.33 + offset;
      const y =
        base +
        Math.sin(x * 0.006 + phase) * 42 +
        Math.cos(x * 0.011 - phase * 0.8) * 18;

      if (x === -80) {
        context.moveTo(x, y);
      } else {
        context.lineTo(x, y);
      }
    }

    context.stroke();
  }

  tick += 1;
  raf = window.requestAnimationFrame(drawFlow);
};

if (canvas && context && !reduceMotion) {
  resizeCanvas();
  drawFlow();
  window.addEventListener("resize", resizeCanvas);
}

window.addEventListener("beforeunload", () => {
  if (raf) window.cancelAnimationFrame(raf);
});
