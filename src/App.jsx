import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { ReactLenis, useLenis } from 'lenis/react'
import 'lenis/dist/lenis.css'
import './App.css'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Info from './pages/Info.jsx'
import Proyecto from './pages/Proyecto.jsx'
import NoEncontrada from './pages/NoEncontrada.jsx'
import { PageTransitionProvider } from './components/PageTransition.jsx'
import { scrollAlAncla } from './components/scrollAlAncla.js'
import Preloader from './components/Preloader.jsx'

// Si la persona pidió menos animaciones en su sistema, el scroll queda normal
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Al cambiar de página, vuelve arriba de todo (salvo que el link apunte a un #ancla)
function ScrollToTop() {
  const { pathname, hash } = useLocation()
  const lenis = useLenis()

  useEffect(() => {
    // Con #ancla (ej. al abrir directo /#proyectos): va a esa sección
    if (hash) {
      scrollAlAncla(hash, lenis, true)
      return
    }
    // Con Lenis hay que scrollear a través de él; si no, Lenis "pelea" con el salto
    if (lenis) lenis.scrollTo(0, { immediate: true })
    else window.scrollTo(0, 0)
  }, [pathname, hash, lenis])

  return null
}

const App = () => {
  return (
    <ReactLenis root options={{ smoothWheel: !reduceMotion }}>
      <BrowserRouter>
        {/* Cortina roja entre páginas: los links usan <TransitionLink> */}
        <PageTransitionProvider>
          <ScrollToTop />
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/info" element={<Info />} />
            <Route path="/proyectos/:id" element={<Proyecto />} />
            <Route path="*" element={<NoEncontrada />} />
          </Routes>
          <Footer />
          {/* Va al final: así, cuando arranca, la página ya está armada y puede seguir su carga */}
          <Preloader />
        </PageTransitionProvider>
      </BrowserRouter>
    </ReactLenis>
  )
}

export default App
