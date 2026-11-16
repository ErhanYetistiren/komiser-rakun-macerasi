/* ============================================================================
   09-MAIN-GAME.JS — ANA OYUN DÖNGÜSÜ, 20 BÖLÜM YÖNETİCİSİ, SÜRÜKLE-NİŞAN DENİZ
   SAVAŞI, BOSS ARENALARI, CEPHANE MAĞAZASI, KARAOKE DİYALOG VE KAYIT SİSTEMİ
   ============================================================================ */

const SAVE_KEY = 'komiserRakun.megaSave.v1';

function defaultSave() {
  return {
    started: false,
    playerName: 'Cesur Dedektif',
    currentChapter: 1,
    unlockedUpTo: 1,
    completedChapters: [],
    coins: 40,
    totalCorrect: 0,
    secrets: [],
    rescuedBots: [],
    ownedWardrobe: ['cap', 'none_hat', 'cape_none', 'glasses_none'],
    wardrobe: { coatHex: '#1e3566', hat: 'cap', back: 'cape_none', eye: 'glasses_none' },
    ownedArsenal: {
      suits: ['robot_suit'],
      weapons: ['club'],
      gloves: ['basic_glove'],
      gadgets: ['jet_std'],
      armors: ['police_suit'],
      ships: ['rae_ship']
    },
    equipped: {
      suits: 'robot_suit',
      weapons: 'club',
      gloves: 'basic_glove',
      gadgets: 'jet_std',
      armors: 'police_suit',
      ships: 'rae_ship'
    },
    settings: { view: '3d', sound: true, music: true, touch: true }
  };
}

function loadSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return defaultSave();
    const parsed = JSON.parse(raw);
    const def = defaultSave();
    return Object.assign(def, parsed, {
      wardrobe: Object.assign(def.wardrobe, parsed.wardrobe || {}),
      ownedArsenal: Object.assign(def.ownedArsenal, parsed.ownedArsenal || {}),
      equipped: Object.assign(def.equipped, parsed.equipped || {}),
      settings: Object.assign(def.settings, parsed.settings || {})
    });
  } catch (e) {
    return defaultSave();
  }
}

function persistSave() {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(Save)); } catch (e) {}
}

let Save = loadSave();

/* ---- 5 ZENGİN DÜNYA HARİTASI (ACT I: BÖLÜM 1–12) ---- */
const WORLDS = {
  town: {
    name: 'Patika Kasabası',
    music: 'town',
    buildings: [
      { mesh: 'bPolice', x: 1200, y: 520, label: '🏛️ MERKEZ KARAKOL', r: 110 },
      { mesh: 'bSchool', x: 620, y: 560, label: '🏫 ATATÜRK İLKOKULU', r: 100 },
      { mesh: 'bWindmill', x: 1840, y: 520, label: '🌾 YEL DEĞİRMENİ', r: 80 },
      { mesh: 'bHouse', x: 620, y: 1240, label: '🏡 KURT\'UN SOKAĞI', r: 85 },
      { mesh: 'bHouse', x: 1720, y: 1160, label: '🏡 NEŞELİ EVLER', r: 85 }
    ],
    props: [
      { mesh: 'bFountain', x: 1200, y: 900 },
      { mesh: 'bPoliceCar', x: 1050, y: 610, yaw: 0.35 },
      { mesh: 'flowerbed', x: 1340, y: 600 },
      { mesh: 'flowerbed', x: 1060, y: 900 },
      { mesh: 'flowerbed', x: 1340, y: 900 }
    ],
    trees: [
      { x: 340, y: 360, kind: 'oak', s: 1.1 }, { x: 450, y: 780, kind: 'pine', s: 1.0 },
      { x: 380, y: 1380, kind: 'oak', s: 1.15 }, { x: 880, y: 360, kind: 'pine', s: 1.05 },
      { x: 1520, y: 360, kind: 'oak', s: 1.1 }, { x: 2050, y: 380, kind: 'pine', s: 1.15 },
      { x: 2060, y: 860, kind: 'oak', s: 1.05 }, { x: 900, y: 1440, kind: 'oak', s: 1.1 },
      { x: 1480, y: 1460, kind: 'pine', s: 1.0 }
    ],
    npcsBase: [
      { id: 'trex', x: 1560, y: 760, line: 'RÖÖÖAAR! Merhaba Komiserim! Kasabanın çörekleri harika kokuyor!' },
      { id: 'ejderha', x: 860, y: 1120, line: 'Pufff! Yanardağ Vadisi\'nde duman halkalarımla seni bekliyorum!' }
    ]
  },
  valley: {
    name: 'Dinozor Vadisi ve Yanardağ',
    music: 'valley',
    buildings: [
      { mesh: 'bVolcano', x: 1200, y: 430, label: '🌋 DUMANLI YANARDAĞ', r: 145 },
      { mesh: 'bHouse', x: 580, y: 620, label: '🏕️ DOĞA İSTASYONU', r: 85 },
      { mesh: 'bWindmill', x: 1850, y: 640, label: '🌴 VADİ KULESİ', r: 80 }
    ],
    props: [
      { mesh: 'flowerbed', x: 960, y: 860 },
      { mesh: 'flowerbed', x: 1440, y: 860 }
    ],
    trees: [
      { x: 360, y: 420, kind: 'palm', s: 1.2 }, { x: 420, y: 980, kind: 'pine', s: 1.15 },
      { x: 460, y: 1420, kind: 'palm', s: 1.1 }, { x: 860, y: 480, kind: 'palm', s: 1.1 },
      { x: 1560, y: 480, kind: 'palm', s: 1.15 }, { x: 2020, y: 480, kind: 'pine', s: 1.2 },
      { x: 2040, y: 1080, kind: 'palm', s: 1.15 }, { x: 1020, y: 1460, kind: 'oak', s: 1.1 }
    ],
    npcsBase: [
      { id: 'trex', x: 920, y: 720, line: 'RÖÖÖAAR-Höhö! Minicik kollarımla el sallıyorum Komiserim!' },
      { id: 'ejderha', x: 1480, y: 720, line: 'Pufff-fşşş! Toplama ve çıkarma bulutlarım her zaman hazır!' }
    ]
  },
  city: {
    name: 'Büyük Şehir Meydanı ve Saat Kulesi',
    music: 'city',
    buildings: [
      { mesh: 'bSchool', x: 1200, y: 470, label: '🕰️ BÜYÜK SAAT KULESİ', r: 115 },
      { mesh: 'bPolice', x: 600, y: 560, label: '📰 ŞEHİR GAZETESİ & 5N1K', r: 105 },
      { mesh: 'bHouse', x: 1820, y: 560, label: '🍕 ŞEHİR FIRINI', r: 90 },
      { mesh: 'bHouse', x: 620, y: 1280, label: '🏦 MERKEZ ÇARŞI', r: 90 }
    ],
    props: [
      { mesh: 'bFountain', x: 1200, y: 900 },
      { mesh: 'bPoliceCar', x: 760, y: 640, yaw: -0.3 },
      { mesh: 'bPoliceCar', x: 1640, y: 640, yaw: 0.4 }
    ],
    trees: [
      { x: 360, y: 380, kind: 'oak', s: 1.05 }, { x: 380, y: 920, kind: 'oak', s: 1.05 },
      { x: 2040, y: 420, kind: 'oak', s: 1.05 }, { x: 2040, y: 960, kind: 'pine', s: 1.1 },
      { x: 960, y: 1460, kind: 'oak', s: 1.05 }, { x: 1460, y: 1460, kind: 'oak', s: 1.05 }
    ],
    npcsBase: [
      { id: 'godzilla', x: 1520, y: 760, line: 'BÜÜÜM! Merhaba küçük dostum! Sırtımdaki mavi dikenler senin için parlıyor!' },
      { id: 'kurt', x: 860, y: 780, line: 'Auuuu! Şehirde trafik kurallarına herkes uyuyor Komiser!' }
    ]
  },
  island: {
    name: 'Lunapark Bilim Adası',
    music: 'valley',
    buildings: [
      { mesh: 'bClownCastle', x: 1200, y: 470, label: '🎡 PALYAÇO KALESİ', r: 120 },
      { mesh: 'bWindmill', x: 620, y: 600, label: '♻️ DOĞA KULESİ', r: 80 },
      { mesh: 'bHouse', x: 1800, y: 620, label: '🚀 UZAY PORTALI ÜSSÜ', r: 90 }
    ],
    props: [
      { mesh: 'bFountain', x: 1200, y: 940 },
      { mesh: 'flowerbed', x: 980, y: 620 },
      { mesh: 'flowerbed', x: 1420, y: 620 }
    ],
    trees: [
      { x: 380, y: 420, kind: 'palm', s: 1.25 }, { x: 420, y: 1020, kind: 'palm', s: 1.2 },
      { x: 480, y: 1420, kind: 'palm', s: 1.15 }, { x: 2000, y: 440, kind: 'palm', s: 1.25 },
      { x: 2020, y: 1040, kind: 'palm', s: 1.2 }, { x: 1520, y: 1440, kind: 'palm', s: 1.15 }
    ],
    npcsBase: [
      { id: 'ejderha', x: 880, y: 760, line: 'Pufff! Bilim Adası\'nın havası tertemiz oldu!' },
      { id: 'trex', x: 1540, y: 780, line: 'RÖÖÖAAR! Doktor Palyaço kalenin içinde saklanıyor!' }
    ]
  },
  lab: {
    name: 'Doktor Palyaço\'nun Dev Laboratuvarı',
    music: 'boss',
    buildings: [
      { mesh: 'bClownCastle', x: 1200, y: 390, label: '🤡 ŞAPŞALTRON-3000 MERKEZİ', r: 125 }
    ],
    props: [],
    trees: [],
    npcsBase: [
      { id: 'karga', x: 960, y: 520, line: 'Gaaak! Patron dikkat et, Komiser Rakun çok hızlı!' },
      { id: 'trex', x: 480, y: 900, line: 'RÖÖÖAAR! Ha gayret Komiser Rakun, başaracaksın!' },
      { id: 'godzilla', x: 1920, y: 900, line: 'BÜÜÜM! Biz arkandayız Başkomiser!' }
    ]
  }
};

const ALL_CHAPTERS = () => CHAPTERS.concat(ASTRO_CHAPTERS);

/* ---- OYUN DURUMU ---- */
const Game = {
  mode: 'title', // 'title' | 'play'
  astroActive: false,
  worldId: 'town',
  worldDef: WORLDS.town,
  time: 0,
  shake: 0,
  arenaWide: false,
  seaActive: false,

  player: { x: 1200, y: 1020, yaw: 0, moving: false, targetX: null, targetY: null, stun: 0 },
  vudi: { x: 1140, y: 1040, yaw: 0, moving: false },
  npcs: [],
  items: [],
  carrying: null,
  pedestal: null,
  pads: [],
  hazards: [],
  particles: [],
  confetti: [],
  questTarget: null,

  chapter: CHAPTERS[0],
  chProgress: 0,
  chGoal: 4,
  qCursor: 0,
  spawnTimer: 0,
  stompTimer: 2.2,
  padQuestion: null,

  sea: {
    bx: 900, by: 1050, byaw: 0,
    kx: 1480, ky: 760, kyaw: 0,
    crate: null, loaded: false,
    aiming: false, aimX: 1480, aimY: 760,
    balls: [], shootTimer: 2.2
  },

  soccer: {
    bx: 1480, by: 1020, bvx: 0, bvy: 0,
    gx: 1820, gy: 860, goals: 0
  },

  dialogOpen: false,
  dialogQueue: [],
  dialogOnDone: null,
  dialogFocus: null,
  currentLine: null,

  quizOpen: false
};

