/* ============================================================================
   09-MAIN-GAME.JS — V2.0 ANA OYUN YÖNETİCİSİ (SABİT 60 FPS iPAD, KALP & AMAÇ
   SİSTEMİ, 3 YILDIZ, SİLAH SEVİYE YÜKSELTME, 6 FARKLI İNTERAKTİF SORU/KODLAMA
   MODU, BLUETOOTH GAMEPAD, GACHA KAPSÜL MAKİNESİ & VELİ GELİŞİM KARNESİ!)
   ============================================================================ */

const SAVE_KEY = 'komiserRakun.megaSave.v2';
const LEGACY_SAVE_KEY = 'komiserRakun.megaSave.v1';

function detectDefaultGfx() {
  const mtp = (typeof navigator !== 'undefined' && navigator.maxTouchPoints) || 0;
  return mtp > 1 ? 'fast' : 'hd';
}

function defaultSave() {
  return {
    started: false,
    playerName: 'Cesur Dedektif',
    currentChapter: 1,
    unlockedUpTo: 1,
    completedChapters: [],
    chapterStars: {},
    coins: 50,
    totalCorrect: 0,
    secrets: [],
    rescuedBots: [],
    scienceUnlocked: [],
    gachaOwned: [],
    upgrades: {},
    subjectStats: {},
    missedQueue: [],
    ownedWardrobe: ['cap', 'none_hat', 'cape_none', 'glasses_none'],
    wardrobe: { coatHex: '#1e3566', hat: 'cap', back: 'cape_none', eye: 'glasses_none' },
    ownedArsenal: {
      suits: ['robot_suit'],
      weapons: ['club'],
      gloves: ['basic_glove'],
      gadgets: ['jet_std'],
      armors: ['police_suit'],
      ships: ['rae_ship'],
      pets: ['none_pet']
    },
    equipped: {
      suits: 'robot_suit',
      weapons: 'club',
      gloves: 'basic_glove',
      gadgets: 'jet_std',
      armors: 'police_suit',
      ships: 'rae_ship',
      pets: 'none_pet'
    },
    settings: {
      view: '3d',
      sound: true,
      music: true,
      touch: true,
      gfx: detectDefaultGfx(),
      speechSpeed: 'slow',
      tier: 'grade2'
    }
  };
}

function loadSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY) || localStorage.getItem(LEGACY_SAVE_KEY);
    if (!raw) return defaultSave();
    const parsed = JSON.parse(raw);
    const def = defaultSave();
    const merged = Object.assign(def, parsed, {
      chapterStars: Object.assign({}, def.chapterStars, parsed.chapterStars || {}),
      upgrades: Object.assign({}, def.upgrades, parsed.upgrades || {}),
      subjectStats: Object.assign({}, def.subjectStats, parsed.subjectStats || {}),
      wardrobe: Object.assign({}, def.wardrobe, parsed.wardrobe || {}),
      ownedArsenal: Object.assign({}, def.ownedArsenal, parsed.ownedArsenal || {}),
      equipped: Object.assign({}, def.equipped, parsed.equipped || {}),
      settings: Object.assign({}, def.settings, parsed.settings || {})
    });
    for (const chNum of (merged.completedChapters || [])) {
      if (!merged.chapterStars[chNum]) merged.chapterStars[chNum] = 2;
    }
    return merged;
  } catch (e) {
    return defaultSave();
  }
}

function persistSave() {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(Save)); } catch (e) {}
}

let Save = loadSave();

function getTotalStars() {
  return Object.values(Save.chapterStars || {}).reduce((a, b) => a + (b || 0), 0);
}

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
  mode: 'title',
  astroActive: false,
  worldId: 'town',
  worldDef: WORLDS.town,
  time: 0,
  shake: 0,
  arenaWide: false,
  seaActive: false,

  hp: 4,
  maxHp: 4,
  combo: 0,
  chapterMistakes: 0,
  chapterDeaths: 0,
  shopDiscount: 1.0,
  gameOverOpen: false,

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

function computeMaxHp() {
  const eq = AstroEngine.getEquippedStats(Save);
  return eq.armor.hearts + (eq.armorLv - 1) + (eq.pet.bonusHearts || 0);
}

function getComboMultiplier() {
  return Game.combo >= 4 ? 3 : Game.combo >= 2 ? 2 : 1;
}

/* ---- EVRENSEL KALP KAYBI, CAN YENİLEME VE GAME-OVER SİSTEMİ ---- */
let hurtFlashTimer = null;
function loseHeart(reason = 'Yanlış hamle!') {
  if (Game.gameOverOpen) return 0;
  Game.hp = Math.max(0, Game.hp - 1);
  Game.combo = 0;
  Game.chapterMistakes++;
  Game.shake = 0.55;
  AudioSys.playHeartBreak?.();

  const hf = document.getElementById('hurtFlash');
  if (hf) {
    hf.classList.add('active');
    if (hurtFlashTimer) clearTimeout(hurtFlashTimer);
    hurtFlashTimer = setTimeout(() => hf.classList.remove('active'), 260);
  }

  const qCard = document.getElementById('quizCardInner');
  if (qCard && Game.quizOpen) {
    qCard.classList.remove('shake-anim');
    void qCard.offsetWidth;
    qCard.classList.add('shake-anim');
  }

  if (AstroEngine.active) {
    AstroEngine.hp = Game.hp;
    AstroEngine.refreshAstroHud();
  }
  refreshHud();
  showToast(`💔 -1 Kalp! ${reason}`);

  if (Game.hp <= 0) {
    Game.chapterDeaths++;
    Game.gameOverOpen = true;
    document.getElementById('gameOverModal').classList.remove('hidden');
  }
  return Game.hp;
}

function gainHeart(n = 1) {
  Game.maxHp = computeMaxHp();
  Game.hp = Math.min(Game.maxHp, Game.hp + n);
  if (AstroEngine.active) {
    AstroEngine.maxHp = Game.maxHp;
    AstroEngine.hp = Game.hp;
    AstroEngine.refreshAstroHud();
  }
  refreshHud();
  showToast(`❤️ +${n} Kalp Yenilendi!`);
  return Game.hp;
}

