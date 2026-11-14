import { useRef } from "react";
import { flushSync } from "react-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { useLenis } from "lenis/react";
import { TransitionContext, usePageTransition } from "./pageTransitionContext.js";

// Transición entre páginas: la misma cortina roja del Laboratorio ("page wipe").
// 1. Entra desde la izquierda y cubre la pantalla (0.4s).
// 2. Con todo rojo, cambia la página y vuelve arriba de todo.
// 3. Sigue de largo y sale por la derecha (0.4s). Siempre de izquierda a derecha.
const WIPE_MS = 400;
const WIPE_EASING = "cubic-bezier(0.76, 0, 0.24, 1)"; // arranca rápido y frena al final

const nextFrame = () => new Promise((r) => requestAnimationFrame(() => r()));

export function PageTransitionProvider({ children }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const lenis = useLenis();
  const capaRef = useRef(null);
  const cortinaRef = useRef(null);
  const enCurso = useRef(false);

  async function navegar(to) {
    if (enCurso.current) return;

    // Misma página: no hay transición, solo vuelve arriba
    if (to === pathname) {
      if (lenis) lenis.scrollTo(0);
      else window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      navigate(to);
      return;
    }

    enCurso.current = true;
    const capa = capaRef.current;
    const cortina = cortinaRef.current;
    const opciones = { duration: WIPE_MS, easing: WIPE_EASING, fill: "forwards" };

    // Frena el scroll suave que esté en curso, así la cortina queda quieta sobre la pantalla
    lenis?.scrollTo(window.scrollY, { immediate: true, force: true });

    // La cortina NO es position: fixed (Safari de iPhone pintaría sus barras de rojo y se
    // quedaría con ese color). Es absolute y se ubica justo sobre la parte visible.
    capa.style.top = `${window.scrollY}px`;
    capa.style.display = "block";
    try {
      // 1. Cubre
      await cortina.animate(
        [{ transform: "translateX(-100%)" }, { transform: "translateX(0)" }],
        opciones,
      ).finished;

      // 2. Con la pantalla toda roja: cambia la página, vuelve arriba (y la cortina con ella,
      //    en el mismo cuadro) y espera a que la página nueva se dibuje
      flushSync(() => navigate(to));
      if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
      else window.scrollTo(0, 0);
      capa.style.top = "0px";
      await nextFrame();
      await nextFrame();

      // 3. Destapa: sigue de largo y sale por la derecha
      await cortina.animate(
        [{ transform: "translateX(0)" }, { transform: "translateX(100%)" }],
        opciones,
      ).finished;
    } finally {
      capa.style.display = "none";
      cortina.getAnimations().forEach((a) => a.cancel());
      enCurso.current = false;
    }
  }

  return (
    <TransitionContext.Provider value={navegar}>
      {children}
      {/* Capa del tamaño de la pantalla (recorta la cortina para que no genere scroll de
          costado) + cortina roja adentro. Oculta (display: none) mientras no se usa. */}
      <div
        ref={capaRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-0 z-90 h-lvh w-full overflow-hidden"
        style={{ top: 0, display: "none" }}
      >
        <div
          ref={cortinaRef}
          className="size-full bg-rojo"
          // misma propiedad que se anima (no usar -translate-x-full: se sumaría)
          style={{ transform: "translateX(-100%)" }}
        />
      </div>
    </TransitionContext.Provider>
  );
}

// Reemplazo de <Link>: igual, pero con la cortina.
// Cmd/Ctrl + clic (abrir en otra pestaña) sigue funcionando normal.
export function TransitionLink({ to, onClick, children, ...props }) {
  const navegar = usePageTransition();

  function handleClick(e) {
    onClick?.(e);
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
      return;
    }
    e.preventDefault();
    navegar(to);
  }

  return (
    <a href={to} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}