/* ---- KLAVYE, FARE VE GERÇEK ÇOKLU DOKUNUŞ (MULTI-TOUCH) TABLET GİRDİSİ ---- */
const Input = {
  keys: {},
  joyActive: false,
  joyPointerId: null,
  joyFloating: false,
  joyOriginX: 0,
  joyOriginY: 0,
  joyDx: 0,
  joyDy: 0,
  dx: 0,
  dy: 0,
  jumpPointerId: null,
  atkPointerId: null,
  aimPointerId: null,
  jumpPressed: false,
  jumpHeld: false,
  fireHeld: false,

  init() {
    window.addEventListener('keydown', (e) => {
      if (document.activeElement && document.activeElement.tagName === 'INPUT') return;
      this.keys[e.code] = true;

      if (Game.quizOpen) {
        if (e.code === 'Digit1' || e.code === 'Numpad1') QuizUI.pick(0);
        if (e.code === 'Digit2' || e.code === 'Numpad2') QuizUI.pick(1);
        if (e.code === 'Digit3' || e.code === 'Numpad3') QuizUI.pick(2);
        if (e.code === 'Space' || e.code === 'Enter') {
          const nb = document.getElementById('btnQuizNext');
          if (nb && !nb.classList.contains('hidden')) nb.click();
        }
        return;
      }

      if (Game.dialogOpen) {
        if (e.code === 'Space' || e.code === 'Enter') {
          e.preventDefault();
          DialogUI.next();
        }
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        if (Game.astroActive) {
          if (!this.jumpHeld) this.jumpPressed = true;
          this.jumpHeld = true;
        } else if (Game.seaActive && Game.sea.loaded) {
          fireSeaCannon(Game.sea.kx, Game.sea.ky);
        } else {
          tryInteract();
        }
      }
      if (e.code === 'Enter') {
        if (!Game.astroActive) tryInteract();
      }
      if (e.code === 'KeyF') {
        if (Game.astroActive) AstroEngine.triggerAttack();
        else if (Game.seaActive && Game.sea.loaded) fireSeaCannon(Game.sea.kx, Game.sea.ky);
        else tryInteract();
      }
      if (e.code === 'KeyE') {
        if (Game.astroActive) AstroEngine.triggerGadget();
      }
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
        if (Game.astroActive) AstroEngine.triggerDash();
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
      if (e.code === 'Space') this.jumpHeld = false;
    });

    // Touch detection & Independent PointerId Virtual Joystick (Sunny Hill + Astro Bot Tablet Feel!)
    const enableTouch = () => {
      document.body.classList.add('touch-ui');
      AudioSys.unlockIOS?.();
    };
    window.addEventListener('touchstart', enableTouch, { once: true, passive: true });

    const jz = document.getElementById('joyZone');
    const jk = document.getElementById('joyKnob');
    const updateJoyFromCenter = (clientX, clientY, cx, cy, maxR) => {
      let dx = clientX - cx, dy = clientY - cy;
      const dist = Math.hypot(dx, dy);
      if (dist > maxR) { dx = (dx / dist) * maxR; dy = (dy / dist) * maxR; }
      jk.style.transform = `translate(${dx}px, ${dy}px)`;
      this.joyDx = dx / maxR;
      this.joyDy = dy / maxR;
    };
    const handleJoyFixed = (clientX, clientY) => {
      const r = jz.getBoundingClientRect();
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      updateJoyFromCenter(clientX, clientY, cx, cy, Math.max(36, r.width * 0.42));
    };
    const endJoy = (pointerId) => {
      if (pointerId !== undefined && this.joyPointerId !== null && pointerId !== this.joyPointerId) return;
      this.joyActive = false;
      this.joyFloating = false;
      this.joyPointerId = null;
      this.joyDx = 0;
      this.joyDy = 0;
      jk.style.transform = 'translate(0px, 0px)';
    };
    jz.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      AudioSys.ensure();
      this.joyActive = true;
      this.joyFloating = false;
      this.joyPointerId = e.pointerId;
      try { jz.setPointerCapture(e.pointerId); } catch (_) {}
      handleJoyFixed(e.clientX, e.clientY);
    });
    jz.addEventListener('pointermove', (e) => {
      if (this.joyActive && e.pointerId === this.joyPointerId && !this.joyFloating) {
        handleJoyFixed(e.clientX, e.clientY);
      }
    });
    jz.addEventListener('pointerup', (e) => endJoy(e.pointerId));
    jz.addEventListener('pointercancel', (e) => endJoy(e.pointerId));

    // Click-to-walk, Dynamic Left-Thumb Touch Stick & Sea Drag-to-Aim on cv2d!
    const cv2d = document.getElementById('cv2d');
    cv2d.addEventListener('pointerdown', (e) => {
      AudioSys.ensure();
      if (Game.mode !== 'play' || Game.dialogOpen || Game.quizOpen || Game.astroActive) return;

      // Dynamic Floating Left-Quadrant Thumbstick for Tablet Touch!
      if (e.pointerType === 'touch' && !Game.seaActive && e.clientX < window.innerWidth * 0.40 && e.clientY > window.innerHeight * 0.45 && !this.joyActive) {
        this.joyActive = true;
        this.joyFloating = true;
        this.joyPointerId = e.pointerId;
        this.joyOriginX = e.clientX;
        this.joyOriginY = e.clientY;
        try { cv2d.setPointerCapture(e.pointerId); } catch (_) {}
        return;
      }

      const worldPt = screenToWorldAct1(e.clientX, e.clientY);
      if (Game.seaActive) {
        if (Game.sea.loaded) {
          Game.sea.aiming = true;
          this.aimPointerId = e.pointerId;
          Game.sea.aimX = worldPt.x;
          Game.sea.aimY = worldPt.y;
        } else {
          Game.player.targetX = worldPt.x;
          Game.player.targetY = worldPt.y;
        }
      } else {
        Game.player.targetX = clamp(worldPt.x, 180, 2220);
        Game.player.targetY = clamp(worldPt.y, 220, 1580);
      }
    });
    cv2d.addEventListener('pointermove', (e) => {
      if (this.joyActive && this.joyFloating && e.pointerId === this.joyPointerId) {
        updateJoyFromCenter(e.clientX, e.clientY, this.joyOriginX, this.joyOriginY, 58);
        return;
      }
      if (Game.seaActive && Game.sea.aiming && (this.aimPointerId === null || e.pointerId === this.aimPointerId)) {
        const worldPt = screenToWorldAct1(e.clientX, e.clientY);
        Game.sea.aimX = worldPt.x;
        Game.sea.aimY = worldPt.y;
      }
    });
    cv2d.addEventListener('pointerup', (e) => {
      if (this.joyFloating && e.pointerId === this.joyPointerId) endJoy(e.pointerId);
    });
    cv2d.addEventListener('pointercancel', (e) => {
      if (this.joyFloating && e.pointerId === this.joyPointerId) endJoy(e.pointerId);
    });

    // Astro Canvas: Left-Half Floating Touch Stick OR Right-Half/Mouse Attack!
    const acv = document.getElementById('astroCanvas');
    acv.addEventListener('pointerdown', (e) => {
      AudioSys.ensure();
      if (!Game.astroActive || Game.quizOpen || Game.dialogOpen) return;
      if (e.pointerType === 'touch' && e.clientX < window.innerWidth * 0.44 && e.clientY > window.innerHeight * 0.36 && !this.joyActive) {
        this.joyActive = true;
        this.joyFloating = true;
        this.joyPointerId = e.pointerId;
        this.joyOriginX = e.clientX;
        this.joyOriginY = e.clientY;
        try { acv.setPointerCapture(e.pointerId); } catch (_) {}
        return;
      }
      if (e.button === 2) AstroEngine.triggerGadget();
      else {
        this.atkPointerId = e.pointerId;
        this.fireHeld = true;
        AstroEngine.triggerAttack();
      }
    });
    acv.addEventListener('pointermove', (e) => {
      if (this.joyActive && this.joyFloating && e.pointerId === this.joyPointerId) {
        updateJoyFromCenter(e.clientX, e.clientY, this.joyOriginX, this.joyOriginY, 58);
      }
    });
    acv.addEventListener('pointerup', (e) => {
      if (this.joyFloating && e.pointerId === this.joyPointerId) endJoy(e.pointerId);
      if (e.pointerId === this.atkPointerId) { this.fireHeld = false; this.atkPointerId = null; }
    });
    acv.addEventListener('pointercancel', (e) => {
      if (this.joyFloating && e.pointerId === this.joyPointerId) endJoy(e.pointerId);
      if (e.pointerId === this.atkPointerId) { this.fireHeld = false; this.atkPointerId = null; }
    });
    acv.addEventListener('contextmenu', (e) => e.preventDefault());

    window.addEventListener('pointerup', (e) => {
      if (Game.seaActive && Game.sea.aiming && (this.aimPointerId === null || e.pointerId === this.aimPointerId)) {
        Game.sea.aiming = false;
        this.aimPointerId = null;
        fireSeaCannon(Game.sea.aimX, Game.sea.aimY);
      }
      if (e.pointerId === this.atkPointerId) {
        this.fireHeld = false;
        this.atkPointerId = null;
      }
      if (e.pointerId === this.jumpPointerId) {
        this.jumpHeld = false;
        this.jumpPointerId = null;
      }
    });

    // Astro Right-Thumb Diamond Action Pad (Multi-Touch Safe by pointerId!)
    const btnJump = document.getElementById('btnAstroJump');
    btnJump.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      AudioSys.ensure();
      this.jumpPointerId = e.pointerId;
      try { btnJump.setPointerCapture(e.pointerId); } catch (_) {}
      this.jumpPressed = true;
      this.jumpHeld = true;
    });
    const releaseJump = (e) => {
      if (this.jumpPointerId === null || e.pointerId === this.jumpPointerId) {
        this.jumpHeld = false;
        this.jumpPointerId = null;
      }
    };
    btnJump.addEventListener('pointerup', releaseJump);
    btnJump.addEventListener('pointercancel', releaseJump);

    const btnAtk = document.getElementById('btnAstroAtk');
    btnAtk.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      AudioSys.ensure();
      this.atkPointerId = e.pointerId;
      try { btnAtk.setPointerCapture(e.pointerId); } catch (_) {}
      this.fireHeld = true;
      AstroEngine.triggerAttack();
    });
    const releaseAtk = (e) => {
      if (this.atkPointerId === null || e.pointerId === this.atkPointerId) {
        this.fireHeld = false;
        this.atkPointerId = null;
      }
    };
    btnAtk.addEventListener('pointerup', releaseAtk);
    btnAtk.addEventListener('pointercancel', releaseAtk);

    document.getElementById('btnAstroGadget').addEventListener('pointerdown', (e) => {
      e.preventDefault();
      AudioSys.ensure();
      AstroEngine.triggerGadget();
    });
    document.getElementById('btnAstroDash').addEventListener('pointerdown', (e) => {
      e.preventDefault();
      AudioSys.ensure();
      AstroEngine.triggerDash();
    });
  },

  poll() {
    let kx = 0, ky = 0;
    if (this.keys['ArrowLeft'] || this.keys['KeyA']) kx -= 1;
    if (this.keys['ArrowRight'] || this.keys['KeyD']) kx += 1;
    if (this.keys['ArrowUp'] || this.keys['KeyW']) ky -= 1;
    if (this.keys['ArrowDown'] || this.keys['KeyS']) ky += 1;
    if (kx !== 0 || ky !== 0) {
      const l = Math.hypot(kx, ky);
      this.dx = kx / l;
      this.dy = ky / l;
      Game.player.targetX = null;
      Game.player.targetY = null;
    } else if (this.joyActive) {
      this.dx = this.joyDx;
      this.dy = this.joyDy;
      Game.player.targetX = null;
      Game.player.targetY = null;
    } else {
      this.dx = 0;
      this.dy = 0;
    }
  }
};

