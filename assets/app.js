'use strict';

(() => {
  const $ = id => document.getElementById(id);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const views = ['welcome', 'hint', 'reveal'];
  let transitionRunning = false;
  let sequence = 0;
  let flightTimer;
  let landing = false;

  function showView(name, moveFocus = true) {
    views.forEach(id => { $(id).hidden = id !== name; });
    const index = views.indexOf(name);
    const progress = document.querySelector('.progress');
    progress.setAttribute('aria-label', `Schritt ${index + 1} von 3`);
    [...progress.children].forEach((dot, i) => dot.classList.toggle('active', i === index));
    $('footer-note').textContent = name === 'reveal' ? 'AUF UNS. AUF NEW YORK. AUF DIESEN ABEND.' : 'DIE SCHÖNSTEN GESCHENKE SIND GEMEINSAME MOMENTE.';
    window.scrollTo({top: 0, behavior: 'instant'});
    if (moveFocus) $(name === 'welcome' ? 'welcome-title' : `${name}-title`).focus({preventScroll: true});
  }

  function reset() {
    sequence++;
    clearTimeout(flightTimer);
    landing = false;
    $('flight-transition').classList.remove('landing');
    $('flight-transition').close();
    $('flight-transition').hidden = true;
    transitionRunning = false;
    document.querySelector('.app-shell').inert = false;
    $('curtain-open').disabled = false;
    $('curtain').close();
    $('curtain').hidden = true;
    document.documentElement.classList.remove('curtain-active');
    $('curtain').classList.remove('parted');
    $('welcome').classList.remove('opening');
    $('confetti').replaceChildren();
    $('open-letter').disabled = false;
    $('reveal-gift').disabled = false;
    showView('welcome');
  }

  $('home-link').addEventListener('click', event => { event.preventDefault(); reset(); });
  $('back-welcome').addEventListener('click', reset);
  $('replay').addEventListener('click', reset);

  $('open-letter').addEventListener('click', () => {
    if (transitionRunning) return;
    transitionRunning = true;
    $('open-letter').disabled = true;
    $('welcome').classList.add('opening');
    const currentSequence = sequence;
    window.setTimeout(() => {
      if (currentSequence !== sequence) return;
      showView('hint');
      transitionRunning = false;
      $('open-letter').disabled = false;
      $('welcome').classList.remove('opening');
    }, reducedMotion ? 0 : 700);
  });

  function finishFlight() {
    if (landing) return;
    landing = true;
    clearTimeout(flightTimer);
    const flight = $('flight-transition');
    flight.classList.add('landing');
    $('flight-skip').disabled = true;
    flightTimer = window.setTimeout(openCurtain, reducedMotion ? 0 : 600);
  }

  function openCurtain() {
    clearTimeout(flightTimer);
    const flight = $('flight-transition');
    flight.close();
    flight.hidden = true;
    const curtain = $('curtain');
    curtain.classList.remove('parted');
    curtain.hidden = false;
    curtain.showModal();
    transitionRunning = false;
    $('reveal-gift').disabled = false;
    $('curtain-open').disabled = false;
    $('curtain-open').focus();
  }

  $('reveal-gift').addEventListener('click', () => {
    if (transitionRunning) return;
    transitionRunning = true;
    $('reveal-gift').disabled = true;
    document.documentElement.classList.add('curtain-active');
    document.querySelector('.app-shell').inert = true;
    if (reducedMotion) { openCurtain(); return; }
    const flight = $('flight-transition');
    landing = false;
    flight.classList.remove('landing');
    $('flight-skip').disabled = false;
    flight.hidden = false;
    flight.showModal();
    $('flight-skip').focus();
    flightTimer = window.setTimeout(finishFlight, 4200);
  });
  $('flight-skip').addEventListener('click', finishFlight);
  $('flight-transition').addEventListener('cancel', event => {
    event.preventDefault();
    finishFlight();
  });

  $('curtain-open').addEventListener('click', () => {
    if (transitionRunning || $('curtain').hidden) return;
    transitionRunning = true;
    $('curtain-open').disabled = true;
    const currentSequence = sequence;
    showView('reveal', false);
    $('curtain').classList.add('parted');
    window.setTimeout(() => {
      if (currentSequence !== sequence) return;
      $('curtain').close();
    $('curtain').hidden = true;
    document.documentElement.classList.remove('curtain-active');
      document.querySelector('.app-shell').inert = false;
      transitionRunning = false;
      $('curtain-open').disabled = false;
      $('reveal-title').focus({preventScroll: true});
      if (!reducedMotion) celebrate();
    }, reducedMotion ? 0 : 1250);
  });

  $('curtain').addEventListener('cancel', event => event.preventDefault());

  $('curtain').addEventListener('keydown', event => {
    if (event.key === 'Tab') {
      event.preventDefault();
      $('curtain-open').focus();
    }
    if (event.key === 'Escape' && !transitionRunning) {
      $('curtain').close();
    $('curtain').hidden = true;
    document.documentElement.classList.remove('curtain-active');
      document.querySelector('.app-shell').inert = false;
      $('reveal-gift').focus();
    }
  });

  function celebrate() {
    const container = $('confetti');
    container.replaceChildren();
    const colors = ['#b19662', '#972b32', '#d8bd82', '#e1d1b1'];
    for (let i = 0; i < 48; i++) {
      const piece = document.createElement('i');
      piece.className = 'confetti-piece';
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.backgroundColor = colors[i % colors.length];
      piece.style.animationDelay = `${Math.random() * .8}s`;
      piece.style.setProperty('--drift', `${Math.random() * 180 - 90}px`);
      piece.style.setProperty('--spin', `${Math.random() * 720 - 360}deg`);
      container.appendChild(piece);
    }
    window.setTimeout(() => container.replaceChildren(), 5000);
  }
})();
