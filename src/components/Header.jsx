import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import star from "../assets/img/STAR.svg";

function Header() {
  const starRef = useRef(null);

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
    <header className="fixed top-0 left-0 z-50 flex w-full items-center justify-between px-4 xl:px-8 pt-5">
      <Link to="/info" className="text-xl font-bold uppercase text-black transition-colors duration-300 hover:text-rojo">
        Info
      </Link>

      {/* La estrella se dibuja con una máscara (en vez de <img>) para poder cambiarle el color */}
      <Link to="/" aria-label="Inicio" className="group">
        <span
          ref={starRef}
          aria-hidden="true"
          className="block h-9 w-8 bg-black transition-colors duration-300 group-hover:bg-rojo"
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
      </Link>

      <Link to="/" className="text-xl font-bold uppercase text-black transition-colors duration-300 hover:text-rojo">
        Work
      </Link>
    </header>
  );
}

export default Header;