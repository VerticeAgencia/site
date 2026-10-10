(function () {
  var root = document.documentElement;
  root.classList.add('js');

  var header = document.querySelector('.header');
  var burger = document.querySelector('.burger');
  var menu = document.getElementById('menu');

  function setMenu(open) {
    header.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  }
  burger.addEventListener('click', function () {
    setMenu(burger.getAttribute('aria-expanded') !== 'true');
  });
  menu.addEventListener('click', function (e) {
    if (e.target.closest('a')) setMenu(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && header.classList.contains('is-open')) {
      setMenu(false);
      burger.focus();
    }
  });

  function onScroll() {
    header.classList.toggle('is-scrolled', window.scrollY > 24);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  var links = [].slice.call(document.querySelectorAll('.nav ul a'));
  var map = {};
  links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });

  if ('IntersectionObserver' in window) {
    var revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); revealIO.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach(function (el, i) {
      el.style.transitionDelay = (i % 4) * 70 + 'ms';
      revealIO.observe(el);
    });

    var navIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var a = map[en.target.id];
        links.forEach(function (l) { l.classList.remove('is-active'); l.removeAttribute('aria-current'); });
        if (a) { a.classList.add('is-active'); a.setAttribute('aria-current', 'true'); }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('main > section').forEach(function (s) { navIO.observe(s); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
  }
  var track = document.getElementById('sites-track');
  if (track) {
    var btns = [].slice.call(document.querySelectorAll('.carousel__btn'));
    var dotsBox = document.getElementById('sites-dots');
    var dots = [];
    var pages = function () { return Math.max(1, Math.round(track.scrollWidth / track.clientWidth)); };
    var buildDots = function () {
      var n = pages();
      if (dots.length === n) return;
      dotsBox.innerHTML = '';
      dots = [];
      for (var i = 0; i < n; i++) {
        var d = document.createElement('button');
        d.type = 'button';
        d.className = 'carousel__dot';
        d.setAttribute('aria-label', 'Ir para o grupo ' + (i + 1) + ' de ' + n);
        d.addEventListener('click', (function (k) {
          return function () {
            var max = track.scrollWidth - track.clientWidth;
            track.scrollTo({ left: n > 1 ? max * k / (n - 1) : 0, behavior: 'smooth' });
          };
        })(i));
        dotsBox.appendChild(d);
        dots.push(d);
      }
    };
    var update = function () {
      buildDots();
      var max = track.scrollWidth - track.clientWidth;
      btns[0].disabled = track.scrollLeft <= 2;
      btns[1].disabled = track.scrollLeft >= max - 2;
      var cur = max > 0 ? Math.round(track.scrollLeft / max * (dots.length - 1)) : 0;
      dots.forEach(function (d, i) {
        d.classList.toggle('is-on', i === cur);
        if (i === cur) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current');
      });
    };
    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        var slide = track.querySelector('.shot');
        var step = slide.getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || 0);
        track.scrollBy({ left: step * Number(b.getAttribute('data-dir')) * Math.max(1, Math.floor(track.clientWidth / step)), behavior: 'smooth' });
      });
    });
    track.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }
  var desc = document.querySelector('[data-desconto]');
  if (desc) {
    var d = new Date();
    d.setDate(d.getDate() + 1);
    var dd = String(d.getDate()).padStart(2, '0') + '/' + String(d.getMonth() + 1).padStart(2, '0');
    desc.textContent = 'até dia ' + dd;
  }
})();
