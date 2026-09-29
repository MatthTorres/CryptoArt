// ==========================================================
// MarketPulse — Versión del programa y sello del pie de página
// ÚNICA FUENTE DE VERDAD de la versión mostrada en el pie de
// página (index, analysis, metals, forex, about y legal).
// Al publicar una versión nueva, cambia solo APP_VERSION aquí.
// ==========================================================

const APP_VERSION = '3.8.1'; // Analitica anonima con Umami Cloud (sin cookies, IP anonimizada) en las 7 paginas, y el punto 5 de legal.html corregido en ES/EN/PT: nombra al encargado del tratamiento, que datos se recogen, ubicacion de servidores y retencion de 6 meses. site v21, 3.8.1
const APP_RELEASE = {
  es: '28 de septiembre de 2026',
  en: 'September 28, 2026',
};

function appLang() {
  return document.documentElement.getAttribute('lang') === 'en' ? 'en' : 'es';
}

// Rellena los marcadores del pie: versión, año de copyright y fecha de la política.
function stampVersionFooter() {
  const lang = appLang();
  document.querySelectorAll('[data-app-version]').forEach(el => {
    el.textContent = 'v' + APP_VERSION;
  });
  document.querySelectorAll('[data-app-year]').forEach(el => {
    el.textContent = String(new Date().getFullYear());
  });
  document.querySelectorAll('[data-app-release]').forEach(el => {
    el.textContent = APP_RELEASE[lang] || APP_RELEASE.es;
  });
  // En páginas sin datos de mercado que sí muestran el sello (about.html) la hora
  // de carga hace de "Actualizado:"; legal.html no incluye hora y usa footerBrandLine.
  const ut = document.getElementById('updateTime');
  if (ut && ut.textContent.trim() === '—') {
    ut.textContent = new Date().toLocaleString(lang === 'es' ? 'es-ES' : 'en-US');
  }
}

// Los scripts se cargan al final del <body>, con el pie ya en el DOM.
stampVersionFooter();
