export const SLIDES = [
  { label: 'Inicio',        url: '/'               },
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

export function currentIndex() {
  const path = window.location.pathname
  const idx  = SLIDES.findIndex(s => {
    if (s.url === '/') return path === '/' || path === '/index.html'
    return path.startsWith(s.url) || path === s.url.replace(/\/$/, '')
  })
  return idx === -1 ? 0 : idx
}

export function goTo(idx) {
  if (idx < 0 || idx >= SLIDES.length) return
  window.location.href = SLIDES[idx].url
}