function screenToWorldAct1(cx, cy) {
  if (R3D.on && R3D.ok && R3D.ready && typeof R3D.screenToWorld === 'function') {
    const hit = R3D.screenToWorld(cx, cy);
    if (hit) return hit;
  }
  const w = window.innerWidth, h = window.innerHeight;
  const refX = Game.seaActive ? (Game.sea.bx + Game.sea.kx) * 0.5 : Game.player.x;
  const refY = Game.seaActive ? (Game.sea.by + Game.sea.ky) * 0.5 : Game.player.y;
  const scale = Game.seaActive ? 1.25 : 0.95;
  return {
    x: refX + (cx - w * 0.5) * scale,
    y: refY + (cy - h * 0.52) * scale * 1.18
  };
}

/* ---- BİLDİRİM, KONFETİ VE HUD ---- */
let toastTimer = null, bannerTimer = null;
function showToast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2800);
}

function showBanner(msg) {
  const el = document.getElementById('banner');
  el.textContent = msg;
  el.classList.add('show');
  spawnScreenConfetti(42);
  if (bannerTimer) clearTimeout(bannerTimer);
  bannerTimer = setTimeout(() => el.classList.remove('show'), 2700);
}

function spawnScreenConfetti(n = 32) {
  const cols = ['#ffd233', '#ff5277', '#38d9ff', '#45e06f', '#a66bff', '#ff8c29'];
  for (let i = 0; i < n; i++) {
    Game.confetti.push({
      x: window.innerWidth * (0.2 + Math.random() * 0.6),
      y: window.innerHeight * 0.35,
      vx: (Math.random() - 0.5) * 420,
      vy: -Math.random() * 340 - 80,
      rot: Math.random() * 6.28,
      vr: (Math.random() - 0.5) * 10,
      col: cols[i % cols.length],
      life: 1.8 + Math.random() * 0.7
    });
  }
}

function addCoins(n) {
  Save.coins = (Save.coins || 0) + n;
  persistSave();
  refreshHud();
}

function refreshHud() {
  document.getElementById('hudStars').textContent = (Save.completedChapters || []).length;
  document.getElementById('hudCoins').textContent = Save.coins || 0;
  document.getElementById('hudSecrets').textContent = (Save.secrets || []).length + (Save.rescuedBots || []).length;

  const ch = Game.chapter;
  if (ch) {
    const tag = document.getElementById('questChapterTag');
    const title = document.getElementById('questTitle');
    if (Game.astroActive && AstroEngine.mode === 'hub') {
      tag.textContent = '🌟 KURTARILAN DOSTLAR ÜSSÜ';
      tag.style.background = '#ff9900';
      title.textContent = '3D dostlarınla gez, E ile Düdük çal veya 🗺️ Bölümlerden gezegen seç!';
    } else if (Game.astroActive) {
      tag.textContent = `BÖLÜM ${ch.num} · ${ch.subject}`;
      tag.style.background = ch.subjectColor || '#7b2cbf';
      title.textContent = ch.summary;
    } else if (Game.mode === 'play') {
      tag.textContent = `BÖLÜM ${ch.num} · ${ch.subject}`;
      tag.style.background = ch.subjectColor || '#1e3566';
      if (ch.mode === 'pad_arena' && Game.padQuestion) {
        title.textContent = `❓ ${Game.padQuestion.q} (${Game.chProgress}/${Game.chGoal})`;
      } else {
        title.textContent = `${ch.title} (${Game.chProgress}/${Game.chGoal})`;
      }
    }
  }
}

/* ---- KARAOKE DİYALOG SİSTEMİ ---- */
const DialogUI = {
  open(lines, focusEntity = null, onDone = null) {
    if (!lines || !lines.length) { if (onDone) onDone(); return; }
    Game.dialogOpen = true;
    Game.dialogQueue = lines.slice();
    Game.dialogFocus = focusEntity;
    Game.dialogOnDone = onDone;
    document.getElementById('dialogOverlay').classList.remove('hidden');
    this.showCurrent();
  },

  showCurrent() {
    const item = Game.dialogQueue[0];
    if (!item) { this.close(); return; }
    const [charId, rawText] = item;
    const text = rawText.replace(/\{name\}/g, Save.playerName || 'Dedektif');
    Game.currentLine = [charId, text];

    const ch = CHARACTERS[charId] || CHARACTERS.rakun;
    document.getElementById('speakerBadge').textContent = ch.badge;

    const wordsWrap = document.getElementById('dialogWords');
    wordsWrap.innerHTML = '';
    const words = text.trim().split(/\s+/);
    const spans = words.map((w) => {
      const sp = document.createElement('span');
      sp.className = 'w';
      sp.textContent = w + ' ';
      wordsWrap.appendChild(sp);
      return sp;
    });

    AudioSys.speakLine(charId, text, (idx) => {
      spans.forEach((s, i) => s.classList.toggle('spoken', i === idx));
    });
  },

  replay() {
    if (Game.currentLine) {
      const [charId, text] = Game.currentLine;
      const spans = Array.from(document.querySelectorAll('#dialogWords span.w'));
      AudioSys.speakLine(charId, text, (idx) => {
        spans.forEach((s, i) => s.classList.toggle('spoken', i === idx));
      });
    }
  },

  next() {
    AudioSys.stopSpeech();
    Game.dialogQueue.shift();
    if (Game.dialogQueue.length > 0) {
      this.showCurrent();
    } else {
      this.close();
    }
  },

  close() {
    AudioSys.stopSpeech();
    Game.dialogOpen = false;
    Game.currentLine = null;
    document.getElementById('dialogOverlay').classList.add('hidden');
    const cb = Game.dialogOnDone;
    Game.dialogOnDone = null;
    if (cb) cb();
  }
};

/* ---- RASTGELE ŞIKLI ÖĞRETİCİ SORU / QUIZ MOTORU ---- */
const QuizUI = {
  queue: [],
  idx: 0,
  current: null,
  shuffled: [],
  answered: false,
  onComplete: null,

  start(questions, badgeLabel, onComplete) {
    if (!questions || !questions.length) { if (onComplete) onComplete(); return; }
    Game.quizOpen = true;
    this.queue = questions.slice();
    this.idx = 0;
    this.onComplete = onComplete;
    document.getElementById('quizSubjectBadge').textContent = badgeLabel || '2. SINIF GÖREV SORUSU';
    document.getElementById('quizModal').classList.remove('hidden');
    this.renderQuestion();
  },

  renderQuestion() {
    const qObj = this.queue[this.idx];
    this.current = qObj;
    this.answered = false;

    document.getElementById('quizProgress').textContent = `Soru ${this.idx + 1} / ${this.queue.length}`;
    document.getElementById('quizQuestionText').textContent = qObj.q;
    document.getElementById('quizVisualHint').textContent = qObj.v || '';

    const fb = document.getElementById('quizFeedback');
    fb.className = '';
    fb.style.display = 'none';
    document.getElementById('btnQuizNext').classList.add('hidden');

    // Shuffle options cleanly so correct choice is randomly A, B, or C!
    const pairs = qObj.opts.map((txt, i) => ({ txt, ok: i === (qObj.ans || 0) }));
    for (let i = pairs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = pairs[i]; pairs[i] = pairs[j]; pairs[j] = tmp;
    }
    this.shuffled = pairs;

    const choicesEl = document.getElementById('quizChoices');
    choicesEl.innerHTML = '';
    const letters = ['A', 'B', 'C', 'D'];
    pairs.forEach((p, idx) => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.innerHTML = `<span class="choice-letter">${letters[idx]}</span><span>${p.txt}</span>`;
      btn.addEventListener('click', () => this.pick(idx));
      choicesEl.appendChild(btn);
    });

    AudioSys.speakLine('vudi', qObj.q);
  },

  pick(choiceIdx) {
    if (this.answered || !this.shuffled[choiceIdx]) return;
    const picked = this.shuffled[choiceIdx];
    const btns = Array.from(document.querySelectorAll('#quizChoices .choice-btn'));
    const fb = document.getElementById('quizFeedback');

    if (picked.ok) {
      this.answered = true;
      btns[choiceIdx].classList.add('correct');
      btns.forEach(b => { b.disabled = true; });
      AudioSys.playSuccess();
      Save.totalCorrect = (Save.totalCorrect || 0) + 1;
      addCoins(5);

      fb.className = 'good';
      fb.style.display = 'block';
      fb.textContent = `✅ Harika! Doğru cevap! (+5 🪙) — ${this.current.exp || ''}`;
      document.getElementById('btnQuizNext').classList.remove('hidden');
    } else {
      btns[choiceIdx].classList.add('wrong');
      btns[choiceIdx].disabled = true;
      AudioSys.playWrong();
      const hintText = this.current.exp || 'Tekrar dikkatlice düşünüp doğru seçeneği bulabilirsin!';
      const visBar = this.current.v ? `📐 Şema: ${this.current.v} — ` : '';
      fb.className = 'hint';
      fb.style.display = 'block';
      fb.textContent = `💡 ${visBar}İpucu: ${hintText}`;
      AudioSys.speakLine('vudi', `İpucu: ${hintText}`);
    }
  },

  next() {
    AudioSys.stopSpeech();
    this.idx++;
    if (this.idx < this.queue.length) {
      this.renderQuestion();
    } else {
      Game.quizOpen = false;
      document.getElementById('quizModal').classList.add('hidden');
      const cb = this.onComplete;
      this.onComplete = null;
      if (cb) cb();
    }
  }
};

