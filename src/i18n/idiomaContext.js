import { createContext, useContext } from "react";

// Idioma del sitio: "es" (por defecto) o "en". Lo maneja IdiomaProvider (Idioma.jsx).
export const IdiomaContext = createContext({ idioma: "es", setIdioma: () => {} });

// Devuelve el idioma, cómo cambiarlo y t(): recibe { es, en } y devuelve el texto en el
// idioma elegido (si falta el inglés, queda el español). Un texto común pasa igual.
export function useIdioma() {
  const { idioma, setIdioma } = useContext(IdiomaContext);
  const t = (valor) =>
    valor && typeof valor === "object" && "es" in valor ? (valor[idioma] ?? valor.es) : valor;
  return { idioma, setIdioma, t };
}
