import { useEffect, useLayoutEffect, useRef, useState } from "react";
import ScrambleText from "./ScrambleText.jsx";
import star from "../assets/img/STAR.svg";
import { esperarPreloader, preloaderActivo } from "./preloaderEstado.js";
import { animarLogo } from "./logoCaracteres.js";
import { useIdioma } from "../i18n/idiomaContext.js";
import { T } from "../i18n/textos.js";
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

function Hero() {
  const laraRef = useRef(null);
  const { t } = useIdioma();
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

  // Se decide una sola vez al montar si "Scroll ↓" se anima (y se marca como ya animado)
  const [animarScroll] = useState(() => !scrollYaAnimado);
  // Si hay preloader, "Scroll ↓" y la entrada del texto esperan a que termine
  const [preloaderListo, setPreloaderListo] = useState(!preloaderActivo);
  useEffect(() => {
    let activo = true;
    esperarPreloader().then(() => activo && setPreloaderListo(true));
    return () => {
      activo = false;
    };
  }, []);
  useEffect(() => {
    scrollYaAnimado = true;
  }, []);

  // Entrada del texto (primera carga; en desktop además se mueve al centro). Es un layout
  // effect para esconder el texto antes de que se dibuje la página, así no aparece un
  // instante en el centro.
  useLayoutEffect(() => {
    if (!animarScroll) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const textos = [saludoRef.current, lugarRef.current];
    // Escondido hasta que arranque (si hay preloader, recién cuando llega a 100%)
    textos.forEach((el) => (el.style.opacity = "0"));
    let animaciones = [];
    let cancelado = false;

    // Se mide cuando la tipografía ya cargó (el ancho del texto cambia con la letra)
    Promise.all([esperarPreloader(), document.fonts.ready]).then(() => {
      if (cancelado) return;

      // Móvil: solo un fundido suave (primero el saludo, apenas después "Buenos Aires")
      if (!window.matchMedia(INTRO_MQ).matches) {
        animaciones = textos.map((el, i) =>
          el.animate([{ opacity: 0 }, { opacity: 1 }], {
            duration: MOVIL_FADE,
            delay: INTRO_DEMORA + i * MOVIL_ESCALON,
            easing: "ease-out",
            fill: "backwards",
          }),
        );
        textos.forEach((el) => (el.style.opacity = ""));
        return;
      }

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

  useEffect(
    () =>
      animarLogo({
        root: laraRef.current,
        dust: dustRef.current,
        section: sectionRef.current,
        mask: MASK,
      }),
    [MASK],
  );

  return (
    <section ref={sectionRef} style={{ "--cols": COLS }} className="hero relative flex h-screen items-center justify-center overflow-hidden bg-white px-4 xl:px-8">
      <div ref={dustRef} className="hero-dust font-grotesk" aria-hidden="true"></div>
      {/* Móvil: saludo arriba del logo y "Buenos Aires" abajo a la derecha.
          Desktop: todo el texto junto, centrado encima del logo (ver .hero-contenido en Hero.css) */}
      <div className="hero-contenido font-grotesk">
        <p ref={saludoRef} className="hero-saludo text-hero-sm font-bold md:text-3xl">
          {t(T.hola)}
          <br />
          {t(T.soyDisenadora)}
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
        {/* Con preloader, aparece (y se anima) recién cuando el preloader termina */}
        {preloaderListo && <ScrambleText text="Scroll ↓" animar={animarScroll} />}
      </p>
    </section>
  );
}

export default Hero;