function pullChapterQuestions(ch, count = 2) {
  const pool = (ch.questions || []).concat(EXTRA_QUESTION_BANK[ch.subjectKey] || []);
  const out = [];
  for (let i = 0; i < count; i++) {
    out.push(pool[(Game.qCursor++) % pool.length]);
  }
  return out;
}

/* ---- BÖLÜM BAŞLATMA (BÖLÜM 1–12 KÖY/DENİZ & BÖLÜM 13–20 ASTRO 3D GEZEGENLER!) ---- */
async function startChapterByNum(num, skipIntro = false) {
  const all = ALL_CHAPTERS();
  const ch = all.find(c => c.num === num) || all[0];

  Save.currentChapter = ch.num;
  if (ch.num > (Save.unlockedUpTo || 1)) Save.unlockedUpTo = ch.num;
  persistSave();

  Game.mode = 'play';
  Game.chapter = ch;
  Game.chProgress = 0;
  Game.carrying = null;
  Game.pads = [];
  Game.hazards = [];
  Game.items = [];
  Game.pedestal = null;
  Game.padQuestion = null;
  Game.seaActive = false;
  Game.arenaWide = false;

  document.getElementById('titleOverlay').classList.add('hidden');
  document.getElementById('hud').classList.remove('hidden');
  document.getElementById('joyZone').classList.add('active-hud');
  document.getElementById('bossBar').classList.add('hidden');

  // ACT II: ASTRO-GALAKSİ 3D GEZEGEN & UZAY SAVAŞI (Chapters 13–20!)
  if (ch.num >= 13) {
    Game.astroActive = true;
    document.getElementById('interactBtn').classList.add('hidden');
    await AstroEngine.startChapter(ch, Save, astroCallbacks());
    refreshHud();
    showBanner(`🚀 ${ch.title}`);
    return;
  }

  // ACT I: SUNNY HILL TARZI KÖY / VADİ / ŞEHİR / DENİZ / LABORATUVAR (Chapters 1–12!)
  if (AstroEngine.active) AstroEngine.stop();
  Game.astroActive = false;

  Game.worldId = ch.world || 'town';
  Game.worldDef = WORLDS[Game.worldId] || WORLDS.town;
  Game.chGoal = ch.targetCount || 4;
  AudioSys.setMusicTheme(Game.worldDef.music || 'town');

  Game.player.x = 1200;
  Game.player.y = 1080;
  Game.player.yaw = Math.PI;
  Game.player.targetX = null;
  Game.player.targetY = null;
  Game.vudi.x = 1135;
  Game.vudi.y = 1105;

  // Populate base NPCs + Secrets not yet found in this world
  Game.npcs = (Game.worldDef.npcsBase || []).filter(n => n.id !== ch.npc).map(n => Object.assign({}, n, { marker: false }));
  for (const sec of SECRETS_LIST) {
    if (sec.world === Game.worldId && !(Save.secrets || []).includes(sec.id)) {
      Game.items.push({ id: sec.id, secret: sec, x: sec.x, y: sec.y, mesh: 'crystal', icon: sec.icon, taken: false });
    }
  }

  setupAct1ChapterMode(ch);
  refreshHud();

  if (!skipIntro && ch.introLines && ch.introLines.length) {
    const bossFocus = Game.npcs.find(n => n.id === ch.npc) || Game.vudi;
    DialogUI.open(ch.introLines, bossFocus);
  }
}

function astroCallbacks() {
  return {
    onToast: (m) => showToast(m),
    onCoins: (n) => addCoins(n),
    onRescueBot: (botKey, cleanName) => {
      if (!Save.rescuedBots.includes(botKey)) {
        Save.rescuedBots.push(botKey);
        addCoins(15);
        persistSave();
      }
      showToast(`🤖 3D Dost Kurtarıldı: ${cleanName}! (+15 🪙)`);
      refreshHud();
    },
    onGateQuiz: (ch, onPass, onCancel) => {
      const qs = pullChapterQuestions(ch, 2);
      QuizUI.start(qs, `${ch.subject} · ${ch.topic}`, () => {
        if (onPass) onPass();
      });
    },
    onChapterWin: (ch) => completeCurrentChapter()
  };
}

async function openHubWorld3D() {
  document.getElementById('titleOverlay').classList.add('hidden');
  document.getElementById('atlasModal').classList.add('hidden');
  document.getElementById('hud').classList.remove('hidden');
  document.getElementById('interactBtn').classList.add('hidden');
  Game.mode = 'play';
  Game.astroActive = true;
  await AstroEngine.startHubWorld(Save, astroCallbacks());
  refreshHud();
}

function setupAct1ChapterMode(ch) {
  // Reset Sunny-Hill Village Soccer Ball & Goal Net!
  Game.soccer = { bx: 1480, by: 1020, bvx: 0, bvy: 0, gx: 1820, gy: 860, goals: 0 };

  if (ch.mode === 'carry_evidence') {
    const npcX = 1200, npcY = 690;
    if (ch.npc !== 'vudi') {
      Game.npcs.push({ id: ch.npc, x: npcX - 65, y: npcY, marker: true, line: 'Topladıklarını yanımdaki altın kürsüye getir Komiser!' });
    }
    Game.pedestal = { x: npcX, y: npcY + 10 };
    const spots = [[520, 820], [1860, 820], [720, 1340], [1680, 1340]];
    const itemIcon = ch.num === 10 ? '♻️' : ch.num === 9 ? '🕵️' : '🔤';
    const itemMesh = ch.num === 10 ? 'crystal' : ch.num === 9 ? 'pizza' : 'bag';
    spots.forEach(([sx, sy], i) => {
      Game.items.push({ id: `ev_${i}`, questItem: true, x: sx, y: sy, mesh: itemMesh, icon: itemIcon, taken: false });
    });
  } else if (ch.mode === 'wolf_stations') {
    const spots = [[640, 680], [1760, 660], [1680, 1280], [660, 1300]];
    Game.wolfSpots = spots;
    Game.npcs.push({ id: 'kurt', x: spots[0][0], y: spots[0][1], baseX: spots[0][0], baseY: spots[0][1], hideSeek: true, marker: true, questNpc: true });
  } else if (ch.mode === 'crow_chase') {
    Game.npcs.push({ id: 'karga', x: 1520, y: 820, marker: true, questNpc: true, vx: 120, vy: 95 });
  } else if (ch.mode === 'boss_trex' || ch.mode === 'boss_palyaco') {
    Game.arenaWide = true;
    const bossId = ch.mode === 'boss_trex' ? 'trex' : 'palyaco';
    Game.npcs.push({ id: bossId, x: 1200, y: 590, marker: true, isBoss: true });
    spawnArenaCollectible(ch.mode === 'boss_trex' ? 'fruit' : 'crystal');
    updateAct1BossBar();
  } else if (ch.mode === 'boss_godzilla') {
    Game.arenaWide = true;
    Game.npcs.push({ id: 'godzilla', x: 1200, y: 640, marker: true, isBoss: true });
    spawnArenaCollectible('pizza');
    updateAct1BossBar();
  } else if (ch.mode === 'pad_arena') {
    Game.arenaWide = true;
    if (ch.npc !== 'vudi') {
      Game.npcs.push({ id: ch.npc, x: 1200, y: 590, marker: true });
    }
    spawnNextPadQuestion();
  } else if (ch.mode === 'sea_battle') {
    Game.seaActive = true;
    Game.sea.bx = 820; Game.sea.by = 1080; Game.sea.byaw = 0;
    Game.sea.kx = 1520; Game.sea.ky = 720; Game.sea.kyaw = 0;
    Game.sea.loaded = false;
    Game.sea.balls = [];
    spawnSeaCrate();
    updateAct1BossBar();
  }
}

function spawnArenaCollectible(meshName) {
  const spots = [[660, 860], [1740, 860], [760, 1320], [1640, 1320], [1200, 1360], [920, 980]];
  const [sx, sy] = spots[Game.chProgress % spots.length];
  Game.items = Game.items.filter(i => !i.arenaItem);
  Game.items.push({
    id: 'arena_pick', arenaItem: true,
    x: sx, y: sy, mesh: meshName,
    icon: meshName === 'fruit' ? '🍎' : meshName === 'pizza' ? '🍕' : '💎',
    taken: false
  });
}

function spawnNextPadQuestion() {
  const ch = Game.chapter;
  const qObj = pullChapterQuestions(ch, 1)[0];
  Game.padQuestion = qObj;

  const opts = qObj.opts.map((t, i) => ({ label: t, ok: i === (qObj.ans || 0) }));
  for (let i = opts.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = opts[i]; opts[i] = opts[j]; opts[j] = tmp;
  }

  const coords = [[760, 900], [1200, 820], [1640, 900]];
  Game.pads = opts.map((o, idx) => ({
    x: coords[idx][0],
    y: coords[idx][1],
    label: o.label,
    ok: o.ok,
    tint: null,
    cooldown: 0
  }));

  // Reset player slightly south so they never accidentally stand on a newly spawned pad!
  Game.player.x = 1200;
  Game.player.y = 1180;
  Game.player.targetX = null;
  Game.player.targetY = null;

  AudioSys.speakLine(ch.npc || 'vudi', qObj.q);
  refreshHud();
  updateAct1BossBar();
}

function spawnSeaCrate() {
  Game.sea.crate = {
    x: 760 + Math.random() * 820,
    y: 680 + Math.random() * 560
  };
}

function fireSeaCannon(tx, ty) {
  if (!Game.sea.loaded) return;
  Game.sea.loaded = false;
  AudioSys.playCannon();
  const S = Game.sea;
  const dx = tx - S.bx, dy = ty - S.by;
  const dist = Math.max(80, Math.hypot(dx, dy));
  const dur = clamp(dist / 520, 0.45, 1.2);
  S.balls.push({
    x: S.bx, y: S.by, zH: 22,
    sx: S.bx, sy: S.by, tx, ty,
    t: 0, dur, enemy: false
  });
}

function updateAct1BossBar() {
  const ch = Game.chapter;
  const bar = document.getElementById('bossBar');
  const bName = document.getElementById('bossName');
  const bPips = document.getElementById('bossPips');
  if (!['boss_trex', 'boss_palyaco', 'boss_godzilla', 'sea_battle', 'pad_arena'].includes(ch.mode)) {
    bar.classList.add('hidden');
    return;
  }
  bar.classList.remove('hidden');
  const icons = {
    boss_trex: ['🍎', '⚪', 'ŞAPŞAL T-REX DOYURMA SAYACI'],
    boss_palyaco: ['💎', '🟣', 'DOKTOR PALYAÇO — ŞAPŞALTRON-3000'],
    boss_godzilla: ['🍕', '⚪', 'ŞEHİR DEVİ GODZİLLA PAYLAŞIM SAYACI'],
    sea_battle: ['💥', '🛟', 'KURNAZ KARGA KORSAN SALI'],
    pad_arena: ['☁️', '⚪', ch.padBanner || `${CHARACTERS[ch.npc]?.name || 'Vudi'} — DOĞRU BULUTA KOŞ!`]
  }[ch.mode];
  bName.textContent = ch.mode === 'pad_arena' && Game.padQuestion ? `❓ ${Game.padQuestion.q}` : icons[2];
  bPips.textContent = icons[0].repeat(Game.chProgress) + icons[1].repeat(Math.max(0, Game.chGoal - Game.chProgress));
}