/* ---- KLAVYE, FARE, ÇOKLU DOKUNUŞ (MULTI-TOUCH) VE BLUETOOTH GAMEPAD GİRDİSİ ---- */
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
  gpPrevBtns: {},

  init() {
    window.addEventListener('keydown', (e) => {
      if (document.activeElement && document.activeElement.tagName === 'INPUT') return;
      this.keys[e.code] = true;

      if (Game.gameOverOpen) return;

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
      if (e.code === 'Enter' && !Game.astroActive) tryInteract();
      if (e.code === 'KeyF') {
        if (Game.astroActive) AstroEngine.triggerAttack();
        else if (Game.seaActive && Game.sea.loaded) fireSeaCannon(Game.sea.kx, Game.sea.ky);
        else tryInteract();
      }
      if (e.code === 'KeyE' && Game.astroActive) AstroEngine.triggerGadget();
      if ((e.code === 'ShiftLeft' || e.code === 'ShiftRight') && Game.astroActive) AstroEngine.triggerDash();
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
      if (e.code === 'Space') this.jumpHeld = false;
    });

    const jz = document.getElementById('joyZone');
    const jk = document.getElementById('joyKnob');
    const updateJoyFromCenter = (clientX, clientY, cx, cy, maxR) => {
      let dx = clientX - cx, dy = clientY - cy;
      const dist = Math.hypot(dx, dy);
      if (dist > maxR) { dx = (dx / dist) * maxR; dy = (dy / dist) * maxR; }
      jk.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
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
      jk.style.transform = 'translate3d(0px, 0px, 0)';
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

    // Unified Scene Pointer Handler for BOTH #glCanvas (3D) and #cv2d (2D fallback)!
    const wireSceneCanvas = (canvasEl) => {
      canvasEl.addEventListener('pointerdown', (e) => {
        AudioSys.ensure();
        if (Game.mode !== 'play' || Game.dialogOpen || Game.quizOpen || Game.gameOverOpen) return;

        // Astro Mode: Left-quadrant touch = Floating Thumbstick; Right/Mouse = Attack!
        if (Game.astroActive) {
          if (e.pointerType === 'touch' && e.clientX < window.innerWidth * 0.44 && e.clientY > window.innerHeight * 0.36 && !this.joyActive) {
            this.joyActive = true;
            this.joyFloating = true;
            this.joyPointerId = e.pointerId;
            this.joyOriginX = e.clientX;
            this.joyOriginY = e.clientY;
            try { canvasEl.setPointerCapture(e.pointerId); } catch (_) {}
            return;
          }
          if (e.button === 2) AstroEngine.triggerGadget();
          else {
            this.atkPointerId = e.pointerId;
            this.fireHeld = true;
            AstroEngine.triggerAttack();
          }
          return;
        }

        // Act I Mode: Left-quadrant touch = Floating Thumbstick; Otherwise Tap-to-Walk or Sea Drag-Aim!
        if (e.pointerType === 'touch' && !Game.seaActive && e.clientX < window.innerWidth * 0.40 && e.clientY > window.innerHeight * 0.45 && !this.joyActive) {
          this.joyActive = true;
          this.joyFloating = true;
          this.joyPointerId = e.pointerId;
          this.joyOriginX = e.clientX;
          this.joyOriginY = e.clientY;
          try { canvasEl.setPointerCapture(e.pointerId); } catch (_) {}
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

      canvasEl.addEventListener('pointermove', (e) => {
        if (this.joyActive && this.joyFloating && e.pointerId === this.joyPointerId) {
          updateJoyFromCenter(e.clientX, e.clientY, this.joyOriginX, this.joyOriginY, 58);
          return;
        }
        if (!Game.astroActive && Game.seaActive && Game.sea.aiming && (this.aimPointerId === null || e.pointerId === this.aimPointerId)) {
          const worldPt = screenToWorldAct1(e.clientX, e.clientY);
          Game.sea.aimX = worldPt.x;
          Game.sea.aimY = worldPt.y;
        }
      });

      canvasEl.addEventListener('pointerup', (e) => {
        if (this.joyFloating && e.pointerId === this.joyPointerId) endJoy(e.pointerId);
        if (e.pointerId === this.atkPointerId) { this.fireHeld = false; this.atkPointerId = null; }
      });
      canvasEl.addEventListener('pointercancel', (e) => {
        if (this.joyFloating && e.pointerId === this.joyPointerId) endJoy(e.pointerId);
        if (e.pointerId === this.atkPointerId) { this.fireHeld = false; this.atkPointerId = null; }
      });
      canvasEl.addEventListener('contextmenu', (e) => e.preventDefault());
    };

    wireSceneCanvas(document.getElementById('glCanvas'));
    wireSceneCanvas(document.getElementById('cv2d'));

    window.addEventListener('pointerup', (e) => {
      if (Game.seaActive && Game.sea.aiming && (this.aimPointerId === null || e.pointerId === this.aimPointerId)) {
        Game.sea.aiming = false;
        this.aimPointerId = null;
        fireSeaCannon(Game.sea.aimX, Game.sea.aimY);
      }
      if (e.pointerId === this.atkPointerId) { this.fireHeld = false; this.atkPointerId = null; }
      if (e.pointerId === this.jumpPointerId) { this.jumpHeld = false; this.jumpPointerId = null; }
    });

    // Right-Thumb Diamond Action Pad (Multi-Touch Safe by pointerId!)
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

  pollGamepad() {
    if (typeof navigator === 'undefined' || !navigator.getGamepads) return { gx: 0, gy: 0 };
    const pads = navigator.getGamepads();
    const gp = pads && (pads[0] || pads[1]);
    if (!gp) return { gx: 0, gy: 0 };

    let gx = Math.abs(gp.axes[0] || 0) > 0.16 ? gp.axes[0] : 0;
    let gy = Math.abs(gp.axes[1] || 0) > 0.16 ? gp.axes[1] : 0;
    if (gp.buttons[14]?.pressed) gx = -1;
    if (gp.buttons[15]?.pressed) gx = 1;
    if (gp.buttons[12]?.pressed) gy = -1;
    if (gp.buttons[13]?.pressed) gy = 1;

    const btnDown = (idx) => {
      const now = !!gp.buttons[idx]?.pressed;
      const was = !!this.gpPrevBtns[idx];
      this.gpPrevBtns[idx] = now;
      return now && !was;
    };

    if (btnDown(0)) {
      if (Game.dialogOpen) DialogUI.next();
      else if (Game.astroActive) { this.jumpPressed = true; }
      else tryInteract();
    }
    if (gp.buttons[0]?.pressed && Game.astroActive) this.jumpHeld = true;
    else if (this.gpPrevBtns[0] && !gp.buttons[0]?.pressed && this.jumpPointerId === null && !this.keys['Space']) {
      this.jumpHeld = false;
    }

    if (btnDown(2) && Game.astroActive && !Game.quizOpen) AstroEngine.triggerAttack();
    if (btnDown(3) && Game.astroActive && !Game.quizOpen) AstroEngine.triggerGadget();
    if ((btnDown(1) || btnDown(5)) && Game.astroActive && !Game.quizOpen) AstroEngine.triggerDash();

    return { gx, gy };
  },

  poll() {
    let kx = 0, ky = 0;
    if (this.keys['ArrowLeft'] || this.keys['KeyA']) kx -= 1;
    if (this.keys['ArrowRight'] || this.keys['KeyD']) kx += 1;
    if (this.keys['ArrowUp'] || this.keys['KeyW']) ky -= 1;
    if (this.keys['ArrowDown'] || this.keys['KeyS']) ky += 1;

    const { gx, gy } = this.pollGamepad();

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
    } else if (Math.hypot(gx, gy) > 0.1) {
      const l = Math.min(1, Math.hypot(gx, gy));
      const a = Math.atan2(gy, gx);
      this.dx = Math.cos(a) * l;
      this.dy = Math.sin(a) * l;
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
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2900);
}

function showBanner(msg) {
  const el = document.getElementById('banner');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
  spawnScreenConfetti(34);
  if (bannerTimer) clearTimeout(bannerTimer);
  bannerTimer = setTimeout(() => el.classList.remove('show'), 2600);
}

function spawnScreenConfetti(n = 28) {
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
      life: 1.7 + Math.random() * 0.6
    });
  }
}

function addCoins(n) {
  Save.coins = (Save.coins || 0) + n;
  persistSave();
  refreshHud();
}

function refreshHud() {
  const stars = getTotalStars();
  document.getElementById('hudStars').textContent = stars;
  document.getElementById('hudCoins').textContent = Save.coins || 0;
  document.getElementById('hudSecrets').textContent = (Save.secrets || []).length + (Save.rescuedBots || []).length;

  const hStr = '❤️'.repeat(Math.max(0, Game.hp)) + '🖤'.repeat(Math.max(0, Game.maxHp - Game.hp));
  const hh = document.getElementById('hudHearts');
  const qh = document.getElementById('quizHeartsPill');
  if (hh) hh.textContent = hStr;
  if (qh) qh.textContent = hStr;

  const cbEl = document.getElementById('hudCombo');
  if (cbEl) {
    const mult = getComboMultiplier();
    if (Game.combo >= 2) {
      cbEl.textContent = `🔥 Seri ${Game.combo} (${mult}x🪙)`;
      cbEl.classList.remove('hidden');
    } else {
      cbEl.classList.add('hidden');
    }
  }

  const ch = Game.chapter;
  if (ch) {
    const tag = document.getElementById('questChapterTag');
    const title = document.getElementById('questTitle');
    if (Game.astroActive && AstroEngine.mode === 'hub') {
      tag.textContent = '🌟 KURTARILAN DOSTLAR ÜSSÜ & BİLİM PARKI';
      tag.style.background = '#ff9900';
      title.textContent = 'Sürpriz Kapsül aç, Bilim Müzesini gez veya 🗺️ Bölümlerden yeni gezegene uç!';
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
    if (Game.dialogQueue.length > 0) this.showCurrent();
    else this.close();
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

/* ---- 6 FARKLI İNTERAKTİF SORU, KODLAMA & BİLSEM BULMACA MOTORU (QuizUI) ---- */
const QuizUI = {
  queue: [],
  idx: 0,
  current: null,
  subjKey: 'karma',
  shuffled: [],
  answered: false,
  firstTry: true,
  onComplete: null,
  onCancel: null,

  start(questions, badgeLabel, onComplete, onCancel = null, subjKey = null) {
    if (!questions || !questions.length) { if (onComplete) onComplete(); return; }
    Game.quizOpen = true;
    this.queue = questions.slice();
    this.idx = 0;
    this.subjKey = subjKey || (Game.chapter && Game.chapter.subjectKey) || 'karma';
    this.onComplete = onComplete;
    this.onCancel = onCancel;
    document.getElementById('quizSubjectBadge').textContent = badgeLabel || 'GÖREV SORUSU';
    document.getElementById('quizModal').classList.remove('hidden');
    refreshHud();
    this.renderQuestion();
  },

  cancel() {
    AudioSys.stopSpeech();
    Game.quizOpen = false;
    document.getElementById('quizModal').classList.add('hidden');
    const cb = this.onCancel;
    this.onCancel = null;
    this.onComplete = null;
    if (cb) cb();
  },

  markSolved(expText) {
    this.answered = true;
    AudioSys.playSuccess();
    Save.totalCorrect = (Save.totalCorrect || 0) + 1;
    AdaptiveTeacher.recordResult(Save, this.subjKey, this.current, this.firstTry);

    if (this.firstTry) Game.combo++;
    const mult = getComboMultiplier();
    const reward = 5 * mult;
    addCoins(reward);
    persistSave();

    const fb = document.getElementById('quizFeedback');
    fb.className = 'good';
    fb.style.display = 'block';
    const comboTxt = mult > 1 ? ` (🔥 ${mult}x Seri Bonusu: +${reward} 🪙!)` : ` (+${reward} 🪙)`;
    fb.textContent = `✅ Harika! Doğru çözdün!${comboTxt} — ${expText || ''}`;
    document.getElementById('btnQuizNext').classList.remove('hidden');
    refreshHud();
  },

  markWrong(hintText) {
    this.firstTry = false;
    AdaptiveTeacher.recordResult(Save, this.subjKey, this.current, false);
    persistSave();
    const fb = document.getElementById('quizFeedback');
    const visBar = (this.current && this.current.v) ? `📐 ${this.current.v} — ` : '';
    fb.className = 'hint';
    fb.style.display = 'block';
    fb.textContent = `💔 -1 Kalp! 💡 ${visBar}İpucu: ${hintText || 'Dikkatlice tekrar inceleyelim!'}`;
    loseHeart('Yanlış cevap seçildi!');
    if (!Game.gameOverOpen) {
      AudioSys.speakLine('vudi', `İpucu: ${hintText || 'Tekrar deneyelim!'}`);
    }
  },

  renderQuestion() {
    const qObj = this.queue[this.idx];
    this.current = qObj;
    this.answered = false;
    this.firstTry = true;

    document.getElementById('quizProgress').textContent = `Görev ${this.idx + 1} / ${this.queue.length}`;
    document.getElementById('quizQuestionText').textContent = qObj.q;
    document.getElementById('quizVisualHint').textContent = qObj.v || '';

    const fb = document.getElementById('quizFeedback');
    fb.className = '';
    fb.style.display = 'none';
    document.getElementById('btnQuizNext').classList.add('hidden');

    const area = document.getElementById('puzzleInteractiveArea');
    const choicesEl = document.getElementById('quizChoices');
    area.innerHTML = '';
    area.classList.add('hidden');
    choicesEl.innerHTML = '';

    const pType = qObj.type || 'mcq';

    if (pType === 'order') {
      this.renderOrderPuzzle(qObj, area);
    } else if (pType === 'match') {
      this.renderMatchPuzzle(qObj, area);
    } else if (pType === 'tf_blitz') {
      this.renderTfPuzzle(qObj, choicesEl);
    } else if (pType === 'robot_code') {
      this.renderRobotCodePuzzle(qObj, area);
    } else {
      if (pType === 'cube_count') {
        area.classList.remove('hidden');
        const cv = document.createElement('canvas');
        cv.id = 'puzzleCanvas';
        cv.width = 340;
        cv.height = 195;
        area.appendChild(cv);
        AdaptiveTeacher.drawCubeTower(cv, qObj.stacks || [[2, 1], [1, 1]]);
      }
      this.renderMcqChoices(qObj, choicesEl);
    }

    AudioSys.speakLine('vudi', qObj.q);
  },

  renderMcqChoices(qObj, choicesEl) {
    const pairs = (qObj.opts || []).map((txt, i) => ({ txt, ok: i === (qObj.ans || 0) }));
    for (let i = pairs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = pairs[i]; pairs[i] = pairs[j]; pairs[j] = tmp;
    }
    this.shuffled = pairs;
    const letters = ['A', 'B', 'C', 'D'];
    pairs.forEach((p, idx) => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.type = 'button';
      btn.innerHTML = `<span class="choice-letter">${letters[idx]}</span><span>${p.txt}</span>`;
      btn.addEventListener('click', () => this.pick(idx));
      choicesEl.appendChild(btn);
    });
  },

  renderTfPuzzle(qObj, choicesEl) {
    this.shuffled = [
      { txt: '✅ DOĞRU', ok: qObj.answerBool === true },
      { txt: '❌ YANLIŞ', ok: qObj.answerBool === false }
    ];
    this.shuffled.forEach((p, idx) => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.type = 'button';
      btn.style.justifyContent = 'center';
      btn.style.fontSize = '21px';
      btn.textContent = p.txt;
      btn.addEventListener('click', () => this.pick(idx));
      choicesEl.appendChild(btn);
    });
  },

  renderOrderPuzzle(qObj, area) {
    area.classList.remove('hidden');
    const target = qObj.tokens.slice();
    const bank = target.map((t, idx) => ({ t, idx }));
    for (let i = bank.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = bank[i]; bank[i] = bank[j]; bank[j] = tmp;
    }
    if (bank.every((b, i) => b.t === target[i]) && bank.length > 1) {
      const tmp = bank[0]; bank[0] = bank[1]; bank[1] = tmp;
    }

    let placed = [];
    const slotsDiv = document.createElement('div');
    slotsDiv.className = 'order-slots';
    const bankDiv = document.createElement('div');
    bankDiv.className = 'order-bank';
    area.append(slotsDiv, bankDiv);

    const redraw = () => {
      slotsDiv.innerHTML = '';
      bankDiv.innerHTML = '';
      if (!placed.length) {
        slotsDiv.innerHTML = '<span style="color:#64748b;font-weight:800;align-self:center">👇 Aşağıdaki kutulara sırayla dokun!</span>';
      }
      placed.forEach((item, pIdx) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'tile-chip placed';
        b.textContent = item.t;
        b.addEventListener('click', () => {
          if (this.answered) return;
          placed.splice(pIdx, 1);
          redraw();
        });
        slotsDiv.appendChild(b);
      });
      bank.forEach((item) => {
        const used = placed.includes(item);
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'tile-chip' + (used ? ' used' : '');
        b.textContent = item.t;
        b.addEventListener('click', () => {
          if (this.answered || used) return;
          AudioSys.playPickup();
          placed.push(item);
          redraw();
          if (placed.length === target.length) {
            const ok = placed.every((x, i) => x.t === target[i]);
            if (ok) {
              this.markSolved(qObj.exp);
            } else {
              placed = [];
              redraw();
              this.markWrong(qObj.exp);
            }
          }
        });
        bankDiv.appendChild(b);
      });
    };
    redraw();
  },

  renderMatchPuzzle(qObj, area) {
    area.classList.remove('hidden');
    const pairs = qObj.pairs || [];
    const lefts = pairs.map((p, i) => ({ txt: p[0], pairId: i, done: false }));
    const rights = pairs.map((p, i) => ({ txt: p[1], pairId: i, done: false }));
    for (let i = rights.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = rights[i]; rights[i] = rights[j]; rights[j] = t;
    }

    let selLeft = null, selRight = null;
    const grid = document.createElement('div');
    grid.className = 'match-grid';
    const colL = document.createElement('div'); colL.className = 'match-col';
    const colR = document.createElement('div'); colR.className = 'match-col';
    grid.append(colL, colR);
    area.appendChild(grid);

    const checkSel = () => {
      if (selLeft === null || selRight === null) return;
      if (lefts[selLeft].pairId === rights[selRight].pairId) {
        lefts[selLeft].done = true;
        rights[selRight].done = true;
        AudioSys.playPickup();
        selLeft = null; selRight = null;
        redraw();
        if (lefts.every(l => l.done)) {
          this.markSolved(qObj.exp);
        }
      } else {
        selLeft = null; selRight = null;
        redraw();
        this.markWrong(qObj.exp);
      }
    };

    const redraw = () => {
      colL.innerHTML = ''; colR.innerHTML = '';
      lefts.forEach((it, idx) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'match-btn' + (it.done ? ' done' : selLeft === idx ? ' active' : '');
        b.textContent = it.txt;
        b.addEventListener('click', () => { if (!this.answered) { selLeft = idx; redraw(); checkSel(); } });
        colL.appendChild(b);
      });
      rights.forEach((it, idx) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'match-btn' + (it.done ? ' done' : selRight === idx ? ' active' : '');
        b.textContent = it.txt;
        b.addEventListener('click', () => { if (!this.answered) { selRight = idx; redraw(); checkSel(); } });
        colR.appendChild(b);
      });
    };
    redraw();
  },

  renderRobotCodePuzzle(qObj, area) {
    area.classList.remove('hidden');
    const cv = document.createElement('canvas');
    cv.id = 'puzzleCanvas';
    cv.width = 270;
    cv.height = 225;
    const seqBox = document.createElement('div');
    seqBox.className = 'code-seq';
    const bar = document.createElement('div');
    bar.className = 'code-toolbar';
    area.append(cv, seqBox, bar);

    const cmds = [];
    let running = false;
    let bot = { x: qObj.start.x, y: qObj.start.y, dir: qObj.start.dir };

    const redraw = () => {
      AdaptiveTeacher.drawRobotGrid(cv, qObj, bot);
      seqBox.textContent = cmds.length
        ? 'Komutlar: ' + cmds.map(c => c === 'F' ? '⬆️' : c === 'L' ? '⬅️' : '➡️').join(' → ')
        : 'Komut eklemek için aşağıdaki yön tuşlarına dokun!';
    };

    const addCmdBtn = (lbl, code, cls = 'btn-sky') => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = `btn btn-sm ${cls}`;
      b.textContent = lbl;
      b.addEventListener('click', () => {
        if (this.answered || running || cmds.length >= 10) return;
        cmds.push(code);
        AudioSys.playPickup();
        redraw();
      });
      bar.appendChild(b);
    };
    addCmdBtn('⬆️ İleri', 'F', 'btn-sky');
    addCmdBtn('⬅️ Sola Dön', 'L', 'btn-purple');
    addCmdBtn('➡️ Sağa Dön', 'R', 'btn-purple');

    const clrBtn = document.createElement('button');
    clrBtn.type = 'button';
    clrBtn.className = 'btn btn-sm btn-cream';
    clrBtn.textContent = '🗑️ Temizle';
    clrBtn.addEventListener('click', () => {
      if (this.answered || running) return;
      cmds.length = 0;
      bot = { x: qObj.start.x, y: qObj.start.y, dir: qObj.start.dir };
      redraw();
    });

    const runBtn = document.createElement('button');
    runBtn.type = 'button';
    runBtn.className = 'btn btn-sm btn-green';
    runBtn.textContent = '▶ Çalıştır!';
    runBtn.addEventListener('click', () => {
      if (this.answered || running || !cmds.length) return;
      running = true;
      bot = { x: qObj.start.x, y: qObj.start.y, dir: qObj.start.dir };
      let stepIdx = 0;
      const timer = setInterval(() => {
        if (stepIdx >= cmds.length) {
          clearInterval(timer);
          running = false;
          if (bot.x === qObj.goal.x && bot.y === qObj.goal.y) {
            this.markSolved(qObj.exp);
          } else {
            bot = { x: qObj.start.x, y: qObj.start.y, dir: qObj.start.dir };
            redraw();
            this.markWrong('Robot pil kutusuna ulaşamadı! Komut sırasını düzeltip tekrar Çalıştır\'a bas!');
          }
          return;
        }
        const c = cmds[stepIdx++];
        if (c === 'L') bot.dir = (bot.dir + 3) % 4;
        else if (c === 'R') bot.dir = (bot.dir + 1) % 4;
        else if (c === 'F') {
          const dxs = [0, 1, 0, -1], dys = [-1, 0, 1, 0];
          const nx = bot.x + dxs[bot.dir], ny = bot.y + dys[bot.dir];
          const hitRock = (qObj.rocks || []).some(r => r.x === nx && r.y === ny);
          if (nx < 0 || ny < 0 || nx >= qObj.gridW || ny >= qObj.gridH || hitRock) {
            clearInterval(timer);
            running = false;
            bot = { x: qObj.start.x, y: qObj.start.y, dir: qObj.start.dir };
            redraw();
            this.markWrong('Robot kayaya veya sınıra çarptı! Yön dönüşlerini kontrol et!');
            return;
          }
          bot.x = nx; bot.y = ny;
        }
        AudioSys.tone(520, 0.05, 'sine', 0.09);
        redraw();
      }, 240);
    });
    bar.append(clrBtn, runBtn);
    redraw();
  },

  pick(choiceIdx) {
    if (this.answered || !this.shuffled[choiceIdx]) return;
    const picked = this.shuffled[choiceIdx];
    const btns = Array.from(document.querySelectorAll('#quizChoices .choice-btn'));

    if (picked.ok) {
      if (btns[choiceIdx]) btns[choiceIdx].classList.add('correct');
      btns.forEach(b => { b.disabled = true; });
      this.markSolved(this.current.exp);
    } else {
      if (btns[choiceIdx]) {
        btns[choiceIdx].classList.add('wrong');
        btns[choiceIdx].disabled = true;
      }
      this.markWrong(this.current.exp);
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
      this.onCancel = null;
      if (cb) cb();
    }
  }
};

