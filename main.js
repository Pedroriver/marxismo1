/* ============================================================
   FERNANDO NARVÁEZ — main.js
   1) Mostrar/ocultar la sección "Familia en crisis".
   2) Resaltar en el menú la sección que se está leyendo.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1) TOGGLE DE SECCIÓN COLAPSABLE ---------- */
  const botonesToggle = document.querySelectorAll('.nav-toggle');

  botonesToggle.forEach((boton) => {
    const idSeccion = boton.dataset.toggle;
    const seccion = document.getElementById(idSeccion);
    if (!seccion) return;

    boton.addEventListener('click', () => {
      const abierta = boton.getAttribute('aria-expanded') === 'true';

      boton.setAttribute('aria-expanded', String(!abierta));
      seccion.hidden = abierta;

      if (!abierta) {
        seccion.scrollIntoView({ behavior: 'smooth', block: 'start' });
        const titulo = seccion.querySelector('h2');
        if (titulo) {
          titulo.setAttribute('tabindex', '-1');
          titulo.focus({ preventScroll: true });
        }
      }
    });
  });

  /* ---------- 2) SCROLL SPY ---------- */
  const enlacesNav = Array.from(document.querySelectorAll('#menu-principal a[href^="#"]'))
    .map((a) => {
      const id = a.getAttribute('href').slice(1);
      const seccion = document.getElementById(id);
      return seccion ? { enlace: a, seccion } : null;
    })
    .filter(Boolean);

  const botonFamilia = document.querySelector('.nav-toggle[data-toggle]');
  if (botonFamilia) {
    const sec = document.getElementById(botonFamilia.dataset.toggle);
    if (sec) enlacesNav.push({ enlace: botonFamilia, seccion: sec });
  }

  const limpiarActivos = () => {
    enlacesNav.forEach(({ enlace }) => enlace.removeAttribute('aria-current'));
  };

  const marcarActivo = (entrada) => {
    limpiarActivos();
    if (entrada) entrada.enlace.setAttribute('aria-current', 'true');
  };

  const observador = new IntersectionObserver(
    (entradas) => {
      const visibles = entradas.filter((e) => e.isIntersecting);
      if (visibles.length === 0) return;

      visibles.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      const activa = visibles[0];
      const match = enlacesNav.find(({ seccion }) => seccion === activa.target);
      marcarActivo(match);
    },
    { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
  );

  enlacesNav.forEach(({ seccion }) => observador.observe(seccion));

  if (location.hash) {
    const id = location.hash.slice(1);
    const match = enlacesNav.find(({ seccion }) => seccion.id === id);
    if (match) marcarActivo(match);
  }

  /* ---------- 3) AÑO DINÁMICO EN EL FOOTER ---------- */
  const anio = document.getElementById('anio');
  if (anio) anio.textContent = new Date().getFullYear();

});