function advanceChapterProgress() {
  Game.chProgress++;
  AudioSys.playSuccess();
  addCoins(10);
  refreshHud();
  updateAct1BossBar();

  if (Game.chProgress >= Game.chGoal) {
    completeCurrentChapter();
    return;
  }

  const ch = Game.chapter;
  if (ch.mode === 'wolf_stations') {
    const kurt = Game.npcs.find(n => n.id === 'kurt');
    if (kurt && Game.wolfSpots) {
      const sp = Game.wolfSpots[Game.chProgress % Game.wolfSpots.length];
      kurt.x = sp[0]; kurt.y = sp[1];
      kurt.baseX = sp[0]; kurt.baseY = sp[1];
      showToast(`🐺 Saklambaç! Kurnaz Kurt ${Game.chProgress + 1}. saklanma noktasına kaçtı!`);
    }
  } else if (ch.mode === 'boss_trex') {
    spawnArenaCollectible('fruit');
  } else if (ch.mode === 'boss_palyaco') {
    spawnArenaCollectible('crystal');
  } else if (ch.mode === 'boss_godzilla') {
    spawnArenaCollectible('pizza');
  } else if (ch.mode === 'pad_arena') {
    spawnNextPadQuestion();
  } else if (ch.mode === 'sea_battle') {
    spawnSeaCrate();
  }
}

function completeCurrentChapter() {
  const ch = Game.chapter;
  if (!Save.completedChapters.includes(ch.num)) {
    Save.completedChapters.push(ch.num);
  }
  const nextNum = Math.min(20, ch.num + 1);
  if (nextNum > (Save.unlockedUpTo || 1)) {
    Save.unlockedUpTo = nextNum;
  }
  addCoins(35);

  // Unlock special Astro Gear reward if present!
  if (ch.rewardUnlock) {
    const { type, id, label } = ch.rewardUnlock;
    if (Save.ownedArsenal[type] && !Save.ownedArsenal[type].includes(id)) {
      Save.ownedArsenal[type].push(id);
      Save.equipped[type] = id;
    }
    showToast(`🎁 YENİ GÜÇ AÇILDI: ${label}`);
  }
  persistSave();
  AudioSys.playFanfare();
  showBanner(`⭐ BÖLÜM ${ch.num} TAMAMLANDI! (+35 🪙)`);
  document.getElementById('bossBar').classList.add('hidden');

  const goNext = () => {
    if (ch.num === 12) {
      DialogUI.open([
        ['vudi', 'Tak-tak-tak! Komiserim! Doktor Palyaço uzay roketiyle Galaksiye kaçtı!'],
        ['rakun', 'Hiç sorun değil Vudi! Astro-Robot zırhımızı ve Hover-Lazer çizmelerimizi giyip 13. Bölümden itibaren Galaksi Gezegenlerine uçuyoruz!']
      ], null, () => startChapterByNum(13));
    } else if (ch.num === 20) {
      openCertificateModal();
    } else {
      startChapterByNum(ch.num + 1);
    }
  };

  if (!Game.astroActive && ch.outroLines && ch.outroLines.length) {
    DialogUI.open(ch.outroLines, Game.vudi, goNext);
  } else {
    setTimeout(goNext, 1300);
  }
}

/* ---- ETKİLEŞİM (KONUŞMA / EŞYA ALMA / TESLİM ETME / DENİZ TOPU) ---- */
function nearestInteractable() {
  if (Game.mode !== 'play' || Game.astroActive) return null;
  if (Game.seaActive) {
    if (Game.sea.loaded) {
      return { kind: 'sea_fire', label: '🎯 Topu Ateşle!', obj: Game.sea };
    }
    return null;
  }
  const px = Game.player.x, py = Game.player.y;
  const ch = Game.chapter;

  if (Game.carrying && Game.pedestal && Math.hypot(Game.pedestal.x - px, Game.pedestal.y - py) < 98) {
    const dLbl = ch.num === 10 ? '♻️ Geri Dönüşüm Kulesine At' : ch.num === 9 ? '🕵️ 5N1K Panosuna Ekle' : '📦 Kürsüye Teslim Et';
    return { kind: 'deliver', label: dLbl, obj: Game.pedestal };
  }

  for (const it of Game.items) {
    if (it.taken) continue;
    if (Math.hypot(it.x - px, it.y - py) < 78) {
      if (it.secret) return { kind: 'secret', label: '🔍 Gizli İpucu!', obj: it };
      if (it.questItem && !Game.carrying) {
        const pLbl = ch.num === 10 ? '♻️ Atığı Topla' : ch.num === 9 ? '🕵️ 5N1K Dosyasını Al' : '🔤 Harf Sandığını Al';
        return { kind: 'pickup', label: pLbl, obj: it };
      }
    }
  }

  for (const npc of Game.npcs) {
    if (Math.hypot(npc.x - px, npc.y - py) < 102) {
      if (npc.questNpc && (ch.mode === 'wolf_stations' || ch.mode === 'crow_chase')) {
        const qLbl = ch.mode === 'wolf_stations' ? '🐺 Saklanan Kurt\'u Yakala!' : `💬 ${CHARACTERS[npc.id].name}`;
        return { kind: 'quest_npc', label: qLbl, obj: npc };
      }
      if (!npc.isBoss) {
        return { kind: 'talk', label: `💬 ${CHARACTERS[npc.id].name}`, obj: npc };
      }
    }
  }
  return null;
}

function tryInteract() {
  const hit = nearestInteractable();
  if (!hit) return;
  const ch = Game.chapter;

  if (hit.kind === 'sea_fire') {
    fireSeaCannon(Game.sea.kx, Game.sea.ky);
    return;
  }

  if (hit.kind === 'secret') {
    hit.obj.taken = true;
    const sec = hit.obj.secret;
    if (!Save.secrets.includes(sec.id)) Save.secrets.push(sec.id);
    addCoins(20);
    AudioSys.playFanfare();
    showToast(`🔍 Gizli İpucu Bulundu: ${sec.name} (+20 🪙)`);
    DialogUI.open([['rakun', sec.line]]);
    refreshHud();
  } else if (hit.kind === 'pickup') {
    hit.obj.taken = true;
    Game.carrying = hit.obj;
    AudioSys.playPickup();
    showToast('💼 İpucunu aldın! Şimdi Altın Kürsüye götür!');
  } else if (hit.kind === 'deliver') {
    Game.carrying = null;
    const qs = pullChapterQuestions(ch, 2);
    QuizUI.start(qs, `${ch.subject} · ${ch.topic}`, () => advanceChapterProgress());
  } else if (hit.kind === 'quest_npc') {
    const npc = hit.obj;
    AudioSys.playCharSignature(npc.id);
    if (ch.mode === 'crow_chase') {
      // Relocate crow after catching!
      const spots = [[560, 740], [1780, 740], [640, 1340], [1720, 1340], [1200, 1180]];
      const nx = spots[(Game.chProgress + 1) % spots.length];
      npc.x = nx[0]; npc.y = nx[1];
    }
    const qs = pullChapterQuestions(ch, 2);
    QuizUI.start(qs, `${ch.subject} · ${ch.topic}`, () => advanceChapterProgress());
  } else if (hit.kind === 'talk') {
    DialogUI.open([[hit.obj.id, hit.obj.line || 'Merhaba Komiser Rakun!']], hit.obj);
  }
}

/* ---- ACT I (SUNNY HILL TARZI DÜNYA, BOSS VE DENİZ SAVAŞI) GÜNCELLEMESİ ---- */
function computeAct1QuestTarget() {
  const ch = Game.chapter;
  if (!ch) return null;
  if (ch.mode === 'carry_evidence') {
    if (Game.carrying && Game.pedestal) return Game.pedestal;
    return Game.items.find(i => i.questItem && !i.taken) || null;
  }
  if (ch.mode === 'wolf_stations' || ch.mode === 'crow_chase') {
    return Game.npcs.find(n => n.questNpc) || null;
  }
  if (ch.mode === 'boss_trex' || ch.mode === 'boss_palyaco' || ch.mode === 'boss_godzilla') {
    return Game.items.find(i => i.arenaItem && !i.taken) || null;
  }
  return null;
}

