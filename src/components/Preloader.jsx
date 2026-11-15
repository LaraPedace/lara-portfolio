import { useLayoutEffect, useRef, useState } from "react";
import { useLenis } from "lenis/react";
import star from "../assets/img/STAR.svg";

// Preloader: fondo blanco, una línea fina que crece desde abajo con la estrella en la
// punta y el porcentaje abajo a la izquierda. Al llegar a 100% la estrella queda justo
// encima de la del header (se mide el elemento real), el resto se desvanece y la
// estrella del preloader "se convierte" en la del header.
// Solo la primera vez por sesión, y nunca con "reducir movimiento".

const VISTO = "preloader-visto"; // clave en sessionStorage
const MIN_MS = 1500; // duración mínima, para que la animación se llegue a ver
const MAX_MS = 10000; // si algo no termina de cargar, a los 10s se completa igual
const SUAVIDAD = 0.06; // cuánto se acerca el progreso visible al real en cada cuadro
const PASO_MIN = 0.006; // avance mínimo por cuadro cuando falta poco (≈ 0,6%)
const FADE_MS = 450; // fundido final

function debeMostrarse() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  try {
    return !sessionStorage.getItem(VISTO);
  } catch {
    return true;
  }
}

// Seguimiento de la carga real: fuentes, imágenes que se cargan de entrada y videos
// que se precargan (las imágenes "lazy" y los videos con preload="none" no se cargan
// hasta que hacen falta, así que no se esperan). Devuelve una función con el avance 0–1.
function seguirCarga() {
  const tareas = [];
  const agregar = (promesa) => tareas.push(promesa.then(() => (listas += 1), () => (listas += 1)));
  let listas = 0;

  if (document.fonts) agregar(document.fonts.ready);
  if (document.readyState !== "complete") {
    agregar(new Promise((ok) => window.addEventListener("load", ok, { once: true })));
  }
  for (const img of document.images) {
    if (img.loading === "lazy" || img.complete) continue;
    agregar(
      new Promise((ok) => {
        img.addEventListener("load", ok, { once: true });
        img.addEventListener("error", ok, { once: true });
      }),
    );
  }
  for (const video of document.querySelectorAll("video")) {
    if (video.preload === "none" || video.readyState >= 2) continue;
    agregar(
      new Promise((ok) => {
        video.addEventListener("loadeddata", ok, { once: true });
        video.addEventListener("error", ok, { once: true });
      }),
    );
  }

  const total = tareas.length;
  return () => (total === 0 ? 1 : listas / total);
}

