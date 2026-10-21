(() => {
  const opening = document.getElementById('opening');
  const openButton = document.getElementById('openSurprise');
  const replayButton = document.getElementById('replayButton');
  const birthdaySong = document.getElementById('birthdaySong');
  const musicToggle = document.getElementById('musicToggle');
  const musicToggleLabel = document.getElementById('musicToggleLabel');
  const teaseButton = document.getElementById('teaseButton');
  const teaseReveal = document.getElementById('teaseReveal');
  const toast = document.getElementById('toast');
  let toastTimer;

  function enterSite() {
    opening.classList.add('is-closing');
    document.body.classList.remove('locked');
    window.setTimeout(() => {
      opening.setAttribute('aria-hidden', 'true');
      document.getElementById('main').focus({ preventScroll: true });
    }, 260);
  }

  function updateMusicButton() {
    const playing = !birthdaySong.paused && !birthdaySong.ended;
    musicToggle.setAttribute('aria-pressed', String(playing));
    musicToggle.setAttribute('aria-label', playing ? 'Pause our song' : 'Play our song');
    musicToggleLabel.textContent = playing ? 'PAUSE SONG' : 'PLAY OUR SONG';
  }

  function startSong() {
    musicToggle.hidden = false;
    birthdaySong.play().then(updateMusicButton).catch(updateMusicButton);
  }

  function replay() {
    birthdaySong.pause();
    birthdaySong.currentTime = 0;
    musicToggle.hidden = true;
    updateMusicButton();
    window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    opening.removeAttribute('aria-hidden');
    opening.classList.remove('is-closing');
    document.body.classList.add('locked');
    openButton.focus({ preventScroll: true });
  }

  openButton.addEventListener('click', () => {
    enterSite();
    startSong();
  });
  musicToggle.addEventListener('click', () => {
    if (birthdaySong.paused || birthdaySong.ended) {
      if (birthdaySong.ended) birthdaySong.currentTime = 0;
      birthdaySong.play().then(updateMusicButton).catch(updateMusicButton);
    } else {
      birthdaySong.pause();
      updateMusicButton();
    }
  });
  birthdaySong.addEventListener('play', updateMusicButton);
  birthdaySong.addEventListener('pause', updateMusicButton);
  birthdaySong.addEventListener('ended', updateMusicButton);
  replayButton.addEventListener('click', replay);

  teaseButton.addEventListener('click', () => {
    const expanded = teaseButton.getAttribute('aria-expanded') === 'true';
    teaseButton.setAttribute('aria-expanded', String(!expanded));
    teaseReveal.hidden = expanded;
    teaseButton.innerHTML = expanded
      ? 'Tap for the official answer <span aria-hidden="true">♡</span>'
      : 'Officially approved <span aria-hidden="true">♥</span>';
    if (!expanded) teaseReveal.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'nearest' });
  });

  // Photo filenames are intentionally local: replace them with the user's original photos.
  document.querySelectorAll('[data-photo-slot]').forEach((slot) => {
    const image = slot.querySelector('img');
    if (!image) return;
    const markLoaded = () => {
      slot.classList.add('has-photo');
      image.style.display = 'block';
    };
    const markMissing = () => {
      slot.classList.remove('has-photo');
      image.style.display = 'none';
    };
    if (image.complete && image.naturalWidth > 0) markLoaded();
    image.addEventListener('load', markLoaded);
    image.addEventListener('error', markMissing);
  });

  // Reveal content gently as it enters view; keep it visible if IntersectionObserver is unavailable.
  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.13, rootMargin: '0px 0px -25px 0px' });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  // A gentle progress marker in the console helps verify the single-page interactions while testing.
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !teaseReveal.hidden) {
      teaseReveal.hidden = true;
      teaseButton.setAttribute('aria-expanded', 'false');
      teaseButton.innerHTML = 'Tap for the official answer <span aria-hidden="true">♡</span>';
    }
  });
})();