function updateAct1(dt) {
  Game.shake = Math.max(0, Game.shake - dt * 2.0);
  const paused = Game.dialogOpen || Game.quizOpen || Game.mode !== 'play';

  // Confetti physics
  for (let i = Game.confetti.length - 1; i >= 0; i--) {
    const cf = Game.confetti[i];
    cf.life -= dt;
    cf.x += cf.vx * dt;
    cf.y += cf.vy * dt;
    cf.vy += 680 * dt;
    cf.rot += cf.vr * dt;
    if (cf.life <= 0) Game.confetti.splice(i, 1);
  }

  // Ambient smoke puffs from Komik Ejderha's nostrils!
  for (const npc of Game.npcs) {
    if (npc.id === 'ejderha' && Math.random() < dt * 7) {
      Game.particles.push({
        x: npc.x + Math.sin(npc.yaw || 0) * 18,
        y: npc.y + Math.cos(npc.yaw || 0) * 18,
        zH: 52,
        vx: (Math.random() - 0.5) * 18,
        vy: (Math.random() - 0.5) * 18,
        vzH: 28 + Math.random() * 18,
        s: 0.7,
        alpha: 0.85,
        flame: Math.random() < 0.28,
        life: 0.9
      });
    }
  }
  for (let i = Game.particles.length - 1; i >= 0; i--) {
    const pt = Game.particles[i];
    pt.life -= dt;
    pt.x += pt.vx * dt;
    pt.y += pt.vy * dt;
    pt.zH += pt.vzH * dt;
    pt.s += dt * 0.9;
    pt.alpha = Math.max(0, pt.life);
    if (pt.life <= 0) Game.particles.splice(i, 1);
  }

  if (paused) return;

  // SEA BATTLE MODE (Chapter 8!)
  if (Game.seaActive) {
    const S = Game.sea;
    let mx = Input.dx, my = Input.dy;
    if (mx === 0 && my === 0 && Game.player.targetX != null) {
      const dx = Game.player.targetX - S.bx, dy = Game.player.targetY - S.by;
      const d = Math.hypot(dx, dy);
      if (d > 24) { mx = dx / d; my = dy / d; } else { Game.player.targetX = null; }
    }
    const bSpd = 250;
    if (Math.hypot(mx, my) > 0.05) {
      S.bx = clamp(S.bx + mx * bSpd * dt, 260, 2140);
      S.by = clamp(S.by + my * bSpd * dt, 280, 1520);
      S.byaw = Math.atan2(mx, my);
    }

    // Kurnaz Karga's Raft circles & shoots!
    S.kx = 1280 + Math.cos(Game.time * 0.65) * 420;
    S.ky = 760 + Math.sin(Game.time * 0.85) * 260;
    S.kyaw = Math.atan2(S.bx - S.kx, S.by - S.ky);

    if (S.crate && Math.hypot(S.crate.x - S.bx, S.crate.y - S.by) < 76) {
      S.crate = null;
      AudioSys.playPickup();
      const qs = pullChapterQuestions(Game.chapter, 2);
      QuizUI.start(qs, 'DENİZ MATEMATİK SANDIĞI', () => {
        S.loaded = true;
        showToast('🎯 Konfeti-Su Topu Dolu! Ekranda Sürükle veya Boşluk ile Ateş Et!');
      });
    }

    S.shootTimer -= dt;
    if (S.shootTimer <= 0) {
      S.shootTimer = 2.6;
      S.balls.push({
        x: S.kx, y: S.ky, zH: 20,
        sx: S.kx, sy: S.ky, tx: S.bx, ty: S.by,
        t: 0, dur: 1.35, enemy: true
      });
    }

    for (let i = S.balls.length - 1; i >= 0; i--) {
      const b = S.balls[i];
      b.t += dt;
      const u = Math.min(1, b.t / b.dur);
      b.x = b.sx + (b.tx - b.sx) * u;
      b.y = b.sy + (b.ty - b.sy) * u;
      b.zH = 18 + Math.sin(u * Math.PI) * 110;
      if (u >= 1) {
        AudioSys.playSplash();
        if (!b.enemy) {
          if (Math.hypot(b.x - S.kx, b.y - S.ky) < 115) {
            showToast('💥 TAM İSABET! Kurnaz Karga\'nın salı vuruldu!');
            advanceChapterProgress();
          } else {
            showToast('🌊 Az farkla ıska! Yeni soru sandığını al!');
            spawnSeaCrate();
          }
        } else if (Math.hypot(b.x - S.bx, b.y - S.by) < 75) {
          Game.shake = 0.45;
          showToast('💦 Karga su balonu attı! Dümeni kır!');
        }
        S.balls.splice(i, 1);
      }
    }
    const seaHit = nearestInteractable();
    const seaIb = document.getElementById('interactBtn');
    if (seaHit) {
      seaIb.textContent = seaHit.label;
      seaIb.classList.remove('hidden');
    } else {
      seaIb.classList.add('hidden');
    }
    return;
  }

  // PLAYER MOVEMENT ON LAND
  const p = Game.player;
  if (p.stun > 0) p.stun -= dt;
  let vx = Input.dx, vy = Input.dy;
  if (vx === 0 && vy === 0 && p.targetX != null) {
    const dx = p.targetX - p.x, dy = p.targetY - p.y;
    const dist = Math.hypot(dx, dy);
    if (dist > 14) { vx = dx / dist; vy = dy / dist; }
    else { p.targetX = null; p.targetY = null; }
  }

  const walkSpd = p.stun > 0 ? 110 : 255;
  if (Math.hypot(vx, vy) > 0.05) {
    const nx = clamp(p.x + vx * walkSpd * dt, 180, 2220);
    const ny = clamp(p.y + vy * walkSpd * dt, 220, 1580);
    // Gentle building collision check
    let blocked = false;
    for (const b of (Game.worldDef.buildings || [])) {
      if (Math.hypot(nx - b.x, ny - b.y) < (b.r || 85) * 0.68) { blocked = true; break; }
    }
    if (!blocked) { p.x = nx; p.y = ny; }
    p.yaw = Math.atan2(vx, vy);
    p.moving = true;
  } else {
    p.moving = false;
  }

  // Vudi Companion Smooth Follow
  const v = Game.vudi;
  const distV = Math.hypot(p.x - v.x, p.y - v.y);
  if (distV > 72) {
    v.x += ((p.x - v.x) / distV) * 245 * dt;
    v.y += ((p.y - v.y) / distV) * 245 * dt;
    v.yaw = Math.atan2(p.x - v.x, p.y - v.y);
    v.moving = true;
  } else {
    v.moving = false;
  }

  Game.questTarget = computeAct1QuestTarget();

  // Sunny-Hill Playable 3D Village Soccer Ball & Goal Net!
  if (Game.soccer && Game.worldId !== 'lab' && !Game.arenaWide) {
    const sc = Game.soccer;
    const dBall = Math.hypot(sc.bx - p.x, sc.by - p.y);
    if (dBall < 48) {
      const kAng = dBall > 1 ? Math.atan2(sc.bx - p.x, sc.by - p.y) : p.yaw;
      sc.bvx = Math.sin(kAng) * 440;
      sc.bvy = Math.cos(kAng) * 440;
      AudioSys.tone(190, 0.08, 'triangle', 0.14, 0, 95);
    }
    sc.bx = clamp(sc.bx + sc.bvx * dt, 240, 2160);
    sc.by = clamp(sc.by + sc.bvy * dt, 280, 1520);
    sc.bvx *= Math.pow(0.18, dt);
    sc.bvy *= Math.pow(0.18, dt);
    if (Math.abs(sc.bx - sc.gx) < 52 && Math.abs(sc.by - sc.gy) < 38) {
      sc.goals = (sc.goals || 0) + 1;
      sc.bx = 1480; sc.by = 1020; sc.bvx = 0; sc.bvy = 0;
      addCoins(10);
      AudioSys.playFanfare();
      showBanner('⚽ GOOOL! Süper Şut Komiser! (+10 🪙)');
    }
  }

  // Kurnaz Kurt Hide-and-Seek Peeking (Ch 2) & Kurnaz Karga Chase (Ch 3)
  const ch = Game.chapter;
  if (ch.mode === 'wolf_stations') {
    const kurt = Game.npcs.find(n => n.id === 'kurt');
    if (kurt && kurt.baseX != null) {
      kurt.x = kurt.baseX + Math.sin(Game.time * 2.6) * 28;
      kurt.yaw = Math.atan2(p.x - kurt.x, p.y - kurt.y);
    }
  }
  if (ch.mode === 'crow_chase') {
    const crow = Game.npcs.find(n => n.id === 'karga');
    if (crow) {
      crow.x += (crow.vx || 110) * dt;
      crow.y += (crow.vy || 90) * dt;
      if (crow.x < 420 || crow.x > 1980) crow.vx = -(crow.vx || 110);
      if (crow.y < 640 || crow.y > 1420) crow.vy = -(crow.vy || 90);
      crow.yaw = Math.atan2(crow.vx, crow.vy);
      crow.moving = true;
    }
  }

  // Boss Arena Hazards & Pickups (T-Rex Ch 4, Godzilla Ch 7, Doktor Palyaço Ch 12)
  if (ch.mode === 'boss_trex' || ch.mode === 'boss_palyaco') {
    Game.spawnTimer -= dt;
    if (Game.spawnTimer <= 0) {
      Game.spawnTimer = ch.mode === 'boss_palyaco' ? 1.55 : 2.1;
      const boss = Game.npcs.find(n => n.isBoss);
      if (boss) {
        const ang = Math.atan2(p.x - boss.x, p.y - boss.y) + (Math.random() - 0.5) * 0.45;
        Game.hazards.push({
          x: boss.x, y: boss.y, h: 18,
          vx: Math.sin(ang) * 235, vy: Math.cos(ang) * 235,
          mesh: ch.mode === 'boss_palyaco' ? 'clownBomb' : 'barrel',
          life: 4.5
        });
      }
    }
  }

  if (ch.mode === 'boss_godzilla') {
    Game.stompTimer -= dt;
    if (Game.stompTimer <= 0) {
      Game.stompTimer = 2.4;
      Game.shake = 0.65;
      AudioSys.playStomp(1.1);
      const gz = Game.npcs.find(n => n.id === 'godzilla');
      if (gz) {
        Game.hazards.push({ x: gz.x, y: gz.y, r: 28, ring: true, life: 2.4 });
      }
    }
  }

  for (let i = Game.hazards.length - 1; i >= 0; i--) {
    const hz = Game.hazards[i];
    hz.life -= dt;
    if (hz.ring) {
      hz.r += dt * 210;
      const d = Math.hypot(p.x - hz.x, p.y - hz.y);
      if (Math.abs(d - hz.r) < 22 && p.stun <= 0) {
        p.stun = 0.9;
        AudioSys.playWrong();
        showToast('⚡ Mavi şok halkası sersemletti! Dikkatli sıyrıl!');
      }
    } else {
      hz.x += hz.vx * dt;
      hz.y += hz.vy * dt;
      hz.h = 14 + Math.abs(Math.sin(Game.time * 8 + i)) * 16;
      if (Math.hypot(p.x - hz.x, p.y - hz.y) < 36 && p.stun <= 0) {
        p.stun = 0.9;
        Game.shake = 0.35;
        AudioSys.playWrong();
        showToast('💥 Dikkat! Varil/Şaka topuna çarptın, hiçbir şey kaybetmedin!');
        hz.life = 0;
      }
    }
    if (hz.life <= 0) Game.hazards.splice(i, 1);
  }

  // Arena item touch -> trigger curriculum questions!
  for (const it of Game.items) {
    if (it.arenaItem && !it.taken && Math.hypot(it.x - p.x, it.y - p.y) < 62) {
      it.taken = true;
      AudioSys.playPickup();
      const qs = pullChapterQuestions(ch, 2);
      QuizUI.start(qs, `${ch.subject} · ${ch.topic}`, () => advanceChapterProgress());
      break;
    }
  }

  // Answer Cloud Pad Touch (Chapters 5 & 11!)
  if (ch.mode === 'pad_arena' && Game.pads.length) {
    for (const pad of Game.pads) {
      if (pad.cooldown > 0) { pad.cooldown -= dt; continue; }
      if (Math.hypot(pad.x - p.x, pad.y - p.y) < 52) {
        if (pad.ok) {
          pad.tint = '#45e06f';
          showToast('✅ Doğru Bulut! Harikasın!');
          advanceChapterProgress();
        } else {
          pad.cooldown = 1.6;
          pad.tint = '#ff4d5e';
          p.y += 65;
          AudioSys.playWrong();
          showToast(`💡 İpucu: ${Game.padQuestion?.exp || 'Diğer bulutlara dikkatlice bak!'}`);
        }
        break;
      }
    }
  }

  // Contextual Floating Interact Button
  const hit = nearestInteractable();
  const ib = document.getElementById('interactBtn');
  if (hit) {
    ib.textContent = hit.label;
    ib.classList.remove('hidden');
  } else {
    ib.classList.add('hidden');
  }
}

