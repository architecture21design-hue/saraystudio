/* Saray Studio: EN / IT switch. Shared by index.html and projects.html.
   Static text uses data-i18n / data-i18n-html / data-i18n-aria attributes.
   Dynamic gallery text (names, places) goes through SarayI18n.tr(). */
(function () {
  var KEY = 'saray-lang';
  var T = {
    en: {},
    it: {
      'nav.interiors': 'Interni',
      'nav.architecture': 'Architettura',
      'nav.products': 'Prodotti',
      'nav.home': 'Home',
      'nav.studio': 'Studio',
      'nav.contact': 'Contatti',
      'nav.menu': 'Menu',
      'hero.message': 'Vi invitiamo a godere di RADIOSARAY cliccando sul player nell’angolo mentre esplorate il sito.',
      'studio.eyebrow': 'Lo Studio',
      'studio.p1': '<span class="brand">SARAY</span> è una casa privata del design fondata da Mohsen Masoudnia e Parisa Sayadifar. Un’espressione raffinata di quiet luxury, <span class="brand">SARAY</span> unisce architettura d’interni, arredi su misura e artigianato d’eccezione per creare spazi dal carattere duraturo.',
      'studio.p2': 'Più che una destinazione del design, <span class="brand">SARAY</span> è un luogo di calore, discrezione e cura del dettaglio, un invito a vivere il design con intenzione, eleganza e un duraturo senso di appartenenza.',
      'studio.alt': 'Mohsen Masoudnia e Parisa Sayadifar, fondatori di Saray Studio',
      'studio.scroll': 'Scorri',
      'contact.label': 'Scriveteci',
      'radio.play': 'Riproduci',
      'radio.playpause': 'Riproduci o metti in pausa Radio Saray',
      'gallery.viewall': 'Vedi tutto',
      'gallery.close': 'Chiudi',
      'gallery.photo': 'foto',
      'meta.title': 'Saray Studio',
      'meta.desc': 'Interni, architettura e prodotti di Saray Studio, Milano.'
    }
  };
  var DYN = {
    it: {
      'Private Residence': 'Residenza Privata',
      'Private Club': 'Club Privato',
      'Milano, Italy': 'Milano, Italia',
      'Monferrato, Italy': 'Monferrato, Italia',
      'Liguria, Italy': 'Liguria, Italia',
      'Bergamo, Italy': 'Bergamo, Italia',
      'Product': 'Prodotto',
      'Photos Nicolò Panzeri': 'Foto Nicolò Panzeri'
    }
  };
  var lang = 'en';
  try { var s = localStorage.getItem(KEY); if (s === 'it' || s === 'en') lang = s; } catch (e) {}

  // English text is whatever is already in the HTML; remember it before the first swap
  var enCache = new WeakMap();
  function remember(el, kind, read) {
    var m = enCache.get(el) || {};
    if (!(kind in m)) m[kind] = read(el);
    enCache.set(el, m);
    return m[kind];
  }
  function t(key) { return (T[lang] && T[lang][key]) || null; }
  function tr(str) { return (DYN[lang] && DYN[lang][str]) || str; }
  function apply() {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var en = remember(el, 'text', function (e) { return e.textContent; });
      el.textContent = t(el.dataset.i18n) || en;
    });
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var en = remember(el, 'html', function (e) { return e.innerHTML; });
      el.innerHTML = t(el.dataset.i18nHtml) || en;
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
      var en = remember(el, 'aria', function (e) { return e.getAttribute('aria-label'); });
      el.setAttribute('aria-label', t(el.dataset.i18nAria) || en);
    });
    document.querySelectorAll('[data-i18n-alt]').forEach(function (el) {
      var en = remember(el, 'alt', function (e) { return e.getAttribute('alt'); });
      el.setAttribute('alt', t(el.dataset.i18nAlt) || en);
    });
    var desc = document.querySelector('meta[name="description"]');
    if (desc) {
      var enD = remember(desc, 'content', function (e) { return e.getAttribute('content'); });
      desc.setAttribute('content', t('meta.desc') || enD);
    }
    document.title = t('meta.title') || 'Saray Studio';
    document.querySelectorAll('[data-lang-set]').forEach(function (el) {
      var on = el.dataset.langSet === lang;
      el.classList.toggle('active', on);
      el.setAttribute('aria-current', on ? 'true' : 'false');
    });
  }
  function set(l) {
    lang = l === 'it' ? 'it' : 'en';
    try { localStorage.setItem(KEY, lang); } catch (e) {}
    apply();
    document.dispatchEvent(new CustomEvent('saray-lang', { detail: lang }));
  }
  document.addEventListener('click', function (e) {
    var el = e.target.closest && e.target.closest('[data-lang-set]');
    if (!el) return;
    e.preventDefault();
    set(el.dataset.langSet);
  });
  window.SarayI18n = { t: t, tr: tr, apply: apply, set: set, get: function () { return lang; } };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', apply);
  else apply();
})();
