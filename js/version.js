// ==========================================================
// MarketPulse — Versión del programa y sello del pie de página
// ÚNICA FUENTE DE VERDAD de la versión mostrada en el pie de
// página (index, analysis, metals, forex, about y legal).
// Al publicar una versión nueva, cambia solo APP_VERSION aquí.
// ==========================================================

const APP_VERSION = '3.2.0'; // MarketPulse multi-activo (cripto + metales + forex)
const APP_RELEASE = {
  es: '25 de septiembre de 2026',
  en: 'September 25, 2026',
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
  // En páginas sin datos de mercado (p. ej. legal.html) el sello sirve de hora de carga.
  const ut = document.getElementById('updateTime');
  if (ut && ut.textContent.trim() === '—') {
    ut.textContent = new Date().toLocaleString(lang === 'es' ? 'es-ES' : 'en-US');
  }
}

// Los scripts se cargan al final del <body>, con el pie ya en el DOM.
stampVersionFooter();
