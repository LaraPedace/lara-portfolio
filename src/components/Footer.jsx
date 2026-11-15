import { useEffect, useRef } from "react";
import star from "../assets/img/STAR-ROJA.svg";
import ScrambleText from "./ScrambleText.jsx";

// Links de contacto
const LINKS = [
  { label: "Email", href: "mailto:larapedace@gmail.com" },
  { label: "Instagram", href: "https://www.instagram.com/l____032003/" },
  { label: "Linkedin", href: "https://www.linkedin.com/in/lara-pedace-9742b6219/" },
];

function Footer() {
  const footerRef = useRef(null);

  // Safari de iPhone: mientras el footer (negro) se ve, el fondo del html pasa a negro,
  // así la barra de abajo y el rebote del scroll no muestran una franja blanca.
  // Al salir de pantalla vuelve a blanco. El footer está en todas las páginas.
  useEffect(() => {
    const html = document.documentElement;
    const observer = new IntersectionObserver(([entry]) => {
      html.style.backgroundColor = entry.isIntersecting ? "#000" : "#fff";
    });
    observer.observe(footerRef.current);
    return () => {
      observer.disconnect();
      html.style.backgroundColor = "";
    };
  }, []);

  return (
    <footer
      ref={footerRef}
      id="contacto"
      className="relative flex min-h-148.5 flex-col bg-black px-4 pt-6.25 pb-1 font-grotesk uppercase text-white xl:px-8 md:pt-9.25 md:pb-4"
    >
      <div className="flex flex-col md:flex-row md:justify-between leading-none">
        {/* Título */}
        <div className="flex flex-col gap-0 tracking-tighter text-display-sm md:text-display leading-none">
          {/* Caracteres random en rojo que se escriben al llegar al footer (como en Sobre mí) */}
          <h2>
            <ScrambleText text="Trabajemos" alVer />
          </h2>
          <h2>
            <ScrambleText text="En conjunto" offset={10} alVer />
          </h2>
        </div>

        {/* Contacto */}
        <div className="mt-11 grid grid-cols-[52%_1fr] text-base md:mt-2.25 md:w-98 md:shrink-0 md:grid-cols-[49%_1fr]">
          <ul className="leading-normal">
            {LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="transition-colors duration-300 hover:text-rojo"
                  {...(link.href.startsWith("http") && { target: "_blank", rel: "noreferrer" })}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <p className="text-right leading-normal md:whitespace-nowrap">Buenos Aires, Argentina</p>

          <p className="col-span-2 mt-6 leading-tight">
            Nuevos proyectos
            <br />
            <a
              href="mailto:larapedace@gmail.com"
              className="normal-case transition-colors duration-300 hover:text-rojo"
            >
              larapedace@gmail.com
            </a>
          </p>
        </div>
      </div>

      {/* Parte inferior: estrella + créditos */}
      <div className="mt-auto flex flex-col md:flex-row md:items-end md:justify-between">
        <img
          src={star}
          alt=""
          aria-hidden="true"
          className="mb-7.25 h-56.25 w-49.5 self-end transition-transform duration-700 ease-out hover:rotate-180 motion-reduce:transition-none md:mb-0 md:h-25.25 md:w-22.25 md:self-auto"
        />

        <div className="flex justify-between  text-2xs xl:text-xs tracking-tight leading-normal md:w-98">
          <p>
            Website by{" "}
            <a
              href="https://www.instagram.com/lolagarciamoreno/"
              target="_blank"
              rel="noreferrer"
              className="transition-colors duration-300 hover:text-rojo"
            >
              @lolagarciamoreno
            </a>
          </p>
          <p className="tracking-wide">2026©</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
