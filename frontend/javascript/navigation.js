import { currentIndex, goTo } from './slides.js'

export function initMenu() {
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

export function initKeyboard() {
  const idx = currentIndex()
  document.addEventListener('keydown', e => {
    const tag = document.activeElement?.tagName
    if (tag === 'TEXTAREA' || tag === 'INPUT') return
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); goTo(idx + 1) }
    if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   { e.preventDefault(); goTo(idx - 1) }
  })
}

export function initSwipe() {
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
    if (Math.abs(dx) > THRESHOLD && Math.abs(dx) > Math.abs(dy) * 1.5) {
      goTo(dx < 0 ? idx + 1 : idx - 1)
    }
    startX = null; startY = null
  }, { passive: true })
}
