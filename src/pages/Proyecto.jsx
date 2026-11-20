import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useLenis } from "lenis/react";
import { proyectos as proyectosEs } from "../data/proyectos.js";
import { useProyectos } from "../i18n/traducir.js";
import { useIdioma } from "../i18n/idiomaContext.js";
import { T } from "../i18n/textos.js";
import { TransitionLink } from "../components/PageTransition.jsx";
import { scrollAlAncla } from "../components/scrollAlAncla.js";
import Botonera from "../components/Botonera.jsx";
import NoEncontrada from "./NoEncontrada.jsx";
import { useSeo } from "../components/useSeo.js";

const esVideo = (src) => /\.(mp4|webm)$/i.test(src);
const reducirMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// "Personajes + App" → "personajes-app" (para el #ancla de cada sección)
const slug = (texto) =>
  texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

// Imagen, gif o video según la extensión
function Media({ src, alt, controles = false }) {
  if (esVideo(src)) {
    return (
      <video
        src={src}
        aria-label={alt}
        autoPlay={!reducirMovimiento}
        muted
        loop
        playsInline
        controls={controles}
        preload="metadata"
        className="h-auto w-full"
      />
    );
  }
  return <img src={src} alt={alt} loading="lazy" decoding="async" className="h-auto w-full" />;
}

// Escalonadas: clases escritas completas para que Tailwind las encuentre (grilla de 24).
const ESCALONADA = {
  grande: {
    izquierda: "col-span-24 lg:col-span-15 lg:col-start-1",
    derecha: "col-span-24 lg:col-span-15 lg:col-start-10",
  },
  // Chica: angosta y hacia el centro, solapándose un poco con la otra (como la escalera de
  // las grandes, pero sin quedar separadas a los bordes)
  chica: {
    izquierda: "col-span-16 col-start-1 lg:col-span-9 lg:col-start-5",
    derecha: "col-span-16 col-start-9 lg:col-span-9 lg:col-start-12",
  },
};

// Grilla de imágenes. Cada item es una URL o un objeto de ancha(), tercio(), escalonada(),
// centrada() o conSonido() (ver proyectos.js).
//   - Si alguna viene marcada (ancha/tercio/escalonada): las anchas van a todo el ancho, los
//     tercios de a tres, las escalonadas van cada una en su fila a un lado y el resto de a dos.
//   - Si no: la primera va a todo el ancho y el resto de a dos (si sobra una al final,
//     también va a todo el ancho).
//   - Con unaPorFila, todas van a todo el ancho.
function Galeria({ imagenes, titulo, unaPorFila = false }) {
  const { t } = useIdioma();
  if (!imagenes.length) return null;
  const items = imagenes.map((img) => (typeof img === "string" ? { src: img } : img));
  const manual = items.some((img) => img.ancha || img.tercio || img.escalonada);
  const sueltaAlFinal = (items.length - 1) % 2 === 1;
  return (
    <div className="grid grid-cols-24 items-start gap-2.5 md:gap-5">
      {items.map((item, i) => {
        const { src, ancha, centrada, tercio, escalonada, tamaño, controles, alt } = item;
        let ancho = "col-span-12";
        if (unaPorFila || (manual ? ancha : i === 0 || (sueltaAlFinal && i === items.length - 1))) {
          ancho = "col-span-24";
        } else if (tercio) {
          ancho = "col-span-8";
        }
        const media = (
          <Media src={src} alt={alt ?? `${titulo} – ${t(T.imagen)} ${i + 1}`} controles={controles} />
        );

        // Escalonada: ocupa una fila entera (así la siguiente baja) y adentro, con la misma
        // grilla, se ubica a su lado
        if (escalonada) {
          return (
            <div key={src} className="col-span-24 grid grid-cols-24 gap-2.5 md:gap-5">
              <div className={ESCALONADA[tamaño][escalonada]}>{media}</div>
            </div>
          );
        }

        return (
          <div
            key={src}
            className={`${ancho} ${
              centrada ? "flex justify-center py-12 lg:py-20 [&_img]:w-20 lg:[&_img]:w-28" : ""
            }`}
          >
            {media}
          </div>
        );
      })}
    </div>
  );
}

// Datos chicos (título + detalle), ej. Texturas / Paleta / Sonido
function Notas({ notas, className = "" }) {
  return (
    <dl className={`flex flex-col gap-5 tracking-tighter ${className}`}>
      {notas.map((n) => (
        <div key={n.titulo} className="flex flex-col gap-1.5">
          <dt className="text-2xl leading-none">{n.titulo}</dt>
          <dd className="text-sm leading-tight uppercase">{n.texto}</dd>
        </div>
      ))}
    </dl>
  );
}

