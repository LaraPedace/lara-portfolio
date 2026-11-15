import { useEffect, useRef } from "react";
import foto from "../assets/img/foto_lari.webp";
import cv from "../assets/CV-LaraPedace.pdf";
import ScrambleText from "../components/ScrambleText.jsx";
import PhotoScramble from "../components/PhotoScramble.jsx";
import "./Info.css";

const PRESENTACION =
  "Soy Lara Pedace, diseñadora multidisciplinaria con base en Buenos Aires, Argentina.";

const SOFTWARES = [
  ["Illustrator", "Photoshop", "After Effects", "Figma", "Visual Studio Code"],
  ["Resolume Arena", "Reaper", "Fusion 360", "Blender", "TouchDesigner"],
];

// En desktop esta frase va en negrita junto a la presentación;
// en móvil pasa a ser el comienzo del texto "sobre mí".
const FRASE =
  "Entiendo el diseño como una forma de expresión que invita a pensar, explorar y transformar ideas en experiencias significativas y sensaciones duraderas.";

function Info() {
  const mainRef = useRef(null);

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
        Sobre mí
      </h2>

      <PhotoScramble
        src={foto}
        alt="Retrato de Lara Pedace"
        className="order-1 animate-fade-in motion-reduce:animate-none aspect-portrait w-full xl:order-0 xl:col-span-2 xl:col-start-6 xl:mt-25"
      />

      <div className="order-4 col-span-2 mt-7.75 text-xl xl:order-0 xl:col-span-6 xl:mt-25 xl:text-2xl">
        <p data-aparece className="aparece">
          <span className="xl:hidden">{FRASE} </span>
          Cada proyecto nace de un concepto que le da sentido, pero es en el proceso, entre
          preguntas, pruebas y hallazgos, donde encuentro su mayor valor. Me interesa explorar el
          limbo entre lo físico y lo digital.
        </p>
        <p data-aparece className="aparece mt-[1.3em]" style={{ "--i": 1 }}>
          Me gradué en 2024 en la Licenciatura en Diseño de la Universidad Torcuato Di Tella.
          Actualmente estoy trabajando para una agencia creativa y en paralelo, desarrollando
          proyectos freelance.
        </p>
      </div>

      {/* Softwares */}
      <h2 data-aparece className="aparece order-5 col-span-2 mt-7.75 text-sm leading-tight font-bold uppercase xl:order-0 xl:col-span-1 xl:col-start-6 xl:mt-18 xl:text-label">
        Softwares
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
        Descargar CV <span aria-hidden="true">↓</span>
      </a>
    </main>
  );
}

export default Info;