function Preloader() {
  const [visible, setVisible] = useState(debeMostrarse);
  const lenis = useLenis();
  const fondoRef = useRef(null);
  const lineaRef = useRef(null);
  const estrellaRef = useRef(null);
  const numeroRef = useRef(null);
  const restoRef = useRef(null);

  // Bloquea el scroll mientras se ve (con Lenis y sin él)
  useLayoutEffect(() => {
    if (!visible) return;
    lenis?.stop();
    const html = document.documentElement;
    const antes = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = antes;
      lenis?.start();
    };
  }, [visible, lenis]);

  // Animación (layout effect: se ubica todo antes de que se dibuje el primer cuadro)
  useLayoutEffect(() => {
    if (!visible) return;
    try {
      sessionStorage.setItem(VISTO, "1");
    } catch {
      // sin sessionStorage: se vuelve a mostrar en la próxima carga, no pasa nada
    }

    const linea = lineaRef.current;
    const estrella = estrellaRef.current;
    const numero = numeroRef.current;
    const avanceReal = seguirCarga();
    const inicio = performance.now();
    let mostrado = 0;
    let frame;
    let timer;

    // Destino: la estrella del header, medida en pantalla (posición, tamaño y giro)
    let destino;
    function medir() {
      const alto = fondoRef.current.clientHeight;
      const header = document.querySelector('header a[aria-label="Inicio"] > span');
      if (!header) {
        destino = { x: window.innerWidth / 2, y: 40, ancho: 32, alto: 36, giro: "", pantalla: alto };
        return;
      }
      // El giro se saca para medir la caja real (sin rotar) y se copia aparte
      const giro = header.style.transform;
      header.style.transform = "none";
      const r = header.getBoundingClientRect();
      header.style.transform = giro;
      destino = {
        x: r.left + r.width / 2,
        y: r.top + r.height / 2,
        ancho: r.width,
        alto: r.height,
        giro: giro === "none" ? "" : giro, // ej. "rotate(0deg)"; vacío si no gira
        pantalla: alto,
      };
      estrella.style.width = `${r.width}px`;
      estrella.style.height = `${r.height}px`;
      linea.style.left = `${destino.x}px`;
    }

    function dibujar(p) {
      // La punta va desde el borde de abajo (0%) hasta el centro de la estrella del header (100%)
      const punta = destino.pantalla - p * (destino.pantalla - destino.y);
      linea.style.height = `${destino.pantalla - punta}px`;
      estrella.style.transform = `translate(${destino.x - destino.ancho / 2}px, ${
        punta - destino.alto / 2
      }px) ${destino.giro}`;
      numero.textContent = `${Math.round(p * 100)}%`;
    }

    function cuadro(ahora) {
      const t = ahora - inicio;
      const real = t >= MAX_MS ? 1 : avanceReal();
      const tope = Math.min(1, t / MIN_MS); // no puede ir más rápido que la duración mínima
      // Se acerca suave al objetivo, con una velocidad mínima para que el final no se arrastre
      const falta = Math.min(real, tope) - mostrado;
      mostrado += Math.max(falta * SUAVIDAD, Math.min(falta, PASO_MIN));
      if (real >= 1 && tope >= 1 && 1 - mostrado < 0.002) mostrado = 1;
      dibujar(mostrado);
      if (mostrado < 1) frame = requestAnimationFrame(cuadro);
      else terminar();
    }

    // 100%: se desvanece todo menos la estrella, que ya está sobre la del header
    function terminar() {
      for (const el of [fondoRef.current, restoRef.current]) {
        el.style.transition = `opacity ${FADE_MS}ms ease-out`;
        el.style.opacity = "0";
      }
      timer = setTimeout(() => setVisible(false), FADE_MS);
    }

    medir();
    dibujar(0);
    frame = requestAnimationFrame(cuadro);
    let activo = true;
    function alCambiarTamaño() {
      if (!activo) return;
      medir();
      dibujar(mostrado);
    }
    window.addEventListener("resize", alCambiarTamaño);
    // Cuando carga la tipografía, los textos del header cambian de ancho y la estrella
    // se corre un poco: se vuelve a medir (y una vez más con todo cargado)
    document.fonts?.ready.then(alCambiarTamaño);
    window.addEventListener("load", alCambiarTamaño);

    return () => {
      activo = false;
      cancelAnimationFrame(frame);
      clearTimeout(timer);
      window.removeEventListener("resize", alCambiarTamaño);
      window.removeEventListener("load", alCambiarTamaño);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div aria-hidden="true" className="pointer-events-auto fixed inset-0 z-100 overflow-hidden">
      <div ref={fondoRef} className="absolute inset-0 bg-white" />
      <div ref={restoRef}>
        <div ref={lineaRef} className="absolute bottom-0 w-px -translate-x-1/2 bg-black" />
        <p
          ref={numeroRef}
          className="absolute bottom-4 left-4 font-grotesk text-5xl leading-none tracking-tighter text-black/20 tabular-nums xl:bottom-8 xl:left-8 xl:text-6xl"
        >
          0%
        </p>
      </div>
      {/* Misma estrella que el header (mismo SVG como máscara, mismo color) */}
      <span
        ref={estrellaRef}
        className="absolute top-0 left-0 block bg-black"
        style={{
          maskImage: `url("${star}")`,
          WebkitMaskImage: `url("${star}")`,
          maskSize: "contain",
          WebkitMaskSize: "contain",
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
          maskPosition: "center",
          WebkitMaskPosition: "center",
        }}
      />
    </div>
  );
}

export default Preloader;
