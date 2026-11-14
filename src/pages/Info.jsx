import foto from "../assets/img/foto_lari.webp";
import ScrambleText from "../components/ScrambleText.jsx";
import PhotoScramble from "../components/PhotoScramble.jsx";

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
  return (
    <main className="grid grid-cols-2 gap-x-5 bg-white px-4 pt-40 pb-20 text-black tracking-tight xl:grid-cols-12 xl:px-8 xl:pt-40 xl:pb-40">
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
        <p>
          <span className="xl:hidden">{FRASE} </span>
          Cada proyecto nace de un concepto que le da sentido, pero es en el proceso, entre
          preguntas, pruebas y hallazgos, donde encuentro su mayor valor. Me interesa explorar el
          limbo entre lo físico y lo digital.
        </p>
        <p className="mt-[1.3em]">
          Me gradué en 2024 en la Licenciatura en Diseño de la Universidad Torcuato Di Tella.
          Actualmente estoy trabajando para una agencia creativa y en paralelo, desarrollando
          proyectos freelance.
        </p>
      </div>

      {/* Softwares */}
      <h2 className="order-5 col-span-2 mt-7.75 text-sm leading-tight font-bold uppercase xl:order-0 xl:col-span-1 xl:col-start-6 xl:mt-18 xl:text-label">
        Softwares
      </h2>

      {SOFTWARES.map((lista, i) => (
        <ul
          key={i}
          className="order-6 mt-7.75 text-lg leading-tight xl:order-0 xl:col-span-2 xl:mt-18"
        >
          {lista.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ))}
    </main>
  );
}

export default Info;
