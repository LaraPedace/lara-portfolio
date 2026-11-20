import { useEffect, useRef } from "react";
import foto from "../assets/img/foto_lari.webp";
import cv from "../assets/CV-LaraPedace.pdf";
import ScrambleText from "../components/ScrambleText.jsx";
import PhotoScramble from "../components/PhotoScramble.jsx";
import { useSeo } from "../components/useSeo.js";
import { useIdioma } from "../i18n/idiomaContext.js";
import { T } from "../i18n/textos.js";
import "./Info.css";

const SOFTWARES = [
  ["Illustrator", "Photoshop", "After Effects", "Figma", "Visual Studio Code"],
  ["Resolume Arena", "Reaper", "Fusion 360", "Blender", "TouchDesigner"],
];

// Los textos (español e inglés) están en src/i18n/textos.js. La "frase" en desktop va en
// negrita junto a la presentación; en móvil pasa a ser el comienzo del texto "sobre mí".

function Info() {
  const mainRef = useRef(null);
  const { t } = useIdioma();
  const PRESENTACION = t(T.presentacion);
  const FRASE = t(T.frase);
  useSeo({ titulo: t(T.sobreMiTitulo), descripcion: t(T.seoInfo) });

  // Aparición al scrollear: cada elemento con data-aparece se muestra (fundido + sube un
  // poquito) cuando entra en pantalla. Una sola vez. --i = orden, para que aparezcan
  // escalonados (ver Info.css).
  useEffect(() => {
    const elementos = mainRef.current.querySelectorAll("[data-aparece]");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    elementos.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <main ref={mainRef} className="grid grid-cols-2 gap-x-5 bg-white px-4 pt-40 pb-20 text-black tracking-tight xl:grid-cols-12 xl:px-8 xl:pt-40 xl:pb-40">
      {/* Presentación */}
      <h1 className="order-3 col-span-2 mt-8 text-3xl leading-tight tracking-tighter font-bold xl:order-0 xl:col-span-8 xl:col-start-4 xl:mt-0 xl:text-lead">
        <ScrambleText text={PRESENTACION} />
        <ScrambleText text={FRASE} offset={PRESENTACION.length} className="hidden xl:block" />
      </h1>

      {/* Sobre mí */}
      <h2 className="order-2 animate-fade-in text-sm leading-normal font-bold uppercase motion-reduce:animate-none xl:order-0 xl:col-span-1 xl:col-start-4 xl:mt-25 xl:text-label">
        {t(T.sobreMiTitulo)}
      </h2>

      <PhotoScramble
        src={foto}
        alt={t(T.retrato)}
        className="order-1 animate-fade-in motion-reduce:animate-none aspect-portrait w-full xl:order-0 xl:col-span-2 xl:col-start-6 xl:mt-25"
      />

      <div className="order-4 col-span-2 mt-7.75 text-xl xl:order-0 xl:col-span-6 xl:mt-25 xl:text-2xl">
        <p data-aparece className="aparece">
          <span className="xl:hidden">{FRASE} </span>
          {t(T.sobreMiTexto1)}
        </p>
        <p data-aparece className="aparece mt-[1.3em]" style={{ "--i": 1 }}>
          {t(T.sobreMiTexto2)}
        </p>
      </div>

      {/* Softwares */}
      <h2 data-aparece className="aparece order-5 col-span-2 mt-7.75 text-sm leading-tight font-bold uppercase xl:order-0 xl:col-span-1 xl:col-start-6 xl:mt-18 xl:text-label">
        {t(T.softwares)}
      </h2>

      {SOFTWARES.map((lista, i) => (
        <ul
          key={i}
          className="order-6 mt-7.75 text-lg leading-tight xl:order-0 xl:col-span-2 xl:mt-18"
        >
          {lista.map((item, j) => (
            <li key={item} data-aparece className="aparece" style={{ "--i": j + 1 }}>
              {item}
            </li>
          ))}
        </ul>
      ))}

      {/* CV: debajo de Softwares, mismo tamaño. Al hacer clic se descarga el PDF */}
      <a
        href={cv}
        download="CV-LaraPedace.pdf"
        data-aparece
        className="aparece order-7 col-span-2 mt-12 w-fit text-sm leading-tight font-bold uppercase transition-colors duration-300 hover:text-rojo xl:order-0 xl:col-span-2 xl:col-start-6 xl:mt-14 xl:text-label"
      >
        {t(T.descargarCv)} <span aria-hidden="true">↓</span>
      </a>
    </main>
  );
}

export default Info;
