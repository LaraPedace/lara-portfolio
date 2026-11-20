import { useEffect, useState } from "react";
import { IdiomaContext, useIdioma } from "./idiomaContext.js";

const GUARDADO = "idioma"; // clave en localStorage: se recuerda la elección

function idiomaInicial() {
  try {
    const guardado = localStorage.getItem(GUARDADO);
    if (guardado === "es" || guardado === "en") return guardado;
  } catch {
    // sin localStorage (navegación privada, etc.): español
  }
  return "es";
}

// Envuelve todo el sitio. Siempre arranca en español (así lo ve Google) salvo que la
// persona ya haya elegido inglés antes.
export function IdiomaProvider({ children }) {
  const [idioma, setIdioma] = useState(idiomaInicial);

  useEffect(() => {
    document.documentElement.lang = idioma;
    try {
      localStorage.setItem(GUARDADO, idioma);
    } catch {
      // no pasa nada: se vuelve a español en la próxima visita
    }
  }, [idioma]);

  return <IdiomaContext.Provider value={{ idioma, setIdioma }}>{children}</IdiomaContext.Provider>;
}

const OPCIONES = [
  { valor: "es", etiqueta: "ESP", nombre: "Español" },
  { valor: "en", etiqueta: "ENG", nombre: "English" },
];

// Botón ESP | ENG fijo abajo a la derecha. Con mix-blend-difference se ve sobre
// fondos blancos (negro), negros (blanco) y sobre imágenes.
export function SelectorIdioma() {
  const { idioma, setIdioma } = useIdioma();
  return (
    <div
      role="group"
      aria-label={idioma === "es" ? "Idioma" : "Language"}
      className="fixed right-4 bottom-4 z-40 flex items-center gap-1.5 text-sm font-bold text-white uppercase mix-blend-difference xl:right-8 xl:bottom-5 xl:text-base"
    >
      {OPCIONES.map((o, i) => (
        <span key={o.valor} className="flex items-center gap-1.5">
          {i > 0 && <span aria-hidden="true">|</span>}
          <button
            type="button"
            lang={o.valor}
            aria-label={o.nombre}
            aria-pressed={idioma === o.valor}
            onClick={() => setIdioma(o.valor)}
            className={`cursor-pointer transition-opacity duration-300 hover:opacity-100 ${
              idioma === o.valor ? "opacity-100" : "opacity-40"
            }`}
          >
            {o.etiqueta}
          </button>
        </span>
      ))}
    </div>
  );
}
