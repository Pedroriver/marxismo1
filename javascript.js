/* ============================================================
   FERNANDO NARVÁEZ — main.js
   Dos funcionalidades:
   1) Mostrar/ocultar la sección "Familia en crisis" con el botón.
   2) Resaltar en el menú la sección que se está leyendo (scroll spy).
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

      // Si la abrimos, hacemos scroll suave hasta ella
      if (!abierta) {
        seccion.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Movemos el foco al título para accesibilidad
        const titulo = seccion.querySelector('h2');
        if (titulo) {
          titulo.setAttribute('tabindex', '-1');
          titulo.focus({ preventScroll: true });
        }
      }
    });
  });

  /* ---------- 2) SCROLL SPY ---------- */
  // Recoge todos los enlaces del menú que apuntan a una sección existente
  const enlacesNav = Array.from(document.querySelectorAll('#menu-principal a[href^="#"]'))
    .map((a) => {
      const id = a.getAttribute('href').slice(1);
      const seccion = document.getElementById(id);
      return seccion ? { enlace: a, seccion } : null;
    })
    .filter(Boolean);

  // También incluimos el botón de "Familia en crisis" como sección observable
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
    if (entrada) {
      entrada.enlace.setAttribute('aria-current', 'true');
    }
  };

  // IntersectionObserver: marca la sección cuya parte superior esté más cerca del top
  const observador = new IntersectionObserver(
    (entradas) => {
      // Solo consideramos las que están intersectando
      const visibles = entradas.filter((e) => e.isIntersecting);
      if (visibles.length === 0) return;

      // Elegimos la que esté más arriba (mayor intersectionRatio o menor top)
      visibles.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      const activa = visibles[0];

      const match = enlacesNav.find(({ seccion }) => seccion === activa.target);
      marcarActivo(match);
    },
    {
      rootMargin: '-30% 0px -60% 0px', // franja de "lectura" cerca del top
      threshold: 0
    }
  );

  enlacesNav.forEach(({ seccion }) => observador.observe(seccion));

  // Fallback: si el usuario recarga con un hash en la URL, marcamos ese enlace
  if (location.hash) {
    const id = location.hash.slice(1);
    const match = enlacesNav.find(({ seccion }) => seccion.id === id);
    if (match) marcarActivo(match);
  }

  /* ---------- 3) AÑO DINÁMICO EN EL FOOTER ---------- */
  const anio = document.getElementById('anio');
  if (anio) anio.textContent = new Date().getFullYear();

});