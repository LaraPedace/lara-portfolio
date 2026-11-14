import { useEffect, useRef, useState } from "react";
import "./Hero.css"; // reutiliza .hero-char (dispersión con rebote, igual que el Hero)

// Mismos caracteres que el Hero
const CHARS = "&@+$%!?*#";
const FLICKER = [1, 1, 1, 0.55]; // variación de opacidad al parpadear

// Grilla de caracteres: 36 columnas; las filas salen de la proporción de la foto (255/268)
// y de la proporción de cada celda (igual que en el Hero: alto = ancho / 0.735)
const COLS = 36;
const ROWS = Math.round(COLS * (268 / 255) * 0.735);

function random(list) {
  return list[Math.floor(Math.random() * list.length)];
}

// Foto que, al pasar el mouse, se desarma en caracteres rojos.
// Cada carácter tiene la opacidad según lo oscuro de esa zona de la foto,
// así se sigue reconociendo la imagen. Los caracteres cerca del mouse se alejan.
function PhotoScramble({ src, alt, className = "" }) {
  const wrapRef = useRef(null);
  const gridRef = useRef(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    const grid = gridRef.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cells = [];
    let cancelled = false;

    // 1. Leer la foto en baja resolución (una celda = un píxel) y crear los caracteres
    const img = new Image();
    img.src = src;
    img
      .decode()
      .then(() => {
        if (cancelled) return;
        const canvas = document.createElement("canvas");
        canvas.width = COLS;
        canvas.height = ROWS;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        ctx.drawImage(img, 0, 0, COLS, ROWS);
        const data = ctx.getImageData(0, 0, COLS, ROWS).data;

        // Luminosidad de cada celda (0 = negro, 1 = blanco)
        const lights = [];
        for (let i = 0; i < data.length; i += 4) {
          lights.push((0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) / 255);
        }
        // Se estira el contraste: lo más oscuro de la foto pasa a 0 y lo más claro a 1
        const min = Math.min(...lights);
        const max = Math.max(...lights);

        for (let y = 0; y < ROWS; y++) {
          for (let x = 0; x < COLS; x++) {
            const light = (lights[y * COLS + x] - min) / (max - min || 1);
            // Oscuro = carácter opaco; las zonas más claras quedan vacías para que se lea la cara
            const shade = Math.pow(1 - light, 1.4);
            const base = shade < 0.12 ? 0 : shade;

            const span = document.createElement("span");
            span.className = "hero-char";
            span.style.gridArea = `${y + 1} / ${x + 1}`;
            grid.appendChild(span);

            const cell = {
              el: span,
              base,
              x: x + 0.5,
              y: y + 0.5,
              a: (Math.random() - 0.5) * 1.1, // desvío del ángulo
              k: 0.55 + Math.random() * 0.9, // cuánto se aleja
              r: (Math.random() - 0.5) * 70, // cuánto gira
              away: false,
            };
            shuffle(cell);
            cells.push(cell);
          }
        }
      })
      .catch(() => {});

    function shuffle(cell) {
      cell.el.textContent = random(CHARS);
      cell.el.style.setProperty("--o", (cell.base * random(FLICKER)).toFixed(2));
    }

    // 2. Parpadeo (solo mientras el mouse está encima)
    let timer = null;
    function flicker() {
      const amount = Math.round(cells.length * (reduce ? 0.04 : 0.12));
      for (let i = 0; i < amount; i++) shuffle(random(cells));
    }

    // 3. Dispersión alrededor del mouse (misma lógica que el Hero)
    let mouseX = null;
    let mouseY = null;
    let queued = false;
    let awayCount = 0;

    function apply() {
      queued = false;
      if (mouseX === null && awayCount === 0) return;
      const box = grid.getBoundingClientRect();
      const cellWidth = box.width / COLS;
      const cellHeight = box.height / ROWS;
      const radius = box.width * 0.22; // zona que afecta el mouse

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
      if (!queued) {
        queued = true;
        requestAnimationFrame(apply);
      }
    }

    // 4. Entrar / mover / salir con el mouse
    function enter(e) {
      if (e.pointerType !== "mouse") return;
      setActive(true);
      if (!timer) timer = setInterval(flicker, reduce ? 500 : 55);
    }
    function move(e) {
      if (e.pointerType !== "mouse") return;
      mouseX = e.clientX;
      mouseY = e.clientY;
      ask();
    }
    function leave() {
      setActive(false);
      clearInterval(timer);
      timer = null;
      mouseX = null;
      mouseY = null;
      ask(); // los caracteres vuelven a su lugar mientras se desvanecen
    }

    wrap.addEventListener("pointerenter", enter);
    wrap.addEventListener("pointermove", move);
    wrap.addEventListener("pointerleave", leave);

    return () => {
      cancelled = true;
      clearInterval(timer);
      wrap.removeEventListener("pointerenter", enter);
      wrap.removeEventListener("pointermove", move);
      wrap.removeEventListener("pointerleave", leave);
      grid.innerHTML = "";
    };
  }, [src]);

  return (
    <div ref={wrapRef} className={`relative @container ${className}`}>
      <img
        src={src}
        alt={alt}
        className={`size-full object-cover transition-opacity duration-300 ${active ? "opacity-0" : ""}`}
      />
      <div
        ref={gridRef}
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 grid font-normal leading-none tracking-normal text-rojo select-none transition-opacity duration-300 ${
          active ? "opacity-100" : "opacity-0"
        }`}
        style={{
          gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${ROWS}, minmax(0, 1fr))`,
          fontSize: `calc(100cqw / ${COLS} / 0.602)`,
        }}
      />
    </div>
  );
}

export default PhotoScramble;
