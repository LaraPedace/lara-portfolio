import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { useLenis } from "lenis/react";
import { lab } from "../data/lab.js";
import { usePageTransition } from "./pageTransitionContext.js";
import { useIdioma } from "../i18n/idiomaContext.js";
import { useDescripcionLab } from "../i18n/traducir.js";
import { T } from "../i18n/textos.js";
import "./Laboratorio.css";

// ─── Ajustes ───────────────────────────────────────────────────────────────
const COLS = 6; // el lienzo se reparte en 6 × 5 celdas (una pieza por celda, con desvío al azar)
const ROWS = 5;
const SIZES = [120, 190, 280]; // ancho de miniatura chica / mediana / grande (en una pantalla de 1440px)
const PARALLAX = [0.55, 0.85, 1.2]; // velocidad de cada tamaño: las grandes se mueven más rápido
const FRICTION = 0.94; // inercia al soltar: más cerca de 1 = sigue más tiempo
const DRIFT = 0.25; // movimiento suave constante cuando nadie arrastra (px por cuadro)
const WHEEL = 0.6; // velocidad con la rueda / trackpad (pantalla completa)

// Cortina roja al entrar / salir: cubre en 0.4s, cambia la vista, destapa en 0.4s.
// Siempre de izquierda a derecha.
const WIPE_MS = 400;
const WIPE_EASING = "cubic-bezier(0.76, 0, 0.24, 1)"; // arranca rápido y frena al final

// Sonido "tick" al pasar el mouse por una pieza (pantalla completa, desktop)
const TICK_HZ = 2200; // tono: más alto = más agudo
const TICK_VOLUMEN = 0.06; // 0 a 1
const TICK_DURACION = 0.03; // segundos
const TICK_GAP = 0.04; // tiempo mínimo entre ticks (segundos)

const nextFrame = () => new Promise((r) => requestAnimationFrame(() => r()));

// Número al azar "con semilla": siempre da la misma secuencia,
// así el lienzo tiene la misma composición cada vez que se carga.
function seededRandom(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), seed | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Arma las piezas del lienzo: las imágenes aparecen dos veces y los videos una
// (para que no haya demasiados videos reproduciéndose a la vez).
function armarPiezas() {
  const rand = seededRandom(7);
  const piezas = [];
  for (const item of lab) {
    const copias = item.tipo === "video" ? 1 : 2;
    for (let c = 0; c < copias; c++) piezas.push({ item, key: `${item.id}-${c}` });
  }
  // Mezclar para que las copias de una misma pieza no queden juntas
  for (let i = piezas.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [piezas[i], piezas[j]] = [piezas[j], piezas[i]];
  }
  // Cada pieza va a una celda, corrida al azar (así no se nota la grilla), con un tamaño al azar.
  // u, v = centro de la pieza dentro del lienzo, de 0 a 1.
  return piezas.map((p, i) => {
    const u = ((i % COLS) + 0.5 + (rand() - 0.5) * 0.7) / COLS;
    const v = (Math.floor(i / COLS) + 0.5 + (rand() - 0.5) * 0.7) / ROWS;
    const capa = Math.floor(rand() * 3); // 0 = chica, 1 = mediana, 2 = grande
    // Los videos aparecen una sola vez: nunca van chicos (atrás de todo), mínimo medianos
    return { ...p, u, v, capa: p.item.tipo === "video" ? Math.max(1, capa) : capa };
  });
}

const PIEZAS = armarPiezas();

// Resto siempre positivo (para el loop infinito)
const mod = (n, m) => ((n % m) + m) % m;