function Dato({ label, children }) {
  return (
    <div className="flex flex-col gap-3 lg:gap-franja-sm">
      <dt className="text-sm tracking-normal uppercase text-white/40 lg:text-franja-label">{label}</dt>
      <dd className="text-project-meta lg:text-franja-meta">{children}</dd>
    </div>
  );
}

// Desktop (lg): grilla de 12 columnas.
//   - Columnas 1-4: franja con la info del proyecto + índice de secciones. Queda fija
//     (sticky) mientras se scrollea el contenido; si no entra en la pantalla, scrollea sola.
//   - Columnas 5-12: imágenes y secciones.
// Móvil/tablet: todo apilado (info arriba, después el contenido).
function Proyecto() {
  const { id } = useParams();
  const lenis = useLenis();
  const { t } = useIdioma();
  const proyectos = useProyectos();
  const indice = proyectos.findIndex((p) => p.id === id);
  const proyecto = proyectos[indice];
  const seccionesEs = proyectosEs[indice]?.secciones ?? [];
  useSeo({
    titulo: proyecto ? `${proyecto.titulo}, ${proyecto.categoria}` : null,
    descripcion: proyecto?.descripcion,
  });
  // Secciones con ancla. Las que comparten "grupo" llevan número (1, 2, 3…) y la primera
  // de cada grupo muestra el título del grupo arriba.
  const secciones = (proyecto?.secciones ?? []).map((s, i, todas) => {
    const anterior = todas[i - 1];
    const abreGrupo = Boolean(s.grupo) && anterior?.grupo !== s.grupo;
    let numero = 0;
    if (s.grupo) {
      for (let j = i; j >= 0 && todas[j].grupo === s.grupo; j--) numero++;
    }
    return { ...s, ancla: slug(seccionesEs[i]?.titulo ?? s.titulo), abreGrupo, numero };
  });
  const [visible, setActiva] = useState(null);
  // Si la sección vista es de otro proyecto (al pasar al siguiente), vale la primera
  const activa = secciones.some((s) => s.ancla === visible) ? visible : secciones[0]?.ancla;

  // Marca en el índice la sección que está en el medio de la pantalla
  useEffect(() => {
    if (!proyecto) return;
    const elementos = document.querySelectorAll("[data-seccion]");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiva(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    elementos.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [proyecto]);

  // Proyecto que no existe (ej. /proyectos/algo-mal-escrito): página 404
  if (!proyecto) return <NoEncontrada />;

  const siguiente = proyectos[(indice + 1) % proyectos.length];

  return (
    <main className="bg-black text-white">
      <div className="px-4 pt-24 xl:px-8 lg:grid lg:grid-cols-12 lg:gap-x-5 lg:pt-franja-top">
        {/* Franja izquierda */}
        <aside
          data-lenis-prevent
          className="flex flex-col gap-9 lg:sticky lg:top-franja-top lg:col-span-4 lg:max-h-[calc(100svh-var(--spacing-franja-top))] lg:gap-franja lg:self-start lg:overflow-y-auto lg:pb-3 lg:scrollbar-none"
        >
          <div className="flex flex-col gap-6 lg:gap-franja">
            <div className="flex flex-col items-start gap-3 lg:gap-franja-sm">
              {/* Vuelve a "Proyectos Seleccionados" en la home */}
              <TransitionLink
                to="/#proyectos"
                className="text-eyebrow uppercase text-white/60 transition-colors duration-300 hover:text-rojo lg:text-franja-label"
              >
                <span aria-hidden="true">← </span>
                {t(T.volver)}
              </TransitionLink>
              <h1 className="text-5xl leading-[1.05] tracking-tighter lg:text-franja-title">
                {proyecto.titulo}
              </h1>
            </div>
            <p className="text-xl  max-lg:leading-tight tracking-tighter lg:text-franja-lead">
              {proyecto.descripcion}
            </p>
          </div>

          <div className="flex flex-col gap-4 lg:gap-franja-sm">
            <h2 className="text-sm uppercase text-white/40 lg:text-franja-label">{t(T.sobreElProyecto)}</h2>
            <p className="text-xl  max-lg:leading-snug tracking-tighter lg:text-franja-body">
              {proyecto.sobreElProyecto}
            </p>
          </div>

          <dl className="grid grid-cols-2 gap-x-5 gap-y-6 tracking-tighter lg:gap-y-franja">
            <Dato label={t(T.tipoDeProyecto)}>{proyecto.tipo}</Dato>
            <Dato label={t(T.anio)}>{proyecto.anio}</Dato>
            <Dato label={t(proyecto.disciplinas.length > 1 ? T.disciplinas : T.disciplina)}>
              {proyecto.disciplinas.map((d) => (
                <span key={d} className="block">
                  {d}
                </span>
              ))}
            </Dato>
            {proyecto.colaboracion && <Dato label={t(T.colaboracion)}>{proyecto.colaboracion}</Dato>}
          </dl>

          {/* Índice de secciones: solo en desktop */}
          {secciones.length > 0 && (
            <nav aria-label={t(T.seccionesDelProyecto)} className="hidden lg:block">
              <ul className="flex flex-col gap-franja-sm text-franja-meta leading-[1.3] tracking-tighter lg:mt-franja">
                {secciones.map((s) => {
                  const esActiva = activa === s.ancla;
                  return (
                    <li key={s.ancla} className={s.grupo ? "pl-6" : ""}>
                      {/* Título del grupo: lleva a su primera sección */}
                      {s.abreGrupo && (
                        <a
                          href={`#${s.ancla}`}
                          onClick={(e) => {
                            e.preventDefault();
                            scrollAlAncla(`#${s.ancla}`, lenis);
                          }}
                          className="-ml-6 mb-franja-sm block opacity-20 transition duration-300 hover:text-rojo hover:opacity-100"
                        >
                          {s.grupo}
                        </a>
                      )}
                      <a
                        href={`#${s.ancla}`}
                        aria-current={esActiva ? "location" : undefined}
                        onClick={(e) => {
                          e.preventDefault();
                          scrollAlAncla(`#${s.ancla}`, lenis);
                        }}
                        className={`inline-flex gap-1.25 transition duration-300 hover:text-rojo hover:opacity-100 ${
                          esActiva ? "opacity-100" : "opacity-20"
                        }`}
                      >
                        {esActiva && <span aria-hidden="true">↳</span>}
                        {s.tituloIndice ?? s.titulo}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>
          )}
        </aside>

        {/* Contenido */}
        <div className="mt-12 flex flex-col gap-16 lg:col-span-8 lg:mt-0 lg:gap-24 lg:pb-10">
          <Galeria imagenes={proyecto.imagenes} titulo={proyecto.titulo} unaPorFila={proyecto.unaPorFila} />

          {secciones.map((s) => (
            <section
              key={s.ancla}
              id={s.ancla}
              data-seccion
              className="flex scroll-mt-40 flex-col gap-6 lg:gap-8"
            >
              <div className="flex flex-col gap-8 lg:flex-row lg:gap-5">
                <div className="flex flex-col gap-4 tracking-tighter lg:w-3/4 ">
                  {s.abreGrupo && (
                    <h2 className="text-2xl leading-[1.34] lg:text-3xl">{s.grupo}</h2>
                  )}
                  {s.grupo ? (
                    <h3 className="text-eyebrow uppercase">
                      <span className="mr-2">{s.numero}.</span>
                      {s.titulo}
                    </h3>
                  ) : (
                    <h2 className="text-eyebrow uppercase">{s.titulo}</h2>
                  )}
                  {s.texto && <p className="text-lg leading-snug lg:text-project-body">{s.texto}</p>}
                </div>
                {/* Notas al costado del texto (si hay destacados, van al lado de ellos) */}
                {s.notas && !s.destacados && <Notas notas={s.notas} className="lg:flex-1" />}
              </div>

              {/* Cifras grandes + notas a la derecha */}
              {s.destacados && (
                <div className="mt-4 grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-5 lg:mt-10">
                  {s.destacados.map((d) => (
                    <p key={d} className="max-w-64 text-2xl leading-tight tracking-tighter text-balance">
                      {d}
                    </p>
                  ))}
                  {s.notas && <Notas notas={s.notas} />}
                </div>
              )}

              {s.botonera && <Botonera estados={s.botonera} />}

              <Galeria
                imagenes={s.imagenes}
                titulo={`${proyecto.titulo}, ${s.titulo}`}
                unaPorFila={proyecto.unaPorFila}
              />
            </section>
          ))}
        </div>
      </div>

      {/* Siguiente proyecto */}
      <TransitionLink
        to={`/proyectos/${siguiente.id}`}
        className="flex flex-col items-center gap-3 px-4 py-24 text-center tracking-tighter transition-colors duration-300 hover:text-rojo lg:py-52 xl:px-8"
      >
        <span className="text-5xl leading-[1.05] tracking-tighter lg:text-9xl">{siguiente.titulo}</span>
        <span className="text-base uppercase lg:text-lg">{t(T.siguienteProyecto)} →</span>
      </TransitionLink>
    </main>
  );
}

export default Proyecto;
