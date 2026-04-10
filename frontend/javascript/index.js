import "$styles/index.css"

import { initMenu, initKeyboard, initSwipe } from './navigation.js'
import { updateCounter, initProgress, initDemoTabs } from './ui.js'

document.addEventListener('DOMContentLoaded', () => {
  initMenu()
  initKeyboard()
  initSwipe()
  initDemoTabs()
  updateCounter()
  initProgress()
})