function Laboratorio() {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const inmersivoRef = useRef(false);
  const [inmersivo, setInmersivo] = useState(false);
  const [abierta, setAbierta] = useState(null); // pieza abierta en grande
  const lenis = useLenis();
  const navegar = usePageTransition();
  const { t } = useIdioma();
  const descripcion = useDescripcionLab();
  const cortinaRef = useRef(null);
  const enTransicion = useRef(false);

  // ─── Sonido "tick" al pasar el mouse por una pieza (solo dentro y solo en desktop) ───
  // Se genera con Web Audio (sin archivo de sonido). Los navegadores solo dejan sonar
  // audio después de un clic: el clic en ENTRAR enciende el audio.
  const audioRef = useRef(null);
  const ultimoTick = useRef(0);

  function prepararAudio() {
    const desktop = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!desktop) return;
    if (!audioRef.current) audioRef.current = new AudioContext();
    audioRef.current.resume();
  }

  function tick() {
    const ctx = audioRef.current;
    if (!ctx || ctx.state !== "running" || !inmersivoRef.current) return;
    const now = ctx.currentTime;
    if (now - ultimoTick.current < TICK_GAP) return; // que no se amontonen si pasás rápido
    ultimoTick.current = now;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = TICK_HZ * (0.92 + Math.random() * 0.16); // leve variación de tono
    gain.gain.setValueAtTime(TICK_VOLUMEN, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + TICK_DURACION); // se apaga rápido
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + TICK_DURACION);
  }

  useEffect(() => () => audioRef.current?.close(), []);

  // Entrar / salir de pantalla completa con la cortina roja
  async function cambiarModo(entrar) {
    if (enTransicion.current || entrar === inmersivoRef.current) return;
    if (entrar) prepararAudio(); // tiene que pasar dentro del clic (antes de cualquier await)
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setInmersivo(entrar);
      return;
    }
    enTransicion.current = true;
    const section = sectionRef.current;
    const cortina = cortinaRef.current;
    const opciones = { duration: WIPE_MS, easing: WIPE_EASING, fill: "forwards" };

    // La cortina NO es position: fixed. Safari de iPhone pinta la barra de estado y la de
    // abajo con el color de los elementos fijos que tocan los bordes, y se quedaba con el
    // rojo de la cortina. Por eso es absolute dentro de la sección, y se ubica justo
    // sobre la parte visible de la pantalla (aunque la sección esté a medio scrollear).
    cortina.style.top = `${-section.getBoundingClientRect().top}px`;
    cortina.style.display = "block";
    try {
      // 1. Entra desde la izquierda hasta cubrir toda la pantalla
      await cortina.animate(
        [{ transform: "translateX(-100%)" }, { transform: "translateX(0)" }],
        opciones,
      ).finished;

      // 2. Con la pantalla toda roja:
      //    - al entrar, se alinea la sección con la pantalla (y la cortina con ella, en el
      //      mismo cuadro, así no se ve el salto). Queda alineada mientras dure la pantalla
      //      completa, y la cortina vuelve a cubrir bien al salir.
      //    - se cambia la vista y se espera a que se dibuje
      if (entrar) {
        const destino = window.scrollY + section.getBoundingClientRect().top;
        if (lenis) lenis.scrollTo(destino, { immediate: true, force: true });
        else window.scrollTo(0, destino);
        cortina.style.top = "0px";
      }
      flushSync(() => setInmersivo(entrar));
      await nextFrame();
      await nextFrame();

      // 3. Sigue de largo y sale por la derecha
      await cortina.animate(
        [{ transform: "translateX(0)" }, { transform: "translateX(100%)" }],
        opciones,
      ).finished;
    } finally {
      // Vuelve a esperar a la izquierda (fuera de pantalla) y oculta
      cortina.style.display = "none";
      cortina.getAnimations().forEach((a) => a.cancel());
      enTransicion.current = false;
    }
  }

  // ─── Motor del lienzo ────────────────────────────────────────────────────
  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const els = [...stage.querySelectorAll("[data-pieza]")];
    const videos = [...stage.querySelectorAll("video")];
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const piezas = PIEZAS.map((p) => ({ ...p }));

    let tileW, tileH, margin; // tamaño del lienzo que se repite, y margen para que el salto no se vea
    let camX = 0;
    let camY = 0;
    let vx = 0; // velocidad (inercia)
    let vy = 0;
    let frame = null;

    // Medidas: el lienzo que se repite siempre es más grande que la pantalla + la pieza más grande,
    // así una pieza sale por un borde y vuelve a entrar por el opuesto cuando ya no se ve.
    function layout() {
      const W = stage.clientWidth;
      const H = stage.clientHeight;
      const scale = Math.min(1.2, Math.max(0.55, W / 1440));
      margin = 600 * scale;
      tileW = Math.max(W + margin, W * 1.5);
      tileH = Math.max(H + margin, H * 1.5);
      piezas.forEach((p, i) => {
        const w = SIZES[p.capa] * scale;
        const h = (w * p.item.alto) / p.item.ancho;
        els[i].style.width = `${w}px`;
        els[i].style.height = `${h}px`;
        p.x = p.u * tileW - w / 2;
        p.y = p.v * tileH - h / 2;
      });
      render();
    }

    function render() {
      piezas.forEach((p, i) => {
        const f = PARALLAX[p.capa];
        const x = mod(p.x - camX * f + margin, tileW) - margin;
        const y = mod(p.y - camY * f + margin, tileH) - margin;
        els[i].style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      });
    }

    // ─── Animación (requestAnimationFrame) ───
    let dragging = false;
    function tick() {
      if (!dragging) {
        if (reduce) {
          vx = vy = 0;
        } else {
          vx *= FRICTION;
          vy *= FRICTION;
          camX += vx + DRIFT;
          camY += vy + DRIFT * 0.6;
        }
      }
      render();
      frame = requestAnimationFrame(tick);
    }
    function start() {
      if (!frame) frame = requestAnimationFrame(tick);
      videos.forEach((v) => v.play().catch(() => {}));
    }
    function stop() {
      cancelAnimationFrame(frame);
      frame = null;
      videos.forEach((v) => v.pause());
    }

    // Solo se anima mientras se ve (o en pantalla completa)
    let visible = false;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible || inmersivoRef.current) start();
      else stop();
    });
    io.observe(section);

    const ro = new ResizeObserver(layout);
    ro.observe(stage);
    layout();

    // ─── Arrastrar (mouse siempre; dedo solo en pantalla completa) ───
    let lastX = 0;
    let lastY = 0;
    let lastT = 0;
    let moved = 0;

    function down(e) {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      if (e.pointerType !== "mouse" && !inmersivoRef.current) return; // en la página, el dedo scrollea
      dragging = true;
      moved = 0;
      vx = vy = 0;
      lastX = e.clientX;
      lastY = e.clientY;
      lastT = performance.now();
      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", up);
      window.addEventListener("pointercancel", up);
    }
    function move(e) {
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      const now = performance.now();
      const dt = Math.max(1, now - lastT);
      lastX = e.clientX;
      lastY = e.clientY;
      lastT = now;
      camX -= dx;
      camY -= dy;
      // velocidad en px por cuadro (60fps), suavizada
      vx = vx * 0.3 + ((-dx / dt) * 16.7) * 0.7;
      vy = vy * 0.3 + ((-dy / dt) * 16.7) * 0.7;
      moved += Math.abs(dx) + Math.abs(dy);
      // Si se arrastró, las miniaturas dejan de responder: así al soltar no se abre ninguna
      if (moved > 6) stage.classList.add("lab-arrastrando");
    }
    function up() {
      dragging = false;
      if (performance.now() - lastT > 80) vx = vy = 0; // se quedó quieto antes de soltar: sin inercia
      stage.classList.remove("lab-arrastrando");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    }

    // Rueda / trackpad: solo en pantalla completa (en la página, la rueda scrollea la página)
    function wheel(e) {
      if (!inmersivoRef.current) return;
      e.preventDefault();
      camX += e.deltaX * WHEEL;
      camY += e.deltaY * WHEEL;
    }

    stage.addEventListener("pointerdown", down);
    stage.addEventListener("wheel", wheel, { passive: false });

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      up();
      stage.removeEventListener("pointerdown", down);
      stage.removeEventListener("wheel", wheel);
    };
  }, []);

  // ─── Pantalla completa: bloquear el scroll de la página ───
  useEffect(() => {
    inmersivoRef.current = inmersivo;
    const bloquear = inmersivo || abierta;
    if (bloquear) lenis?.stop();
    else lenis?.start();
  }, [inmersivo, abierta, lenis]);

  // ─── Esc: cierra la pieza abierta, o sale de pantalla completa ───
  // (sin lista de dependencias: se vuelve a enganchar en cada render con los valores al día)
  useEffect(() => {
    function onKey(e) {
      if (e.key !== "Escape") return;
      if (abierta) setAbierta(null);
      else if (inmersivo) cambiarModo(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  function abrir(item) {
    // Si la pieza tiene página propia, se va con la cortina; si no, se abre en grande
    if (item.href) navegar(item.href);
    else setAbierta(item);
  }

  const boton =
    "text-lg font-medium cursor-pointer uppercase tracking-tighter text-black transition-colors duration-300 hover:text-rojo";

  return (
    <section ref={sectionRef} id="laboratorio" className="relative h-svh overflow-x-clip bg-white text-black">
      {/* En la página: "isolate" agrupa las capas del Laboratorio (título z-50, miniaturas
          z-0 a z-40) para que no compitan con el header (también z-50) y queden debajo.
          En pantalla completa: z-60, por encima del header a propósito. */}
      <div className={inmersivo ? "fixed inset-0 z-60 bg-white" : "absolute inset-0 isolate"}>
        {/* Lienzo */}
        <div
          ref={stageRef}
          className={`cursor-star absolute inset-0 overflow-hidden select-none ${
            inmersivo ? "touch-none" : "touch-pan-y"
          }`}
        >
          {PIEZAS.map(({ item, key, capa }) => (
            <button
              key={key}
              type="button"
              data-pieza
              onClick={() => abrir(item)}
              onPointerEnter={(e) => e.pointerType === "mouse" && tick()}
              aria-label={descripcion(item.descripcion)}
              className={`lab-pieza group absolute top-0 left-0 cursor-star will-change-transform hover:z-40 ${
                ["z-0", "z-10", "z-20"][capa]
              }`}
            >
              <span className="block size-full transition-transform duration-300 ease-out group-hover:scale-105">
                {item.tipo === "video" ? (
                  <video
                    src={item.src}
                    muted
                    loop
                    playsInline
                    preload="none"
                    className="pointer-events-none size-full object-cover"
                  />
                ) : (
                  <img
                    src={item.src}
                    alt=""
                    draggable={false}
                    decoding="async"
                    className="pointer-events-none size-full object-cover"
                  />
                )}
              </span>
              <span className="pointer-events-none absolute top-full left-0 w-max max-w-60 pt-4 text-left text-sm leading-tight tracking-tighter text-rojo opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                {descripcion(item.descripcion)}
              </span>
            </button>
          ))}
        </div>

        {/* Título fijo a la izquierda + botón entrar / salir */}
        <div className="pointer-events-none absolute top-1/2 left-4 z-50 -translate-y-1/2 xl:left-8">
          <h2 className="max-w-[6em] text-5xl leading-none font-medium tracking-tighter xl:text-6xl">
            {t(T.laboratorio)}
          </h2>
          <button
            type="button"
            onClick={() => cambiarModo(!inmersivo)}
            className={`pointer-events-auto mt-4 ${boton}`}
          >
            <span aria-hidden="true">{inmersivo ? "← " : "→ "}</span>
            {inmersivo ? t(T.salir) : t(T.entrar)}
          </button>
        </div>
      </div>

      {/* Pieza abierta en grande */}
      {abierta && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={descripcion(abierta.descripcion)}
          onClick={() => setAbierta(null)}
          className="fixed inset-0 z-70 flex animate-fade-in flex-col items-center justify-center gap-4 bg-white/95 p-4 [animation-delay:0s] [animation-duration:300ms]"
        >
          <button
            type="button"
            onClick={() => setAbierta(null)}
            // Arriba a la derecha (más cómodo para el pulgar). El padding agranda la zona
            // tocable y el margen negativo lo compensa para que el texto quede alineado.
            className={`absolute top-5 right-4 -m-3 p-3 xl:right-8 ${boton}`}
          >
            {t(T.cerrar)} <span aria-hidden="true">×</span>
          </button>
          {abierta.tipo === "video" ? (
            <video
              src={abierta.src}
              autoPlay
              loop
              controls
              playsInline
              onClick={(e) => e.stopPropagation()}
              className="max-h-[80svh] max-w-full"
            />
          ) : (
            <img
              src={abierta.src}
              alt={descripcion(abierta.descripcion)}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[80svh] max-w-full object-contain"
            />
          )}
          <p className="text-lg tracking-tighter">{descripcion(abierta.descripcion)}</p>
        </div>
      )}

      {/* Cortina roja de la transición.
          - absolute (NO fixed): ver cambiarModo, Safari de iPhone pintaba sus barras de rojo.
          - h-lvh: alto de la pantalla con las barras de Safari escondidas, para cubrir siempre.
          - transform: misma propiedad que anima la cortina (no usar -translate-x-full: se sumaría).
          - display: none mientras no anima. */}
      <div
        ref={cortinaRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-0 z-80 h-lvh w-full bg-rojo"
        style={{ top: 0, transform: "translateX(-100%)", display: "none" }}
      />
    </section>
  );
}

export default Laboratorio;
