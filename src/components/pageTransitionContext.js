import { createContext, useContext } from "react";

// Contexto de la transición entre páginas (ver PageTransition.jsx).
// Va en un archivo aparte para que el recargado en vivo de Vite funcione bien.
export const TransitionContext = createContext(null);

// Para navegar con la cortina desde código (por ejemplo, desde el Laboratorio)
export function usePageTransition() {
  return useContext(TransitionContext);
}
