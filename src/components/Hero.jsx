import { useEffect, useLayoutEffect, useRef, useState } from "react";
import ScrambleText from "./ScrambleText.jsx";
import star from "../assets/img/STAR.svg";
import "./Hero.css";

// "Scroll ↓" hace el efecto de caracteres random solo la primera vez que carga la página.
// Esta variable vive mientras la pestaña esté abierta: si vas a Info y volvés, ya no
// se repite; si recargás la página, sí.
// El texto del Hero (desktop) usa la misma regla para su entrada.
let scrollYaAnimado = false;

// ─── Entrada del texto la primera vez que carga la página ───
// "Hola, Soy Diseñadora Integral" aparece pegado al borde izquierdo del logo y
// "Buenos Aires, 2026©" al derecho (con un fundido); después los dos se deslizan
// hasta su lugar, en el centro.
const INTRO_MQ = "(min-width: 48rem)"; // desde md, igual que en Hero.css
const INTRO_FADE = 800; // fundido (ms)
const INTRO_PAUSA = 250; // quietos en los bordes (ms)
const INTRO_MOVER = 1300; // viaje al centro (ms)
const INTRO_DEMORA = 200; // espera antes de arrancar (ms)
const INTRO_EASING = "cubic-bezier(0.65, 0, 0.35, 1)"; // arranca y frena suave
// Móvil: el texto de arriba y de abajo de la estrella solo aparece con un fundido
const MOVIL_FADE = 1200; // ms
const MOVIL_ESCALON = 250; // "Buenos Aires" arranca un poquito después (ms)

// Dibujo de las letras: cada # es un carácter, cada . es un espacio vacío
const MASK_LARA = [
  "#######.........................#########.............################...................#########........",
  "#######........................##########.............###################................#########........",
  "#######........................##########.............####################..............###########.......",
  "#######.......................############............#####################.............###########.......",
  "#######.......................############............######.......#########...........#############......",
  "#######......................##############...........######.........#######...........#############......",
  "#######......................#######.######...........######..........#######.........#######.#######.....",
  "#######.....................#######..#######..........######..........#######.........#######.#######.....",
  "#######.....................#######..#######..........######..........#######........#######...#######....",
  "#######.....................######....#######.........######.........#######.........#######...#######....",
  "#######....................#######....#######.........######################........#######.....#######...",
  "#######....................#######.....#######........#####################.........#######.....#######...",
  "#######...................#######......#######........####################.........#######......########..",
  "#######...................#####################.......##################...........#####################..",
  "#######..................######################.......##################..........######################..",
  "#######..................#######################......######......#######.........#######################.",
  "#######.................########################......######......########.......########################.",
  "#######.................#######..........########.....######.......#######.......#######...........#######",
  "####################...#######............#######.....######........#######.....########...........#######",
  "####################...#######............########....######.........#######....#######.............######",
  "####################..#######..............#######....######.........########...#######.............######",
  "####################..#######..............#######....######..........#######..#######..............######",
];

// Móvil: en vez de LARA, la estrella del header (sale de STAR.svg pasada a esta grilla)
const MASK_ESTRELLA = [
  ".........................#.........................",
  "........................###........................",
  "........................###........................",
  "........................###........................",
  "........................###........................",
  ".......................#####.......................",
  ".......................#####.......................",
  ".......................#####.......................",
  ".......................#####.......................",
  ".......................#####.......................",
  "##....................#######....................##",
  "#####.................#######.................#####",
  "..#######.............#######.............#######..",
  "...##########.........#######.........##########...",
  ".....###########.....#########.....###########.....",
  ".......#############.#########.#############.......",
  "........###################################........",
  "..........###############################..........",
  "............###########################............",
  ".............#########################.............",
  "...............#####################...............",
  "................###################................",
  "...............#####################...............",
  ".............#########################.............",
  "............###########################............",
  "..........###############################..........",
  "........###################################........",
  ".......#############.#########.#############.......",
  ".....###########.....#########.....###########.....",
  "....#########.........#######.........#########....",
  "..#######.............#######.............#######..",
  "######................#######................######",
  "##....................#######....................##",
  ".......................#####.......................",
  ".......................#####.......................",
  ".......................#####.......................",
  ".......................#####.......................",
  ".......................#####.......................",
  "........................###........................",
  "........................###........................",
  "........................###........................",
  "........................###........................",
  ".........................#.........................",
];

const MOVIL_MQ = "(max-width: 767px)"; // igual que md en Tailwind

// Caracteres que van apareciendo
const CHARS = "&@+$%!?*#";

// Opacidades posibles (la mayoría 1, algunas más transparentes)
const LEVELS = [1, 1, 1, 1, 1, 1, 1, 1, 1, 0.6, 0.35, 0.16];

// Elige un elemento al azar de una lista
function random(list) {
  return list[Math.floor(Math.random() * list.length)];
}

// Le pone a un elemento un carácter y una opacidad al azar
function shuffle(el) {
  el.textContent = random(CHARS);
  el.style.setProperty("--o", random(LEVELS));
}

