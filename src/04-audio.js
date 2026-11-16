/* ============================================================================
   04-AUDIO.JS — TÜRKÇE KONUŞMA SENTEZİ (tr-TR), 8 KARAKTER ÖZEL SES EFEKTİ VE
   PROSEDÜREL ARKA PLAN / BOSS MÜZİKLERİ (Sıfır Harici MP3/WAV)
   ============================================================================ */

const AudioSys = {
  ctx: null,
  soundOn: true,
  musicOn: true,
  voices: [],
  trVoices: [],
  speaking: false,
  speakerId: null,
  wordIdx: -1,
  wordTimer: null,
  mouthPhase: 0,
  musicTimer: null,
  musicStep: 0,
  musicTheme: 'town',
  iosUnlocked: false,
  isIOS: false,
  speechSpeed: 'slow', // 'slow' | 'normal'

  init() {
    const ua = (typeof navigator !== 'undefined' && navigator.userAgent) || '';
    const plat = (typeof navigator !== 'undefined' && navigator.platform) || '';
    const mtp = (typeof navigator !== 'undefined' && navigator.maxTouchPoints) || 0;
    this.isIOS = /iPad|iPhone|iPod/i.test(ua) || (plat === 'MacIntel' && mtp > 1);

    if ('speechSynthesis' in window) {
      const loadV = () => {
        this.voices = window.speechSynthesis.getVoices() || [];
        this.trVoices = this.voices.filter(v => /^tr([-_]|$)/i.test(v.lang) || /turkish|türkçe|yelda|emel|tolga/i.test(v.name));
      };
      loadV();
      window.speechSynthesis.onvoiceschanged = loadV;
    }

    // iPadOS / iOS Safari WKWebView Audio + SpeechSynthesis Unlocker on first user gesture
    const unlockIOS = () => {
      if (this.iosUnlocked) return;
      this.iosUnlocked = true;
      const ctx = this.ensure();
      if (ctx) {
        try {
          const buf = ctx.createBuffer(1, 1, 22050);
          const src = ctx.createBufferSource();
          src.buffer = buf;
          src.connect(ctx.destination);
          src.start(0);
        } catch (e) {}
      }
      if ('speechSynthesis' in window) {
        try {
          const u = new SpeechSynthesisUtterance(' ');
          u.volume = 0.01;
          u.lang = 'tr-TR';
          window.speechSynthesis.speak(u);
        } catch (e) {}
      }
    };
    ['touchstart', 'touchend', 'pointerdown', 'click'].forEach(ev => {
      window.addEventListener(ev, unlockIOS, { passive: true });
    });
  },

  ensure() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) this.ctx = new AC();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  },

  tone(freq, dur, type = 'triangle', vol = 0.14, delay = 0, slideTo = null) {
    if (!this.soundOn) return;
    const ctx = this.ensure();
    if (!ctx) return;
    const t0 = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(Math.max(24, freq), t0);
    if (slideTo) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(24, slideTo), t0 + dur);
    }
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.linearRampToValueAtTime(vol, t0 + Math.min(0.02, dur * 0.25));
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g);
    g.connect(ctx.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  },

  noise(dur = 0.18, vol = 0.12, delay = 0, bandFreq = 900, q = 1.4) {
    if (!this.soundOn) return;
    const ctx = this.ensure();
    if (!ctx) return;
    const t0 = ctx.currentTime + delay;
    const len = Math.max(1, Math.floor(ctx.sampleRate * dur));
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const flt = ctx.createBiquadFilter();
    flt.type = 'bandpass';
    flt.frequency.setValueAtTime(bandFreq, t0);
    flt.Q.setValueAtTime(q, t0);
    const g = ctx.createGain();
    g.gain.setValueAtTime(vol, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    src.connect(flt);
    flt.connect(g);
    g.connect(ctx.destination);
    src.start(t0);
    src.stop(t0 + dur + 0.02);
  },

  /* ---- 8 KARAKTERİN İMZA SES EFEKTLERİ ---- */
  playCharSignature(id) {
    if (!this.soundOn) return;
    switch (id) {
      case 'rakun':
        // Polis telsizi / neşeli komiser düdüğü
        this.tone(740, 0.08, 'triangle', 0.13, 0, 880);
        this.tone(988, 0.12, 'triangle', 0.13, 0.09, 1046);
        break;
      case 'vudi':
        // Hızlı enerjik ağaçkakan gaga vurması: Tak-tak-tak-ta-tak! + cıvıltı
        [0, 0.055, 0.11, 0.18, 0.23].forEach((d, i) => {
          this.tone(1250 + (i % 2) * 180, 0.038, 'square', 0.11, d, 680);
          this.noise(0.03, 0.08, d, 1900, 3.0);
        });
        this.tone(1320, 0.09, 'sine', 0.11, 0.29, 1760);
        break;
      case 'palyaco':
        // Teatral kötü kahkaha (Mua-ha-ha-ha!) + kırmızı burun palyaço kornası (Honk-honk!)
        this.tone(480, 0.11, 'sawtooth', 0.12, 0, 390);
        this.tone(360, 0.09, 'sawtooth', 0.11, 0.12, 520);
        [0.24, 0.35, 0.46, 0.57].forEach((d, i) => {
          const f = 560 - i * 55;
          this.tone(f, 0.09, 'triangle', 0.13, d, f * 0.78);
        });
        break;
      case 'karga':
        // Sinsi "Gaaak! Gaaak!" karga sesi
        this.tone(430, 0.16, 'sawtooth', 0.11, 0, 290);
        this.noise(0.14, 0.07, 0.01, 1200, 2.2);
        this.tone(410, 0.18, 'sawtooth', 0.11, 0.21, 260);
        break;
      case 'trex':
        // Tok/gür komik dinozor kükremesi: RÖÖÖAAR-bloop!
        this.tone(135, 0.34, 'sawtooth', 0.16, 0, 72);
        this.noise(0.28, 0.10, 0.02, 260, 1.2);
        this.tone(190, 0.11, 'sine', 0.13, 0.35, 290);
        break;
      case 'ejderha':
        // Heyecanlı hırıltı + duman/alev pufu (Pufff-fşşş!)
        this.noise(0.26, 0.15, 0, 650, 0.9);
        this.tone(260, 0.14, 'triangle', 0.12, 0.05, 420);
        this.noise(0.18, 0.11, 0.18, 1300, 1.1);
        break;
      case 'godzilla':
        // Derin bas sarsıntılı dev sesi: BÜÜÜM!
        this.playStomp(1.2);
        this.tone(92, 0.42, 'sawtooth', 0.17, 0.04, 52);
        break;
      case 'kurt':
        // Karizmatik/hırıltılı kısa kurt uluması: Auuuu-hmph!
        this.tone(240, 0.22, 'triangle', 0.14, 0, 410);
        this.tone(410, 0.20, 'triangle', 0.12, 0.21, 290);
        this.noise(0.09, 0.06, 0.40, 420, 1.8);
        break;
    }
  },

  playStomp(power = 1.0) {
    if (!this.soundOn) return;
    this.tone(68, 0.28 * power, 'sine', Math.min(0.24, 0.18 * power), 0, 30);
    this.noise(0.16 * power, 0.11 * power, 0, 160, 0.9);
  },

  playPuff() {
    if (!this.soundOn) return;
    this.noise(0.16, 0.09, 0, 780, 1.1);
  },

  playSuccess() {
    if (!this.soundOn) return;
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
      this.tone(f, 0.16, 'triangle', 0.15, i * 0.075);
    });
  },

  playFanfare() {
    if (!this.soundOn) return;
    const notes = [523, 659, 784, 1046, 784, 1046, 1318];
    const times = [0, 0.09, 0.18, 0.28, 0.42, 0.53, 0.66];
    notes.forEach((f, i) => this.tone(f, i === 6 ? 0.42 : 0.14, 'triangle', 0.17, times[i]));
  },

  playWrong() {
    if (!this.soundOn) return;
    this.tone(310, 0.14, 'sine', 0.13, 0, 250);
    this.tone(245, 0.20, 'sine', 0.13, 0.13, 195);
  },

  playHeartBreak() {
    if (!this.soundOn) return;
    this.tone(340, 0.12, 'sawtooth', 0.16, 0, 220);
    this.tone(215, 0.26, 'sawtooth', 0.16, 0.12, 115);
    this.noise(0.14, 0.10, 0.05, 420, 1.2);
  },

  playLedgeGrab() {
    if (!this.soundOn) return;
    this.tone(480, 0.07, 'triangle', 0.13, 0, 760);
    this.tone(760, 0.09, 'sine', 0.12, 0.06, 980);
  },

  playPickup() {
    if (!this.soundOn) return;
    this.tone(587, 0.08, 'sine', 0.13, 0, 880);
    this.tone(880, 0.11, 'triangle', 0.13, 0.07, 1174);
  },

  playCannon() {
    if (!this.soundOn) return;
    this.tone(180, 0.22, 'sine', 0.18, 0, 58);
    this.noise(0.2, 0.14, 0, 520, 0.8);
  },

  playSplash() {
    if (!this.soundOn) return;
    this.noise(0.28, 0.14, 0, 1100, 0.7);
    this.tone(360, 0.14, 'sine', 0.1, 0.04, 180);
  },

  /* ---- TÜRKÇE SESLİ OKUMA + KARAOKE KELİME VURGUSU + AĞIZ/GAGA RİTMİ ---- */
  stopSpeech() {
    if (this.wordTimer) {
      clearInterval(this.wordTimer);
      this.wordTimer = null;
    }
    if ('speechSynthesis' in window) {
      try { window.speechSynthesis.cancel(); } catch (e) {}
    }
    this.speaking = false;
    this.speakerId = null;
    this.wordIdx = -1;
  },

  speakLine(charId, text, onWordIdx) {
    this.stopSpeech();
    const ch = CHARACTERS[charId] || CHARACTERS.rakun;
    this.playCharSignature(charId);

    const words = String(text).trim().split(/\s+/).filter(Boolean);
    if (!words.length) return;

    this.speaking = true;
    this.speakerId = charId;
    this.wordIdx = 0;
    if (onWordIdx) onWordIdx(0);

    const rawRate = Math.min(1.06, Math.max(0.78, (ch.voice && ch.voice.rate) || 1.0));
    const speedFactor = this.isIOS
      ? (this.speechSpeed === 'slow' ? 0.66 : 0.80)
      : (this.speechSpeed === 'slow' ? 0.82 : 0.94);
    const rate = Math.max(0.56, Math.min(0.95, +(rawRate * speedFactor).toFixed(2)));
    const baseWordMs = this.speechSpeed === 'slow' ? 430 : 335;
    const msPerWord = Math.max(260, Math.round(baseWordMs / Math.max(0.75, rawRate)));
    let wi = 0;

    // Garantili zamanlayıcı: TTS olmasa veya boundary ateşlemese bile kelime kelime vurgular ve ağzı/gagayı oynatır
    this.wordTimer = setInterval(() => {
      wi++;
      if (wi < words.length) {
        this.wordIdx = wi;
        if (onWordIdx) onWordIdx(wi);
      } else {
        clearInterval(this.wordTimer);
        this.wordTimer = null;
        setTimeout(() => {
          this.speaking = false;
          this.speakerId = null;
          if (onWordIdx) onWordIdx(-1);
        }, 240);
      }
    }, msPerWord);

    if (this.soundOn && 'speechSynthesis' in window) {
      try {
        const clean = text
          .replace(/[★⭐🦖🐉🦎🐺🤡🐦‍⬛🐦🦝🔥❤️🪙🤖⚡]/g, '')
          .replace(/([.!?;:])\s+/g, '$1 , ');
        const u = new SpeechSynthesisUtterance(clean);
        u.lang = 'tr-TR';
        u.pitch = (ch.voice && ch.voice.pitch) || 1.0;
        u.rate = rate;
        u.volume = 1.0;
        if (!this.trVoices.length) {
          this.voices = window.speechSynthesis.getVoices() || [];
          this.trVoices = this.voices.filter(v => /^tr([-_]|$)/i.test(v.lang) || /turkish|türkçe/i.test(v.name));
        }
        if (this.trVoices.length) {
          const idx = Math.abs(charId.charCodeAt(0) + charId.length) % this.trVoices.length;
          u.voice = this.trVoices[idx];
        }
        u.onboundary = (ev) => {
          if (ev.name === 'word' && typeof ev.charIndex === 'number') {
            const prefix = clean.slice(0, ev.charIndex);
            const count = prefix.trim() ? prefix.trim().split(/\s+/).length : 0;
            this.wordIdx = Math.min(words.length - 1, count);
            if (onWordIdx) onWordIdx(this.wordIdx);
          }
        };
        u.onend = () => {
          if (this.wordTimer) { clearInterval(this.wordTimer); this.wordTimer = null; }
          this.speaking = false;
          this.speakerId = null;
          if (onWordIdx) onWordIdx(-1);
        };
        window.speechSynthesis.speak(u);
      } catch (e) {}
    }
  },

  mouthOpenFor(charId, t) {
    if (!this.speaking || this.speakerId !== charId) return 0;
    const speed = charId === 'vudi' ? 24 : charId === 'godzilla' ? 11 : charId === 'trex' ? 14 : 18;
    return Math.max(0, 0.5 + 0.5 * Math.sin(t * speed + Math.sin(t * 7.3)));
  },

  /* ---- 4 BÖLGE / BOSS PROSEDÜREL ARKA PLAN MÜZİĞİ ---- */
  setMusicTheme(theme) {
    if (this.musicTheme === theme && this.musicTimer) return;
    this.musicTheme = theme;
    this.restartMusicLoop();
  },

  restartMusicLoop() {
    if (this.musicTimer) {
      clearInterval(this.musicTimer);
      this.musicTimer = null;
    }
    if (!this.musicOn || !this.soundOn) return;

    const patterns = {
      town: {
        bpm: 122,
        lead: [523, 0, 659, 587, 523, 0, 784, 659, 587, 0, 659, 523, 494, 587, 523, 0],
        bass: [262, 0, 196, 0, 262, 0, 196, 0, 220, 0, 175, 0, 196, 0, 262, 0]
      },
      valley: {
        bpm: 128,
        lead: [440, 523, 587, 0, 659, 587, 523, 440, 392, 440, 523, 0, 587, 523, 440, 0],
        bass: [220, 220, 165, 0, 196, 196, 147, 0, 175, 175, 196, 0, 220, 0, 165, 0]
      },
      city: {
        bpm: 132,
        lead: [587, 0, 740, 659, 587, 494, 587, 0, 659, 0, 784, 740, 659, 587, 494, 0],
        bass: [294, 0, 220, 0, 247, 0, 196, 0, 262, 0, 220, 0, 294, 247, 220, 0]
      },
      boss: {
        bpm: 156,
        lead: [587, 698, 880, 831, 784, 698, 659, 587, 587, 698, 932, 880, 784, 698, 659, 554],
        bass: [147, 147, 220, 147, 175, 175, 165, 147, 147, 147, 233, 220, 196, 175, 165, 139]
      }
    };

    const pat = patterns[this.musicTheme] || patterns.town;
    const stepMs = Math.round((60 / pat.bpm / 2) * 1000);

    this.musicTimer = setInterval(() => {
      if (!this.musicOn || !this.soundOn) return;
      if (!this.ctx || this.ctx.state !== 'running') return;
      const duck = this.speaking ? 0.32 : 1.0;
      const s = this.musicStep % pat.lead.length;
      this.musicStep++;
      const l = pat.lead[s];
      const b = pat.bass[s];
      if (l > 0) this.tone(l, stepMs / 1000 * 0.78, this.musicTheme === 'boss' ? 'square' : 'triangle', 0.036 * duck);
      if (b > 0) this.tone(b, stepMs / 1000 * 0.85, 'sine', 0.045 * duck);
    }, stepMs);
  }
};
