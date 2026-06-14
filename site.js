// ---- Page fade transitions ----
(function () {
  // Fade in on load
  function fadeIn() { document.body.classList.add('page-ready'); }
  if (document.readyState === 'complete') {
    requestAnimationFrame(fadeIn);
  } else {
    window.addEventListener('load', function () { requestAnimationFrame(fadeIn); });
  }

  // Fade out before navigation
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a');
    if (!a) return;
    var href = a.getAttribute('href');
    if (!href) return;
    // Skip: external links, anchors, mailto/tel, target="_blank"
    if (a.target === '_blank') return;
    if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
    // Only intercept same-origin relative links
    if (href.startsWith('http://') || href.startsWith('https://')) return;
    e.preventDefault();
    document.body.classList.remove('page-ready');
    document.body.classList.add('page-leaving');
    setTimeout(function () { window.location.href = href; }, 360);
  });
})();

// ---- Mobile nav toggle ----
(function () {
  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.nav-toggle');
  if (toggle && header) {
    toggle.addEventListener('click', function () {
      header.classList.toggle('nav-open');
    });
    document.querySelectorAll('.nav-links a').forEach(function (a) {
      a.addEventListener('click', function () { header.classList.remove('nav-open'); });
    });
  }
})();

// ---- Home slideshow ----
(function () {
  var show = document.querySelector('.slideshow');
  if (!show) return;
  var slides = Array.prototype.slice.call(show.querySelectorAll('.slide'));
  if (slides.length < 2) return;
  var i = 0, timer = null, DELAY = 4000;

  function go(n) {
    slides[i].classList.remove('is-active');
    i = (n + slides.length) % slides.length;
    slides[i].classList.add('is-active');
  }
  function next() { go(i + 1); }
  function prev() { go(i - 1); }
  function start() { stop(); timer = setInterval(next, DELAY); }
  function stop() { if (timer) { clearInterval(timer); timer = null; } }

  var nextBtn = show.querySelector('.slideshow-arrow.next');
  var prevBtn = show.querySelector('.slideshow-arrow.prev');
  if (nextBtn) nextBtn.addEventListener('click', function () { next(); start(); });
  if (prevBtn) prevBtn.addEventListener('click', function () { prev(); start(); });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { next(); start(); }
    else if (e.key === 'ArrowLeft') { prev(); start(); }
  });

  slides[0].classList.add('is-active');
  start();
})();
