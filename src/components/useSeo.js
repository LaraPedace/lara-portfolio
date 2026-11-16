import { useEffect } from "react";

// Título y descripción de cada página (los que se ven en la pestaña y en Google).
// Los valores por defecto están en index.html; al salir de la página se restauran.
// noindex = true: le pide a Google que no la muestre (ej. la página 404).

function meta(selector) {
  return document.head.querySelector(selector);
}

export function useSeo({ titulo, descripcion, noindex = false }) {
  useEffect(() => {
    if (!titulo) return; // sin título no toca nada (ej. proyecto inexistente: manda la 404)
    const desc = meta('meta[name="description"]');
    const canonical = meta('link[rel="canonical"]');
    const antes = { titulo: document.title, desc: desc?.content, canonical: canonical?.href };

    document.title = `${titulo} — Lara Pedace`;
    if (descripcion && desc) desc.content = descripcion;
    if (canonical) canonical.href = `https://www.larapedace.com${window.location.pathname}`;

    let robots = null;
    if (noindex) {
      robots = document.createElement("meta");
      robots.name = "robots";
      robots.content = "noindex";
      document.head.appendChild(robots);
    }

    return () => {
      document.title = antes.titulo;
      if (desc && antes.desc) desc.content = antes.desc;
      if (canonical && antes.canonical) canonical.href = antes.canonical;
      robots?.remove();
    };
  }, [titulo, descripcion, noindex]);
}
