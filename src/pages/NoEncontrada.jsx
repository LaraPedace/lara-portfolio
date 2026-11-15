import { useEffect, useRef } from "react";
import { TransitionLink } from "../components/PageTransition.jsx";
import { animarLogo } from "../components/logoCaracteres.js";
import "../components/Hero.css";

// Dibujo del 404, con el mismo trazo que el LARA del Hero (palos de 7, barras de 4, 22 filas)
const MASK_404 = [
  "#######.......#######.........###############.........#######.......#######",
  "#######.......#######.......###################.......#######.......#######",
  "#######.......#######......#####################......#######.......#######",
  "#######.......#######......#####################......#######.......#######",
  "#######.......#######......########.....########......#######.......#######",
  "#######.......#######......#######.......#######......#######.......#######",
  "#######.......#######......#######.......#######......#######.......#######",
  "#######.......#######......#######.......#######......#######.......#######",
  "#######.......#######......#######.......#######......#######.......#######",
  "#######.......#######......#######.......#######......#######.......#######",
  "#######.......#######......#######.......#######......#######.......#######",
  "#######.......#######......#######.......#######......#######.......#######",
  "#####################......#######.......#######......#####################",
  "#####################......#######.......#######......#####################",
  "#####################......#######.......#######......#####################",
  "#####################......#######.......#######......#####################",
  "..............#######......#######.......#######....................#######",
  "..............#######......########.....########....................#######",
  "..............#######......#####################....................#######",
  "..............#######......#####################....................#######",
  "..............#######.......###################.....................#######",
  "..............#######.........###############.......................#######",
];

// Página 404: el "404" armado con caracteres como el LARA de la home, pero en rojo.
// También se muestra cuando el proyecto de /proyectos/:id no existe.
function NoEncontrada() {
  const sectionRef = useRef(null);
  const logoRef = useRef(null);
  const dustRef = useRef(null);

  useEffect(
    () =>
      animarLogo({
        root: logoRef.current,
        dust: dustRef.current,
        section: sectionRef.current,
        mask: MASK_404,
      }),
    [],
  );

  return (
    <main
      ref={sectionRef}
      style={{ "--cols": MASK_404[0].length }}
      className="hero no-encontrada relative flex min-h-svh flex-col justify-center gap-16 overflow-hidden md:justify-between md:gap-0 bg-white px-4 pt-24 pb-10 text-black xl:px-8 xl:pt-24"
    >
      <div ref={dustRef} className="hero-dust font-grotesk" aria-hidden="true"></div>

      <div className="hero-stage relative mx-auto">
        <h1 ref={logoRef} className="hero-lara font-grotesk" aria-label="404"></h1>
      </div>

      <div className="relative flex flex-col gap-4 tracking-tighter md:mt-8">
        <p className="text-4xl leading-none md:text-6xl font-medium tracking-tighter">Oops! Esta página no existe.</p>
        <TransitionLink
          to="/"
          className="w-fit text-lg font-medium uppercase transition-colors duration-300 hover:text-rojo"
        >
          <span aria-hidden="true">→ </span>
          Volver al inicio
        </TransitionLink>
      </div>
    </main>
  );
}

export default NoEncontrada;
