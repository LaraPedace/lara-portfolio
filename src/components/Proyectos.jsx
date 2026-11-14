import { useState, useRef, useEffect } from "react";
import { proyectos } from "../data/proyectos.js";
import "./Proyectos.css";

const VISTAS = ["lista", "grilla"];
const FADE_MS = 250; // duración del fundido al cambiar de vista

// Móvil/tablet: tarjetas apiladas (siempre igual).
// Desktop (lg): se puede elegir entre
//   - lista: una fila por proyecto (nombre a la izquierda; imagen y descripción a la derecha)
//   - grilla: tarjetas en 3 columnas
function Proyectos() {
  const [vista, setVista] = useState("lista");
  const [visible, setVisible] = useState(true);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  // Primero se desvanece, cambia de vista y vuelve a aparecer
  function cambiarVista(nueva) {
    if (nueva === vista) return;
    clearTimeout(timer.current);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVista(nueva);
      return;
    }
    setVisible(false);
    timer.current = setTimeout(() => {
      setVista(nueva);
      setVisible(true);
    }, FADE_MS);
  }

  const lista = vista === "lista";

  return (
    <section id="proyectos" className="bg-white px-4 pt-40 pb-40 text-black md:pt-12 xl:px-8">
      <h2 className="text-6xl font-medium tracking-tighter">Proyectos Seleccionados</h2>

      {/* Selector de vista: solo en desktop */}
      <div role="group" aria-label="Forma de ver los proyectos" className="mt-4 hidden gap-4.5 lg:flex">
        {VISTAS.map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => cambiarVista(v)}
            aria-pressed={vista === v}
            className={`text-lg font-medium cursor-pointer uppercase tracking-tighter transition-colors duration-300 ${
              vista === v ? "text-black hover:text-rojo" : "text-black/25 hover:text-rojo"
            }`}
          >
            {vista === v && <span aria-hidden="true">↓ </span>}
            {v}
          </button>
        ))}
      </div>

      <ul
        style={{ transitionDuration: `${FADE_MS}ms` }}
        className={`mt-3.75 grid grid-cols-1 gap-y-7 transition-opacity ease-out md:mt-8.25 md:grid-cols-2 md:gap-x-5 md:gap-y-14 ${
          visible ? "opacity-100" : "opacity-0"
        } ${
          lista
            ? "lg:mt-4 lg:grid-cols-1 lg:gap-y-0 lg:border-b lg:border-black/20"
            : "lg:mt-8.25 lg:grid-cols-3"
        }`}
      >
        {proyectos.map((proyecto) => (
          <li key={proyecto.id} className={lista ? "lg:border-t lg:border-black/20" : ""}>
            <a
              href={`/proyectos/${proyecto.id}`}
              className={`group flex flex-col transition-colors duration-300 hover:text-rojo ${
                lista ? "lg:grid lg:grid-cols-12 lg:gap-x-5 lg:pt-4.75 lg:pb-12.5" : ""
              }`}
            >
              {/* Imagen. En lista: el contenedor de afuera reserva el lugar
                  y el de adentro aparece con un fundido al scrollear */}
              <div className={lista ? "lg:col-span-5 lg:col-start-8 lg:aspect-project-row" : ""}>
                <div
                  className={`group/img aspect-square cursor-star overflow-hidden ${
                    lista ? "proyecto-aparece lg:aspect-auto lg:size-full" : "xl:aspect-card"
                  }`}
                >
                  <img
                    src={proyecto.preview}
                    alt={proyecto.titulo}
                    loading="lazy"
                    decoding="async"
                    className="size-full object-cover transition duration-500 ease-out group-hover/img:scale-105 group-hover/img:blur-sm motion-reduce:transition-none"
                  />
                </div>
              </div>

              <div className={lista ? "lg:col-span-7 lg:row-start-1 lg:mt-5.25" : ""}>
                <h3 className={`mt-2 text-4xl font-medium tracking-tighter md:mt-3 ${lista ? "lg:mt-0" : ""}`}>
                  {proyecto.titulo}
                </h3>
                <p className="tracking-tighter md:text-lg">{proyecto.categoria}</p>
              </div>

              {lista && proyecto.descripcion && (
                <p className="hidden tracking-tighter md:text-xl w-3/4 lg:col-span-5 lg:col-start-8 lg:mt-4.5 lg:block">
                  {proyecto.descripcion}
                </p>
              )}
            </a>
          </li>
        ))}
      </ul>

     
    </section>
  );
}

export default Proyectos;
