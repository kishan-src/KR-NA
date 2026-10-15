/**
 * Radha Krishna Devotional Hero Section Interactive Controller
 * Features:
 * - Directional Hover Stretch Move Nav Pill
 * - Glass UI Video Background Toggle (Feather Video <-> Pure Black)
 * - Divine Bansuri Flute Audio Player
 * - Interactive Cursor Spotlight Video Illumination
 * - Divine Flute & White Dot Text Custom Cursor
 * - Interactive Vertical Rail Progress & Wisdom Quotes
 * - Glass Drawer Navigation & Sacred Chants Modal
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- Element Selectors ---
  const navContainer = document.getElementById('navLinks');
  const navItems = document.querySelectorAll('.nav-item');
  const navStretchPill = document.getElementById('navStretchPill');
  
  const bgVideo = document.getElementById('bgVideo');
  const videoBgContainer = document.getElementById('videoBgContainer');
  const bgVideoToggle = document.getElementById('bgVideoToggle');
  const toggleLabel = document.getElementById('toggleLabel');

  const searchInput = document.getElementById('searchInput');
  const searchClearBtn = document.getElementById('searchClearBtn');
  const menuToggleBtn = document.getElementById('menuToggleBtn');
  const drawerOverlay = document.getElementById('drawerOverlay');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');
  const drawerLinks = document.querySelectorAll('.drawer-link');
  
  const railSegments = document.querySelectorAll('.rail-segment');
  const railCounter = document.getElementById('railCounter');
  
  const emblemBtn = document.getElementById('emblemBtn');
  const audioStatusText = document.getElementById('audioStatusText');
  const chantsBtn = document.getElementById('chantsBtn');
  const chantsModal = document.getElementById('chantsModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const darshanBtn = document.getElementById('darshanBtn');
  const toast = document.getElementById('toast');
  const quoteText = document.getElementById('quoteText');
  const quoteSource = document.getElementById('quoteSource');
  const subTitle = document.getElementById('subTitle');
  const copyMantraBtn = document.getElementById('drawerMahaMantraBtn');

  // --- Toast Notification Helper ---
  let toastTimer = null;
  function showToast(message) {
    if (toastTimer) clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add('show');
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  // ==========================================================================
  // Hover Stretch Move Directional Style Navigation Pill
  // ==========================================================================
  let currentActiveIndex = 0;
  let lastNavIndex = 0;
  let stretchTimeout = null;

  function movePillTo(targetElement, isDirectional = true) {
    if (!targetElement || !navStretchPill || !navContainer) return;

    const navRect = navContainer.getBoundingClientRect();
    const targetRect = targetElement.getBoundingClientRect();

    const targetLeft = targetRect.left - navRect.left;
    const targetWidth = targetRect.width;
    const targetIndex = parseInt(targetElement.getAttribute('data-index') || '0', 10);

    // Apply directional stretch dynamic when moving between different tabs
    if (isDirectional && targetIndex !== lastNavIndex) {
      if (stretchTimeout) clearTimeout(stretchTimeout);

      navStretchPill.classList.remove('stretch-right', 'stretch-left');
      if (targetIndex > lastNavIndex) {
        navStretchPill.classList.add('stretch-right');
      } else {
        navStretchPill.classList.add('stretch-left');
      }

      // Reset stretch elastic shape back to standard rounded capsule once target reached
      stretchTimeout = setTimeout(() => {
        navStretchPill.classList.remove('stretch-right', 'stretch-left');
      }, 240);
    }

    lastNavIndex = targetIndex;

    navStretchPill.style.left = `${targetLeft}px`;
    navStretchPill.style.width = `${targetWidth}px`;
    navStretchPill.style.opacity = '1';
  }

  // Initialize pill position on active item
  const activeItem = navContainer ? navContainer.querySelector('.nav-item.active') : null;
  if (activeItem) {
    currentActiveIndex = parseInt(activeItem.getAttribute('data-index') || '0', 10);
    lastNavIndex = currentActiveIndex;
    // Delay slightly to ensure fonts and layout dimensions have computed
    setTimeout(() => {
      movePillTo(activeItem, false);
    }, 120);
  }

  // Nav Item Events
  navItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      movePillTo(item, true);
    });

    item.addEventListener('click', (e) => {
      e.preventDefault();
      const navName = item.getAttribute('data-nav') || item.getAttribute('href')?.replace('#', '');
      switchView(navName);
    });
  });

  // When mouse leaves the entire nav container, snap pill back to the active item
  if (navContainer) {
    navContainer.addEventListener('mouseleave', () => {
      const currentActive = navContainer.querySelector('.nav-item.active');
      if (currentActive) {
        movePillTo(currentActive, true);
      }
    });
  }

  // Recalculate pill on window resize
  window.addEventListener('resize', () => {
    const currentActive = navContainer ? navContainer.querySelector('.nav-item.active') : null;
    if (currentActive) {
      movePillTo(currentActive, false);
    }
  });

  // ==========================================================================
  // Glass UI Background Video Toggle Switch
  // ==========================================================================
  let isVideoBgActive = true;

  if (bgVideoToggle) {
    bgVideoToggle.addEventListener('click', () => {
      isVideoBgActive = !isVideoBgActive;

      if (isVideoBgActive) {
        bgVideoToggle.classList.add('active');
        bgVideoToggle.setAttribute('aria-checked', 'true');
        videoBgContainer.classList.remove('hidden');
        if (toggleLabel) toggleLabel.textContent = 'AMBIENT VIDEO';
        if (bgVideo) bgVideo.play().catch(() => {});
        showToast('✨ Celestial Feather Video Background: Enabled');
      } else {
        bgVideoToggle.classList.remove('active');
        bgVideoToggle.setAttribute('aria-checked', 'false');
        videoBgContainer.classList.add('hidden');
        if (toggleLabel) toggleLabel.textContent = 'BLACK CANVAS';
        if (bgVideo) bgVideo.pause();
        showToast('🌑 Minimalist Pure Black Canvas: Enabled');
      }
    });
  }

  // ==========================================================================
  // Search Bar Functionality
  // ==========================================================================
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      if (searchInput.value.trim().length > 0) {
        searchClearBtn.style.display = 'flex';
      } else {
        searchClearBtn.style.display = 'none';
      }
    });

    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && searchInput.value.trim().length > 0) {
        showToast(`Searching for: "${searchInput.value.trim()}"`);
      }
    });

    searchClearBtn.addEventListener('click', () => {
      searchInput.value = '';
      searchClearBtn.style.display = 'none';
      searchInput.focus();
    });
  }

  // ==========================================================================
  // Hamburger Slide Drawer
  // ==========================================================================
  function openDrawer() {
    drawerOverlay.classList.add('open');
    menuToggleBtn.setAttribute('aria-expanded', 'true');
    drawerOverlay.setAttribute('aria-hidden', 'false');
  }

  function closeDrawer() {
    drawerOverlay.classList.remove('open');
    menuToggleBtn.setAttribute('aria-expanded', 'false');
    drawerOverlay.setAttribute('aria-hidden', 'true');
  }

  if (menuToggleBtn) menuToggleBtn.addEventListener('click', openDrawer);
  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeDrawer);
  if (drawerOverlay) {
    drawerOverlay.addEventListener('click', (e) => {
      if (e.target === drawerOverlay) closeDrawer();
    });
  }

  drawerLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const navName = link.getAttribute('data-nav') || link.getAttribute('href')?.replace('#', '');
      if (navName) {
        switchView(navName);
        closeDrawer();
      }
    });
  });

  // ==========================================================================
  // Right Vertical Rail Progress Indicator
  // ==========================================================================
  const sectionData = [
    {
      step: '01 / 04',
      subtitle: 'THE SUPREME EMBODIMENT OF ETERNAL LOVE',
      quote: '"Wherever there is Krishna and Radha, there is eternal grace, supreme joy, and unconditional love."',
      source: '— Shrimad Bhagavatam & Gita Wisdom'
    },
    {
      step: '02 / 04',
      subtitle: 'THE MYSTIC MELODY OF THE DIVINE FLUTE',
      quote: '"When Krishna plays His Venu flute in the groves of Vrindavan, the entire cosmos pauses in sweet ecstasy."',
      source: '— Chaitanya Charitamrita'
    },
    {
      step: '03 / 04',
      subtitle: 'THE TIMELESS GITA PHILOSOPHY OF SURRENDER',
      quote: '"Abandon all varieties of dharmas and simply surrender unto Me. I shall deliver you from all sinful reactions."',
      source: '— Bhagavad Gita 18.66'
    },
    {
      step: '04 / 04',
      subtitle: 'THE SACRED MAHA-MANTRA OF TRANSCENDENCE',
      quote: '"Hare Krishna Hare Krishna, Krishna Krishna Hare Hare • Hare Rama Hare Rama, Rama Rama Hare Hare."',
      source: '— Kali-Santarana Upanishad'
    }
  ];

  let currentRailIndex = 0;
  let phraseAutoTimer = null;
  let isTaglineHovered = false;

  // Adaptive timing calculation:
  // Dynamically increases display time for longer text (phrases + sources).
  // Ensures short verses remain for an ample comfortable baseline (~6.5s)
  // while longer verses automatically get extended time (up to ~18-20s) to read with ease.
  function calculatePhraseDuration(data) {
    if (!data) return 7500;
    const quote = data.quote || '';
    const source = data.source || '';
    const fullText = `${quote} ${source}`.trim();
    const charCount = fullText.length;
    const wordCount = (fullText.match(/\S+/g) || []).length;

    // Base cognitive absorption pause: 4000ms
    // Reading allowance: ~42ms per character + ~120ms per word
    const readingTime = (charCount * 42) + (wordCount * 120);
    const totalDuration = 4000 + readingTime;

    // Enforce minimum 6500ms (6.5s) and maximum 22000ms (22s)
    return Math.min(22000, Math.max(6500, Math.round(totalDuration)));
  }

  function scheduleNextPhrase() {
    if (phraseAutoTimer) {
      clearTimeout(phraseAutoTimer);
      phraseAutoTimer = null;
    }
    if (isTaglineHovered) {
      return; // Do not auto-advance while visitor is hovering over the box or rail
    }
    const currentData = sectionData[currentRailIndex];
    const duration = calculatePhraseDuration(currentData);
    phraseAutoTimer = setTimeout(() => {
      const nextIndex = (currentRailIndex + 1) % sectionData.length;
      updateRailStep(nextIndex);
    }, duration);
  }

  function updateRailStep(index, isManual = false) {
    if (index < 0 || index >= sectionData.length) return;
    currentRailIndex = index;

    // Update rail segment indicators
    railSegments.forEach((segment, i) => {
      if (i === index) {
        segment.classList.add('active');
      } else {
        segment.classList.remove('active');
      }
    });

    // Synchronize drawer links if present
    if (typeof drawerLinks !== 'undefined' && drawerLinks) {
      drawerLinks.forEach((link) => {
        const slideIdx = parseInt(link.getAttribute('data-slide') || '-1', 10);
        if (slideIdx === index) {
          link.classList.add('active');
        } else if (slideIdx >= 0 && slideIdx < sectionData.length) {
          link.classList.remove('active');
        }
      });
    }

    const data = sectionData[index];
    if (data) {
      if (railCounter) {
        railCounter.textContent = data.step;
      }
      
      // Gentle fade-out before updating content
      if (quoteText) {
        quoteText.style.opacity = '0';
        quoteText.style.transform = 'translateY(6px)';
      }
      if (quoteSource) {
        quoteSource.style.opacity = '0';
        quoteSource.style.transform = 'translateY(4px)';
      }
      if (subTitle) {
        subTitle.style.opacity = '0';
        subTitle.style.transform = 'translateY(-3px)';
      }
      
      setTimeout(() => {
        if (subTitle) subTitle.textContent = data.subtitle;
        if (quoteText) quoteText.textContent = data.quote;
        if (quoteSource) quoteSource.textContent = data.source;

        // Smooth fade-in
        if (quoteText) {
          quoteText.style.opacity = '1';
          quoteText.style.transform = 'translateY(0)';
        }
        if (quoteSource) {
          quoteSource.style.opacity = '1';
          quoteSource.style.transform = 'translateY(0)';
        }
        if (subTitle) {
          subTitle.style.opacity = '1';
          subTitle.style.transform = 'translateY(0)';
        }
      }, 200);
    }

    // Reschedule next rotation with adaptive timing based on newly active phrase
    scheduleNextPhrase();
  }

  railSegments.forEach((segment, idx) => {
    segment.addEventListener('click', () => {
      updateRailStep(idx, true);
    });
  });

  // Pause auto-rotation on hover over the tagline quote box or vertical rail
  const taglineCard = document.querySelector('.tagline-container');
  if (taglineCard) {
    taglineCard.addEventListener('mouseenter', () => {
      isTaglineHovered = true;
      if (phraseAutoTimer) {
        clearTimeout(phraseAutoTimer);
        phraseAutoTimer = null;
      }
    });
    taglineCard.addEventListener('mouseleave', () => {
      isTaglineHovered = false;
      scheduleNextPhrase();
    });
  }

  const rightRailCard = document.querySelector('.right-rail');
  if (rightRailCard) {
    rightRailCard.addEventListener('mouseenter', () => {
      isTaglineHovered = true;
      if (phraseAutoTimer) {
        clearTimeout(phraseAutoTimer);
        phraseAutoTimer = null;
      }
    });
    rightRailCard.addEventListener('mouseleave', () => {
      isTaglineHovered = false;
      scheduleNextPhrase();
    });
  }

  const subtitleBox = document.getElementById('subTitleWrap');
  if (subtitleBox) {
    subtitleBox.addEventListener('mouseenter', () => {
      isTaglineHovered = true;
      if (phraseAutoTimer) {
        clearTimeout(phraseAutoTimer);
        phraseAutoTimer = null;
      }
    });
    subtitleBox.addEventListener('mouseleave', () => {
      isTaglineHovered = false;
      scheduleNextPhrase();
    });
  }

  // Pause when browser tab is hidden and resume when returning
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (phraseAutoTimer) {
        clearTimeout(phraseAutoTimer);
        phraseAutoTimer = null;
      }
    } else {
      if (!isTaglineHovered) {
        scheduleNextPhrase();
      }
    }
  });

  // Start auto-rotation on initial load
  scheduleNextPhrase();

  // ==========================================================================
  // Divine Bansuri Flute Audio Player
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

  let isPlayingAudio = false;
  let fadeInterval = null;

  function fadeInAudio(audio, targetVolume = 0.85, durationMs = 800) {
    if (fadeInterval) clearInterval(fadeInterval);
    audio.volume = 0;
    const stepTime = 40;
    const stepDelta = targetVolume / (durationMs / stepTime);
    fadeInterval = setInterval(() => {
      if (audio.volume + stepDelta >= targetVolume) {
        audio.volume = targetVolume;
        clearInterval(fadeInterval);
      } else {
        audio.volume += stepDelta;
      }
    }, stepTime);
  }

  function fadeOutAudio(audio, durationMs = 600, onComplete) {
    if (fadeInterval) clearInterval(fadeInterval);
    const stepTime = 40;
    const stepDelta = audio.volume / (durationMs / stepTime);
    fadeInterval = setInterval(() => {
      if (audio.volume - stepDelta <= 0) {
        audio.volume = 0;
        clearInterval(fadeInterval);
        if (onComplete) onComplete();
      } else {
        audio.volume -= stepDelta;
      }
    }, stepTime);
  }

  function startDivineAudio() {
    isPlayingAudio = true;
    emblemBtn.classList.add('playing');
    audioStatusText.textContent = 'PLAYING';
    showToast('♪ Divine Bansuri Flute Harmony Playing');

    const playPromise = fluteAudio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          fadeInAudio(fluteAudio, 0.85, 800);
        })
        .catch((err) => {
          console.warn('Playback blocked or failed:', err);
          isPlayingAudio = false;
          emblemBtn.classList.remove('playing');
          audioStatusText.textContent = 'FLUTE';
          showToast('Click again to allow audio playback');
        });
    }
  }

  function stopDivineAudio() {
    isPlayingAudio = false;
    emblemBtn.classList.remove('playing');
    audioStatusText.textContent = 'FLUTE';
    showToast('Divine Harmony Paused');

    fadeOutAudio(fluteAudio, 500, () => {
      fluteAudio.pause();
    });
  }

  fluteAudio.addEventListener('ended', () => {
    if (!fluteAudio.loop) {
      isPlayingAudio = false;
      emblemBtn.classList.remove('playing');
      audioStatusText.textContent = 'FLUTE';
    }
  });

  

  if (emblemBtn) {
    emblemBtn.addEventListener('click', () => {
      if (!isPlayingAudio) {
        startDivineAudio();
      } else {
        stopDivineAudio();
      }
    });
  }

  // ==========================================================================
  // Modals & Action Triggers
  // ==========================================================================
  function openModal(modal) {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
  }

  function closeModal(modal) {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  }

  if (chantsBtn && chantsModal) {
    chantsBtn.addEventListener('click', () => openModal(chantsModal));
  }
  if (modalCloseBtn && chantsModal) {
    modalCloseBtn.addEventListener('click', () => closeModal(chantsModal));
  }
  if (chantsModal) {
    chantsModal.addEventListener('click', (e) => {
      if (e.target === chantsModal) closeModal(chantsModal);
    });
  }



  if (darshanBtn) {
    darshanBtn.addEventListener('click', (e) => {
      e.preventDefault();
      switchView('darshan');
    });
  }

  if (copyMantraBtn) {
    copyMantraBtn.addEventListener('click', () => {
      const mantra = "Hare Krishna Hare Krishna Krishna Krishna Hare Hare | Hare Rama Hare Rama Rama Rama Hare Hare";
      navigator.clipboard.writeText(mantra).then(() => {
        showToast('Maha-Mantra copied to clipboard!');
      }).catch(() => {
        showToast('Maha-Mantra: Hare Krishna Hare Rama');
      });
    });
  }

  // ==========================================================================
  // 3D Parallax Depth & Hover Transparency Controller (Forearms Over Text)
  // ==========================================================================
  const depthStage = document.getElementById('depthStage');
  const titleLayer = document.getElementById('titleLayer');
  const foregroundHandsWrap = document.getElementById('foregroundHandsWrap');
  const subTitleWrap = document.getElementById('subTitleWrap');

  if (depthStage && titleLayer && foregroundHandsWrap) {
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let isHoveringRightSide = false;

    window.addEventListener('mousemove', (e) => {
      // Normalized coordinates from -1 to 1
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = (e.clientY / window.innerHeight) * 2 - 1;

      targetX = normX;
      targetY = normY;

      // Detect cursor proximity to the right forearm & subheadings area
      // (Right side normX > 0.05 and lower-middle quadrant normY > -0.2)
      if (normX > 0.08 && normY > -0.25) {
        isHoveringRightSide = true;
      } else {
        isHoveringRightSide = false;
      }
    });

    window.addEventListener('mouseleave', () => {
      targetX = 0;
      targetY = 0;
      isHoveringRightSide = false;
    });

    // Subtitle & Title Hover Triggers: make forearms ultra-transparent
    if (subTitleWrap) {
      subTitleWrap.addEventListener('mouseenter', () => {
        foregroundHandsWrap.classList.add('ultra-transparent');
      });
      subTitleWrap.addEventListener('mouseleave', () => {
        foregroundHandsWrap.classList.remove('ultra-transparent');
      });
    }

    if (titleLayer) {
      titleLayer.addEventListener('mouseenter', () => {
        foregroundHandsWrap.classList.add('hover-transparent');
      });
      titleLayer.addEventListener('mouseleave', () => {
        foregroundHandsWrap.classList.remove('hover-transparent');
      });
    }

    function renderParallax() {
      // Smooth linear interpolation (lerp)
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;

      // 1. Text Layer (Behind) - gentle parallax
      const textX = currentX * 14;
      const textY = currentY * 8;
      const textRotY = currentX * 3.5;
      const textRotX = -currentY * 3.5;
      titleLayer.style.transform = `translate3d(${textX}px, ${textY}px, 0px) rotateY(${textRotY}deg) rotateX(${textRotX}deg)`;

      // 2. Foreground Divine Hands (Over Texts) - amplified parallax with 3D projection
      const handsX = currentX * 36;
      const handsY = currentY * 24;
      const handsRotY = currentX * 6.5;
      const handsRotX = -currentY * 6.5;
      foregroundHandsWrap.style.transform = `translate(-50%, -50%) translate3d(${handsX}px, ${handsY}px, 35px) rotateY(${handsRotY}deg) rotateX(${handsRotX}deg) scale(1.02)`;

      // 3. Proximity Transparency: smoothly melt forearms when hovering near right-hand subheadings
      if (isHoveringRightSide) {
        foregroundHandsWrap.classList.add('hover-transparent');
      } else if (!foregroundHandsWrap.matches(':hover') && !subTitleWrap?.matches(':hover') && !titleLayer?.matches(':hover') && !depthStage?.matches(':hover')) {
        foregroundHandsWrap.classList.remove('hover-transparent');
      }

      requestAnimationFrame(renderParallax);
    }

    requestAnimationFrame(renderParallax);
  }

  // ==========================================================================
  // Dynamic Cursor Spotlight Controller for Background Video
  // Lights up the background video wherever the user's cursor hovers
  // ==========================================================================
  function initVideoSpotlight() {
    if (!videoBgContainer) return;

    let spotTargetX = window.innerWidth / 2;
    let spotTargetY = window.innerHeight / 2;
    let spotCurrentX = window.innerWidth / 2;
    let spotCurrentY = window.innerHeight / 2;
    let isCursorInside = false;
    let fadeOutTimeout = null;

    function renderSpotlight() {
      // Smooth linear interpolation (lerp) for fluid, cinematic motion
      spotCurrentX += (spotTargetX - spotCurrentX) * 0.14;
      spotCurrentY += (spotTargetY - spotCurrentY) * 0.14;

      videoBgContainer.style.setProperty('--spot-x', `${spotCurrentX.toFixed(1)}px`);
      videoBgContainer.style.setProperty('--spot-y', `${spotCurrentY.toFixed(1)}px`);

      requestAnimationFrame(renderSpotlight);
    }

    requestAnimationFrame(renderSpotlight);

    window.addEventListener('mousemove', (e) => {
      spotTargetX = e.clientX;
      spotTargetY = e.clientY;

      if (!isCursorInside) {
        isCursorInside = true;
        if (fadeOutTimeout) clearTimeout(fadeOutTimeout);
        videoBgContainer.classList.add('active-spotlight');
        videoBgContainer.style.setProperty('--spot-opacity', '1');
      }
    });

    window.addEventListener('mouseleave', () => {
      isCursorInside = false;
      videoBgContainer.style.setProperty('--spot-opacity', '0');
      fadeOutTimeout = setTimeout(() => {
        if (!isCursorInside) {
          videoBgContainer.classList.remove('active-spotlight');
        }
      }, 400);
    });

    window.addEventListener('mouseenter', (e) => {
      spotTargetX = e.clientX;
      spotTargetY = e.clientY;
      isCursorInside = true;
      if (fadeOutTimeout) clearTimeout(fadeOutTimeout);
      videoBgContainer.classList.add('active-spotlight');
      videoBgContainer.style.setProperty('--spot-opacity', '1');
    });
  }

  initVideoSpotlight();

  // ==========================================================================
  // Custom Divine Inverted Peacock Feather & White Dot Text Cursor Controller
  // Default/Other Elements: Inverted Peacock Feather cursor
  // Text Hover: Morphs into glowing White Dot
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

  function initCustomCursor() {
    const customCursor = document.getElementById('customCursor');
    if (!customCursor) return;

    // Preserve natural touch interaction on coarse mobile screens
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    let isVisible = false;

    // Determine if an element is reading text vs an interactive or UI container element
    function isTextElement(target) {
      if (!target) return false;

      // Interactive controls, buttons, links, toggles, rail steps remain FEATHER
      const isInteractive = target.closest(
        'button, a, input, select, textarea, [role="button"], [role="switch"], .btn, .emblem-btn, .nav-item, .glass-toggle-btn, .rail-segment, .search-clear-btn, .modal-close-btn, .drawer-close-btn, .drawer-actions'
      );
      if (isInteractive) {
        return false;
      }

      // Check for reading text elements
      const textTags = 'h1, h2, h3, h4, h5, h6, p, blockquote, .subtitle, .main-title, .title-word, .quote-text, .quote-source, .sanskrit, .translation, .drawer-mantra, .leela-hindi, .leela-english, .leela-title-hindi, .leela-title-english, .leelas-intro-hindi, .leelas-intro-english, .leelas-main-title, .leelas-sub-title, .om-symbol, sup, label';
      if (target.closest(textTags)) {
        return true;
      }

      // General span text outside of buttons/links
      if (target.tagName === 'SPAN' && !target.closest('button, a, .nav-item, .btn, .emblem-btn')) {
        return true;
      }

      return false;
    }

    // Determine if element is an interactive button/link/control
    function isInteractiveElement(target) {
      if (!target) return false;
      return !!target.closest(
        'button, a, input, select, textarea, [role="button"], [role="switch"], .btn, .emblem-btn, .nav-item, .glass-toggle-btn, .rail-segment, .drawer-link, .modal-close-btn, .search-clear-btn'
      );
    }

    // Move cursor with 1:1 hardware performance
    window.addEventListener('mousemove', (e) => {
      customCursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;

      if (!isVisible) {
        isVisible = true;
        customCursor.classList.add('visible');
      }

      const target = document.elementFromPoint(e.clientX, e.clientY) || e.target;

      if (isTextElement(target)) {
        // Hovering on text -> morph into glowing white dot
        customCursor.classList.remove('cursor-mode-feather', 'cursor-interactive');
        customCursor.classList.add('cursor-mode-dot');
      } else {
        // Hovering on other elements -> peacock feather cursor
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

  // ==========================================================================
  // Sacred Krishna Leelas In-Page SPA Engine
  // ==========================================================================
  const TOTAL_LEELAS_PAGES = 6;
  let currentLeelasPage = 1; // 1 to 6 or 'all'
  let hasInitializedLeelas = false;

  const leelasCardsGrid = document.getElementById('leelasCardsGrid');
  const leelasPagesNav = document.getElementById('leelasPagesNav');
  const prevPageBtn = document.getElementById('prevPageBtn');
  const nextPageBtn = document.getElementById('nextPageBtn');
  const prevPageBtnBottom = document.getElementById('prevPageBtnBottom');
  const nextPageBtnBottom = document.getElementById('nextPageBtnBottom');
  const currentPageText = document.getElementById('currentPageText');
  const currentChapterTitle = document.getElementById('currentChapterTitle');
  const currentPageTextBottom = document.getElementById('currentPageTextBottom');
  const currentChapterTitleBottom = document.getElementById('currentChapterTitleBottom');

  function formatQuotedText(text) {
    if (!text) return '""';
    const clean = String(text).trim().replace(/^["“”«»]/, '').replace(/["“”«»]$/, '').trim();
    return `"${clean}"`;
  }

  function createIllustratedLeelaCard(item) {
    const card = document.createElement('article');
    card.className = 'leela-card';
    card.setAttribute('data-id', item.id);
    card.setAttribute('data-page', item.page);

    const quotedHindi = formatQuotedText(item.hindi);
    const quotedEnglish = formatQuotedText(item.english);

    card.innerHTML = `
      <div class="leela-illustration-panel">
        ${item.illustrationSvg}
      </div>
      <div class="leela-card-top">
        <span class="leela-serial-badge">लीला ${item.id} • LEELA ${item.id}</span>
        <span class="leela-category-badge">${item.categoryHindi || ''}</span>
      </div>
      <div class="leela-titles-wrap">
        <h3 class="leela-title-hindi">${item.titleHindi}</h3>
        <h4 class="leela-title-english">${item.titleEnglish}</h4>
      </div>
      <div class="leela-verse-box glass-card">
        <p class="leela-verse-hindi">${quotedHindi}</p>
        <p class="leela-verse-english">${quotedEnglish}</p>
      </div>
    `;
    return card;
  }

  function renderLeelasPage(page, shouldScroll = true) {
    currentLeelasPage = page;
    const dataset = window.KRISHNA_LEELAS;
    if (!dataset || !leelasCardsGrid) return;

    // Update active tab in leelasPagesNav
    if (leelasPagesNav) {
      const pageTabs = leelasPagesNav.querySelectorAll('.leela-page-tab');
      pageTabs.forEach(tab => {
        const tabVal = tab.getAttribute('data-page');
        if (tabVal === String(currentLeelasPage)) {
          tab.classList.add('active');
        } else {
          tab.classList.remove('active');
        }
      });
    }

    // Update pagination labels
    if (currentLeelasPage === 'all') {
      const allText = 'सम्पूर्ण ग्रंथ • ALL 50 LEELAS';
      const allSub = 'समस्त 50 पावन लीलाओं के दर्शन';
      if (currentPageText) currentPageText.textContent = allText;
      if (currentChapterTitle) currentChapterTitle.textContent = allSub;
      if (currentPageTextBottom) currentPageTextBottom.textContent = allText;
      if (currentChapterTitleBottom) currentChapterTitleBottom.textContent = allSub;

      if (prevPageBtn) prevPageBtn.disabled = true;
      if (nextPageBtn) nextPageBtn.disabled = true;
      if (prevPageBtnBottom) prevPageBtnBottom.disabled = true;
      if (nextPageBtnBottom) nextPageBtnBottom.disabled = true;
    } else {
      const pageNum = parseInt(currentLeelasPage, 10);
      const chapterInfo = window.CHAPTER_PAGES ? (window.CHAPTER_PAGES[pageNum] || window.CHAPTER_PAGES[1]) : { hi: '', en: '' };
      const pageIndicator = `पृष्ठ ${pageNum} / ${TOTAL_LEELAS_PAGES} • PAGE ${pageNum} OF ${TOTAL_LEELAS_PAGES}`;
      const chapterIndicator = `${chapterInfo.hi} (${chapterInfo.en}) • ${chapterInfo.range || ''}`;

      if (currentPageText) currentPageText.textContent = pageIndicator;
      if (currentChapterTitle) currentChapterTitle.textContent = chapterIndicator;
      if (currentPageTextBottom) currentPageTextBottom.textContent = pageIndicator;
      if (currentChapterTitleBottom) currentChapterTitleBottom.textContent = chapterIndicator;

      const isFirst = (pageNum <= 1);
      const isLast = (pageNum >= TOTAL_LEELAS_PAGES);

      if (prevPageBtn) prevPageBtn.disabled = isFirst;
      if (nextPageBtn) nextPageBtn.disabled = isLast;
      if (prevPageBtnBottom) prevPageBtnBottom.disabled = isFirst;
      if (nextPageBtnBottom) nextPageBtnBottom.disabled = isLast;
    }

    // Render cards
    leelasCardsGrid.classList.add('page-transitioning');
    setTimeout(() => {
      leelasCardsGrid.innerHTML = '';
      const itemsToRender = (currentLeelasPage === 'all')
        ? dataset
        : dataset.filter(item => item.page === parseInt(currentLeelasPage, 10));

      itemsToRender.forEach(item => {
        leelasCardsGrid.appendChild(createIllustratedLeelaCard(item));
      });

      leelasCardsGrid.classList.remove('page-transitioning');

      if (shouldScroll) {
        const toolbar = document.querySelector('.leelas-page-toolbar');
        if (toolbar) {
          toolbar.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }, 60);
  }

  function initLeelasView() {
    if (hasInitializedLeelas) return;
    hasInitializedLeelas = true;

    // Chapter Tab Clicks
    if (leelasPagesNav) {
      const pageTabs = leelasPagesNav.querySelectorAll('.leela-page-tab');
      pageTabs.forEach(tab => {
        tab.addEventListener('click', () => {
          const targetPage = tab.getAttribute('data-page');
          renderLeelasPage(targetPage, true);
        });
      });
    }

    // Prev / Next pagination buttons
    function goPrevLeelaPage() {
      if (currentLeelasPage !== 'all') {
        const p = parseInt(currentLeelasPage, 10);
        if (p > 1) renderLeelasPage(p - 1, true);
      }
    }
    function goNextLeelaPage() {
      if (currentLeelasPage !== 'all') {
        const p = parseInt(currentLeelasPage, 10);
        if (p < TOTAL_LEELAS_PAGES) renderLeelasPage(p + 1, true);
      }
    }

    if (prevPageBtn) prevPageBtn.addEventListener('click', goPrevLeelaPage);
    if (nextPageBtn) nextPageBtn.addEventListener('click', goNextLeelaPage);
    if (prevPageBtnBottom) prevPageBtnBottom.addEventListener('click', goPrevLeelaPage);
    if (nextPageBtnBottom) nextPageBtnBottom.addEventListener('click', goNextLeelaPage);

    const backToTopBtn = document.getElementById('backToTopBtn');
    if (backToTopBtn) {
      backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        const heroContainer = document.querySelector('.hero-container');
        if (heroContainer) heroContainer.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    renderLeelasPage(1, false);
  }

  // ==========================================================================
  // Interactive Search for Leelas, Bhajans, Shlokas
  // ==========================================================================
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.trim().toLowerCase();
      if (searchClearBtn) {
        searchClearBtn.style.display = query.length > 0 ? 'flex' : 'none';
      }

      if (query.length > 0) {
        if (document.body.getAttribute('data-active-view') !== 'leelas') {
          switchView('leelas', false);
        }

        const dataset = window.KRISHNA_LEELAS;
        if (dataset && leelasCardsGrid) {
          const filtered = dataset.filter(item => {
            const h = (item.hindi || '').toLowerCase();
            const eng = (item.english || '').toLowerCase();
            const th = (item.titleHindi || '').toLowerCase();
            const te = (item.titleEnglish || '').toLowerCase();
            const c = (item.categoryHindi || '').toLowerCase() + ' ' + (item.categoryEnglish || '').toLowerCase();
            return h.includes(query) || eng.includes(query) || th.includes(query) || te.includes(query) || c.includes(query);
          });

          leelasCardsGrid.innerHTML = '';
          if (filtered.length === 0) {
            leelasCardsGrid.innerHTML = `
              <div class="glass-card" style="grid-column: 1 / -1; padding: 3rem; text-align: center; border-radius: 20px;">
                <p style="font-size: 1.15rem; color: #f0cb7d; margin-bottom: 0.5rem; font-weight: 700;">कोई लीला नहीं मिली • No Leelas matching "${query}"</p>
                <p style="color: rgba(255,255,255,0.65);">Try searching for "Makhan", "Gita", "Yamuna", "Kaliya", "Govardhan" or "Kansa".</p>
              </div>
            `;
          } else {
            filtered.forEach(item => {
              leelasCardsGrid.appendChild(createIllustratedLeelaCard(item));
            });
          }

          if (currentPageText) {
            currentPageText.textContent = `खोज परिणाम • SEARCH RESULTS: ${filtered.length} LEELAS FOUND`;
          }
        }
      } else {
        renderLeelasPage(1, false);
      }
    });

    if (searchClearBtn) {
      searchClearBtn.addEventListener('click', () => {
        searchInput.value = '';
        searchClearBtn.style.display = 'none';
        renderLeelasPage(1, false);
      });
    }
  }

  // ==========================================================================
  // Dynamic SPA View Switching (Home, About, Leelas, Darshan)
  // ==========================================================================
  function switchView(navName, updateHash = true) {
    if (!navName) navName = 'home';
    navName = navName.toLowerCase().replace('#', '');
    if (!['home', 'about', 'leelas', 'darshan'].includes(navName)) {
      navName = 'home';
    }

    document.body.setAttribute('data-active-view', navName);

    // Toggle active state on SPA views
    const views = document.querySelectorAll('.spa-view');
    views.forEach(v => {
      if (v.id === `view-${navName}`) {
        v.classList.add('active');
      } else {
        v.classList.remove('active');
      }
    });

    // Update nav items and move pill
    navItems.forEach(item => {
      const itemNav = item.getAttribute('data-nav') || item.getAttribute('href')?.replace('#', '');
      if (itemNav === navName) {
        item.classList.add('active');
        currentActiveIndex = parseInt(item.getAttribute('data-index') || '0', 10);
        lastNavIndex = currentActiveIndex;
        movePillTo(item, false);
      } else {
        item.classList.remove('active');
      }
    });

    // Update drawer links
    drawerLinks.forEach(link => {
      const linkNav = link.getAttribute('data-nav') || link.getAttribute('href')?.replace('#', '');
      if (linkNav === navName) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // If Leelas view is activated, initialize cards
    if (navName === 'leelas') {
      initLeelasView();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
    const heroContainer = document.querySelector('.hero-container');
    if (heroContainer) heroContainer.scrollTo({ top: 0, behavior: 'smooth' });

    if (updateHash) {
      history.replaceState(null, '', `#${navName}`);
    }

    const titleMap = {
      home: 'Swagatam • Home',
      about: 'About Kishan Rai & Devotional Vision',
      leelas: '50 Sacred Krishna Leelas',
      darshan: 'Divine Temple Darshan & Teachings'
    };
    showToast(titleMap[navName] || `Navigated to ${navName}`);
  }

  // Expose switchView to global window object
  window.switchView = switchView;

  // Hashchange & Initial Hash Routing
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.replace('#', '') || 'home';
    switchView(hash, false);
  });

  const initialHash = window.location.hash.replace('#', '') || 'home';
  switchView(initialHash, false);

  // Escape key handler
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDrawer();
      if (chantsModal) closeModal(chantsModal);
    }
  });
});


