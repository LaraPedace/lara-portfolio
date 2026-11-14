import { useEffect, useRef, useState } from "react";
import ScrambleText from "./ScrambleText.jsx";
import "./Hero.css";

// "Scroll ↓" hace el efecto de caracteres random solo la primera vez que carga la página.
// Esta variable vive mientras la pestaña esté abierta: si vas a Info y volvés, ya no
// se repite; si recargás la página, sí.
let scrollYaAnimado = false;

// Dibujo de las letras: cada # es un carácter, cada . es un espacio vacío
const MASK = [
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
const COLS = MASK[0].length;
const ROWS = MASK.length;

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

// ─── Móvil: logo estirado que vuelve a su tamaño con el scroll (estilo monopol-magazin.de) ───
const ESTIRADO_ALTO = 0.88; // el logo estirado ocupa el 88% del alto visible (svh)
const ESTIRADO_HASTA = 0.65; // vuelve a tamaño normal al scrollear el 65% del alto visible
const ESTIRADO_MQ = "(max-width: 767px)"; // solo móvil

function Hero() {
  const laraRef = useRef(null);
  const dustRef = useRef(null);
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const canvasRef = useRef(null);
  const scrollTextRef = useRef(null);

  // Se decide una sola vez al montar si "Scroll ↓" se anima (y se marca como ya animado)
  const [animarScroll] = useState(() => !scrollYaAnimado);
  useEffect(() => {
    scrollYaAnimado = true;
  }, []);

  useEffect(() => {
    const root = laraRef.current;
    const dust = dustRef.current;
    const section = sectionRef.current;
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    const scrollText = scrollTextRef.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const movilMq = window.matchMedia(ESTIRADO_MQ);

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

    // ─── Móvil: logo estirado sin deformar los caracteres ───
    // Mientras está estirado, el logo se dibuja en un <canvas>: cada fila del dibujo se
    // repite en K filas de caracteres de tamaño normal, una debajo de otra. Al scrollear,
    // las filas se juntan y las que sobran se desvanecen hasta quedar una por fila; ahí el
    // canvas se esconde y vuelve a verse el logo normal (los <span>).
    // Por qué canvas: con ~8000 caracteres como elementos de la página, el celular se trababa.
    // Cada sub-fila se dibuja una vez en una imagen en memoria ("hoja"), y en cada cuadro
    // del scroll solo se estampan esas tiras en su lugar.
    const ctx = canvas.getContext("2d");
    const hoja = document.createElement("canvas");
    const hojaCtx = hoja.getContext("2d");
    const probe = document.createElement("div"); // medidor de 100svh (ver medir)
    probe.style.cssText =
      "position:absolute;top:0;left:0;width:0;height:100svh;visibility:hidden;pointer-events:none";
    document.body.appendChild(probe);

    let estirado = false; // modo móvil activo
    let enCanvas = false; // el logo se está mostrando en el canvas (todavía estirado)
    let K = 1; // sub-filas por fila del dibujo
    let escalaInicial = 1; // cuántas veces más alto arranca el logo
    let distancia = 1; // cuánto hay que scrollear para que vuelva a su tamaño
    let ancho = 0; // ancho del logo (px)
    let celda = 0; // ancho de una columna (px)
    let filaAlto = 0; // alto de una fila de caracteres (px)
    let dpr = 1;
    let fuente = "";
    let rojo = "#e30613";
    let visibles = 1; // sub-filas visibles por fila del dibujo
    let hojaCeldas = []; // celdas de la hoja: { x, fila (índice de tira) }
    let frame = null;

    // Dibuja un carácter random en la hoja (en su celda)
    function dibujarCelda(c) {
      const px = c.x * celda * dpr;
      const py = c.fila * filaAlto * dpr;
      hojaCtx.clearRect(px, py, celda * dpr, filaAlto * dpr);
      hojaCtx.globalAlpha = random(LEVELS);
      hojaCtx.fillText(random(CHARS), px + (celda * dpr) / 2, py + (filaAlto * dpr) / 2);
    }

    function prepararHoja() {
      hoja.width = Math.round(ancho * dpr);
      hoja.height = Math.round(ROWS * K * filaAlto * dpr);
      hojaCtx.font = fuente;
      hojaCtx.fillStyle = rojo;
      hojaCtx.textAlign = "center";
      hojaCtx.textBaseline = "middle";
      hojaCeldas = [];
      for (let m = 0; m < ROWS; m++) {
        for (let j = 0; j < K; j++) {
          for (const x of columnasSubFila(m, j)) {
            const c = { x, j, fila: m * K + j };
            hojaCeldas.push(c);
            dibujarCelda(c);
          }
        }
      }
    }

    // Qué columnas tienen carácter en la sub-fila j de la fila m del dibujo.
    // Si se repitiera la fila tal cual, las diagonales quedarían como escalones altos
    // (todo "cuadrado") y los bordes como líneas rectas que parecen un contorno. Por eso:
    // - las sub-filas intermedias corren los bordes de cada trazo de a poco hacia los de la
    //   fila siguiente (diagonales suaves);
    // - y mueven los bordes al azar ±1 carácter (bordes irregulares, sin línea).
    // La sub-fila 0 es exactamente la fila del dibujo: coincide con el logo normal.
    function columnasSubFila(m, j) {
      const actual = tramos(MASK[m]);
      if (j === 0) return llenar(actual, 0);
      const siguiente = m + 1 < ROWS ? tramos(MASK[m + 1]) : actual;
      const t = j / K;
      let bordes = actual;
      if (siguiente.length === actual.length) {
        bordes = actual.map(([a, b], i) => [
          a + (siguiente[i][0] - a) * t,
          b + (siguiente[i][1] - b) * t,
        ]);
      } else if (t >= 0.5) {
        bordes = siguiente; // cambia la forma (ej. se abre un hueco): se pasa a la siguiente
      }
      return llenar(bordes, 1);
    }

    // Tramos de "#" seguidos de una fila: [inicio, fin) en columnas
    function tramos(fila) {
      const lista = [];
      let inicio = -1;
      for (let x = 0; x <= fila.length; x++) {
        const lleno = fila[x] === "#";
        if (lleno && inicio < 0) inicio = x;
        if (!lleno && inicio >= 0) {
          lista.push([inicio, x]);
          inicio = -1;
        }
      }
      return lista;
    }

    // Columnas de cada tramo; "azar" mueve cada borde ±1 con algo de probabilidad
    function llenar(bordes, azar) {
      const cols = [];
      const mover = () => (azar && Math.random() < 0.35 ? (Math.random() < 0.5 ? -1 : 1) : 0);
      for (const [a, b] of bordes) {
        const desde = Math.max(0, Math.round(a) + mover());
        const hasta = Math.min(COLS, Math.round(b) + mover());
        for (let x = desde; x < hasta; x++) cols.push(x);
      }
      return cols;
    }

    function medir() {
      estirado = movilMq.matches && !reduce;
      section.classList.toggle("hero-estirado", estirado);
      stage.style.transform = "";
      if (!estirado) {
        mostrarCanvas(false);
        return;
      }

      // El logo arranca justo debajo del header
      const header = document.querySelector("header");
      const top = (header ? header.offsetHeight : 52) + 12;
      section.style.setProperty("--hero-top", `${top}px`);

      // 100svh = alto visible con las barras del navegador abiertas: no cambia cuando la
      // barra de Safari aparece o se esconde, así el logo no salta.
      const svh = probe.offsetHeight;
      ancho = stage.offsetWidth;
      celda = ancho / COLS;
      filaAlto = celda / 0.735; // igual que en Hero.css
      const altoNormal = filaAlto * ROWS;
      // Alto estirado: 88% de la pantalla, pero sin tapar "Scroll ↓"
      const limite = Math.min(svh * ESTIRADO_ALTO, scrollText.offsetTop - 16 - top);
      escalaInicial = Math.max(1, limite / altoNormal);
      distancia = svh * ESTIRADO_HASTA;
      K = Math.max(1, Math.ceil(escalaInicial));

      // Misma letra que el logo normal
      const estilo = getComputedStyle(root);
      dpr = Math.min(3, window.devicePixelRatio || 1);
      fuente = `${estilo.fontWeight} ${parseFloat(estilo.fontSize) * dpr}px ${estilo.fontFamily}`;
      rojo = estilo.color;

      canvas.width = Math.round(ancho * dpr);
      canvas.height = Math.round(altoNormal * escalaInicial * dpr);
      canvas.style.width = `${ancho}px`;
      canvas.style.height = `${altoNormal * escalaInicial}px`;
      prepararHoja();
      actualizar();
    }

    function mostrarCanvas(si) {
      if (si === enCanvas) return;
      enCanvas = si;
      canvas.style.display = si ? "block" : "none";
      root.style.visibility = si ? "hidden" : "";
      if (si) clear(); // mientras está en el canvas, los caracteres no se dispersan
    }

    // Estampa las sub-filas en su lugar según el scroll
    function actualizar() {
      frame = null;
      if (!estirado) return;
      const y = Math.max(0, window.scrollY);
      const progreso = Math.min(1, y / distancia);
      const escala = escalaInicial + (1 - escalaInicial) * progreso;

      // Mientras se encoge, el logo queda quieto arriba (compensa el scroll); cuando llega
      // a su tamaño normal, se va con la página. Como el borde de abajo del logo y el
      // comienzo de la sección siguiente se mueven en línea recta, nunca se tocan.
      stage.style.transform = `translateY(${Math.min(y, distancia).toFixed(1)}px)`;

      if (progreso >= 1 || escalaInicial <= 1) {
        mostrarCanvas(false);
        return;
      }
      mostrarCanvas(true);

      // Cuántas sub-filas se ven por fila del dibujo: K arriba de todo, 1 al final.
      // Se reparten el alto de cada fila estirada; la última va apareciendo/desvaneciéndose.
      visibles = 1 + ((K - 1) * (escala - 1)) / (escalaInicial - 1);
      const paso = (filaAlto * escala) / visibles;
      const tiraAlto = filaAlto * dpr;
      const hastaJ = Math.min(K, Math.ceil(visibles));

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let m = 0; m < ROWS; m++) {
        for (let j = 0; j < hastaJ; j++) {
          ctx.globalAlpha = Math.min(1, visibles - j);
          const destino = Math.round((m * filaAlto * escala + j * paso) * dpr);
          ctx.drawImage(hoja, 0, (m * K + j) * tiraAlto, hoja.width, tiraAlto, 0, destino, hoja.width, tiraAlto);
        }
      }
      ctx.globalAlpha = 1;
    }

    function onScrollEstirado() {
      if (estirado && !frame) frame = requestAnimationFrame(actualizar);
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
      if (enCanvas) {
        // Estirado: se cambian caracteres de las sub-filas que se ven, en la hoja
        const hastaJ = Math.min(K, Math.ceil(visibles));
        for (let i = 0; i < amount; i++) {
          const c = random(hojaCeldas);
          if (c.j < hastaJ) dibujarCelda(c);
        }
        if (!frame) frame = requestAnimationFrame(actualizar);
      } else {
        for (let i = 0; i < amount; i++) shuffle(random(cells).el);
      }
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
      if (!visible || enCanvas) return; // fuera de pantalla o estirado: no se calcula nada
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

    // Arrancar el estirado (cuando la tipografía ya cargó, para dibujarla bien en el canvas)
    medir();
    document.fonts?.ready.then(() => estirado && medir());
    window.addEventListener("scroll", onScrollEstirado, { passive: true });
    window.addEventListener("resize", medir);
    movilMq.addEventListener("change", medir);

    // 5. Limpieza: se ejecuta si el componente desaparece de la página
    return () => {
      clearInterval(timer);
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", clear);
      window.removeEventListener("blur", clear);
      window.removeEventListener("scroll", ask);
      document.documentElement.removeEventListener("pointerleave", clear);
      window.removeEventListener("scroll", onScrollEstirado);
      window.removeEventListener("resize", medir);
      movilMq.removeEventListener("change", medir);
      probe.remove();
      section.classList.remove("hero-estirado");
      stage.style.transform = "";
      root.style.visibility = "";
      root.innerHTML = "";
      dust.innerHTML = "";
    };
  }, []);

  return (
    <section ref={sectionRef} className="hero relative flex h-screen items-center justify-center overflow-hidden bg-white px-4 xl:px-8">
      <div ref={dustRef} className="hero-dust font-grotesk" aria-hidden="true"></div>
      <div ref={stageRef} className="hero-stage relative font-grotesk">
        <h1 ref={laraRef} className="hero-lara" aria-label="Lara"></h1>
        {/* Móvil: logo estirado (se dibuja desde Hero.jsx; oculto en desktop) */}
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-0"
          style={{ display: "none" }}
        />
      </div>
      <p ref={scrollTextRef} className="absolute bottom-19 xl:bottom-5 w-full text-center text-base xl:text-base font-bold text-rojo ">
        <ScrambleText text="Scroll ↓" animar={animarScroll} />
      </p>
    </section>
  );
}

export default Hero;
