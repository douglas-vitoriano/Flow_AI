import { currentIndex, SLIDES } from './slides.js'

export function updateCounter() {
  const el = document.querySelector('.topbar__counter')
  if (el) el.textContent = `${currentIndex() + 1} / ${SLIDES.length}`
}

export function initProgress() {
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

export function initDemoTabs() {
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
