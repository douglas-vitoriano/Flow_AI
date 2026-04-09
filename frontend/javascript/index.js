import "$styles/index.css"
import "$styles/syntax-highlighting.css"

/* ─── SLIDE ORDER ─────────────────────────────────────────── */
const SLIDES = [
  { label: 'Capa',          url: '/'               },
  { label: 'Problema',      url: '/problema/'      },
  { label: 'Solução',       url: '/solucao/'       },
  { label: 'Modos',         url: '/modos/'         },
  { label: 'Como Funciona', url: '/funcionamento/' },
  { label: 'Tecnologia',    url: '/tech/'          },
  { label: 'Demo',          url: '/demo/'          },
  { label: 'Roadmap',       url: '/roadmap/'       },
  { label: 'Resultado',     url: '/resultado/'     },
  { label: 'Próximo Passo', url: '/passos/'        },
]

/* ─── CURRENT INDEX ───────────────────────────────────────── */
function currentIndex() {
  const path = window.location.pathname
  const idx  = SLIDES.findIndex(s => {
    if (s.url === '/') return path === '/' || path === '/index.html'
    return path.startsWith(s.url) || path === s.url.replace(/\/$/, '')
  })
  return idx === -1 ? 0 : idx
}

/* ─── NAVIGATE ────────────────────────────────────────────── */
function goTo(idx) {
  if (idx < 0 || idx >= SLIDES.length) return
  window.location.href = SLIDES[idx].url
}

/* ─── TOPBAR MENU ─────────────────────────────────────────── */
function initMenu() {
  const burger = document.querySelector('.topbar__burger')
  const menu   = document.getElementById('slideMenu')
  if (!burger || !menu) return

  burger.addEventListener('click', () => {
    const open = menu.classList.toggle('is-open')
    burger.setAttribute('aria-expanded', String(open))
    burger.textContent = open ? '✕' : '☰'
  })

  document.addEventListener('click', e => {
    if (!burger.contains(e.target) && !menu.contains(e.target)) {
      menu.classList.remove('is-open')
      burger.setAttribute('aria-expanded', 'false')
      burger.textContent = '☰'
    }
  })
}

/* ─── KEYBOARD NAVIGATION ─────────────────────────────────── */
function initKeyboard() {
  const idx = currentIndex()
  document.addEventListener('keydown', e => {
    // Skip if focus is inside a text input
    const tag = document.activeElement?.tagName
    if (tag === 'TEXTAREA' || tag === 'INPUT') return

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); goTo(idx + 1) }
    if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   { e.preventDefault(); goTo(idx - 1) }
  })
}

/* ─── SWIPE ───────────────────────────────────────────────── */
function initSwipe() {
  const THRESHOLD = 48
  let startX = null, startY = null
  const idx = currentIndex()

  document.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX
    startY = e.touches[0].clientY
  }, { passive: true })

  document.addEventListener('touchend', e => {
    if (startX === null) return
    const dx = e.changedTouches[0].clientX - startX
    const dy = e.changedTouches[0].clientY - startY
    // Only trigger on predominantly horizontal swipes
    if (Math.abs(dx) > THRESHOLD && Math.abs(dx) > Math.abs(dy) * 1.5) {
      goTo(dx < 0 ? idx + 1 : idx - 1)
    }
    startX = null; startY = null
  }, { passive: true })
}

/* ─── DEMO TABS (static panels, not live AI) ──────────────── */
function initDemoTabs() {
  const tabs   = document.querySelectorAll('.demo-tab[data-panel]')
  const panels = document.querySelectorAll('.demo-panel')
  if (!tabs.length) return

  function activate(i) {
    tabs.forEach((t, j) => t.classList.toggle('is-active', j === i))
    panels.forEach((p, j) => p.classList.toggle('is-active', j === i))
  }

  tabs.forEach((tab, i) => tab.addEventListener('click', () => activate(i)))
  activate(0)
}

/* ─── COUNTER ─────────────────────────────────────────────── */
function updateCounter() {
  const el = document.querySelector('.topbar__counter')
  if (el) el.textContent = `${currentIndex() + 1} / ${SLIDES.length}`
}

/* ─── PROGRESS INDICATOR ──────────────────────────────────── */
function initProgress() {
  const bar = document.createElement('div')
  bar.style.cssText = `
    position:fixed;top:0;left:0;height:2px;
    background:var(--neon);z-index:600;
    width:${((currentIndex() + 1) / SLIDES.length) * 100}%;
    transition:width .4s cubic-bezier(.22,1,.36,1);
    box-shadow:0 0 8px rgba(232,255,0,.6);
    pointer-events:none;
  `
  document.body.appendChild(bar)
}

/* ─── INIT ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initMenu()
  initKeyboard()
  initSwipe()
  initDemoTabs()
  updateCounter()
  initProgress()
})
