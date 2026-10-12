/**
 * Radha Krishna Devotional Hero Section Interactive Controller
 * Features:
 * - Directional Hover Stretch Move Nav Pill
 * - Glass UI Video Background Toggle (Feather Video <-> Pure Black)
 * - Web Audio API Bansuri Flute Synthesizer
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
      navItems.forEach(nav => nav.classList.remove('active'));
      item.classList.add('active');
      currentActiveIndex = parseInt(item.getAttribute('data-index') || '0', 10);
      lastNavIndex = currentActiveIndex;
      movePillTo(item, false);

      const navText = item.querySelector('.nav-text').textContent;
      showToast(`Navigated to: ${navText}`);
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
      const slideIdx = parseInt(link.getAttribute('data-slide') || '0', 10);
      drawerLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      closeDrawer();
      if (slideIdx < sectionData.length) {
        updateRailStep(slideIdx);
      }
      showToast(`Selected: ${link.querySelector('.drawer-title').textContent}`);
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

  function updateRailStep(index) {
    railSegments.forEach((segment, i) => {
      if (i === index) {
        segment.classList.add('active');
      } else {
        segment.classList.remove('active');
      }
    });

    const data = sectionData[index];
    if (data) {
      railCounter.textContent = data.step;
      
      quoteText.style.opacity = '0';
      quoteText.style.transform = 'translateY(6px)';
      
      setTimeout(() => {
        subTitle.textContent = data.subtitle;
        quoteText.textContent = data.quote;
        quoteSource.textContent = data.source;
        quoteText.style.opacity = '1';
        quoteText.style.transform = 'translateY(0)';
      }, 180);
    }
  }

  railSegments.forEach((segment, idx) => {
    segment.addEventListener('click', () => {
      updateRailStep(idx);
    });
  });

  // ==========================================================================
  // Web Audio API: Serene Bansuri Flute & Tanpura Drone Synthesizer
  // ==========================================================================
  let audioCtx = null;
  let isPlayingAudio = false;
  let masterGain = null;
  let fluteInterval = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  const fluteNotes = [277.18, 311.13, 349.23, 415.30, 466.16, 554.37, 622.25, 698.46];

  function playFluteTone(freq, duration = 3.5) {
    if (!audioCtx || !isPlayingAudio) return;

    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    const filter = audioCtx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    const vibrato = audioCtx.createOscillator();
    const vibratoGain = audioCtx.createGain();
    vibrato.frequency.setValueAtTime(5.2, audioCtx.currentTime);
    vibratoGain.gain.setValueAtTime(3.5, audioCtx.currentTime);
    vibrato.connect(osc.frequency);
    vibrato.start();

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, audioCtx.currentTime);

    const now = audioCtx.currentTime;
    gainNode.gain.setValueAtTime(0.001, now);
    gainNode.gain.exponentialRampToValueAtTime(0.12, now + 0.6);
    gainNode.gain.exponentialRampToValueAtTime(0.08, now + duration - 0.8);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(masterGain);

    osc.start(now);
    osc.stop(now + duration);
    vibrato.stop(now + duration);
  }

  function startDivineAudio() {
    initAudio();
    isPlayingAudio = true;
    emblemBtn.classList.add('playing');
    audioStatusText.textContent = 'PLAYING';
    showToast('♪ Divine Bansuri Flute Harmony Playing');

    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.8, audioCtx.currentTime);
    masterGain.connect(audioCtx.destination);

    const droneOsc = audioCtx.createOscillator();
    const droneGain = audioCtx.createGain();
    droneOsc.type = 'sine';
    droneOsc.frequency.setValueAtTime(138.59, audioCtx.currentTime);
    droneGain.gain.setValueAtTime(0.04, audioCtx.currentTime);
    droneOsc.connect(droneGain);
    droneGain.connect(masterGain);
    droneOsc.start();

    let noteIdx = 0;
    const melodyPattern = [0, 2, 3, 5, 4, 3, 2, 0, 1, 3, 2, 0];
    
    playFluteTone(fluteNotes[melodyPattern[0]], 4.0);

    fluteInterval = setInterval(() => {
      if (!isPlayingAudio) return;
      noteIdx = (noteIdx + 1) % melodyPattern.length;
      const targetFreq = fluteNotes[melodyPattern[noteIdx]];
      playFluteTone(targetFreq, 3.8);
    }, 2800);
  }

  function stopDivineAudio() {
    isPlayingAudio = false;
    emblemBtn.classList.remove('playing');
    audioStatusText.textContent = 'FLUTE';
    if (fluteInterval) clearInterval(fluteInterval);
    if (masterGain && audioCtx) {
      masterGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.8);
    }
    showToast('Divine Harmony Paused');
  }

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
    darshanBtn.addEventListener('click', () => {
      showToast('Jai Shri Radhe Krishna! Opening Daily Darshan Portal...');
      setTimeout(() => {
        openModal(chantsModal);
      }, 500);
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

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDrawer();
      if (chantsModal) closeModal(chantsModal);
    }
  });
});