function pullChapterQuestions(ch, count = 2, preferInteractive = false) {
  return AdaptiveTeacher.buildEncounterPack(ch, Save, count, preferInteractive);
}

/* ---- BÖLÜM BAŞLATMA (BÖLÜM 1–12 KÖY/DENİZ & BÖLÜM 13–21 ASTRO 3D GEZEGENLER!) ---- */
async function startChapterByNum(num, skipIntro = false) {
  if (Game.dialogOpen) {
    Game.dialogOnDone = null;
    DialogUI.close();
  }
  if (Game.quizOpen) {
    QuizUI.cancel();
  }
  const all = ALL_CHAPTERS();
  const ch = all.find(c => c.num === num) || all[0];

  Save.currentChapter = ch.num;
  if (ch.num > (Save.unlockedUpTo || 1)) Save.unlockedUpTo = ch.num;
  persistSave();

  Game.mode = 'play';
  Game.chapter = ch;
  Game.chProgress = 0;
  Game.chapterMistakes = 0;
  Game.chapterDeaths = 0;
  Game.maxHp = computeMaxHp();
  Game.hp = Game.maxHp;
  Game.gameOverOpen = false;
  Game.carrying = null;
  Game.pads = [];
  Game.hazards = [];
  Game.items = [];
  Game.pedestal = null;
  Game.padQuestion = null;
  Game.seaActive = false;
  Game.arenaWide = false;

  document.getElementById('titleOverlay').classList.add('hidden');
  document.getElementById('gameOverModal').classList.add('hidden');
  document.getElementById('hud').classList.remove('hidden');
  document.getElementById('joyZone').classList.add('active-hud');
  document.getElementById('bossBar').classList.add('hidden');

  if (ch.num >= 13) {
    Game.astroActive = true;
    document.getElementById('interactBtn').classList.add('hidden');
    await AstroEngine.startChapter(ch, Save, astroCallbacks());
    refreshHud();
    showBanner(`🚀 ${ch.title}`);
    return;
  }

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

  Game.npcs = (Game.worldDef.npcsBase || []).filter(n => n.id !== ch.npc).map(n => Object.assign({}, n, { marker: false }));
  for (const sec of SECRETS_LIST) {
    if (sec.world === Game.worldId && !(Save.secrets || []).includes(sec.id)) {
      Game.items.push({ id: sec.id, secret: sec, x: sec.x, y: sec.y, mesh: 'crystal', icon: sec.icon, taken: false });
    }
  }
  // Hidden First-Aid Heart Donut in every Act I world!
  Game.items.push({ id: 'world_heart_donut', heartItem: true, x: 1380, y: 920, mesh: 'fruit', icon: '🍩', taken: false });

  setupAct1ChapterMode(ch);
  refreshHud();

  if (!skipIntro && ch.introLines && ch.introLines.length) {
    const bossFocus = Game.npcs.find(n => n.id === ch.npc) || Game.vudi;
    DialogUI.open(ch.introLines, bossFocus);
  }
}

