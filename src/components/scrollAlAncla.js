// Scrollea hasta una sección (#ancla) dejándola justo debajo del header fijo.
// Devuelve false si la sección no existe en la página.
export function scrollAlAncla(hash, lenis, immediate = false) {
  const el = hash && document.querySelector(hash);
  if (!el) return false;
  const header = document.querySelector("header");
  const offset = -(header ? header.offsetHeight : 0);
  if (lenis) lenis.scrollTo(el, { offset, immediate, force: immediate });
  else {
    const top = el.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top, behavior: immediate ? "auto" : "smooth" });
  }
  return true;
}
