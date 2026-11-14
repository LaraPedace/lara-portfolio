import { useEffect, useRef } from "react";

// Mismos caracteres y opacidades que el efecto del Hero
const CHARS = "&@+$%!?*#";
const LEVELS = [1, 1, 1, 1, 1, 1, 0.6, 0.35];

const SCRAMBLE_MS = 1000; // tiempo en que todo son caracteres random
const STEP_MS = 7; // cada letra se escribe 7ms después de la anterior (de izquierda a derecha)
const JITTER_MS = 250; // un poco de azar para que no sea una línea perfecta
const EVERY_MS = 55; // cada cuánto cambian los caracteres (igual que el Hero)

function random(list) {
  return list[Math.floor(Math.random() * list.length)];
}

// Texto que arranca como caracteres random y después se "escribe" letra por letra.
// - offset: posición de la primera letra, para encadenar varios textos (el segundo
//   empieza a escribirse cuando termina el primero).
// Cada carácter random se dibuja encima de la letra real (invisible), así el texto
// ocupa siempre el mismo lugar y las líneas no saltan.
// - animar: si es false, el texto aparece directo, sin efecto.
function ScrambleText({ text, offset = 0, className = "", animar = true }) {
  const ref = useRef(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const letters = [...ref.current.querySelectorAll("[data-letter]")].map((el) => ({
      real: el.firstChild,
      fake: el.lastChild,
    }));

    function reveal(letter) {
      letter.real.style.visibility = "visible";
      letter.fake.textContent = "";
    }

    if (reduce || !animar) {
      letters.forEach(reveal);
      return;
    }

    const resolveAt = letters.map(
      (_, i) => SCRAMBLE_MS + (offset + i) * STEP_MS + Math.random() * JITTER_MS,
    );
    const end = Math.max(...resolveAt);
    const pending = new Set(letters.keys());
    const start = performance.now();
    let last = -Infinity;
    let frame;

    function shuffle(letter) {
      letter.fake.textContent = random(CHARS);
      letter.fake.style.opacity = random(LEVELS);
    }

    letters.forEach(shuffle);

    function tick(now) {
      const t = now - start;
      if (now - last >= EVERY_MS) {
        last = now;
        for (const i of pending) {
          if (t >= resolveAt[i]) {
            reveal(letters[i]);
            pending.delete(i);
          } else if (Math.random() < 0.6) {
            shuffle(letters[i]);
          }
        }
      }
      if (t < end + EVERY_MS) frame = requestAnimationFrame(tick);
      else letters.forEach(reveal); // por las dudas, que quede todo escrito
    }
    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, [text, offset, animar]);

  const words = text.split(" ");

  return (
    <span ref={ref} className={className}>
      {/* Texto real para lectores de pantalla; lo visual se oculta */}
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, w) => (
          <span key={w}>
            <span className="whitespace-nowrap">
              {[...word].map((char, c) => (
                <span key={c} data-letter className="relative inline-block">
                  <span className="invisible">{char}</span>
                  <span className="absolute inset-0 flex items-center justify-center text-scramble font-normal text-rojo" />
                </span>
              ))}
            </span>
            {w < words.length - 1 && " "}
          </span>
        ))}
      </span>
    </span>
  );
}

export default ScrambleText;
