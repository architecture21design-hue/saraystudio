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

// ---- Audio player ----
(function () {
  // Tracks — replace with your MP3 paths
  var tracks = [
    /* { src: 'audio/track1.mp3', title: 'Track 1' }, */
  ];

  var bar = document.createElement('div');
  bar.className = 'player-bar';
  bar.innerHTML =
    '<button class="player-btn" aria-label="Play / pause">' +
      '<svg class="icon-play"  viewBox="0 0 16 16"><polygon points="4,2 13,8 4,14"/></svg>' +
      '<svg class="icon-pause" viewBox="0 0 16 16"><rect x="2" y="2" width="4" height="12"/><rect x="10" y="2" width="4" height="12"/></svg>' +
    '</button>';
  document.body.appendChild(bar);

  if (!tracks.length) return; // no tracks yet — button visible but inert

  var audio   = new Audio();
  var idx     = 0;
  var playing = false;

  function load(i) {
    idx = (i + tracks.length) % tracks.length;
    audio.src = tracks[idx].src;
  }

  audio.addEventListener('ended', function () { load(idx + 1); audio.play(); });

  bar.querySelector('.player-btn').addEventListener('click', function () {
    if (!audio.src) load(0);
    playing ? audio.pause() : audio.play();
    playing = !playing;
    bar.classList.toggle('player-open', playing);
  });

  load(0);
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
