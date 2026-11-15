import { useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { TransitionLink } from "./PageTransition.jsx";
import star from "../assets/img/STAR.svg";

function Header() {
  const starRef = useRef(null);
  // En las páginas de proyecto el fondo es negro: el header pasa a blanco sobre negro
  const oscuro = useLocation().pathname.startsWith("/proyectos/");
  const texto = oscuro ? "text-white" : "text-black";

  // La estrella gira con el scroll. Se cambia el estilo directo (sin estado de React)
  // para no volver a dibujar el header en cada cuadro del scroll.
  useEffect(() => {
    function handleScroll() {
      starRef.current.style.transform = `rotate(${window.scrollY / 3}deg)`;
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 ${oscuro ? "bg-black/70" : "bg-white/70"} backdrop-blur-xl left-0 z-50 flex w-full items-center justify-between px-4 xl:px-8 py-2 md:py-4`}>
      <TransitionLink to="/info" className={` text-sm xl:text-base font-bold uppercase ${texto} transition-colors duration-300 hover:text-rojo`}>
        SOBRE MÍ
      </TransitionLink>

      {/* La estrella se dibuja con una máscara (en vez de <img>) para poder cambiarle el color */}
      <TransitionLink to="/" aria-label="Inicio" className="group">
        <span
          ref={starRef}
          aria-hidden="true"
          className={`block h-9 w-8 ${oscuro ? "bg-white" : "bg-black"} transition-colors duration-300 group-hover:bg-rojo`}
          style={{
            maskImage: `url("${star}")`,
            WebkitMaskImage: `url("${star}")`,
            maskSize: "contain",
            WebkitMaskSize: "contain",
            maskRepeat: "no-repeat",
            WebkitMaskRepeat: "no-repeat",
            maskPosition: "center",
            WebkitMaskPosition: "center",
          }}
        />
      </TransitionLink>

      {/* Lleva a la sección "Proyectos Seleccionados" de la home */}
      <TransitionLink to="/#proyectos" className={`text-sm xl:text-base font-bold uppercase ${texto} transition-colors duration-300 hover:text-rojo`}>
        PROYECTOS
      </TransitionLink>
    </header>
  );
}

export default Header;