/* ---- MENÜLER, CEPHANE ATÖLYESİ, HARİTA VE DİPLOMA ---- */
function renderArsenalModal() {
  document.getElementById('arsenalCoins').textContent = Save.coins || 0;
  const wrap = document.getElementById('arsenalContainer');
  wrap.innerHTML = '';

  const categories = [
    ['suits', '🤖 3D Astro Kahraman Zırhları'],
    ['weapons', '⚔️ 3D Kılıçlar, Baltalar ve Yıldırım Çekiçleri'],
    ['gloves', '🧤 Astro Eldiven Güçleri (E Tuşu)'],
    ['gadgets', '🚀 Hover-Lazer Jet-Pack & Kalkanlar'],
    ['armors', '👑 Zırhlar, Miğferler ve Taçlar (Kalp Artışı)'],
    ['ships', '✈️ Galaksi Savaşı 3D Uzay Uçakları']
  ];

  for (const [catKey, catTitle] of categories) {
    const sec = document.createElement('div');
    sec.className = 'arsenal-section';
    sec.innerHTML = `<h3>${catTitle}</h3>`;
    const grid = document.createElement('div');
    grid.className = 'arsenal-grid';

    for (const item of ARSENAL[catKey]) {
      const owned = (Save.ownedArsenal[catKey] || []).includes(item.id) || item.cost === 0;
      const eq = Save.equipped[catKey] === item.id;
      const card = document.createElement('div');
      card.className = 'gear-card' + (eq ? ' equipped' : '');
      card.innerHTML = `
        <div>
          <div style="font-weight:900;font-size:16px">${item.icon} ${item.name}</div>
          <div style="font-size:12.5px;color:#4a4366;font-weight:700;margin-top:3px">${item.desc}</div>
        </div>
      `;
      const btn = document.createElement('button');
      btn.className = 'btn btn-sm ' + (eq ? 'btn-green' : owned ? 'btn-sky' : 'btn-orange');
      btn.textContent = eq ? '✔ Kuşanıldı' : owned ? 'Kuşan' : `Satın Al (${item.cost} 🪙)`;
      btn.addEventListener('click', async () => {
        if (!owned) {
          if ((Save.coins || 0) < item.cost) {
            AudioSys.playWrong();
            showToast('🪙 Yeterli altının yok! Görev veya Antrenman yaparak altın kazan!');
            return;
          }
          Save.coins -= item.cost;
          Save.ownedArsenal[catKey].push(item.id);
          AudioSys.playFanfare();
        } else {
          AudioSys.playPickup();
        }
        Save.equipped[catKey] = item.id;
        persistSave();
        refreshHud();
        renderArsenalModal();
        if (Game.astroActive && AstroEngine.active) {
          const eqStats = AstroEngine.getEquippedStats(Save);
          AstroEngine.maxHp = eqStats.armor.hearts;
          AstroEngine.hp = AstroEngine.maxHp;
          if (catKey === 'suits' && AstroEngine.mode !== 'starfighter') {
            if (AstroEngine.mode === 'hub') await openHubWorld3D();
            else await startChapterByNum(Game.chapter.num, true);
          } else {
            await AstroEngine.attachEquipmentToHero(eqStats);
            AstroEngine.refreshAstroHud();
          }
        }
      });
      card.appendChild(btn);
      grid.appendChild(card);
    }
    sec.appendChild(grid);
    wrap.appendChild(sec);
  }
}

function renderAtlasModal() {
  const grid = document.getElementById('chapterGrid');
  grid.innerHTML = '';
  for (const ch of ALL_CHAPTERS()) {
    const unlocked = ch.num <= Math.max(Save.unlockedUpTo || 1, 1) || ch.num === 13;
    const done = (Save.completedChapters || []).includes(ch.num);
    const card = document.createElement('div');
    card.className = 'chapter-card' + (!unlocked ? ' locked' : '') + (Game.chapter?.num === ch.num ? ' active-ch' : '');
    card.innerHTML = `
      <div>
        <span class="ch-subj" style="background:${ch.subjectColor}">${ch.num >= 13 ? '🚀 ' : '🕵️ '}${ch.subject}</span>
        <div style="font-weight:900;font-size:15.5px;margin-top:6px">${done ? '⭐ ' : ''}${ch.title}</div>
        <div style="font-size:12.5px;color:#4a4366;font-weight:700;margin-top:3px">${ch.topic}</div>
      </div>
    `;
    const btn = document.createElement('button');
    btn.className = 'btn btn-sm ' + (unlocked ? (ch.num >= 13 ? 'btn-purple' : 'btn-green') : 'btn-cream');
    btn.textContent = unlocked ? (done ? '🔄 Tekrar Oyna' : '▶ Oyna') : '🔒 Kilitli';
    btn.disabled = !unlocked;
    btn.addEventListener('click', () => {
      document.getElementById('atlasModal').classList.add('hidden');
      startChapterByNum(ch.num);
    });
    card.appendChild(btn);
    grid.appendChild(card);
  }
}

function renderWardrobeGrid() {
  const g = document.getElementById('wardrobeGrid');
  g.innerHTML = '';
  for (const it of WARDROBE_ITEMS) {
    const owned = Save.ownedWardrobe.includes(it.id) || it.cost === 0;
    const active = Save.wardrobe[it.slot] === it.id;
    const b = document.createElement('button');
    b.className = 'acc-btn' + (active ? ' selected' : '');
    b.textContent = `${it.icon} ${it.name}` + (owned ? '' : ` (${it.cost}🪙)`);
    b.addEventListener('click', () => {
      if (!owned) {
        if ((Save.coins || 0) < it.cost) { showToast('🪙 Yeterli altın yok!'); return; }
        Save.coins -= it.cost;
        Save.ownedWardrobe.push(it.id);
        AudioSys.playFanfare();
      }
      Save.wardrobe[it.slot] = it.id;
      persistSave();
      refreshHud();
      renderWardrobeGrid();
    });
    g.appendChild(b);
  }
  document.getElementById('saveStatsText').textContent =
    `Dedektif: ${Save.playerName} · Yıldız: ${Save.completedChapters.length}/20 · Doğru Cevap: ${Save.totalCorrect}`;
}

function openCertificateModal() {
  R2D.renderCertificate(document.getElementById('certCanvas'), Save);
  document.getElementById('certModal').classList.remove('hidden');
}

function syncSettingButtons() {
  const touchOn = Save.settings.touch !== false;
  const tTxt = touchOn ? '📱 Tablet Tuşları: Açık' : '📱 Tablet Tuşları: Kapalı';
  const vTxt = R3D.on && R3D.ok ? '🧊 Görünüm: 3D' : '🎨 Görünüm: 2D';
  const sTxt = AudioSys.soundOn ? '🔊 Ses: Açık' : '🔇 Ses: Kapalı';
  const mTxt = AudioSys.musicOn ? '🎵 Müzik: Açık' : '🔕 Müzik: Kapalı';
  const bt1 = document.getElementById('btnToggleTouchTitle');
  const bt2 = document.getElementById('btnMenuTouch');
  if (bt1) bt1.textContent = tTxt;
  if (bt2) bt2.textContent = tTxt;
  document.getElementById('btnToggleViewTitle').textContent = vTxt;
  document.getElementById('btnMenuView').textContent = vTxt;
  document.getElementById('btnToggleSoundTitle').textContent = sTxt;
  document.getElementById('btnMenuSound').textContent = sTxt;
  document.getElementById('btnToggleMusicTitle').textContent = mTxt;
  document.getElementById('btnMenuMusic').textContent = mTxt;
  document.body.classList.toggle('show-touch', touchOn);
  document.body.classList.toggle('mode-2d', !(R3D.on && R3D.ok));
}

