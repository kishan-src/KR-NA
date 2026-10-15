/**
 * About Page Controller - Kishan Rai Portfolio & Devotional Vision
 * Features:
 * - Ambient Video Background Toggle
 * - Divine Flute Audio Player
 * - Inverted Peacock Feather Quill Cursor & Water Submerge Ripple Effect
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================================================
  // Ambient Video Background Toggle
  // ==========================================================================
  const bgVideo = document.getElementById('bgVideo');
  const videoBgContainer = document.getElementById('videoBgContainer');
  const bgVideoToggle = document.getElementById('bgVideoToggle');
  const toggleLabel = document.getElementById('toggleLabel');

  let isVideoBgActive = true;

  if (bgVideoToggle) {
    bgVideoToggle.addEventListener('click', () => {
      isVideoBgActive = !isVideoBgActive;

      if (isVideoBgActive) {
        bgVideoToggle.classList.add('active');
        bgVideoToggle.setAttribute('aria-checked', 'true');
        if (videoBgContainer) videoBgContainer.classList.remove('hidden');
        if (toggleLabel) toggleLabel.textContent = 'AMBIENT VIDEO';
        if (bgVideo) bgVideo.play().catch(() => {});
      } else {
        bgVideoToggle.classList.remove('active');
        bgVideoToggle.setAttribute('aria-checked', 'false');
        if (videoBgContainer) videoBgContainer.classList.add('hidden');
        if (toggleLabel) toggleLabel.textContent = 'BLACK CANVAS';
        if (bgVideo) bgVideo.pause();
      }
    });
  }

  // ==========================================================================
  // Divine Flute Audio Player
  // ==========================================================================
  const FLUTE_AUDIO_URL = 'https://res.cloudinary.com/acggupzy/video/upload/v1791861453/WhatsApp_Audio_2026-10-12_at_6.56.35_PM.mp3';
  let fluteAudio = document.getElementById('fluteAudio');
  if (!fluteAudio) {
    fluteAudio = new Audio(FLUTE_AUDIO_URL);
    fluteAudio.id = 'fluteAudio';
    fluteAudio.loop = true;
    fluteAudio.preload = 'auto';
  } else {
    fluteAudio.loop = true;
  }

  const audioToggleBtn = document.getElementById('audioToggleBtn');
  let isPlayingAudio = false;

  function toggleAudio() {
    if (!isPlayingAudio) {
      fluteAudio.play().then(() => {
        isPlayingAudio = true;
        if (audioToggleBtn) audioToggleBtn.classList.add('playing');
      }).catch(() => {});
    } else {
      fluteAudio.pause();
      isPlayingAudio = false;
      if (audioToggleBtn) audioToggleBtn.classList.remove('playing');
    }
  }

  if (audioToggleBtn) {
    audioToggleBtn.addEventListener('click', toggleAudio);
  }

  // ==========================================================================
  // Water Submerge Ripple Pulse Effect
  // ==========================================================================
  function createWaterRipple(x, y) {
    const ripple = document.createElement('div');
    ripple.className = 'water-submerge-ripple';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    ripple.innerHTML = `
      <span class="water-drop-impact"></span>
      <span class="water-ripple-wave wave-1"></span>
      <span class="water-ripple-wave wave-2"></span>
      <span class="water-ripple-wave wave-3"></span>
    `;

    document.body.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 850);
  }

  // ==========================================================================
  // Custom Inverted Peacock Feather Cursor
  // ==========================================================================
  function initCustomCursor() {
    const customCursor = document.getElementById('customCursor');
    if (!customCursor) return;

    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    let isVisible = false;

    function isTextElement(target) {
      if (!target) return false;
      const isInteractive = target.closest(
        'button, a, input, select, textarea, [role="button"], [role="switch"], .btn, .btn-github-large, .btn-home-return, .nav-item, .back-home-btn'
      );
      if (isInteractive) return false;

      const textTags = 'h1, h2, h3, h4, h5, h6, p, blockquote, .thought-card-body, .about-hero-subtitle, .creator-quote-strip, .om-symbol';
      return !!target.closest(textTags);
    }

    function isInteractiveElement(target) {
      if (!target) return false;
      return !!target.closest('button, a, input, select, textarea, [role="button"], .btn, .btn-github-large, .btn-home-return, .nav-item, .back-home-btn, .glass-btn');
    }

    window.addEventListener('mousemove', (e) => {
      customCursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;

      if (!isVisible) {
        isVisible = true;
        customCursor.classList.add('visible');
      }

      const target = document.elementFromPoint(e.clientX, e.clientY) || e.target;

      if (isTextElement(target)) {
        customCursor.classList.remove('cursor-mode-feather', 'cursor-interactive');
        customCursor.classList.add('cursor-mode-dot');
      } else {
        customCursor.classList.remove('cursor-mode-dot');
        customCursor.classList.add('cursor-mode-feather');

        if (isInteractiveElement(target)) {
          customCursor.classList.add('cursor-interactive');
        } else {
          customCursor.classList.remove('cursor-interactive');
        }
      }
    });

    window.addEventListener('mouseleave', () => {
      isVisible = false;
      customCursor.classList.remove('visible');
    });

    window.addEventListener('mouseenter', () => {
      isVisible = true;
      customCursor.classList.add('visible');
    });

    // Tactile press on click & trigger water droplet submerged ripple pulse
    window.addEventListener('mousedown', (e) => {
      customCursor.classList.add('clicking');
      createWaterRipple(e.clientX, e.clientY);
    });

    window.addEventListener('mouseup', () => {
      customCursor.classList.remove('clicking');
    });
  }

  initCustomCursor();
});
