// === TYPEWRITER ===
const greetings = [
  "hello, traveler.",
  "you found /dev/log.",
  "i write bugs so you don't have to.",
  "console.log('welcome back.');",
  "0x72656164657220313a20666f756e642e",
];
const typeEl = document.getElementById('typewriter');
let gIdx = 0, cIdx = 0, deleting = false;

function tick() {
  const current = greetings[gIdx];
  if (deleting) {
    cIdx--;
    typeEl.textContent = current.slice(0, cIdx);
    if (cIdx === 0) {
      deleting = false;
      gIdx = (gIdx + 1) % greetings.length;
      setTimeout(tick, 400);
      return;
    }
    setTimeout(tick, 35);
  } else {
    cIdx++;
    typeEl.textContent = current.slice(0, cIdx);
    if (cIdx === current.length) {
      deleting = true;
      setTimeout(tick, 2200);
      return;
    }
    setTimeout(tick, 75 + Math.random() * 50);
  }
}
tick();

// === READING PROGRESS BAR ===
const progressBar = document.getElementById('progressBar');
function updateProgress() {
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = (docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0) + '%';
}
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

// === THEME TOGGLE (3-state with smooth transition) ===
const themeButtons = document.querySelectorAll('.theme-btn');
const root = document.documentElement;

function setTheme(theme, animate = true) {
  if (animate) {
    document.body.classList.add('theme-anim');
    setTimeout(() => document.body.classList.remove('theme-anim'), 700);
  }
  root.setAttribute('data-theme', theme);
  try { localStorage.setItem('devlog-theme', theme); } catch (e) {}
  themeButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.theme === theme));
}
themeButtons.forEach(btn => btn.addEventListener('click', () => setTheme(btn.dataset.theme)));

let initialTheme = 'dark';
try {
  const saved = localStorage.getItem('devlog-theme');
  if (saved && ['dark', 'light', 'cyber'].includes(saved)) initialTheme = saved;
} catch (e) {}
setTheme(initialTheme, false);

// === COPY-FLASH CODE BUTTONS ===
document.querySelectorAll('.copy-btn').forEach(btn => {
  btn.addEventListener('click', async () => {
    const codeEl = document.getElementById(btn.dataset.target);
    if (!codeEl) return;
    const text = codeEl.innerText;

    try {
      await navigator.clipboard.writeText(text);
    } catch (e) {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch (e2) {}
      document.body.removeChild(ta);
    }

    btn.classList.add('copied');
    const label = btn.querySelector('.copy-label');
    const icon = btn.querySelector('i');
    const origLabel = label.textContent;
    const origIcon = icon.className;
    label.textContent = 'copied';
    icon.className = 'fas fa-check';

    setTimeout(() => {
      btn.classList.remove('copied');
      label.textContent = origLabel;
      icon.className = origIcon;
    }, 1800);
  });
});

// === GITHUB LIVE COUNTERS ===
const starsEl = document.getElementById('ghStars');
const forksEl = document.getElementById('ghForks');

function formatNumber(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
  return n.toString();
}

function animateCounter(el, target, duration = 1400) {
  const start = parseInt(el.dataset.raw) || 0;
  const startTime = performance.now();
  function frame(now) {
    const t = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    const value = Math.floor(start + (target - start) * eased);
    el.textContent = formatNumber(value);
    el.dataset.raw = value;
    if (t < 1) requestAnimationFrame(frame);
    else {
      el.dataset.raw = target;
      el.textContent = formatNumber(target);
    }
  }
  requestAnimationFrame(frame);
}

async function loadGitHubStats() {
  const fallbackStars = 82400;
  const fallbackForks = 4180;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    const res = await fetch('https://api.github.com/repos/tailwindlabs/tailwindcss', {
      signal: controller.signal,
      headers: { 'Accept': 'application/vnd.github.v3+json' }
    });
    clearTimeout(timeout);
    if (!res.ok) throw new Error('Rate limited');
    const data = await res.json();
    animateCounter(starsEl, data.stargazers_count);
    animateCounter(forksEl, data.forks_count);
  } catch (e) {
    animateCounter(starsEl, fallbackStars);
    animateCounter(forksEl, fallbackForks);
  }
}
loadGitHubStats();

// Simulate live activity on the star counter
setInterval(() => {
  if (Math.random() < 0.35) {
    const next = (parseInt(starsEl.dataset.raw) || 0) + 1;
    starsEl.dataset.raw = next;
    starsEl.textContent = formatNumber(next);
    starsEl.classList.remove('flash-up');
    void starsEl.offsetWidth;
    starsEl.classList.add('flash-up');
  }
}, 9000);

// === MOUSE GLOW (hero only) ===
const mouseGlow = document.getElementById('mouseGlow');
const hero = document.getElementById('hero');
hero.addEventListener('mousemove', (e) => {
  const rect = hero.getBoundingClientRect();
  mouseGlow.style.left = (e.clientX - rect.left) + 'px';
  mouseGlow.style.top = (e.clientY - rect.top) + 'px';
  mouseGlow.style.opacity = '1';
});
hero.addEventListener('mouseleave', () => { mouseGlow.style.opacity = '0'; });

// === SCROLL REVEAL ===
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -80px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// === SUBSCRIBE FORM ===
const subForm = document.getElementById('subForm');
const subToast = document.getElementById('subToast');
subForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const input = document.getElementById('emailInput');
  if (!input.value || !input.value.includes('@')) return;
  subToast.style.opacity = '1';
  input.value = '';
  input.placeholder = 'see you Tuesday.';
  setTimeout(() => {
    subToast.style.opacity = '0';
    input.placeholder = 'you@somewhere.dev';
  }, 4000);
});

// === KEYBOARD SHORTCUT: T to cycle theme ===
document.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
  if (e.key === 't' || e.key === 'T') {
    const order = ['dark', 'light', 'cyber'];
    const next = order[(order.indexOf(root.getAttribute('data-theme')) + 1) % order.length];
    setTheme(next);
  }
});

// === BG GRID PARALLAX ===
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  if (scrolled < window.innerHeight) {
    hero.style.backgroundPosition = `center ${scrolled * 0.3}px`;
  }
}, { passive: true });
