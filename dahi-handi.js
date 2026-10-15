/**
 * Krishna Dahi Handi & Spinning Flute Interactive Intro Experience
 * 
 * Flow:
 * 1. ONE-TIME EXPERIENCE: Plays on initial arrival, saved to localStorage so it never repeats.
 * 2. Hanging pot sways in 10-20% rhythmic pendulum arc.
 * 3. Curd droplets slosh out at turn-around swing endpoints.
 * 4. User clicks/taps pot: Spinning flute swoops in and smashes the pot.
 * 5. Pot shatters into ceramic shards, peacock feather flutters, marigold petals explode.
 * 6. Massive curd fountain bursts, spilling rich creamy curd across the bottom of the webpage.
 * 7. Intro overlay fades out to reveal the Radha Krishna landing page.
 * 8. After ~3.6s, the curd realistically drains downwards with organic fluid physics,
 *    viscous friction, surface tension, and trailing rivulets off the browser window.
 * 9. Intro and curd elements are completely removed from DOM. Never shows again!
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'krishna_dahi_handi_completed';

  // Ensure any previous completion flag is purged so the loading animation always plays when loading the site!
  try {
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    // If storage is restricted, continue gracefully
  }

  // --- Configuration ---
  const CONFIG = {
    maxSwayDeg: 13.5,            // ~14 degrees (10-20% angle as requested)
    swayPeriodSec: 2.7,          // 2.7s smooth pendulum period
    sloshCurdCount: 5,           // Droplets per turn-around
    splashCurdCount: 110,        // Explosive burst droplets on smash
    shardCount: 6,
    petalCount: 28,
    stardustCount: 30,
    curdSpillHeight: 180,        // Height of bottom curd pool (px)
    transitionDelayMs: 1300,     // Delay before landing page fade-in
    autoSweepDelayMs: 3600       // Time curd stays visible before being swept away downwards
  };

  // --- Sound Synthesizer (Web Audio API) ---
  class DivineAudio {
    constructor() {
      this.ctx = null;
    }

    init() {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.ctx = new AudioContext();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    playSmashSound() {
      this.init();
      if (!this.ctx) return;

      const t = this.ctx.currentTime;

      // 1. Crisp Ceramic Shatter (Filtered White Noise Burst)
      const bufferSize = this.ctx.sampleRate * 0.4;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.08));
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const bandpass = this.ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.setValueAtTime(2400, t);
      bandpass.Q.setValueAtTime(3.0, t);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.85, t);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.35);

      noise.connect(bandpass);
      bandpass.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);
      noise.start(t);

      // 2. Heavy Viscous Curd / Milk Splash (Low-frequency sweep)
      const splashOsc = this.ctx.createOscillator();
      const splashGain = this.ctx.createGain();
      splashOsc.type = 'triangle';
      splashOsc.frequency.setValueAtTime(320, t);
      splashOsc.frequency.exponentialRampToValueAtTime(50, t + 0.45);
      splashGain.gain.setValueAtTime(0.65, t);
      splashGain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);

      splashOsc.connect(splashGain);
      splashGain.connect(this.ctx.destination);
      splashOsc.start(t);
      splashOsc.stop(t + 0.5);

      // 3. Divine Flute Harmonics (Raga Bhupali: C5, E5, G5, A5 chords with sweet decay)
      const fluteNotes = [523.25, 659.25, 783.99, 880.00];
      fluteNotes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t + idx * 0.04);
        
        // Gentle flute vibrato
        const vibrato = this.ctx.createOscillator();
        const vibGain = this.ctx.createGain();
        vibrato.frequency.value = 5.5;
        vibGain.gain.value = 6.0;
        vibrato.connect(osc.frequency);
        vibrato.start(t + idx * 0.04);

        gain.gain.setValueAtTime(0.0, t + idx * 0.04);
        gain.gain.linearRampToValueAtTime(0.22, t + idx * 0.04 + 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.04 + 1.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t + idx * 0.04);
        osc.stop(t + idx * 0.04 + 1.3);
        vibrato.stop(t + idx * 0.04 + 1.3);
      });
    }

    playCurdSloshSound() {
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(380, t);
      osc.frequency.exponentialRampToValueAtTime(120, t + 0.18);
      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.2);
    }

    playSweepSound() {
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;

      // 1. Viscous liquid drainage surge (Low-pass filtered brownian noise)
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.95);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastVal = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        lastVal = (lastVal + 0.05 * white) / 1.05;
        data[i] = lastVal * 3.5 * Math.sin((i / bufferSize) * Math.PI);
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(540, t);
      filter.frequency.exponentialRampToValueAtTime(110, t + 0.95);
      filter.Q.value = 3.5;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.01, t);
      gain.gain.linearRampToValueAtTime(0.26, t + 0.18);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.95);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start(t);

      // 2. Liquid plop and bubbling drops (sweet water droplet harmonic tones)
      const dropletFreqs = [280, 220, 160];
      dropletFreqs.forEach((freq, idx) => {
        const dropOsc = this.ctx.createOscillator();
        const dropGain = this.ctx.createGain();
        dropOsc.type = 'sine';
        const dropTime = t + 0.12 + idx * 0.14;
        dropOsc.frequency.setValueAtTime(freq, dropTime);
        dropOsc.frequency.exponentialRampToValueAtTime(freq * 0.5, dropTime + 0.16);

        dropGain.gain.setValueAtTime(0.0, dropTime);
        dropGain.gain.linearRampToValueAtTime(0.07, dropTime + 0.02);
        dropGain.gain.exponentialRampToValueAtTime(0.001, dropTime + 0.16);

        dropOsc.connect(dropGain);
        dropGain.connect(this.ctx.destination);
        dropOsc.start(dropTime);
        dropOsc.stop(dropTime + 0.17);
      });
    }
  }

  // --- Dahi Handi Controller ---
  class DahiHandiIntro {
    constructor() {
      this.overlay = null;
      this.canvas = null;
      this.ctx = null;
      this.potAssembly = null;
      this.promptContainer = null;
      this.flute = null;
      this.shatterContainer = null;
      this.bottomSpill = null;
      this.impactFlash = null;
      this.curdSvg = null;
      this.curdWavePrimary = null;
      this.curdWaveSecondary = null;
      this.curdWaveHighlight = null;
      this.curdFloorSplats = null;

      this.audio = new DivineAudio();
      this.animId = null;
      this.startTime = null;
      this.isSmashed = false;
      this.isSweeping = false;
      this.sweepTimer = null;
      this.sweepAnimId = null;
      this.currentAngle = 0;
      this.hasSloshedThisPeak = false;

      // Particle systems
      this.stardust = [];
      this.curdDroplets = [];

      this.init();
    }

    init() {
      this.buildDOM();
      this.setupCanvas();
      this.initStardust();
      this.bindEvents();
      this.startLoop();
    }

    buildDOM() {
      // 1. Main Intro Fullscreen Overlay
      const overlay = document.createElement('div');
      overlay.className = 'dahi-handi-overlay';
      overlay.id = 'dahiHandiIntro';
      overlay.setAttribute('role', 'dialog');
      overlay.setAttribute('aria-label', 'Janmashtami Dahi Handi Celebration');

      overlay.innerHTML = `
        <!-- Festive Top Marigold Garland -->
        <div class="handi-garland-toran" aria-hidden="true"></div>

        <!-- Ambient Divine Radiance Aura behind Handi -->
        <div class="handi-divine-aura" aria-hidden="true"></div>

        <!-- High-Performance 60FPS Particles Canvas -->
        <canvas class="handi-canvas" id="handiCanvas"></canvas>

        <!-- Hanging Swinging Pot Assembly (Pivot at top center) -->
        <div class="handi-pot-assembly" id="handiPotAssembly" title="Click Krishna's Dahi Handi to break!">
          <div class="handi-rim-glow" aria-hidden="true"></div>
          <img src="assets/dahi_handi_perfect.png" class="handi-pot-img" alt="Sacred Dahi Handi Pot">
        </div>

        <!-- Spinning Flute Striker (Flies in dynamically on click) -->
        <div class="spinning-flute" id="spinningFlute" aria-hidden="true">
          <img src="assets/flute_final.png" alt="Krishna Divine Bansuri">
        </div>

        <!-- Shatter Layer for Ceramic Shards & Petals -->
        <div class="handi-shatter-container" id="handiShatterContainer" aria-hidden="true"></div>

        <!-- Divine Impact Radial Flash -->
        <div class="handi-impact-flash" id="handiImpactFlash" aria-hidden="true"></div>

        <!-- User Guidance & Call to Action -->
        <div class="handi-prompt-container" id="handiPrompt">
          <span class="handi-badge">✨ JANMASHTAMI UTSAV ✨</span>
          <h1 class="handi-title">Smash the Dahi Handi</h1>
          <p class="handi-subtitle">Click or tap the swinging Matki to break with Krishna's Sacred Bansuri</p>
          <button class="handi-cta-btn" id="handiCtaBtn" aria-label="Tap to smash pot">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
            TOUCH MATKI TO CELEBRATE
          </button>
        </div>
      `;

      // Prepend overlay right at top of document body so it renders first
      document.body.prepend(overlay);

      // 2. Curd Spilled All Over Bottom of Webpage (Persists temporarily on Landing Page)
      const bottomSpill = document.createElement('div');
      bottomSpill.className = 'curd-bottom-spill';
      bottomSpill.id = 'curdBottomSpill';
      bottomSpill.setAttribute('aria-hidden', 'true');
      bottomSpill.innerHTML = `
        <svg class="curd-svg-wave" id="curdSvgWave" viewBox="0 0 1440 220" preserveAspectRatio="none">
          <defs>
            <linearGradient id="curdGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#ffffff" stop-opacity="1"/>
              <stop offset="35%" stop-color="#fffcf2" stop-opacity="0.98"/>
              <stop offset="70%" stop-color="#fdf6e2" stop-opacity="0.96"/>
              <stop offset="100%" stop-color="#f5e8c4" stop-opacity="0.95"/>
            </linearGradient>
            <linearGradient id="curdHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#ffffff" stop-opacity="0.8"/>
              <stop offset="100%" stop-color="#ffffff" stop-opacity="0.1"/>
            </linearGradient>
            <filter id="curdGlow" x="-5%" y="-15%" width="110%" height="130%">
              <feDropShadow dx="0" dy="-4" stdDeviation="6" flood-color="#ffffff" flood-opacity="0.45"/>
            </filter>
          </defs>

          <!-- Deep Curd Pool Base -->
          <path id="curdWavePrimary" d="M0,70 C120,40 220,95 360,55 C480,20 600,85 720,45 C860,10 980,80 1120,50 C1260,25 1360,65 1440,40 L1440,220 L0,220 Z" 
                fill="url(#curdGrad)" filter="url(#curdGlow)" opacity="0.96"/>

          <!-- Secondary Splashing Wave Crest -->
          <path id="curdWaveSecondary" d="M0,90 C180,60 300,120 480,80 C640,40 760,110 940,75 C1100,45 1280,100 1440,70 L1440,220 L0,220 Z" 
                fill="#ffffff" opacity="0.85"/>

          <!-- Glossy Specular Highlights along the Curd Pool Surface -->
          <path id="curdWaveHighlight" d="M40,75 Q120,45 200,70 Q280,95 380,62 Q480,35 560,78 Q660,115 760,65 Q860,25 960,72 Q1080,110 1200,60 Q1320,35 1400,65" 
                fill="none" stroke="url(#curdHighlight)" stroke-width="4.5" stroke-linecap="round" opacity="0.75"/>

          <!-- Organic Curd Splatter Globs along the Floor -->
          <g id="curdFloorSplats">
            <circle cx="160" cy="50" r="14" fill="#ffffff" opacity="0.9"/>
            <circle cx="190" cy="38" r="7" fill="#ffffff" opacity="0.8"/>
            <circle cx="510" cy="40" r="16" fill="#ffffff" opacity="0.95"/>
            <circle cx="545" cy="32" r="9" fill="#ffffff" opacity="0.85"/>
            <circle cx="890" cy="35" r="18" fill="#ffffff" opacity="0.95"/>
            <circle cx="930" cy="26" r="10" fill="#ffffff" opacity="0.85"/>
            <circle cx="1250" cy="45" r="15" fill="#ffffff" opacity="0.9"/>
            <circle cx="1285" cy="36" r="8" fill="#ffffff" opacity="0.8"/>
          </g>
        </svg>
      `;
      document.body.appendChild(bottomSpill);

      // Cache elements
      this.overlay = overlay;
      this.canvas = document.getElementById('handiCanvas');
      this.potAssembly = document.getElementById('handiPotAssembly');
      this.promptContainer = document.getElementById('handiPrompt');
      this.flute = document.getElementById('spinningFlute');
      this.shatterContainer = document.getElementById('handiShatterContainer');
      this.bottomSpill = bottomSpill;
      this.impactFlash = document.getElementById('handiImpactFlash');
      this.curdSvg = document.getElementById('curdSvgWave');
      this.curdWavePrimary = document.getElementById('curdWavePrimary');
      this.curdWaveSecondary = document.getElementById('curdWaveSecondary');
      this.curdWaveHighlight = document.getElementById('curdWaveHighlight');
      this.curdFloorSplats = document.getElementById('curdFloorSplats');
    }

    setupCanvas() {
      this.ctx = this.canvas.getContext('2d');
      const resize = () => {
        if (!this.canvas) return;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
      };
      resize();
      window.addEventListener('resize', resize);
    }

    initStardust() {
      this.stardust = [];
      for (let i = 0; i < CONFIG.stardustCount; i++) {
        this.stardust.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          r: 0.8 + Math.random() * 2.2,
          alpha: 0.2 + Math.random() * 0.7,
          vy: -0.2 - Math.random() * 0.4,
          pulse: Math.random() * Math.PI * 2
        });
      }
    }

    bindEvents() {
      const smashTrigger = (e) => {
        e.preventDefault();
        this.audio.init();
        this.smashHandi();
      };

      if (this.potAssembly) {
        this.potAssembly.addEventListener('click', smashTrigger);
      }

      const ctaBtn = document.getElementById('handiCtaBtn');
      if (ctaBtn) {
        ctaBtn.addEventListener('click', smashTrigger);
      }
    }

    startLoop() {
      this.startTime = performance.now();
      const loop = (now) => {
        const elapsedSec = (now - this.startTime) / 1000;
        this.update(elapsedSec);
        this.render();
        if (this.overlay) {
          this.animId = requestAnimationFrame(loop);
        }
      };
      this.animId = requestAnimationFrame(loop);
    }

    update(elapsedSec) {
      if (!this.isSmashed) {
        // --- 1. Pendulum Physics of the Pot ---
        const omega = (2 * Math.PI) / CONFIG.swayPeriodSec;
        this.currentAngle = CONFIG.maxSwayDeg * Math.sin(omega * elapsedSec);

        // Apply rotation to DOM pot assembly (pivot is top-center 50% 0%)
        if (this.potAssembly) {
          this.potAssembly.style.transform = `translateX(-50%) rotate(${this.currentAngle}deg)`;
        }

        // --- 2. Slosh Curd on Swing Turn-Around ---
        const isNearPeak = Math.abs(this.currentAngle) > (CONFIG.maxSwayDeg * 0.86);

        if (isNearPeak && !this.hasSloshedThisPeak) {
          this.hasSloshedThisPeak = true;
          const reboundDir = this.currentAngle > 0 ? -1 : 1;
          this.emitSloshCurd(reboundDir);
          this.audio.playCurdSloshSound();
        } else if (!isNearPeak) {
          this.hasSloshedThisPeak = false;
        }
      }

      // --- 3. Update Curd Droplets ---
      for (let i = this.curdDroplets.length - 1; i >= 0; i--) {
        const d = this.curdDroplets[i];
        d.x += d.vx;
        d.y += d.vy;
        d.vy += d.gravity;
        d.vx *= 0.985;
        d.alpha -= d.decay;

        if (d.alpha <= 0 || d.y > window.innerHeight) {
          this.curdDroplets.splice(i, 1);
        }
      }

      // --- 4. Update Stardust ---
      this.stardust.forEach(star => {
        star.y += star.vy;
        star.pulse += 0.04;
        if (star.y < 0) {
          star.y = window.innerHeight;
          star.x = Math.random() * window.innerWidth;
        }
      });
    }

    emitSloshCurd(reboundDir) {
      if (!this.potAssembly) return;
      const rect = this.potAssembly.getBoundingClientRect();

      const mouthX = rect.left + rect.width / 2;
      const mouthY = rect.top + rect.height * 0.58;

      for (let i = 0; i < CONFIG.sloshCurdCount; i++) {
        this.curdDroplets.push({
          x: mouthX + (Math.random() - 0.5) * 24,
          y: mouthY + (Math.random() - 0.5) * 10,
          vx: reboundDir * (1.8 + Math.random() * 2.6) + (Math.random() - 0.5) * 1.0,
          vy: 0.6 + Math.random() * 1.8,
          radius: 3.5 + Math.random() * 4.5,
          gravity: 0.22,
          alpha: 0.92,
          decay: 0.016,
          isSlosh: true
        });
      }
    }

    render() {
      if (!this.ctx || !this.canvas) return;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      // 1. Draw Celestial Stardust
      this.stardust.forEach(star => {
        const a = star.alpha * (0.6 + 0.4 * Math.sin(star.pulse));
        this.ctx.beginPath();
        this.ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(255, 220, 120, ${a})`;
        this.ctx.shadowColor = 'rgba(255, 215, 80, 0.6)';
        this.ctx.shadowBlur = 6;
        this.ctx.fill();
      });

      // 2. Draw Luscious Curd Droplets
      this.curdDroplets.forEach(d => {
        this.ctx.save();
        this.ctx.globalAlpha = Math.max(0, d.alpha);

        this.ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
        this.ctx.shadowBlur = d.isSlosh ? 8 : 12;

        const speed = Math.hypot(d.vx, d.vy);
        const angle = Math.atan2(d.vy, d.vx);

        this.ctx.translate(d.x, d.y);
        this.ctx.rotate(angle);

        this.ctx.beginPath();
        const stretch = Math.min(2.4, 1 + speed * 0.12);
        this.ctx.ellipse(0, 0, d.radius * stretch, d.radius, 0, 0, Math.PI * 2);

        const grad = this.ctx.createRadialGradient(-d.radius * 0.3, -d.radius * 0.3, 1, 0, 0, d.radius * stretch);
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.65, '#fffbf0');
        grad.addColorStop(1, '#f5edd6');
        this.ctx.fillStyle = grad;
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.arc(-d.radius * 0.35, -d.radius * 0.25, d.radius * 0.28, 0, Math.PI * 2);
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        this.ctx.fill();

        this.ctx.restore();
      });
    }

    // ==========================================================================
    // Interactive Smash Sequence
    // ==========================================================================
    smashHandi() {
      if (this.isSmashed) return;
      this.isSmashed = true;

      // Freeze pot in current swing pose
      if (this.potAssembly) {
        this.potAssembly.classList.add('frozen');
      }

      // Hide prompt
      if (this.promptContainer) {
        this.promptContainer.classList.add('hide');
      }

      // Initiate Spinning Flute Swoop Attack
      this.launchSpinningFlute();
    }

    launchSpinningFlute() {
      if (!this.flute || !this.potAssembly) return;

      const potRect = this.potAssembly.getBoundingClientRect();
      const targetX = potRect.left + potRect.width / 2;
      const targetY = potRect.top + potRect.height * 0.65;

      const startX = -120;
      const startY = -80;
      const flightDuration = 420;
      const flightStart = performance.now();

      this.flute.style.opacity = '1';

      const flyStep = (now) => {
        const progress = Math.min(1, (now - flightStart) / flightDuration);
        const easeProg = progress * progress;

        const currentX = startX + (targetX - startX) * easeProg;
        const currentY = startY + (targetY - startY) * easeProg;

        const rotation = -1080 + 1080 * easeProg;
        const scale = 0.35 + 0.85 * easeProg;

        this.flute.style.left = `${currentX - 80}px`;
        this.flute.style.top = `${currentY - 80}px`;
        this.flute.style.transform = `rotate(${rotation}deg) scale(${scale})`;

        if (progress < 1) {
          requestAnimationFrame(flyStep);
        } else {
          // FLUTE IMPACTS POT!
          this.executeImpact(targetX, targetY);
        }
      };

      requestAnimationFrame(flyStep);
    }

    executeImpact(impactX, impactY) {
      // 1. Play Web Audio Ceramic Crack + Splash + Flute Chord
      this.audio.playSmashSound();

      // 2. Trigger Flute Background Audio if element exists
      const fluteAudio = document.getElementById('fluteAudio');
      if (fluteAudio) {
        fluteAudio.play().catch(() => {});
      }

      // 3. Screen Shake & Radial Flash
      if (this.overlay) {
        this.overlay.classList.add('screen-shake');
        setTimeout(() => {
          if (this.overlay) this.overlay.classList.remove('screen-shake');
        }, 350);
      }

      if (this.impactFlash) {
        this.impactFlash.style.setProperty('--flash-x', `${(impactX / window.innerWidth) * 100}%`);
        this.impactFlash.style.setProperty('--flash-y', `${(impactY / window.innerHeight) * 100}%`);
        this.impactFlash.classList.add('active');
        setTimeout(() => {
          if (this.impactFlash) this.impactFlash.classList.remove('active');
        }, 240);
      }

      // 4. Hide Intact Pot Assembly
      if (this.potAssembly) {
        this.potAssembly.style.display = 'none';
      }

      // 5. Flute recoil & settle
      this.flute.style.transition = 'transform 0.6s cubic-bezier(0.18, 0.89, 0.32, 1.28)';
      this.flute.style.transform = 'rotate(-15deg) scale(1.18)';

      // 6. Spawn Ceramic Shards, Fluttering Feather & Marigold Petals
      this.spawnShatterPieces(impactX, impactY);

      // 7. Explode Massive Curd Fountain Spray
      this.explodeCurdFountain(impactX, impactY);

      // 8. Spill Curd All Over the Bottom of the Webpage
      this.spillCurdOnBottom();

      // 9. Smooth Transition to Landing Page
      setTimeout(() => {
        this.revealLandingPage();
      }, CONFIG.transitionDelayMs);
    }

    spawnShatterPieces(centerX, centerY) {
      if (!this.shatterContainer) return;

      const shardImages = [
        'assets/shard_1.png',
        'assets/shard_2.png',
        'assets/shard_3.png',
        'assets/shard_4.png',
        'assets/shard_5.png',
        'assets/shard_6.png'
      ];

      shardImages.forEach((src, idx) => {
        const el = document.createElement('div');
        el.className = 'pot-shard';
        el.innerHTML = `<img src="${src}" alt="shard">`;

        const angle = (idx / shardImages.length) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
        const speed = 7 + Math.random() * 9;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed - 4;
        const rotSpeed = (Math.random() - 0.5) * 18;

        el.style.left = `${centerX - 40}px`;
        el.style.top = `${centerY - 40}px`;
        el.style.width = '80px';
        el.style.height = '80px';

        this.shatterContainer.appendChild(el);

        let x = centerX - 40;
        let y = centerY - 40;
        let curVx = vx;
        let curVy = vy;
        let rot = 0;
        let opacity = 1;

        const animateShard = () => {
          x += curVx;
          y += curVy;
          curVy += 0.42;
          curVx *= 0.985;
          rot += rotSpeed;
          opacity -= 0.008;

          el.style.transform = `translate3d(${x - centerX + 40}px, ${y - centerY + 40}px, 0) rotate(${rot}deg)`;
          el.style.opacity = Math.max(0, opacity);

          if (opacity > 0 && y < window.innerHeight + 100) {
            requestAnimationFrame(animateShard);
          } else {
            el.remove();
          }
        };
        requestAnimationFrame(animateShard);
      });

      // Fluttering Peacock Feather
      const featherEl = document.createElement('div');
      featherEl.className = 'flutter-feather';
      featherEl.innerHTML = `<img src="assets/shard_feather.png" alt="peacock feather">`;
      featherEl.style.left = `${centerX - 35}px`;
      featherEl.style.top = `${centerY - 70}px`;
      this.shatterContainer.appendChild(featherEl);

      let fx = centerX - 35;
      let fy = centerY - 70;
      let fvy = -5.5;
      let fvx = (Math.random() - 0.5) * 2;
      let fRot = 0;
      let fTime = 0;

      const animateFeather = () => {
        fTime += 0.05;
        fy += fvy;
        fx += fvx + Math.sin(fTime * 2.5) * 1.5;
        fvy += 0.12;
        fvy = Math.min(2.5, fvy);
        fRot = Math.sin(fTime * 2) * 28;

        featherEl.style.transform = `translate3d(${fx - centerX + 35}px, ${fy - centerY + 70}px, 0) rotate(${fRot}deg)`;

        if (fy < window.innerHeight - 80) {
          requestAnimationFrame(animateFeather);
        }
      };
      requestAnimationFrame(animateFeather);

      // Shower of Marigold Flower Petals
      const petalColors = ['#ff9800', '#ffb300', '#f57c00', '#ffd54f', '#d84315'];
      for (let i = 0; i < CONFIG.petalCount; i++) {
        const petal = document.createElement('div');
        petal.className = 'marigold-petal';
        petal.style.backgroundColor = petalColors[Math.floor(Math.random() * petalColors.length)];
        petal.style.left = `${centerX}px`;
        petal.style.top = `${centerY - 20}px`;
        this.shatterContainer.appendChild(petal);

        const pAngle = Math.random() * Math.PI * 2;
        const pSpeed = 4 + Math.random() * 8;
        let px = 0;
        let py = 0;
        let pvx = Math.cos(pAngle) * pSpeed;
        let pvy = Math.sin(pAngle) * pSpeed - 3;
        let pRot = Math.random() * 360;
        let pRotSpeed = (Math.random() - 0.5) * 15;
        let pAlpha = 1;

        const animatePetal = () => {
          px += pvx;
          py += pvy;
          pvy += 0.28;
          pvx *= 0.98;
          pRot += pRotSpeed;
          pAlpha -= 0.01;

          petal.style.transform = `translate3d(${px}px, ${py}px, 0) rotate(${pRot}deg)`;
          petal.style.opacity = Math.max(0, pAlpha);

          if (pAlpha > 0) {
            requestAnimationFrame(animatePetal);
          } else {
            petal.remove();
          }
        };
        requestAnimationFrame(animatePetal);
      }
    }

    explodeCurdFountain(centerX, centerY) {
      for (let i = 0; i < CONFIG.splashCurdCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 4 + Math.random() * 14;

        this.curdDroplets.push({
          x: centerX + (Math.random() - 0.5) * 30,
          y: centerY + (Math.random() - 0.5) * 30,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 4,
          radius: 4.0 + Math.random() * 8.5,
          gravity: 0.38,
          alpha: 1.0,
          decay: 0.009,
          isSlosh: false
        });
      }
    }

    spillCurdOnBottom() {
      // Curd covers the bottom of the page
      setTimeout(() => {
        if (this.bottomSpill) {
          this.bottomSpill.classList.add('spilled');
        }
        // Auto-sweep after ~3.6 seconds to sweep away downwards
        this.scheduleCurdSweep(CONFIG.autoSweepDelayMs);
      }, 250);
    }

    scheduleCurdSweep(delayMs) {
      if (this.sweepTimer) {
        clearTimeout(this.sweepTimer);
      }
      this.sweepTimer = setTimeout(() => {
        if (!this.isSweeping && this.bottomSpill && this.bottomSpill.classList.contains('spilled')) {
          this.sweepCurdDownwards();
        }
      }, delayMs);
    }

    sweepCurdDownwards() {
      if (this.isSweeping || !this.bottomSpill || !this.bottomSpill.classList.contains('spilled')) return;
      this.isSweeping = true;

      if (this.sweepTimer) {
        clearTimeout(this.sweepTimer);
        this.sweepTimer = null;
      }

      // Play rich fluid drainage and liquid plop sound
      this.audio.playSweepSound();

      // Fluid Discretization: 19 sample columns across the 1440 SVG coordinate width
      const N = 19;
      const initialYs = [
        70, 52, 45, 78, 62, 38, 28, 65, 52, 32, 60, 48, 28, 55, 68, 52, 38, 52, 40
      ];

      // Physical state per fluid column
      const columns = [];
      for (let i = 0; i < N; i++) {
        const x = (i / (N - 1)) * 1440;
        // Random friction coefficient mu_i between 0.65 and 1.50
        // Lower friction = faster downward streaming channel (viscous finger)
        // Higher friction = surface drag holding back
        const friction = 0.65 + Math.random() * 0.85;
        const gravity = 0.32 + Math.random() * 0.22;
        const driftPhase = Math.random() * Math.PI * 2;
        const driftSpeed = 0.035 + Math.random() * 0.04;
        const driftAmp = 5 + Math.random() * 10;

        columns.push({
          baseX: x,
          x: x,
          y: initialYs[i],
          vy: 0,
          friction: friction,
          gravity: gravity,
          driftPhase: driftPhase,
          driftSpeed: driftSpeed,
          driftAmp: driftAmp,
          rivuletCooldown: Math.floor(Math.random() * 10)
        });
      }

      let frameCount = 0;
      const startTime = performance.now();
      const activeDroplets = [];

      // Catmull-Rom to Cubic Bezier path generator for smooth organic curvature
      const buildSmoothPath = (pts, bottomY = 220) => {
        let d = `M ${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`;
        for (let i = 0; i < pts.length - 1; i++) {
          const p0 = i > 0 ? pts[i - 1] : pts[i];
          const p1 = pts[i];
          const p2 = pts[i + 1];
          const p3 = i < pts.length - 2 ? pts[i + 2] : p2;

          const cp1x = p1.x + (p2.x - p0.x) / 6;
          const cp1y = p1.y + (p2.y - p0.y) / 6;
          const cp2x = p2.x - (p3.x - p1.x) / 6;
          const cp2y = p2.y - (p3.y - p1.y) / 6;

          d += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
        }
        d += ` L 1440,${bottomY} L 0,${bottomY} Z`;
        return d;
      };

      const animateFluidDrainage = (now) => {
        frameCount++;
        const elapsed = now - startTime;
        let allDrained = true;

        // 1. Physics Step: Surface Tension, Gravity & Friction Drag
        for (let i = 0; i < N; i++) {
          const col = columns[i];

          if (col.y < 225) {
            allDrained = false;

            // Surface tension coupling with adjacent fluid columns
            let tension = 0;
            if (i > 0 && i < N - 1) {
              tension = 0.09 * ((columns[i - 1].y - col.y) + (columns[i + 1].y - col.y));
            } else if (i === 0) {
              tension = 0.09 * (columns[1].y - col.y);
            } else if (i === N - 1) {
              tension = 0.09 * (columns[N - 2].y - col.y);
            }

            // Downward acceleration: gravity - friction*velocity + surface cohesion
            const frictionDrag = -col.vy * (0.02 * col.friction);
            const a = col.gravity + frictionDrag + tension;

            col.vy += a;
            col.y += col.vy;

            // Non-linear horizontal meandering path
            col.x = col.baseX + Math.sin(col.driftPhase + frameCount * col.driftSpeed) * col.driftAmp;

            // Spawn trailing viscous rivulets in fast flow channels
            col.rivuletCooldown--;
            if (col.rivuletCooldown <= 0 && col.vy > 1.8 && col.y < 180 && Math.random() < 0.45) {
              col.rivuletCooldown = 12 + Math.floor(Math.random() * 15);
              this.spawnFluidRivulet(col.x, col.y);
            }
          } else {
            col.y = 225;
          }
        }

        // 2. Dynamically re-mesh SVG wave paths with fluid contours
        if (this.curdWavePrimary) {
          const primaryPath = buildSmoothPath(columns, 220);
          this.curdWavePrimary.setAttribute('d', primaryPath);
        }

        if (this.curdWaveSecondary) {
          const secPts = columns.map(c => ({
            x: c.x,
            y: Math.min(220, c.y + 16 + Math.sin(c.driftPhase + frameCount * 0.05) * 8)
          }));
          const secPath = buildSmoothPath(secPts, 220);
          this.curdWaveSecondary.setAttribute('d', secPath);
        }

        // 3. Fade specular highlights and floor splats along with drainage
        if (this.curdWaveHighlight) {
          this.curdWaveHighlight.style.opacity = Math.max(0, 0.75 - (elapsed / 1100));
        }

        if (this.curdFloorSplats) {
          this.curdFloorSplats.style.opacity = Math.max(0, 1.0 - (elapsed / 850));
        }

        // 4. Random sliding droplets along fluid streams
        if (elapsed < 1200 && Math.random() < 0.35) {
          this.spawnSlidingDrop();
        }

        if (!allDrained || elapsed < 1300) {
          this.sweepAnimId = requestAnimationFrame(animateFluidDrainage);
        } else {
          // Curd is completely drained away!
          this.finishCurdSweep();
        }
      };

      this.sweepAnimId = requestAnimationFrame(animateFluidDrainage);
    }

    spawnFluidRivulet(svgX, svgY) {
      if (!this.bottomSpill) return;
      const W = window.innerWidth;
      const clientX = (svgX / 1440) * W;
      const clientY = (svgY / 220) * 180;

      const rivulet = document.createElement('div');
      rivulet.className = 'curd-drain-rivulet';
      const width = 3 + Math.random() * 5;
      const maxH = 25 + Math.random() * 45;
      rivulet.style.width = `${width}px`;
      rivulet.style.left = `${clientX - width / 2}px`;
      rivulet.style.top = `${clientY}px`;
      rivulet.style.height = '0px';

      this.bottomSpill.appendChild(rivulet);

      let h = 0;
      let alpha = 0.95;
      let yOffset = 0;
      const vStream = 2.5 + Math.random() * 3.5;

      const animRivulet = () => {
        h = Math.min(maxH, h + vStream);
        yOffset += vStream * 0.45;
        alpha -= 0.038;

        rivulet.style.height = `${h}px`;
        rivulet.style.transform = `translateY(${yOffset}px)`;
        rivulet.style.opacity = Math.max(0, alpha);

        if (alpha > 0) {
          requestAnimationFrame(animRivulet);
        } else {
          rivulet.remove();
        }
      };
      requestAnimationFrame(animRivulet);
    }

    spawnSlidingDrop() {
      if (!this.bottomSpill) return;
      const W = window.innerWidth;
      const px = Math.random() * W;
      const py = 10 + Math.random() * 50;

      const drop = document.createElement('div');
      drop.className = 'curd-sliding-drop';
      const size = 4 + Math.random() * 5;
      drop.style.width = `${size}px`;
      drop.style.height = `${size * 1.3}px`;
      drop.style.left = `${px}px`;
      drop.style.top = `${py}px`;

      this.bottomSpill.appendChild(drop);

      let curY = py;
      let vy = 1.8 + Math.random() * 2.5;
      let alpha = 0.95;
      const wobbleFreq = 0.08 + Math.random() * 0.06;
      const wobbleAmp = 1.2 + Math.random() * 2.0;

      const animDrop = () => {
        vy += 0.28; // gravity
        curY += vy;
        alpha -= 0.035;

        const curX = Math.sin(curY * wobbleFreq) * wobbleAmp;
        drop.style.transform = `translate(${curX}px, ${curY - py}px)`;
        drop.style.opacity = Math.max(0, alpha);

        if (alpha > 0 && curY < 230) {
          requestAnimationFrame(animDrop);
        } else {
          drop.remove();
        }
      };
      requestAnimationFrame(animDrop);
    }

    finishCurdSweep() {
      if (this.bottomSpill) {
        this.bottomSpill.classList.remove('spilled');
      }
      this.isSweeping = false;
      this.sweepAnimId = null;

      // Completely remove elements from DOM so no traces remain
      setTimeout(() => {
        if (this.bottomSpill) {
          this.bottomSpill.remove();
          this.bottomSpill = null;
        }
        if (this.overlay) {
          this.overlay.remove();
          this.overlay = null;
        }
      }, 300);
    }

    revealLandingPage() {
      // Fade out the dark intro overlay to unveil the landing page
      if (this.overlay) {
        this.overlay.classList.add('fade-out');
      }
    }
  }

  // Auto-initialize as soon as DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new DahiHandiIntro());
  } else {
    new DahiHandiIntro();
  }

  // Developer helper to reset the one-time experience if testing is needed in console:
  window.resetDahiHandi = () => {
    localStorage.removeItem(STORAGE_KEY);
    location.reload();
  };
})();