function Hero() {
  const laraRef = useRef(null);
  const dustRef = useRef(null);
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const saludoRef = useRef(null);
  const lugarRef = useRef(null);

  // Móvil → estrella; desktop → LARA. Si cambia el ancho de la ventana, se rearma.
  const [esMovil, setEsMovil] = useState(() => window.matchMedia(MOVIL_MQ).matches);
  useEffect(() => {
    const mq = window.matchMedia(MOVIL_MQ);
    const cambiar = () => setEsMovil(mq.matches);
    mq.addEventListener("change", cambiar);
    return () => mq.removeEventListener("change", cambiar);
  }, []);
  const MASK = esMovil ? MASK_ESTRELLA : MASK_LARA;
  const COLS = MASK[0].length;
  const ROWS = MASK.length;

  // Se decide una sola vez al montar si "Scroll ↓" se anima (y se marca como ya animado)
  const [animarScroll] = useState(() => !scrollYaAnimado);
  useEffect(() => {
    scrollYaAnimado = true;
  }, []);

  // Entrada del texto (primera carga; en desktop además se mueve al centro). Es un layout effect para esconder el
  // texto antes de que se dibuje la página, así no aparece un instante en el centro.
  useLayoutEffect(() => {
    if (!animarScroll) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const textos = [saludoRef.current, lugarRef.current];

    // Móvil: solo un fundido suave (primero el saludo, apenas después "Buenos Aires")
    if (!window.matchMedia(INTRO_MQ).matches) {
      const fundidos = textos.map((el, i) =>
        el.animate([{ opacity: 0 }, { opacity: 1 }], {
          duration: MOVIL_FADE,
          delay: INTRO_DEMORA + i * MOVIL_ESCALON,
          easing: "ease-out",
          fill: "backwards",
        }),
      );
      return () => fundidos.forEach((a) => a.cancel());
    }

    textos.forEach((el) => (el.style.opacity = "0"));
    let animaciones = [];
    let cancelado = false;

    // Se mide cuando la tipografía ya cargó (el ancho del texto cambia con la letra)
    document.fonts.ready.then(() => {
      if (cancelado) return;
      const logo = stageRef.current.getBoundingClientRect();
      const saludo = saludoRef.current.getBoundingClientRect();
      const lugar = lugarRef.current.getBoundingClientRect();
      const desde = [logo.left - saludo.left, logo.right - lugar.right]; // px hasta cada borde

      const total = INTRO_FADE + INTRO_PAUSA + INTRO_MOVER;
      const finFade = INTRO_FADE / total;
      const finPausa = (INTRO_FADE + INTRO_PAUSA) / total;
      animaciones = textos.map((el, i) => {
        const x = `translateX(${desde[i]}px)`;
        return el.animate(
          [
            { opacity: 0, transform: x, easing: "ease-out" },
            { opacity: 1, transform: x, offset: finFade },
            { opacity: 1, transform: x, offset: finPausa, easing: INTRO_EASING },
            { opacity: 1, transform: "translateX(0)" },
          ],
          { duration: total, delay: INTRO_DEMORA, fill: "backwards" },
        );
      });
      textos.forEach((el) => (el.style.opacity = ""));
    });

    return () => {
      cancelado = true;
      animaciones.forEach((a) => a.cancel());
      textos.forEach((el) => (el.style.opacity = ""));
    };
  }, [animarScroll]);

  useEffect(() => {
    const root = laraRef.current;
    const dust = dustRef.current;
    const section = sectionRef.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // 1. Crear un <span> por cada # del dibujo (el logo normal)
    const cells = [];
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        if (MASK[y][x] !== "#") continue;

        const span = document.createElement("span");
        span.className = "hero-char";
        span.setAttribute("aria-hidden", "true");
        span.style.gridArea = `${y + 1} / ${x + 1}`;
        shuffle(span);
        root.appendChild(span);

        cells.push({
          el: span,
          x: x + 0.5,
          y: y + 0.5,
          a: (Math.random() - 0.5) * 1.1, // desvío del ángulo
          k: 0.55 + Math.random() * 0.9, // cuánto se aleja
          r: (Math.random() - 0.5) * 70, // cuánto gira
          away: false,
        });
      }
    }

    // 2. Crear los caracteres sueltos del fondo
    const motes = [];
    function place(mote) {
      mote.style.left = 2 + Math.random() * 96 + "%";
      mote.style.top = 3 + Math.random() * 94 + "%";
      mote.textContent = random(CHARS);
      mote.style.setProperty("--o", (0.15 + Math.random() * 0.35).toFixed(2));
    }
    for (let i = 0; i < 22; i++) {
      const mote = document.createElement("span");
      place(mote);
      dust.appendChild(mote);
      motes.push(mote);
    }

    // 3. Parpadeo: cada 55ms cambia el 9% de los caracteres.
    //    Solo corre mientras el Hero se ve en pantalla (si no, gasta recursos y traba el scroll).
    const every = reduce ? 500 : 55;
    const share = reduce ? 0.04 : 0.09;
    let timer = null;
    function flicker() {
      const amount = Math.round(cells.length * share);
      for (let i = 0; i < amount; i++) shuffle(random(cells).el);
      if (Math.random() < (reduce ? 0.3 : 0.12)) place(random(motes));
    }

    let visible = false;
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !timer) timer = setInterval(flicker, every);
      if (!visible && timer) {
        clearInterval(timer);
        timer = null;
      }
    });
    observer.observe(section);

    // 4. Dispersión: los caracteres cerca del mouse se alejan
    let mouseX = null;
    let mouseY = null;
    let queued = false;
    let awayCount = 0; // cuántos caracteres están desplazados ahora

    function apply() {
      queued = false;
      // Sin mouse y sin caracteres desplazados no hay nada que hacer
      if (mouseX === null && awayCount === 0) return;
      const box = root.getBoundingClientRect();
      const cellWidth = box.width / COLS;
      const cellHeight = box.height / ROWS;
      const radius = box.width * 0.085; // tamaño de la zona que afecta el mouse

      for (const cell of cells) {
        let hit = false;

        if (mouseX !== null) {
          const dx = box.left + cell.x * cellWidth - mouseX;
          const dy = box.top + cell.y * cellHeight - mouseY;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < radius) {
            hit = true;
            const force = 1 - distance / radius;
            const push = force * force * radius * 0.55 * cell.k;
            const angle = Math.atan2(dy, dx) + cell.a * force;
            cell.el.style.setProperty("--dx", (Math.cos(angle) * push).toFixed(1) + "px");
            cell.el.style.setProperty("--dy", (Math.sin(angle) * push).toFixed(1) + "px");
            cell.el.style.setProperty("--r", (cell.r * force).toFixed(1) + "deg");
            if (!cell.away) {
              cell.away = true;
              awayCount++;
              cell.el.classList.add("away");
            }
          }
        }

        // Si el mouse ya no está cerca, el carácter vuelve a su lugar
        if (!hit && cell.away) {
          cell.away = false;
          awayCount--;
          cell.el.classList.remove("away");
          cell.el.style.removeProperty("--dx");
          cell.el.style.removeProperty("--dy");
          cell.el.style.removeProperty("--r");
        }
      }
    }

    function ask() {
      if (!visible) return; // fuera de pantalla: no se calcula nada
      if (!queued) {
        queued = true;
        requestAnimationFrame(apply);
      }
    }
    function move(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      ask();
    }
    function clear() {
      mouseX = null;
      mouseY = null;
      if (!queued) {
        queued = true;
        requestAnimationFrame(apply);
      }
    }
    function up(e) {
      if (e.pointerType !== "mouse") clear();
    }

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerdown", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", clear);
    window.addEventListener("blur", clear);
    window.addEventListener("scroll", ask, { passive: true });
    document.documentElement.addEventListener("pointerleave", clear);

    // 5. Limpieza: se ejecuta si el componente desaparece de la página
    return () => {
      clearInterval(timer);
      observer.disconnect();
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", clear);
      window.removeEventListener("blur", clear);
      window.removeEventListener("scroll", ask);
      document.documentElement.removeEventListener("pointerleave", clear);
      root.innerHTML = "";
      dust.innerHTML = "";
    };
  }, [MASK, COLS, ROWS]);

  return (
    <section ref={sectionRef} style={{ "--cols": COLS }} className="hero relative flex h-screen items-center justify-center overflow-hidden bg-white px-4 xl:px-8">
      <div ref={dustRef} className="hero-dust font-grotesk" aria-hidden="true"></div>
      {/* Móvil: saludo arriba del logo y "Buenos Aires" abajo a la derecha.
          Desktop: todo el texto junto, centrado encima del logo (ver .hero-contenido en Hero.css) */}
      <div className="hero-contenido font-grotesk">
        <p ref={saludoRef} className="hero-saludo text-hero-sm font-bold md:text-3xl">
          Hola,
          <br />
          Soy Diseñadora Integral
        </p>
        <div ref={stageRef} className="hero-stage relative">
          <h1 ref={laraRef} className="hero-lara" aria-label="Lara"></h1>
        </div>
        <p ref={lugarRef} className="hero-lugar text-right text-hero-sm font-bold md:text-3xl">
          <span className="text-rojo">
            <span
              aria-hidden="true"
              className="hero-estrella bg-rojo"
              style={{ maskImage: `url("${star}")`, WebkitMaskImage: `url("${star}")` }}
            />
            Buenos Aires,
          </span>
          <br />
          2026©
        </p>
      </div>
      <p className="absolute bottom-12 xl:bottom-5 w-full text-center text-base xl:text-base font-bold text-rojo ">
        <ScrambleText text="Scroll ↓" animar={animarScroll} />
      </p>
    </section>
  );
}

export default Hero;