function astroCallbacks() {
  return {
    getHearts: (maxH) => { Game.maxHp = maxH; return Game.hp; },
    onLoseHeart: (reason) => loseHeart(reason),
    onGainHeart: (n) => gainHeart(n),
    onToast: (m) => showToast(m),
    onCoins: (n) => addCoins(n),
    onRescueBot: (botKey, cleanName, glbFile) => {
      if (!Save.rescuedBots.includes(botKey)) {
        Save.rescuedBots.push(botKey);
        addCoins(15);
      }
      if (glbFile && SCIENCE_CARDS[glbFile] && !(Save.scienceUnlocked || []).includes(glbFile)) {
        Save.scienceUnlocked.push(glbFile);
        const card = SCIENCE_CARDS[glbFile];
        showToast(`🔬 ${card.title}: ${card.fact}`);
        AudioSys.speakLine('vudi', card.fact);
      } else {
        showToast(`🤖 3D Dost Kurtarıldı: ${cleanName}! (+15 🪙)`);
      }
      persistSave();
      refreshHud();
    },
    onCagePuzzle: (ch, cg, onPass, onCancel) => {
      const qs = pullChapterQuestions(ch, 1, true);
      QuizUI.start(qs, `🔒 DOST KURTARMA KİLİDİ · ${ch.subject}`, onPass, onCancel, ch.subjectKey);
    },
    onBossShieldQuiz: (ch, onPass, onCancel) => {
      const tfPool = (INTERACTIVE_PUZZLES[ch.subjectKey] || INTERACTIVE_PUZZLES.matematik).filter(p => p.type === 'tf_blitz' || p.type === 'match');
      const pick = tfPool.length ? [tfPool[(Game.qCursor++) % tfPool.length]] : pullChapterQuestions(ch, 1, true);
      QuizUI.start(pick, `🛡️ BOSS KALKAN KIRMA DÜELLOSU!`, onPass, onCancel, ch.subjectKey);
    },
    onGateQuiz: (ch, onPass, onCancel) => {
      const qs = pullChapterQuestions(ch, 2, true);
      QuizUI.start(qs, `🔓 GEZEGEN KAPISI · ${ch.subject}`, onPass, onCancel, ch.subjectKey);
    },
    onHubGacha: () => rollHubGacha(),
    onChapterWin: (ch) => completeCurrentChapter()
  };
}

async function openHubWorld3D() {
  if (Game.dialogOpen) {
    Game.dialogOnDone = null;
    DialogUI.close();
  }
  if (Game.quizOpen) {
    QuizUI.cancel();
  }
  document.getElementById('titleOverlay').classList.add('hidden');
  document.getElementById('atlasModal').classList.add('hidden');
  document.getElementById('hud').classList.remove('hidden');
  document.getElementById('joyZone').classList.add('active-hud');
  document.getElementById('interactBtn').classList.add('hidden');
  Game.mode = 'play';
  Game.astroActive = true;
  Game.maxHp = computeMaxHp();
  Game.hp = Game.maxHp;
  await AstroEngine.startHubWorld(Save, astroCallbacks());
  refreshHud();
}

async function rollHubGacha() {
  if ((Save.coins || 0) < 30) {
    AudioSys.playWrong();
    showToast('🪙 Sürpriz Kapsül için 30 🪙 gerekli! Görev çözerek altın topla!');
    return;
  }
  const unowned = GACHA_CAPSULES.filter(g => !(Save.gachaOwned || []).includes(g.id));
  if (!unowned.length) {
    showToast('🏆 Kapsül Makinesindeki tüm 3D Heykelleri zaten topladın!');
    return;
  }
  Save.coins -= 30;
  const won = unowned[Math.floor(Math.random() * unowned.length)];
  if (!Save.gachaOwned) Save.gachaOwned = [];
  Save.gachaOwned.push(won.id);
  persistSave();
  AudioSys.playFanfare();
  showBanner(`🎰 YENİ 3D HEYKEL: ${won.name}!`);
  await AstroEngine.spawnGachaInHub(won);
  AstroEngine.refreshAstroHud();
  refreshHud();
}

