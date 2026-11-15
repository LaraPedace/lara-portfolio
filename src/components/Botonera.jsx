import { useEffect, useRef, useState } from "react";

const reducirMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const FADE_MS = 250; // duración del fundido al cambiar de botón

// Botonera interactiva (ej. Microdesastre): recrea los botones de la instalación.
// Al elegir uno cambian el subtítulo, el video de la sala, el sensor (ícono + nombre),
// su descripción y lo que muestra el monitor.
// estados = [{ etiqueta, nombre, subtitulo, icono, sensor, texto, video, monitor }]
function Botonera({ estados }) {
  const [elegido, setElegido] = useState(0); // botón marcado (cambia al instante)
  const [mostrado, setMostrado] = useState(0); // contenido en pantalla (cambia con el fundido)
  const [visible, setVisible] = useState(true);
  const timer = useRef(null);
  const actual = estados[mostrado];

  useEffect(() => () => clearTimeout(timer.current), []);

  // Se desvanece, cambia el contenido y vuelve a aparecer (como el cambio de vista en la home)
  function elegir(i) {
    if (i === elegido) return;
    setElegido(i);
    clearTimeout(timer.current);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setMostrado(i);
      return;
    }
    setVisible(false);
    timer.current = setTimeout(() => {
      setMostrado(i);
      setVisible(true);
    }, FADE_MS);
  }

  return (
    <div className="flex flex-col gap-10 tracking-tighter lg:gap-14">
      {/* Botones */}
      <div role="group" aria-label="Botones de la instalación" className="grid grid-cols-2 gap-2.5 md:gap-5 lg:grid-cols-4">
        {estados.map((e, i) => {
          const activo = i === elegido;
          return (
            <button
              key={e.etiqueta}
              type="button"
              onClick={() => elegir(i)}
              aria-pressed={activo}
              className={`flex h-23.5 cursor-pointer flex-col items-center justify-center border transition-colors duration-300 ${
                activo
                  ? "border-white bg-white text-black"
                  : "border-neutral-800 text-neutral-400 hover:border-rojo hover:text-rojo"
              }`}
            >
              <span className="text-eyebrow uppercase">{e.etiqueta}</span>
              <span className="text-xl leading-tight lg:text-project-body lg:leading-tight">{e.nombre}</span>
            </button>
          );
        })}
      </div>

      {/* Lo que hace el botón elegido */}
      <div
        aria-live="polite"
        style={{ transitionDuration: `${FADE_MS}ms` }}
        className={`flex flex-col gap-6 transition-opacity ease-out lg:gap-8 ${visible ? "opacity-100" : "opacity-0"}`}
      >
        <p className="text-xl leading-tight">{actual.subtitulo}</p>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-8 lg:gap-5">
          <video
            key={actual.video}
            src={actual.video}
            aria-label={`Sala: ${actual.nombre}`}
            autoPlay={!reducirMovimiento}
            muted
            loop
            playsInline
            preload="metadata"
            className="aspect-video w-full object-cover lg:col-span-5"
          />

          <div className="flex flex-col gap-6 lg:col-span-3">
            <div className="flex items-center gap-3.5">
              <img src={actual.icono} alt="" aria-hidden="true" className="size-9 shrink-0" />
              <span className="text-sm leading-none uppercase">{actual.sensor}</span>
            </div>
            <p className="text-xl leading-tight">{actual.texto}</p>
            <div className="flex flex-col gap-3">
              <span className="text-sm leading-none uppercase">Monitor</span>
              <video
                key={actual.monitor}
                src={actual.monitor}
                aria-label={`Monitor: ${actual.nombre}`}
                autoPlay={!reducirMovimiento}
                muted
                loop
                playsInline
                preload="metadata"
                className="aspect-monitor w-full border border-neutral-900 object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Botonera;