/* ---- BAŞLANGIÇ BAĞLANTILARI VE ANA ANİMASYON DÖNGÜSÜ ---- */
function wireUI() {
  if (Save.started) {
    document.getElementById('btnContinue').classList.remove('hidden');
  }

  document.getElementById('btnContinue').addEventListener('click', () => {
    AudioSys.ensure();
    startChapterByNum(Save.currentChapter || 1, true);
  });

  document.getElementById('btnNewGame').addEventListener('click', () => {
    AudioSys.ensure();
    openSetupModal(1);
  });

  document.getElementById('btnStartAstroDirect').addEventListener('click', () => {
    AudioSys.ensure();
    if (!Save.started) {
      Save.started = true;
      persistSave();
    }
    startChapterByNum(13);
  });

  let pendingStartChapter = 1;
  function openSetupModal(chNum) {
    pendingStartChapter = chNum;
    document.getElementById('playerNameInput').value = Save.playerName || 'Cesur Dedektif';
    const sw = document.getElementById('coatSwatches');
    sw.innerHTML = '';
    COAT_SWATCHES.forEach((c) => {
      const b = document.createElement('button');
      b.className = 'acc-btn' + (Save.wardrobe.coatHex === c.hex ? ' selected' : '');
      b.innerHTML = `<span style="display:inline-block;width:14px;height:14px;border-radius:50%;background:${c.hex};vertical-align:middle;margin-right:5px"></span>${c.label}`;
      b.addEventListener('click', () => {
        Save.wardrobe.coatHex = c.hex;
        openSetupModal(pendingStartChapter);
      });
      sw.appendChild(b);
    });

    const acc = document.getElementById('starterAccRow');
    acc.innerHTML = '';
    [['cap', '👮 Polis Kepi'], ['none_hat', '🦝 Kulaklar Açık']].forEach(([id, lbl]) => {
      const b = document.createElement('button');
      b.className = 'acc-btn' + (Save.wardrobe.hat === id ? ' selected' : '');
      b.textContent = lbl;
      b.addEventListener('click', () => {
        Save.wardrobe.hat = id;
        openSetupModal(pendingStartChapter);
      });
      acc.appendChild(b);
    });

    document.getElementById('setupModal').classList.remove('hidden');
  }

  document.getElementById('btnSetupCancel').addEventListener('click', () => {
    document.getElementById('setupModal').classList.add('hidden');
  });

  document.getElementById('btnSetupStart').addEventListener('click', () => {
    const val = document.getElementById('playerNameInput').value.trim();
    Save.playerName = val || 'Cesur Dedektif';
    Save.started = true;
    persistSave();
    document.getElementById('setupModal').classList.add('hidden');
    startChapterByNum(pendingStartChapter);
  });

  let testVoiceIdx = 0;
  document.getElementById('btnTestVoices').addEventListener('click', () => {
    const samples = [
      ['rakun', 'Ben Komiser Rakun! Altın yıldız rozetimle göreve hazırım!'],
      ['vudi', 'Tak-tak-tak! Ben Yardımcı Vudi Ağaçkakan! Hemen ipuçlarını bulalım!'],
      ['palyaco', 'Muahahaha! Hihohaha! Ben Doktor Palyaço, kırmızı burnuma dikkat edin!'],
      ['trex', 'RÖÖÖAAR! Ben Şapşal T-Rex, kollarım kısa ama kalbim kocaman!'],
      ['ejderha', 'Pufff-fşşş! Ben Komik Ejderha, burnumdan duman pufçukları çıkar!'],
      ['godzilla', 'BÜÜÜM! Ben Şehir Devi Godzilla! Adım attıkça yer sarsılır!'],
      ['kurt', 'Auuuu! Ben Kurnaz Kurt, hızıma kimse yetişemez!'],
      ['karga', 'Gaaak! Gaaak! Mor berem ve kırmızı atkımla parlak rozetleri çok severim!']
    ];
    const [cid, txt] = samples[testVoiceIdx % samples.length];
    testVoiceIdx++;
    AudioSys.speakLine(cid, txt);
    showToast(`${CHARACTERS[cid].badge}: "${txt}"`);
  });

  const toggleView = () => {
    if (!R3D.ok) { showToast('Bu cihazda yalnızca 2D görünüm destekleniyor.'); return; }
    R3D.on = !R3D.on;
    Save.settings.view = R3D.on ? '3d' : '2d';
    persistSave();
    syncSettingButtons();
  };
  const toggleSound = () => {
    AudioSys.soundOn = !AudioSys.soundOn;
    Save.settings.sound = AudioSys.soundOn;
    if (!AudioSys.soundOn) AudioSys.stopSpeech();
    AudioSys.restartMusicLoop();
    persistSave();
    syncSettingButtons();
  };
  const toggleMusic = () => {
    AudioSys.musicOn = !AudioSys.musicOn;
    Save.settings.music = AudioSys.musicOn;
    AudioSys.restartMusicLoop();
    persistSave();
    syncSettingButtons();
  };
  const toggleFs = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  };

  const toggleTouch = () => {
    Save.settings.touch = !(Save.settings.touch !== false);
    persistSave();
    syncSettingButtons();
  };

  document.getElementById('btnToggleTouchTitle')?.addEventListener('click', toggleTouch);
  document.getElementById('btnMenuTouch')?.addEventListener('click', toggleTouch);
  document.getElementById('btnToggleViewTitle').addEventListener('click', toggleView);
  document.getElementById('btnMenuView').addEventListener('click', toggleView);
  document.getElementById('btnToggleSoundTitle').addEventListener('click', toggleSound);
  document.getElementById('btnMenuSound').addEventListener('click', toggleSound);
  document.getElementById('btnToggleMusicTitle').addEventListener('click', toggleMusic);
  document.getElementById('btnMenuMusic').addEventListener('click', toggleMusic);
  document.getElementById('btnFullscreenTitle').addEventListener('click', toggleFs);
  document.getElementById('btnMenuFullscreen').addEventListener('click', toggleFs);

  document.getElementById('btnInfoTitle').addEventListener('click', () => {
    const vb = document.getElementById('voiceStatusBox');
    const trCount = (AudioSys.trVoices || []).length;
    vb.textContent = trCount > 0
      ? `🔊 Cihazda ${trCount} adet Türkçe konuşma sesi bulundu ve aktif! (+ 8 karaktere özel Web Audio efektleri)`
      : `🔊 Karakter özel ses efektleri ve kelime kelime karaoke okuma aktif!`;
    document.getElementById('infoModal').classList.remove('hidden');
  });
  document.getElementById('btnCloseInfo').addEventListener('click', () => document.getElementById('infoModal').classList.add('hidden'));

  document.getElementById('interactBtn').addEventListener('click', () => tryInteract());
  document.getElementById('btnReplayVoice').addEventListener('click', () => DialogUI.replay());
  document.getElementById('btnDialogNext').addEventListener('click', () => DialogUI.next());
  document.getElementById('btnQuizRead').addEventListener('click', () => {
    if (QuizUI.current) AudioSys.speakLine('vudi', QuizUI.current.q);
  });
  document.getElementById('btnQuizNext').addEventListener('click', () => QuizUI.next());

  document.getElementById('questCard').addEventListener('click', () => {
    if (Game.chapter) showToast(`📌 Görev: ${Game.chapter.summary}`);
  });

  // Arsenal, Hub, Astro Quick, Atlas & Practice
  document.getElementById('btnArsenal').addEventListener('click', () => {
    renderArsenalModal();
    document.getElementById('arsenalModal').classList.remove('hidden');
  });
  document.getElementById('btnCloseArsenal').addEventListener('click', () => document.getElementById('arsenalModal').classList.add('hidden'));

  document.getElementById('btnHubWorld').addEventListener('click', () => openHubWorld3D());

  document.getElementById('btnAstroQuick').addEventListener('click', () => {
    const nextAstro = Math.max(13, Save.currentChapter >= 13 ? Save.currentChapter : 13);
    startChapterByNum(nextAstro);
  });

  document.getElementById('btnAtlas').addEventListener('click', () => {
    renderAtlasModal();
    document.getElementById('atlasModal').classList.remove('hidden');
  });
  document.getElementById('btnCloseAtlas').addEventListener('click', () => document.getElementById('atlasModal').classList.add('hidden'));

  document.getElementById('btnUnlockAllChapters').addEventListener('click', () => {
    Save.unlockedUpTo = 20;
    Save.coins = (Save.coins || 0) + 500;
    persistSave();
    AudioSys.playFanfare();
    showToast('🔓 20 Bölümün tamamı açıldı ve test için +500 🪙 eklendi!');
    refreshHud();
    renderAtlasModal();
  });

  document.getElementById('btnPracticeOpen').addEventListener('click', () => {
    document.getElementById('atlasModal').classList.add('hidden');
    document.getElementById('practiceModal').classList.remove('hidden');
  });
  document.getElementById('btnClosePractice').addEventListener('click', () => document.getElementById('practiceModal').classList.add('hidden'));

  document.querySelectorAll('.practice-pick').forEach((btn) => {
    btn.addEventListener('click', () => {
      const subj = btn.getAttribute('data-subj');
      document.getElementById('practiceModal').classList.add('hidden');
      let pool = [];
      if (subj === 'karma') {
        Object.values(EXTRA_QUESTION_BANK).forEach(arr => { pool = pool.concat(arr); });
      } else {
        pool = (EXTRA_QUESTION_BANK[subj] || []).slice();
      }
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const t = pool[i]; pool[i] = pool[j]; pool[j] = t;
      }
      const count = subj === 'karma' ? 6 : 5;
      QuizUI.start(pool.slice(0, count), `🎯 ANTRENMAN TURU · ${subj.toUpperCase()}`, () => {
        const bonus = subj === 'karma' ? 45 : 25;
        addCoins(bonus);
        AudioSys.playFanfare();
        showBanner(`🏆 Antrenman Tamamlandı! +${bonus} 🪙`);
      });
    });
  });

  document.getElementById('btnMenu').addEventListener('click', () => {
    renderWardrobeGrid();
    document.getElementById('menuModal').classList.remove('hidden');
  });
  document.getElementById('btnCloseMenu').addEventListener('click', () => document.getElementById('menuModal').classList.add('hidden'));

  document.getElementById('btnOpenCert').addEventListener('click', () => {
    document.getElementById('menuModal').classList.add('hidden');
    openCertificateModal();
  });
  document.getElementById('btnCloseCert').addEventListener('click', () => document.getElementById('certModal').classList.add('hidden'));
  document.getElementById('btnDownloadCert').addEventListener('click', () => {
    const cv = document.getElementById('certCanvas');
    const a = document.createElement('a');
    a.download = `baskomiser-diploma-${(Save.playerName || 'dedektif').replace(/\s+/g, '-')}.png`;
    a.href = cv.toDataURL('image/png');
    a.click();
  });

  document.getElementById('btnReturnTitle').addEventListener('click', () => {
    document.getElementById('menuModal').classList.add('hidden');
    if (AstroEngine.active) AstroEngine.stop();
    Game.astroActive = false;
    Game.seaActive = false;
    Game.mode = 'title';
    document.getElementById('hud').classList.add('hidden');
    document.getElementById('interactBtn').classList.add('hidden');
    document.getElementById('bossBar').classList.add('hidden');
    document.getElementById('titleOverlay').classList.remove('hidden');
    if (Save.started) document.getElementById('btnContinue').classList.remove('hidden');
  });
}

function bootGame() {
  AudioSys.init();
  AudioSys.soundOn = Save.settings.sound !== false;
  AudioSys.musicOn = Save.settings.music !== false;
  if (Save.settings.touch === undefined) Save.settings.touch = true;

  R3D.init(document.getElementById('glCanvas')).then(() => {
    if (Save.settings.view === '2d') R3D.on = false;
    syncSettingButtons();
  }).catch((e) => console.error('R3D init error:', e));

  Input.init();
  wireUI();
  syncSettingButtons();
  refreshHud();

  // Populate live village cast on Title Screen!
  Game.npcs = [
    { id: 'palyaco', x: 1380, y: 780 },
    { id: 'karga', x: 1450, y: 820 },
    { id: 'trex', x: 980, y: 820 },
    { id: 'ejderha', x: 1060, y: 1060 },
    { id: 'godzilla', x: 1520, y: 1060 },
    { id: 'kurt', x: 920, y: 1020 }
  ];

  let lastTs = performance.now();
  function frame(now) {
    requestAnimationFrame(frame);
    try {
      const dt = Math.min(0.05, Math.max(0.001, (now - lastTs) / 1000));
      lastTs = now;
      Game.time += dt;

      Input.poll();

      const anyModalOpen = Game.dialogOpen || Game.quizOpen ||
        !document.getElementById('arsenalModal').classList.contains('hidden') ||
        !document.getElementById('atlasModal').classList.contains('hidden') ||
        !document.getElementById('menuModal').classList.contains('hidden') ||
        !document.getElementById('practiceModal').classList.contains('hidden');

      if (Game.astroActive) {
        AstroEngine.update(dt, Input, anyModalOpen);
        // Still animate confetti overlay on cv2d!
        for (let i = Game.confetti.length - 1; i >= 0; i--) {
          const cf = Game.confetti[i];
          cf.life -= dt; cf.x += cf.vx * dt; cf.y += cf.vy * dt; cf.vy += 680 * dt; cf.rot += cf.vr * dt;
          if (cf.life <= 0) Game.confetti.splice(i, 1);
        }
        const cv2 = document.getElementById('cv2d');
        const ctx2 = cv2.getContext('2d');
        ctx2.clearRect(0, 0, cv2.width, cv2.height);
      } else {
        updateAct1(dt);
        if (R3D.ok && R3D.on) R3D.renderScene(Game, dt);
        R2D.renderOverlayAnd2D(document.getElementById('cv2d'), Game);
      }

      // Live animated portraits when dialogue or setup modal is open!
      if (Game.dialogOpen && Game.currentLine) {
        R2D.drawPortrait(document.getElementById('portraitCanvas'), Game.currentLine[0], Game.time, Save.wardrobe);
      }
      if (!document.getElementById('setupModal').classList.contains('hidden')) {
        R2D.drawPortrait(document.getElementById('setupPreviewCanvas'), 'rakun', Game.time, Save.wardrobe);
      }
    } catch (err) {
      console.error('Frame loop caught error:', err);
    }
  }
  requestAnimationFrame(frame);

  // Expose automation/inspection hook (like Sunny Hill's window.SH)
  window.KR_GAME = {
    Game, Save, AudioSys, R3D, R2D, AstroEngine, DialogUI, QuizUI,
    startChapterByNum, openHubWorld3D, completeCurrentChapter
  };
}

window.addEventListener('DOMContentLoaded', bootGame);