function setupAct1ChapterMode(ch) {
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
  const qObj = pullChapterQuestions(ch, 1, false)[0];
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
  addCoins(10 * getComboMultiplier());
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

  // 1..3 Star Chapter Performance Rating!
  let earnedStars = 1;
  if (Game.chapterDeaths === 0) earnedStars = 2;
  if (Game.chapterDeaths === 0 && Game.chapterMistakes <= 1) earnedStars = 3;
  Save.chapterStars[ch.num] = Math.max(Save.chapterStars[ch.num] || 0, earnedStars);

  const nextNum = Math.min(21, ch.num + 1);
  if (nextNum > (Save.unlockedUpTo || 1)) Save.unlockedUpTo = nextNum;
  addCoins(25 + earnedStars * 10);

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
  showBanner(`${'⭐'.repeat(earnedStars)} BÖLÜM ${ch.num} TAMAMLANDI!`);
  document.getElementById('bossBar').classList.add('hidden');

  const goNext = () => {
    if (ch.num === 12) {
      DialogUI.open([
        ['vudi', 'Tak-tak-tak! Komiserim! Doktor Palyaço uzay roketiyle Galaksiye kaçtı!'],
        ['rakun', 'Harika! Astro-Robot zırhımızı ve Hover-Lazer çizmelerimizi giyip 13. Bölümden itibaren Galaksi Gezegenlerine uçuyoruz!']
      ], null, () => startChapterByNum(13));
    } else if (ch.num >= 20) {
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
    if (Game.sea.loaded) return { kind: 'sea_fire', label: '🎯 Topu Ateşle!', obj: Game.sea };
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
      if (it.heartItem) return { kind: 'heart_pick', label: '🍩 İlk Yardım Çöreği (+1❤️)', obj: it };
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
  if (hit.kind === 'heart_pick') {
    hit.obj.taken = true;
    AudioSys.playPickup();
    gainHeart(1);
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
    showToast('📦 Aldın! Şimdi Altın Kürsüye götür!');
  } else if (hit.kind === 'deliver') {
    Game.carrying = null;
    const qs = pullChapterQuestions(ch, 2, ch.num >= 9);
    QuizUI.start(qs, `${ch.subject} · ${ch.topic}`, () => advanceChapterProgress(), null, ch.subjectKey);
  } else if (hit.kind === 'quest_npc') {
    const npc = hit.obj;
    AudioSys.playCharSignature(npc.id);
    if (ch.mode === 'crow_chase') {
      const spots = [[560, 740], [1780, 740], [640, 1340], [1720, 1340], [1200, 1180]];
      const nx = spots[(Game.chProgress + 1) % spots.length];
      npc.x = nx[0]; npc.y = nx[1];
    }
    const qs = pullChapterQuestions(ch, 2, false);
    QuizUI.start(qs, `${ch.subject} · ${ch.topic}`, () => advanceChapterProgress(), null, ch.subjectKey);
  } else if (hit.kind === 'talk') {
    DialogUI.open([[hit.obj.id, hit.obj.line || 'Merhaba Komiser Rakun!']], hit.obj);
  }
}

/* ---- ACT I GÜNCELLEMESİ ---- */
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
  const paused = Game.dialogOpen || Game.quizOpen || Game.gameOverOpen || Game.mode !== 'play';

  for (let i = Game.confetti.length - 1; i >= 0; i--) {
    const cf = Game.confetti[i];
    cf.life -= dt;
    cf.x += cf.vx * dt;
    cf.y += cf.vy * dt;
    cf.vy += 680 * dt;
    cf.rot += cf.vr * dt;
    if (cf.life <= 0) Game.confetti.splice(i, 1);
  }

  for (const npc of Game.npcs) {
    if (npc.id === 'ejderha' && Math.random() < dt * 5) {
      Game.particles.push({
        x: npc.x + Math.sin(npc.yaw || 0) * 18,
        y: npc.y + Math.cos(npc.yaw || 0) * 18,
        zH: 52,
        vx: (Math.random() - 0.5) * 18,
        vy: (Math.random() - 0.5) * 18,
        vzH: 28 + Math.random() * 18,
        s: 0.7, alpha: 0.85, flame: Math.random() < 0.28, life: 0.85
      });
    }
  }
  for (let i = Game.particles.length - 1; i >= 0; i--) {
    const pt = Game.particles[i];
    pt.life -= dt;
    pt.x += pt.vx * dt; pt.y += pt.vy * dt; pt.zH += pt.vzH * dt;
    pt.s += dt * 0.9; pt.alpha = Math.max(0, pt.life);
    if (pt.life <= 0) Game.particles.splice(i, 1);
  }

  if (paused) return;

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

    S.kx = 1280 + Math.cos(Game.time * 0.65) * 420;
    S.ky = 760 + Math.sin(Game.time * 0.85) * 260;
    S.kyaw = Math.atan2(S.bx - S.kx, S.by - S.ky);

    if (S.crate && Math.hypot(S.crate.x - S.bx, S.crate.y - S.by) < 76) {
      S.crate = null;
      AudioSys.playPickup();
      const qs = pullChapterQuestions(Game.chapter, 2, false);
      QuizUI.start(qs, 'DENİZ MATEMATİK SANDIĞI', () => {
        S.loaded = true;
        showToast('🎯 Konfeti-Su Topu Dolu! Ekranda Sürükle veya Ateş Tuşuna Bas!');
      }, () => spawnSeaCrate(), Game.chapter.subjectKey);
    }

    S.shootTimer -= dt;
    if (S.shootTimer <= 0) {
      S.shootTimer = 2.8;
      S.balls.push({
        x: S.kx, y: S.ky, zH: 20,
        sx: S.kx, sy: S.ky, tx: S.bx, ty: S.by,
        t: 0, dur: 1.4, enemy: true
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
          if (Math.hypot(b.x - S.kx, b.y - S.ky) < 118) {
            showToast('💥 TAM İSABET! Kurnaz Karga\'nın salı vuruldu!');
            advanceChapterProgress();
          } else {
            showToast('🌊 Az farkla ıska! Yeni soru sandığını al!');
            spawnSeaCrate();
          }
        } else if (Math.hypot(b.x - S.bx, b.y - S.by) < 68) {
          loseHeart('Karga\'nın su topuna çarptın!');
        }
        S.balls.splice(i, 1);
      }
    }
    const seaHit = nearestInteractable();
    const seaIb = document.getElementById('interactBtn');
    if (seaHit) { seaIb.textContent = seaHit.label; seaIb.classList.remove('hidden'); }
    else seaIb.classList.add('hidden');
    return;
  }

  const p = Game.player;
  if (p.stun > 0) p.stun -= dt;
  let vx = Input.dx, vy = Input.dy;
  if (vx === 0 && vy === 0 && p.targetX != null) {
    const dx = p.targetX - p.x, dy = p.targetY - p.y;
    const dist = Math.hypot(dx, dy);
    if (dist > 14) { vx = dx / dist; vy = dy / dist; }
    else { p.targetX = null; p.targetY = null; }
  }

  const walkSpd = p.stun > 0 ? 115 : 260;
  if (Math.hypot(vx, vy) > 0.05) {
    const nx = clamp(p.x + vx * walkSpd * dt, 180, 2220);
    const ny = clamp(p.y + vy * walkSpd * dt, 220, 1580);
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

  if (ch.mode === 'boss_trex' || ch.mode === 'boss_palyaco') {
    Game.spawnTimer -= dt;
    if (Game.spawnTimer <= 0) {
      Game.spawnTimer = ch.mode === 'boss_palyaco' ? 1.65 : 2.2;
      const boss = Game.npcs.find(n => n.isBoss);
      if (boss) {
        const ang = Math.atan2(p.x - boss.x, p.y - boss.y) + (Math.random() - 0.5) * 0.45;
        Game.hazards.push({
          x: boss.x, y: boss.y, h: 18,
          vx: Math.sin(ang) * 225, vy: Math.cos(ang) * 225,
          mesh: ch.mode === 'boss_palyaco' ? 'clownBomb' : 'barrel',
          life: 4.5
        });
      }
    }
  }

  if (ch.mode === 'boss_godzilla') {
    Game.stompTimer -= dt;
    if (Game.stompTimer <= 0) {
      Game.stompTimer = 2.5;
      Game.shake = 0.6;
      AudioSys.playStomp(1.0);
      const gz = Game.npcs.find(n => n.id === 'godzilla');
      if (gz) Game.hazards.push({ x: gz.x, y: gz.y, r: 28, ring: true, life: 2.4 });
    }
  }

  for (let i = Game.hazards.length - 1; i >= 0; i--) {
    const hz = Game.hazards[i];
    hz.life -= dt;
    if (hz.ring) {
      hz.r += dt * 205;
      const d = Math.hypot(p.x - hz.x, p.y - hz.y);
      if (Math.abs(d - hz.r) < 20 && p.stun <= 0) {
        p.stun = 1.2;
        loseHeart('Mavi şok halkasına çarptın!');
      }
    } else {
      hz.x += hz.vx * dt;
      hz.y += hz.vy * dt;
      hz.h = 14 + Math.abs(Math.sin(Game.time * 8 + i)) * 16;
      if (Math.hypot(p.x - hz.x, p.y - hz.y) < 34 && p.stun <= 0) {
        p.stun = 1.2;
        hz.life = 0;
        loseHeart('Boss engeline çarptın!');
      }
    }
    if (hz.life <= 0) Game.hazards.splice(i, 1);
  }

  for (const it of Game.items) {
    if (it.arenaItem && !it.taken && Math.hypot(it.x - p.x, it.y - p.y) < 62) {
      it.taken = true;
      AudioSys.playPickup();
      const qs = pullChapterQuestions(ch, 2, ch.num >= 7);
      QuizUI.start(qs, `${ch.subject} · ${ch.topic}`, () => advanceChapterProgress(), null, ch.subjectKey);
      break;
    }
  }

  if (ch.mode === 'pad_arena' && Game.pads.length) {
    for (const pad of Game.pads) {
      if (pad.cooldown > 0) { pad.cooldown -= dt; continue; }
      if (Math.hypot(pad.x - p.x, pad.y - p.y) < 52) {
        if (pad.ok) {
          pad.tint = '#45e06f';
          Game.combo++;
          showToast('✅ Doğru Bulut! Harikasın!');
          advanceChapterProgress();
        } else {
          pad.cooldown = 1.8;
          pad.tint = '#ff4d5e';
          p.y += 72;
          loseHeart(`Yanlış bulut! İpucu: ${Game.padQuestion?.exp || ''}`);
        }
        break;
      }
    }
  }

  const hit = nearestInteractable();
  const ib = document.getElementById('interactBtn');
  if (hit) { ib.textContent = hit.label; ib.classList.remove('hidden'); }
  else ib.classList.add('hidden');
}

/* ---- CEPHANE ATÖLYESİ (SEVİYE YÜKSELTME Lv.1→5 + PARA ÜSTÜ İNDİRİMİ + PETLER!) ---- */
function renderArsenalModal() {
  document.getElementById('arsenalCoins').textContent = Save.coins || 0;
  const stEl = document.getElementById('arsenalStars');
  if (stEl) stEl.textContent = getTotalStars();

  const wrap = document.getElementById('arsenalContainer');
  wrap.innerHTML = '';

  // Real Change-Making Math Discount Banner!
  const discBanner = document.createElement('div');
  discBanner.style.cssText = 'background:#e8f8ee;border:3px solid #219142;border-radius:16px;padding:10px 14px;margin-top:8px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px';
  discBanner.innerHTML = Game.shopDiscount < 1
    ? `<span style="font-weight:900;color:#14532d">🎉 %25 Kasiyer Vudi Matematik İndirimi Aktif! Tüm fiyatlar indirimli!</span>`
    : `<span style="font-weight:800;color:#14532d">🧮 <strong>Para Üstü Hesapla, %25 Mağaza İndirimi Kazan!</strong> Alışveriş matematiğini çözerek tüm eşyaları ucuza al!</span>`;
  if (Game.shopDiscount >= 1) {
    const dBtn = document.createElement('button');
    dBtn.type = 'button';
    dBtn.className = 'btn btn-green btn-sm';
    dBtn.textContent = '🪙 Para Üstü Sorusu Çöz (%25 İndirim)';
    dBtn.addEventListener('click', () => {
      document.getElementById('arsenalModal').classList.add('hidden');
      const changeQs = [
        { q: '🪙 Kasiyer Vudi Sorusu: 65 🪙 tutan bir kılıç için 100 🪙 verdin. Vudi sana kaç altın PARA ÜSTÜ vermelidir?', v: '💰 100 - 65 = ?', opts: ['35 altın', '45 altın', '25 altın'], ans: 0, exp: '100 - 65 = 35 altın para üstü!' }
      ];
      QuizUI.start(changeQs, '🪙 MAĞAZA PARA ÜSTÜ MATEMATİĞİ', () => {
        Game.shopDiscount = 0.75;
        showBanner('🎉 %25 MAĞAZA İNDİRİMİ KAZANDIN!');
        renderArsenalModal();
        document.getElementById('arsenalModal').classList.remove('hidden');
      }, null, 'matematik');
    });
    discBanner.appendChild(dBtn);
  }
  wrap.appendChild(discBanner);

  const categories = [
    ['suits', '🤖 3D Astro Kahraman & Dönüşüm Kostümleri', false],
    ['weapons', '⚔️ 3D Kılıçlar & Çekiçler (Lv.1 → Lv.5 Yükseltilebilir!)', true],
    ['gloves', '🧤 Astro Eldiven Güçleri (🐸 Güç Tuşu)', false],
    ['gadgets', '🚀 Hover-Lazer Jet-Pack & Kalkanlar', false],
    ['armors', '👑 Zırhlar, Miğferler & Taçlar (Lv.1 → Lv.5 Kalp Artışı!)', true],
    ['pets', '🐦 3D Yardımcı Evcil Dostlar & Uzay Kanat Uçakları (Pet)', false],
    ['ships', '✈️ Galaksi Savaşı 3D Uzay Uçakları', false]
  ];

  const totalStars = getTotalStars();

  for (const [catKey, catTitle, upgradable] of categories) {
    if (!ARSENAL[catKey]) continue;
    const sec = document.createElement('div');
    sec.className = 'arsenal-section';
    sec.innerHTML = `<h3>${catTitle}</h3>`;
    const grid = document.createElement('div');
    grid.className = 'arsenal-grid';

    if (!Save.ownedArsenal[catKey]) Save.ownedArsenal[catKey] = [];

    for (const item of ARSENAL[catKey]) {
      const owned = Save.ownedArsenal[catKey].includes(item.id) || item.cost === 0;
      const eq = Save.equipped[catKey] === item.id;
      const lv = (Save.upgrades && Save.upgrades[item.id]) || 1;
      const starLocked = (item.starReq || 0) > totalStars && !owned;
      const finalCost = Math.max(5, Math.round(item.cost * Game.shopDiscount));

      const card = document.createElement('div');
      card.className = 'gear-card' + (eq ? ' equipped' : '');
      card.innerHTML = `
        <div>
          <div style="font-weight:900;font-size:15.5px">${item.icon} ${item.name} ${upgradable && owned ? `<span style="color:#d97706">[Lv.${lv}]</span>` : ''}</div>
          <div style="font-size:12.5px;color:#4a4366;font-weight:700;margin-top:3px">${item.desc}</div>
        </div>
      `;

      const btnRow = document.createElement('div');
      btnRow.style.cssText = 'display:flex;gap:6px;flex-wrap:wrap';

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-sm ' + (starLocked ? 'btn-cream' : eq ? 'btn-green' : owned ? 'btn-sky' : 'btn-orange');
      btn.disabled = starLocked;
      btn.textContent = starLocked
        ? `🔒 ${item.starReq}⭐ Gerekli`
        : eq ? '✔ Kuşanıldı' : owned ? 'Kuşan' : `Al (${finalCost} 🪙)`;

      btn.addEventListener('click', async () => {
        if (!owned) {
          if ((Save.coins || 0) < finalCost) {
            AudioSys.playWrong();
            showToast('🪙 Yeterli altının yok! Görev veya Antrenman çözerek altın kazan!');
            return;
          }
          Save.coins -= finalCost;
          Save.ownedArsenal[catKey].push(item.id);
          AudioSys.playFanfare();
        } else {
          AudioSys.playPickup();
        }
        Save.equipped[catKey] = item.id;
        Game.maxHp = computeMaxHp();
        Game.hp = Game.maxHp;
        persistSave();
        refreshHud();
        renderArsenalModal();
        await syncLiveAstroEquipment(catKey);
      });
      btnRow.appendChild(btn);

      if (upgradable && owned && lv < 5) {
        const upgCost = Math.round((30 + lv * 20) * Game.shopDiscount);
        const uBtn = document.createElement('button');
        uBtn.type = 'button';
        uBtn.className = 'btn btn-purple btn-sm';
        uBtn.textContent = `⬆️ Lv.${lv + 1} (${upgCost}🪙)`;
        uBtn.addEventListener('click', async () => {
          if ((Save.coins || 0) < upgCost) {
            AudioSys.playWrong();
            showToast('🪙 Yükseltme için yeterli altın yok!');
            return;
          }
          Save.coins -= upgCost;
          if (!Save.upgrades) Save.upgrades = {};
          Save.upgrades[item.id] = lv + 1;
          Game.maxHp = computeMaxHp();
          Game.hp = Game.maxHp;
          AudioSys.playFanfare();
          showToast(`⚡ ${item.name} Seviye ${lv + 1} oldu!`);
          persistSave();
          refreshHud();
          renderArsenalModal();
          await syncLiveAstroEquipment(catKey);
        });
        btnRow.appendChild(uBtn);
      }

      card.appendChild(btnRow);
      grid.appendChild(card);
    }
    sec.appendChild(grid);
    wrap.appendChild(sec);
  }
}

async function syncLiveAstroEquipment(catKey) {
  if (Game.astroActive && AstroEngine.active) {
    const eqStats = AstroEngine.getEquippedStats(Save);
    AstroEngine.maxHp = Game.maxHp;
    AstroEngine.hp = Game.hp;
    if (catKey === 'suits' && AstroEngine.mode !== 'starfighter') {
      if (AstroEngine.mode === 'hub') await openHubWorld3D();
      else await startChapterByNum(Game.chapter.num, true);
    } else {
      await AstroEngine.attachEquipmentToHero(eqStats);
      AstroEngine.refreshAstroHud();
    }
  }
}

/* ---- HARİTA, VELİ KARNESİ & BİLİM ANSİKLOPEDİSİ ---- */
function renderAtlasModal() {
  const grid = document.getElementById('chapterGrid');
  grid.innerHTML = '';
  const totalStars = getTotalStars();

  for (const ch of ALL_CHAPTERS()) {
    const starLocked = (ch.starReq || 0) > totalStars && !(Save.unlockedUpTo >= ch.num);
    const unlocked = !starLocked && (ch.num <= Math.max(Save.unlockedUpTo || 1, 1) || ch.num === 13);
    const chStars = (Save.chapterStars && Save.chapterStars[ch.num]) || 0;
    const starDisp = chStars > 0 ? '⭐'.repeat(chStars) + '☆'.repeat(3 - chStars) + ' ' : '';

    const card = document.createElement('div');
    card.className = 'chapter-card' + (!unlocked ? ' locked' : '') + (Game.chapter?.num === ch.num ? ' active-ch' : '');
    card.innerHTML = `
      <div>
        <span class="ch-subj" style="background:${ch.subjectColor}">${ch.num >= 13 ? '🚀 ' : '🕵️ '}${ch.subject}</span>
        <div style="font-weight:900;font-size:15px;margin-top:5px">${starDisp}${ch.title}</div>
        <div style="font-size:12px;color:#4a4366;font-weight:700;margin-top:3px">${ch.topic}</div>
      </div>
    `;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-sm ' + (unlocked ? (ch.num >= 13 ? 'btn-purple' : 'btn-green') : 'btn-cream');
    btn.textContent = starLocked ? `🔒 ${ch.starReq}⭐ Gerekli` : unlocked ? (chStars ? '🔄 Tekrar Oyna' : '▶ Oyna') : '🔒 Kilitli';
    btn.disabled = !unlocked;
    btn.addEventListener('click', () => {
      document.getElementById('atlasModal').classList.add('hidden');
      startChapterByNum(ch.num);
    });
    card.appendChild(btn);
    grid.appendChild(card);
  }
}

function renderReportModal() {
  const box = document.getElementById('reportContainer');
  box.innerHTML = '';

  const subjects = [
    ['turkce', '📖 Türkçe (Hece, Eş/Zıt Anlam, 5N1K, Noktalama)'],
    ['matematik', '🔢 Matematik (Sayılar, Çarpma, Kesir, Saat & Para)'],
    ['hayat', '🌱 Hayat Bilgisi & Uzay/Doğa Bilimi'],
    ['ingilizce', '🌍 İngilizce (Kelimeler, Renkler, Can/Can\'t)'],
    ['bilsem', '🧠 BİLSEM Görsel Zeka & Robot Kodlama']
  ];

  const summary = document.createElement('div');
  summary.style.cssText = 'background:#eef7ff;border:3px solid #1e3566;border-radius:16px;padding:12px;margin-bottom:12px;font-weight:800';
  summary.innerHTML = `
    ⭐ Toplam Yıldız: <strong>${getTotalStars()}</strong> ·
    ✅ Toplam Doğru: <strong>${Save.totalCorrect || 0}</strong> ·
    🤖 Kurtarılan 3D Dost: <strong>${(Save.rescuedBots || []).length}</strong> ·
    🏆 Sürpriz Kapsül Heykeli: <strong>${(Save.gachaOwned || []).length}/${GACHA_CAPSULES.length}</strong>
  `;
  box.appendChild(summary);

  for (const [key, label] of subjects) {
    const st = (Save.subjectStats && Save.subjectStats[key]) || { right: 0, wrong: 0 };
    const tot = st.right + st.wrong;
    const pct = tot > 0 ? Math.round((st.right / tot) * 100) : 100;
    const status = tot === 0 ? 'Henüz soru çözülmedi' : pct >= 85 ? '🌟 Çok Başarılı!' : pct >= 65 ? '👍 İyi Gidiyor' : '🔄 Adaptif Öğretmen Pekiştiriyor';
    const row = document.createElement('div');
    row.className = 'report-row';
    row.innerHTML = `
      <div style="display:flex;justify-content:space-between;font-weight:900;font-size:14.5px">
        <span>${label}</span>
        <span>%${pct} (${st.right} Doğru / ${st.wrong} İpucu) — ${status}</span>
      </div>
      <div class="report-bar-bg"><div class="report-bar-fill" style="width:${pct}%"></div></div>
    `;
    box.appendChild(row);
  }

  // Science & Animal Encyclopedia Section!
  const sciTitle = document.createElement('h3');
  sciTitle.style.cssText = 'color:#1e3566;margin:14px 0 8px';
  sciTitle.textContent = '🔬 Galaksi Bilim & Doğa Ansiklopedisi (Kurtarılan 3D Dost Kartları)';
  box.appendChild(sciTitle);

  const sciGrid = document.createElement('div');
  sciGrid.className = 'chapter-grid';
  for (const [fileKey, card] of Object.entries(SCIENCE_CARDS)) {
    const unlocked = (Save.scienceUnlocked || []).includes(fileKey) || (Save.rescuedBots || []).some(k => k.endsWith(fileKey));
    const el = document.createElement('div');
    el.className = 'chapter-card' + (unlocked ? '' : ' locked');
    el.innerHTML = `
      <div>
        <div style="font-weight:900;font-size:15px">${card.title}</div>
        <div style="font-size:12.5px;font-weight:700;color:#352f4d;margin-top:4px">${unlocked ? card.fact : '🔒 Gezegenlerde bu 3D dostu kurtardığında sesli bilim kartı açılır!'}</div>
      </div>
    `;
    if (unlocked) {
      const sb = document.createElement('button');
      sb.type = 'button';
      sb.className = 'btn btn-sky btn-sm';
      sb.textContent = '🔊 Sesli Dinle';
      sb.addEventListener('click', () => AudioSys.speakLine('vudi', card.fact));
      el.appendChild(sb);
    }
    sciGrid.appendChild(el);
  }
  box.appendChild(sciGrid);
}

function renderWardrobeGrid() {
  const g = document.getElementById('wardrobeGrid');
  g.innerHTML = '';
  for (const it of WARDROBE_ITEMS) {
    const owned = Save.ownedWardrobe.includes(it.id) || it.cost === 0;
    const active = Save.wardrobe[it.slot] === it.id;
    const b = document.createElement('button');
    b.type = 'button';
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
    `Dedektif: ${Save.playerName} · Yıldız: ${getTotalStars()}⭐ · Doğru: ${Save.totalCorrect}`;
}

function openCertificateModal() {
  R2D.renderCertificate(document.getElementById('certCanvas'), Save);
  document.getElementById('certModal').classList.remove('hidden');
}

function syncSettingButtons() {
  const touchOn = Save.settings.touch !== false;
  const gfx = Save.settings.gfx || 'fast';
  const sp = Save.settings.speechSpeed || 'slow';
  const tier = Save.settings.tier || 'grade2';

  AudioSys.speechSpeed = sp;
  ThreeShared.applyGfxMode(gfx);

  const gfxLabels = { fast: '⚡ Grafik: Akıcı 60FPS', hd: '✨ Grafik: HD', ultra: '💎 Grafik: Ultra' };
  const spTxt = sp === 'slow' ? '🐢 Okuma: Yavaş' : '🐇 Okuma: Normal';
  const tierLabels = { grade2: '🎓 Seviye: 2. Sınıf', bilsem: '🧠 Seviye: BİLSEM Zeka', grade3: '🚀 Seviye: 3. Sınıf Hazırlık' };
  const tTxt = touchOn ? '📱 Tablet Tuşları: Açık' : '📱 Tablet Tuşları: Kapalı';
  const vTxt = R3D.on && R3D.ok ? '🧊 Görünüm: 3D' : '🎨 Görünüm: 2D';
  const sTxt = AudioSys.soundOn ? '🔊 Ses: Açık' : '🔇 Ses: Kapalı';
  const mTxt = AudioSys.musicOn ? '🎵 Müzik: Açık' : '🔕 Müzik: Kapalı';

  const setTxt = (id, txt) => { const el = document.getElementById(id); if (el) el.textContent = txt; };
  setTxt('btnToggleGfxTitle', gfxLabels[gfx] || gfxLabels.fast);
  setTxt('btnMenuGfx', gfxLabels[gfx] || gfxLabels.fast);
  setTxt('btnToggleSpeechTitle', spTxt);
  setTxt('btnMenuSpeech', spTxt);
  setTxt('btnToggleSpeechSpeedDialog', sp === 'slow' ? '🐢 Hız: Yavaş' : '🐇 Hız: Normal');
  setTxt('btnMenuTier', tierLabels[tier] || tierLabels.grade2);
  setTxt('btnToggleTouchTitle', tTxt);
  setTxt('btnMenuTouch', tTxt);
  setTxt('btnToggleViewTitle', vTxt);
  setTxt('btnMenuView', vTxt);
  setTxt('btnToggleSoundTitle', sTxt);
  setTxt('btnMenuSound', sTxt);
  setTxt('btnToggleMusicTitle', mTxt);
  setTxt('btnMenuMusic', mTxt);

  document.body.classList.toggle('show-touch', touchOn);
  document.body.classList.toggle('mode-2d', !(R3D.on && R3D.ok));
}

/* ---- BAŞLANGIÇ BAĞLANTILARI VE ANA ANİMASYON DÖNGÜSÜ ---- */
function wireUI() {
  if (Save.started) document.getElementById('btnContinue').classList.remove('hidden');

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
    if (!Save.started) { Save.started = true; persistSave(); }
    startChapterByNum(13);
  });

  let pendingStartChapter = 1;
  function openSetupModal(chNum) {
    pendingStartChapter = chNum;
    document.getElementById('playerNameInput').value = Save.playerName || 'Cesur Dedektif';

    const tw = document.getElementById('tierSwatches');
    if (tw) {
      tw.innerHTML = '';
      [['grade2', '🌱 2. Sınıf Müfredatı'], ['bilsem', '🧠 BİLSEM & Robot Kodlama'], ['grade3', '🚀 3. Sınıfa Hazırlık']].forEach(([tid, lbl]) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'acc-btn' + ((Save.settings.tier || 'grade2') === tid ? ' selected' : '');
        b.textContent = lbl;
        b.addEventListener('click', () => {
          Save.settings.tier = tid;
          syncSettingButtons();
          openSetupModal(pendingStartChapter);
        });
        tw.appendChild(b);
      });
    }

    const sw = document.getElementById('coatSwatches');
    sw.innerHTML = '';
    COAT_SWATCHES.forEach((c) => {
      const b = document.createElement('button');
      b.type = 'button';
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
      b.type = 'button';
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
      ['palyaco', 'Muahahaha! Ben Doktor Palyaço, kırmızı burnuma dikkat edin!'],
      ['trex', 'RÖÖÖAAR! Ben Şapşal T-Rex, kollarım kısa ama kalbim kocaman!'],
      ['ejderha', 'Pufff! Ben Komik Ejderha, burnumdan duman halkaları çıkar!'],
      ['godzilla', 'BÜÜÜM! Ben Şehir Devi Godzilla! Adım attıkça yer sarsılır!'],
      ['kurt', 'Auuuu! Ben Kurnaz Kurt, hızıma kimse yetişemez!'],
      ['karga', 'Gaaak! Mor berem ve kırmızı atkımla parlak rozetleri severim!']
    ];
    const [cid, txt] = samples[testVoiceIdx % samples.length];
    testVoiceIdx++;
    AudioSys.speakLine(cid, txt);
    showToast(`${CHARACTERS[cid].badge}: "${txt}"`);
  });

  const cycleGfx = () => {
    const order = ['fast', 'hd', 'ultra'];
    Save.settings.gfx = order[(order.indexOf(Save.settings.gfx || 'fast') + 1) % order.length];
    persistSave();
    syncSettingButtons();
    showToast(Save.settings.gfx === 'fast' ? '⚡ iPad Akıcı 60 FPS Modu Aktif!' : Save.settings.gfx === 'hd' ? '✨ HD Dengeli Grafik Modu Aktif!' : '💎 Ultra Grafik Modu Aktif!');
  };
  const toggleSpeechSpeed = () => {
    Save.settings.speechSpeed = (Save.settings.speechSpeed || 'slow') === 'slow' ? 'normal' : 'slow';
    persistSave();
    syncSettingButtons();
    if (Game.dialogOpen) DialogUI.replay();
  };
  const cycleTier = () => {
    const order = ['grade2', 'bilsem', 'grade3'];
    Save.settings.tier = order[(order.indexOf(Save.settings.tier || 'grade2') + 1) % order.length];
    persistSave();
    syncSettingButtons();
  };
  const toggleTouch = () => {
    Save.settings.touch = !(Save.settings.touch !== false);
    persistSave();
    syncSettingButtons();
  };
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
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.().catch(() => {});
    else document.exitFullscreen?.().catch(() => {});
  };

  document.getElementById('btnToggleGfxTitle')?.addEventListener('click', cycleGfx);
  document.getElementById('btnMenuGfx')?.addEventListener('click', cycleGfx);
  document.getElementById('btnToggleSpeechTitle')?.addEventListener('click', toggleSpeechSpeed);
  document.getElementById('btnMenuSpeech')?.addEventListener('click', toggleSpeechSpeed);
  document.getElementById('btnToggleSpeechSpeedDialog')?.addEventListener('click', toggleSpeechSpeed);
  document.getElementById('btnMenuTier')?.addEventListener('click', cycleTier);
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
      ? `🔊 Cihazda ${trCount} adet Türkçe ses bulundu · iPad Öğretmen Hızı (${Save.settings.speechSpeed === 'slow' ? 'Yavaş' : 'Normal'}) aktif!`
      : `🔊 Karakter özel ses efektleri ve kelime kelime karaoke okuma aktif!`;
    document.getElementById('infoModal').classList.remove('hidden');
  });
  document.getElementById('btnCloseInfo').addEventListener('click', () => document.getElementById('infoModal').classList.add('hidden'));

  const openReport = () => {
    document.getElementById('infoModal').classList.add('hidden');
    document.getElementById('menuModal').classList.add('hidden');
    document.getElementById('atlasModal').classList.add('hidden');
    renderReportModal();
    document.getElementById('reportModal').classList.remove('hidden');
  };
  document.getElementById('btnInfoOpenReport')?.addEventListener('click', openReport);
  document.getElementById('btnMenuReport')?.addEventListener('click', openReport);
  document.getElementById('btnReportOpenAtlas')?.addEventListener('click', openReport);
  document.getElementById('btnHubMuseum')?.addEventListener('click', openReport);
  document.getElementById('btnCloseReport')?.addEventListener('click', () => document.getElementById('reportModal').classList.add('hidden'));

  document.getElementById('btnHubGacha')?.addEventListener('click', () => rollHubGacha());

  // Game Over Modal Actions (Retry Checkpoint vs First-Aid Donut Revive!)
  document.getElementById('btnGameOverRetry')?.addEventListener('click', () => {
    document.getElementById('gameOverModal').classList.add('hidden');
    Game.gameOverOpen = false;
    if (Game.quizOpen) QuizUI.cancel();
    Game.maxHp = computeMaxHp();
    Game.hp = Game.maxHp;
    if (Game.astroActive && AstroEngine.active) {
      AstroEngine.respawnAtCheckpoint(Game.maxHp);
      showToast('🔄 Son kontrol noktasından tekrar başladın!');
    } else {
      startChapterByNum(Game.chapter.num, true);
      showToast('🔄 Bölüm başından kalplerin yenilenerek başladın!');
    }
    refreshHud();
  });

  document.getElementById('btnGameOverRevive')?.addEventListener('click', () => {
    if ((Save.coins || 0) < 25) {
      AudioSys.playWrong();
      showToast('🪙 İlk Yardım Çöreği için 25 🪙 gerekli! Kontrol noktasından tekrar dene!');
      return;
    }
    Save.coins -= 25;
    persistSave();
    document.getElementById('gameOverModal').classList.add('hidden');
    Game.gameOverOpen = false;
    Game.maxHp = computeMaxHp();
    Game.hp = Game.maxHp;
    if (AstroEngine.active) {
      AstroEngine.hp = Game.maxHp;
      AstroEngine.invuln = 2.0;
      AstroEngine.refreshAstroHud();
    }
    AudioSys.playFanfare();
    showToast('🍩 İlk Yardım Çöreği Yendi! Kalplerin Tamamlandı!');
    refreshHud();
  });

  document.getElementById('btnBuyHeartPack')?.addEventListener('click', () => {
    if (Game.hp >= Game.maxHp) { showToast('❤️ Kalplerin zaten tamamen dolu!'); return; }
    if ((Save.coins || 0) < 20) { AudioSys.playWrong(); showToast('🪙 20 🪙 gerekli!'); return; }
    Save.coins -= 20;
    Game.hp = Game.maxHp;
    if (AstroEngine.active) { AstroEngine.hp = Game.maxHp; AstroEngine.refreshAstroHud(); }
    persistSave();
    AudioSys.playSuccess();
    renderArsenalModal();
    refreshHud();
    showToast('🍩 Tüm kalplerin yenilendi!');
  });

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
    Save.unlockedUpTo = 21;
    for (let i = 1; i <= 20; i++) {
      if (!Save.chapterStars[i]) Save.chapterStars[i] = 1;
    }
    Save.coins = (Save.coins || 0) + 500;
    persistSave();
    AudioSys.playFanfare();
    showToast('🔓 Gizli Bölüm 21 dahil tüm bölümler açıldı ve +500 🪙 eklendi!');
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
      if (subj === 'bilsem') {
        pool = INTERACTIVE_PUZZLES.bilsem.slice();
      } else if (subj === 'karma') {
        Object.values(INTERACTIVE_PUZZLES).forEach(arr => { pool = pool.concat(arr); });
        Object.values(EXTRA_QUESTION_BANK).forEach(arr => { pool = pool.concat(arr.slice(0, 4)); });
      } else {
        pool = (INTERACTIVE_PUZZLES[subj] || []).concat(EXTRA_QUESTION_BANK[subj] || []);
      }
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const t = pool[i]; pool[i] = pool[j]; pool[j] = t;
      }
      const count = subj === 'karma' ? 6 : 4;
      QuizUI.start(pool.slice(0, count), `🎯 İNTERAKTİF ANTRENMAN · ${subj.toUpperCase()}`, () => {
        const bonus = subj === 'karma' ? 50 : subj === 'bilsem' ? 35 : 25;
        addCoins(bonus);
        AudioSys.playFanfare();
        showBanner(`🏆 Antrenman Tamamlandı! +${bonus} 🪙`);
      }, null, subj);
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
  AudioSys.speechSpeed = Save.settings.speechSpeed || 'slow';
  if (Save.settings.touch === undefined) Save.settings.touch = true;
  if (!Save.settings.gfx) Save.settings.gfx = detectDefaultGfx();
  ThreeShared.gfxMode = Save.settings.gfx;

  Game.maxHp = computeMaxHp();
  Game.hp = Game.maxHp;

  R3D.init(document.getElementById('glCanvas')).then(() => {
    if (Save.settings.view === '2d') R3D.on = false;
    syncSettingButtons();
  }).catch((e) => console.error('R3D init error:', e));

  Input.init();
  wireUI();
  syncSettingButtons();
  refreshHud();

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

      const anyModalOpen = Game.dialogOpen || Game.quizOpen || Game.gameOverOpen ||
        !document.getElementById('arsenalModal').classList.contains('hidden') ||
        !document.getElementById('atlasModal').classList.contains('hidden') ||
        !document.getElementById('menuModal').classList.contains('hidden') ||
        !document.getElementById('reportModal').classList.contains('hidden') ||
        !document.getElementById('practiceModal').classList.contains('hidden');

      if (Game.astroActive) {
        AstroEngine.update(dt, Input, anyModalOpen);
        for (let i = Game.confetti.length - 1; i >= 0; i--) {
          const cf = Game.confetti[i];
          cf.life -= dt; cf.x += cf.vx * dt; cf.y += cf.vy * dt; cf.vy += 680 * dt; cf.rot += cf.vr * dt;
          if (cf.life <= 0) Game.confetti.splice(i, 1);
        }
        R2D.renderOverlayAnd2D(document.getElementById('cv2d'), Game);
      } else {
        updateAct1(dt);
        if (R3D.ok && R3D.on) R3D.renderScene(Game, dt);
        R2D.renderOverlayAnd2D(document.getElementById('cv2d'), Game);
      }

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

  window.KR_GAME = {
    Game, Save, AudioSys, ThreeShared, R3D, R2D, AstroEngine, DialogUI, QuizUI, AdaptiveTeacher,
    startChapterByNum, openHubWorld3D, completeCurrentChapter, loseHeart, gainHeart, rollHubGacha
  };
}

window.addEventListener('DOMContentLoaded', bootGame);
