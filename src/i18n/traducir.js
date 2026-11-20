import { useMemo } from "react";
import { proyectos } from "../data/proyectos.js";
import { proyectosEn } from "./proyectosEn.js";
import { labEn } from "./labEn.js";
import { useIdioma } from "./idiomaContext.js";

// Pone los textos en inglés encima de los datos en español, respetando la forma:
// listas posición por posición, objetos campo por campo. Lo que no está traducido
// (o vale null) queda como en español; las imágenes y todo lo demás no se tocan.
function superponer(base, en) {
  if (en === undefined || en === null) return base;
  if (Array.isArray(base) && Array.isArray(en)) {
    // Lista de textos (ej. disciplinas): se reemplaza entera
    if (base.every((b) => typeof b === "string")) return en;
    return base.map((b, i) => superponer(b, en[i]));
  }
  if (base && typeof base === "object" && typeof en === "object") {
    const resultado = { ...base };
    for (const clave of Object.keys(en)) resultado[clave] = superponer(base[clave], en[clave]);
    return resultado;
  }
  // Una imagen (URL) con su texto alternativo traducido
  if (typeof base === "string" && en && typeof en === "object") return { src: base, ...en };
  return en;
}

// Los proyectos en el idioma elegido (mismo orden y mismos ids que proyectos.js)
export function useProyectos() {
  const { idioma } = useIdioma();
  return useMemo(
    () => (idioma === "es" ? proyectos : proyectos.map((p) => superponer(p, proyectosEn[p.id]))),
    [idioma],
  );
}

// Descripción de una pieza del Laboratorio en el idioma elegido
export function useDescripcionLab() {
  const { idioma } = useIdioma();
  return (descripcion) => (idioma === "en" ? (labEn[descripcion] ?? descripcion) : descripcion);
}
