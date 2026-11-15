// Estado compartido del preloader, para que otras partes (el Hero) esperen a que termine.
// Se decide una sola vez, al cargar la página: así está disponible antes de que se monte
// cualquier componente.

const VISTO = "preloader-visto"; // clave en sessionStorage (la guarda Preloader.jsx)

function debeMostrarse() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  try {
    return !sessionStorage.getItem(VISTO);
  } catch {
    return true;
  }
}

export function marcarVisto() {
  try {
    sessionStorage.setItem(VISTO, "1");
  } catch {
    // sin sessionStorage: se vuelve a mostrar en la próxima carga, no pasa nada
  }
}

// ¿Se muestra el preloader en esta carga?
export const preloaderActivo = debeMostrarse();

let avisar;
const termino = new Promise((ok) => (avisar = ok));
if (!preloaderActivo) avisar();

// Se resuelve cuando el preloader llega a 100% y empieza a desvanecerse
// (o enseguida, si no hay preloader)
export function esperarPreloader() {
  return termino;
}

export function avisarQueTermino() {
  avisar();
}
