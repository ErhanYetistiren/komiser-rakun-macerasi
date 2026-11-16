/* ============================================================================
   08-ASTRO3D-ENGINE.JS — GERÇEK .GLB 3D MODELLERLE TAM ASTRO-BOT GALAKSİ MOTORU
   Dual-Speeder Uçak İnişi, Hover-Lazer Çizmeler, Yaylı/Balon/Buz/Plazma Eldivenler,
   Kılıç/Çekiç Komboları, 3D Sandıklar & Testereler, Şok Dalgalı Bosslar,
   3D Uzay Uçağı Savaşı ve Kurtarılan Dostlar Üssü (Hub Gezegeni)!
   ============================================================================ */

const AstroEngine = {
  ready: false,
  loading: false,
  active: false,
  sceneReady: false,
  loadToken: 0,
  THREE: null,
  renderer: null,
  scene: null,
  camera: null,
  chapter: null,
  mode: 'platformer', // 'platformer' | 'starfighter' | 'hub'

  hero: null,
  introShip: null,
  flyInTimer: 0,
  weaponPivot: null,
  springLine: null,
  laserLeft: null,
  laserRight: null,
  slashRing: null,
  dropShadow: null,
  balloonMesh: null,
  balloonTimer: 0,

  px: 0, py: 2, pz: 0,
  vx: 0, vy: 0, vz: 0,
  yaw: 0,
  grounded: false,
  coyote: 0,
  jumpsLeft: 2,
  hoverFuel: 1.5,
  hovering: false,
  dashCd: 0,
  dashTimer: 0,
  atkCd: 0,
  atkAnim: 0,
  gadgetCd: 0,
  invuln: 0,
  hp: 4,
  maxHp: 4,
  checkpoint: { x: 0, y: 2, z: 0 },

  platforms: [],
  bouncers: [],
  coins: [],
  chests: [],
  saws: [],
  cages: [],
  hubFriends: [],
  paradeMode: false,
  enemies: [],
  asteroids: [],
  boostRings: [],
  boostTimer: 0,
  shockRings: [],
  projectiles: [],
  particles: [],
  springBeam: null,
  springTarget: null,
  gloveProto: null,
  gate: null,
  boss: null,
  rescuedCount: 0,
  killsCount: 0,
  camShake: 0,

  async ensureThree() {
    if (this.ready) return true;
    const ok = await ThreeShared.ensure();
    if (!ok) return false;
    try {
      const THREE = ThreeShared.THREE;
      this.THREE = THREE;
      const cv = document.getElementById('astroCanvas');
      const renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: true, powerPreference: 'high-performance' });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.08;
      this.renderer = renderer;

      this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.2, 460);
      window.addEventListener('resize', () => {
        if (!this.renderer || !this.camera) return;
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
      });
      this.ready = true;
    } catch (err) {
      console.error('Astro renderer init error:', err);
      this.ready = false;
    }
    return this.ready;
  },

  async loadGLB(filename) {
    return ThreeShared.loadGLB(filename);
  },

  async spawnNormalizedGLB(filename, targetSize = 2.2) {
    return ThreeShared.spawnGLB(filename, targetSize);
  },

  playClip(entity, names, loop = true) {
    if (!entity || !entity.mixer || !entity.animations.length) return;
    const THREE = this.THREE;
    let chosen = null;
    for (const want of names) {
      const key = Object.keys(entity.clips).find(k => k.includes(want));
      if (key) { chosen = entity.clips[key]; break; }
    }
    if (!chosen) chosen = entity.animations[0];
    if (!chosen || entity.currentClip === chosen.name) return;
    entity.currentClip = chosen.name;
    const act = entity.mixer.clipAction(chosen);
    act.reset();
    act.setLoop(loop ? THREE.LoopRepeat : THREE.LoopOnce, loop ? Infinity : 1);
    act.clampWhenFinished = !loop;
    if (entity.currentAction) entity.currentAction.crossFadeTo(act, 0.16, false);
    act.play();
    entity.currentAction = act;
  },

  getEquippedStats(save) {
    const eq = save.equipped || {};
    const suit = ARSENAL.suits.find(s => s.id === eq.suits) || ARSENAL.suits[0];
    const weapon = ARSENAL.weapons.find(w => w.id === eq.weapons) || ARSENAL.weapons[0];
    const glove = ARSENAL.gloves.find(g => g.id === eq.gloves) || ARSENAL.gloves[0];
    const gadget = ARSENAL.gadgets.find(g => g.id === eq.gadgets) || ARSENAL.gadgets[0];
    const armor = ARSENAL.armors.find(a => a.id === eq.armors) || ARSENAL.armors[0];
    const ship = ARSENAL.ships.find(s => s.id === eq.ships) || ARSENAL.ships[0];
    return { suit, weapon, glove, gadget, armor, ship };
  },

  setupBaseScene(skyTopHex, skyBotHex, denseSpace = false) {
    const THREE = this.THREE;
    const scene = new THREE.Scene();
    this.scene = scene;

    const topCol = new THREE.Color(skyTopHex || '#102554');
    const botCol = new THREE.Color(skyBotHex || '#6ad8ff');
    scene.background = topCol.clone().lerp(botCol, 0.4);
    scene.fog = new THREE.FogExp2(scene.background.getHex(), denseSpace ? 0.0052 : 0.0062);

    const hemi = new THREE.HemisphereLight(0xffffff, 0x3b4d7a, 1.3);
    scene.add(hemi);
    const dir = new THREE.DirectionalLight(0xfff6e0, 1.7);
    dir.position.set(28, 48, 26);
    dir.castShadow = true;
    dir.shadow.mapSize.set(1024, 1024);
    dir.shadow.camera.near = 2;
    dir.shadow.camera.far = 170;
    const d = 50;
    dir.shadow.camera.left = -d; dir.shadow.camera.right = d;
    dir.shadow.camera.top = d; dir.shadow.camera.bottom = -d;
    scene.add(dir);
    this.sunLight = dir;

    const starGeo = new THREE.BufferGeometry();
    const starCount = denseSpace ? 1300 : 600;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 280;
      starPos[i * 3 + 1] = (Math.random() - 0.2) * 150;
      starPos[i * 3 + 2] = -Math.random() * 360 + 50;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.55 }));
    scene.add(stars);
    this.starField = stars;

    this.platforms = [];
    this.bouncers = [];
    this.coins = [];
    this.chests = [];
    this.saws = [];
    this.cages = [];
    this.hubFriends = [];
    this.enemies = [];
    this.asteroids = [];
    this.boostRings = [];
    this.boostTimer = 0;
    this.shockRings = [];
    this.projectiles = [];
    this.particles = [];
    this.springTarget = null;
    this.gate = null;
    this.boss = null;
    this.gatePrompting = false;
    this.rescuedCount = 0;
    this.killsCount = 0;
    this.invuln = 0;
    this.camShake = 0;
    this.balloonTimer = 0;
  },

  async startChapter(ch, save, callbacks) {
    const token = ++this.loadToken;
    this.sceneReady = false;
    this.hero = null;
    const lp = document.getElementById('loadingPill');
    if (lp) lp.classList.remove('hidden');

    const ok = await this.ensureThree();
    if (!ok || token !== this.loadToken) {
      if (lp) lp.classList.add('hidden');
      return false;
    }
    this.callbacks = callbacks;
    this.saveRef = save;
    this.chapter = ch;
    this.mode = ch.astroType || 'platformer';
    this.active = true;
    document.body.classList.add('astro-mode');
    document.getElementById('astroCanvas').classList.remove('hidden');
    document.getElementById('astroHud').classList.remove('hidden');

    this.setupBaseScene(ch.theme.skyTop, ch.theme.skyBot, this.mode === 'starfighter');

    const eq = this.getEquippedStats(save);
    this.maxHp = eq.armor.hearts;
    this.hp = this.maxHp;

    if (this.mode === 'starfighter') {
      await this.buildStarfighterStage(ch, eq);
    } else {
      await this.buildPlatformerStage(ch, eq);
    }

    if (token !== this.loadToken) return false;
    this.sceneReady = true;
    if (lp) lp.classList.add('hidden');
    this.refreshAstroHud();
    AudioSys.setMusicTheme('boss');
    return true;
  },

  /* ---- KURTARILAN DOSTLAR MERKEZ ÜS GEZEGENİ (ASTRO CRASH SITE HUB!) ---- */
  async startHubWorld(save, callbacks) {
    const token = ++this.loadToken;
    this.sceneReady = false;
    this.hero = null;
    const lp = document.getElementById('loadingPill');
    if (lp) lp.classList.remove('hidden');

    const ok = await this.ensureThree();
    if (!ok || token !== this.loadToken) {
      if (lp) lp.classList.add('hidden');
      return false;
    }
    this.callbacks = callbacks;
    this.saveRef = save;
    this.chapter = {
      num: 0, id: 'hub', astroType: 'hub',
      title: '🌟 Kurtarılan 3D Dostlar Üssü (Galaksi Parkı)',
      subject: 'ASTRO ÜS', subjectColor: '#ffbe1a',
      rescueModels: []
    };
    this.mode = 'hub';
    this.active = true;
    this.paradeMode = false;
    document.body.classList.add('astro-mode');
    document.getElementById('astroCanvas').classList.remove('hidden');
    document.getElementById('astroHud').classList.remove('hidden');

    this.setupBaseScene('#1b6be0', '#9beeff', false);
    const THREE = this.THREE;
    const eq = this.getEquippedStats(save);
    this.maxHp = eq.armor.hearts;
    this.hp = this.maxHp;

    const mainPlat = new THREE.Group();
    const topM = new THREE.Mesh(new THREE.CylinderGeometry(24, 22, 1.2, 32), new THREE.MeshStandardMaterial({ color: 0x5bd966, roughness: 0.55 }));
    topM.position.y = -0.6; topM.receiveShadow = true;
    const botM = new THREE.Mesh(new THREE.CylinderGeometry(21, 10, 8, 28), new THREE.MeshStandardMaterial({ color: 0xc98a4b, roughness: 0.75 }));
    botM.position.y = -5.2;
    mainPlat.add(topM, botM);
    this.scene.add(mainPlat);
    this.platforms.push({ mesh: mainPlat, baseX: 0, x: 0, y: 0, z: 0, w: 42, d: 42, moveAmpX: 0, moveSpeed: 0, phase: 0 });

    const starMon = await this.spawnNormalizedGLB('Star.glb', 4.6);
    starMon.root.position.set(0, 1.2, -6);
    this.scene.add(starMon.root);
    this.hubMonument = starMon.root;

    const parkedShip = await this.spawnNormalizedGLB(eq.ship.glb || 'Spaceship_Rae.glb', 5.2);
    parkedShip.root.position.set(10, 0.2, -8);
    parkedShip.root.rotation.y = -0.5;
    this.scene.add(parkedShip.root);

    for (let i = 0; i < 6; i++) {
      const ang = (i / 6) * Math.PI * 2;
      const tr = await this.spawnNormalizedGLB('Tree_Fruit.glb', 4.2);
      tr.root.position.set(Math.cos(ang) * 17, 0, Math.sin(ang) * 17);
      this.scene.add(tr.root);
    }
    const bnc = await this.spawnNormalizedGLB('Bouncer.glb', 1.8);
    bnc.root.position.set(-9, 0, -4);
    this.scene.add(bnc.root);
    this.bouncers.push({ mesh: bnc.root, plat: this.platforms[0], lz: -4, lx: -9 });

    await this.spawnHeroRig(eq);
    this.px = 0; this.py = 1.2; this.pz = 6;
    this.flyInTimer = 0;

    const rescuedIds = (save.rescuedBots && save.rescuedBots.length)
      ? save.rescuedBots.map(k => k.split('_').slice(1).join('_'))
      : ['Fox.glb', 'Duck.glb', 'Astronaut_Frog.glb', 'Trex.glb'];

    const uniqueFiles = Array.from(new Set(rescuedIds)).slice(0, 18);
    for (let i = 0; i < uniqueFiles.length; i++) {
      const ang = (i / uniqueFiles.length) * Math.PI * 2;
      const rad = 6.5 + (i % 2) * 3.2;
      const fr = await this.spawnNormalizedGLB(uniqueFiles[i], 2.05);
      const fx = Math.cos(ang) * rad, fz = -4 + Math.sin(ang) * rad;
      fr.root.position.set(fx, 0, fz);
      fr.root.rotation.y = -ang;
      this.scene.add(fr.root);
      this.playClip(fr, ['dance', 'wave', 'idle', 'walk'], true);
      this.hubFriends.push({ ent: fr, x: fx, z: fz, idx: i });
    }

    if (token !== this.loadToken) return false;
    this.sceneReady = true;
    if (lp) lp.classList.add('hidden');
    this.refreshAstroHud();
    callbacks.onToast('🌟 Dostlar Üssü! Güç (🐸) tuşuyla Düdük çalıp 3D dostlarını peşine takabilirsin!');
    AudioSys.setMusicTheme('town');
    return true;
  },

  stop() {
    this.loadToken++;
    this.active = false;
    this.sceneReady = false;
    document.body.classList.remove('astro-mode');
    const lp = document.getElementById('loadingPill');
    const cv = document.getElementById('astroCanvas');
    const ah = document.getElementById('astroHud');
    const bb = document.getElementById('bossBar');
    if (lp) lp.classList.add('hidden');
    if (cv) cv.classList.add('hidden');
    if (ah) ah.classList.add('hidden');
    if (bb) bb.classList.add('hidden');
  },

  async spawnHeroRig(eq) {
    const THREE = this.THREE;
    this.hero = await this.spawnNormalizedGLB(eq.suit.glb || 'RobotExpressive.glb', eq.suit.size || 2.35);
    this.scene.add(this.hero.root);
    await this.attachEquipmentToHero(eq);
    this.playClip(this.hero, ['idle', 'standing'], true);

    const laserGeo = new THREE.CylinderGeometry(0.11, 0.18, 6, 10);
    const laserMat = new THREE.MeshBasicMaterial({ color: 0x00eeff, transparent: true, opacity: 0.85 });
    this.laserLeft = new THREE.Mesh(laserGeo, laserMat);
    this.laserRight = new THREE.Mesh(laserGeo, laserMat);
    this.laserLeft.visible = false;
    this.laserRight.visible = false;
    this.scene.add(this.laserLeft, this.laserRight);

    const slashGeo = new THREE.RingGeometry(1.1, (eq.weapon.range || 3.8) * 0.72, 26);
    slashGeo.rotateX(-Math.PI / 2);
    this.slashRing = new THREE.Mesh(
      slashGeo,
      new THREE.MeshBasicMaterial({ color: eq.weapon.color || '#5effc8', side: THREE.DoubleSide, transparent: true, opacity: 0 })
    );
    this.scene.add(this.slashRing);

    const dsGeo = new THREE.RingGeometry(0.36, 0.80, 24);
    dsGeo.rotateX(-Math.PI / 2);
    this.dropShadow = new THREE.Mesh(
      dsGeo,
      new THREE.MeshBasicMaterial({ color: 0x00eeff, side: THREE.DoubleSide, transparent: true, opacity: 0.82 })
    );
    this.scene.add(this.dropShadow);

    // Octo-Balloon visual sphere above back when balloon_lift active!
    this.balloonMesh = new THREE.Mesh(
      new THREE.SphereGeometry(1.25, 16, 14),
      new THREE.MeshStandardMaterial({ color: 0xff4da6, roughness: 0.25 })
    );
    this.balloonMesh.position.set(0, 2.9, 0);
    this.balloonMesh.visible = false;
    this.hero.root.add(this.balloonMesh);

    // 3D Stretching Spring Coil Beam for Frog/Magnet Gloves!
    const sbGeo = new THREE.CylinderGeometry(0.12, 0.12, 1, 10);
    sbGeo.rotateX(Math.PI / 2);
    this.springBeam = new THREE.Mesh(
      sbGeo,
      new THREE.MeshBasicMaterial({ color: 0x52ff7a, transparent: true, opacity: 0.88 })
    );
    this.springBeam.visible = false;
    this.scene.add(this.springBeam);

    // Preload Glove.glb so flying punch uses real 3D Glove mesh!
    try { this.gloveProto = await this.loadGLB('Glove.glb'); } catch (e) {}
  },

  async attachEquipmentToHero(eq) {
    if (!this.hero) return;
    const THREE = this.THREE;
    if (this.equipGroup) this.hero.root.remove(this.equipGroup);
    const eg = new THREE.Group();
    this.equipGroup = eg;
    this.hero.root.add(eg);

    const wp = new THREE.Group();
    wp.position.set(0.88, 1.15, 0.35);
    eg.add(wp);
    this.weaponPivot = wp;

    if (eq.weapon && eq.weapon.glb) {
      const wm = await this.spawnNormalizedGLB(eq.weapon.glb, 1.65);
      wm.root.rotation.x = Math.PI * 0.18;
      wp.add(wm.root);
    }

    if (eq.glove && eq.glove.glb) {
      const glv = await this.spawnNormalizedGLB(eq.glove.glb, 0.65);
      glv.root.position.set(-0.88, 1.05, 0.38);
      eg.add(glv.root);
    }

    if (eq.gadget && eq.gadget.glb) {
      const gm = await this.spawnNormalizedGLB(eq.gadget.glb, 1.1);
      if (eq.gadget.id === 'shield_gold') {
        gm.root.position.set(-0.98, 1.12, 0.35);
        gm.root.rotation.y = -Math.PI * 0.4;
      } else {
        gm.root.position.set(0, 1.15, -0.46);
      }
      eg.add(gm.root);
    }

    if (eq.armor && eq.armor.glb) {
      const am = await this.spawnNormalizedGLB(eq.armor.glb, 0.88);
      am.root.position.set(0, 2.32, 0);
      eg.add(am.root);
    }
  },

  async buildPlatformerStage(ch, eq) {
    const THREE = this.THREE;
    const scene = this.scene;

    await this.spawnHeroRig(eq);

    // Dual-Speeder Spaceship Swoop-In Intro!
    this.introShip = await this.spawnNormalizedGLB(eq.ship.glb || 'Spaceship_Rae.glb', 3.8);
    this.introShip.inner.rotation.y = Math.PI;
    scene.add(this.introShip.root);
    this.flyInTimer = 1.65;
    AudioSys.tone(260, 0.45, 'sawtooth', 0.1, 0, 620);

    // Background 3D Planet & Clouds!
    if (ch.theme.planet) {
      const bgP = await this.spawnNormalizedGLB(ch.theme.planet, 28);
      bgP.root.position.set(-38, 22, -135);
      scene.add(bgP.root);
    }
    for (let cl = 0; cl < 5; cl++) {
      const cloud = await this.spawnNormalizedGLB('Cloud_1.glb', 6.5);
      cloud.root.position.set((cl % 2 === 0 ? -18 : 18), 8 + cl * 2, -18 - cl * 24);
      scene.add(cloud.root);
    }

    const platColor = new THREE.Color(ch.theme.plat || '#59d665');
    const sideColor = new THREE.Color(ch.theme.side || '#b87a3d');
    const diff = ch.difficulty || 1;
    const isIce = ch.id === 'ch16';
    const isMagma = ch.id === 'ch17';
    const isNeon = ch.id === 'ch19' || ch.id === 'ch20';

    const addPlat = async (x, y, z, w, d, moveAmpX = 0, moveSpeed = 1.4, checkpoint = false, moveAmpY = 0, holo = false) => {
      const grp = new THREE.Group();
      const topMat = new THREE.MeshStandardMaterial({
        color: holo ? 0x00f5d4 : platColor,
        roughness: isIce ? 0.14 : 0.52,
        metalness: isIce ? 0.25 : 0.05,
        emissive: holo ? 0x005566 : 0x000000,
        transparent: holo,
        opacity: holo ? 0.88 : 1.0
      });
      const topM = new THREE.Mesh(new THREE.BoxGeometry(w, 0.75, d), topMat);
      topM.position.y = -0.37;
      topM.receiveShadow = true;
      topM.castShadow = true;
      const bodyM = new THREE.Mesh(
        new THREE.BoxGeometry(w * 0.9, 2.8, d * 0.9),
        new THREE.MeshStandardMaterial({ color: sideColor, roughness: 0.75 })
      );
      bodyM.position.y = -2.1;
      grp.add(topM, bodyM);

      if (checkpoint) {
        const flg = await this.spawnNormalizedGLB('Goal_Flag.glb', 2.6);
        flg.root.position.set(-w * 0.34, 0, 0);
        grp.add(flg.root);
      }

      grp.position.set(x, y, z);
      scene.add(grp);
      const pObj = { mesh: grp, topMat, baseX: x, baseY: y, x, y, z, w, d, moveAmpX, moveAmpY, moveSpeed, phase: Math.random() * 6.28, checkpoint, holo, solid: true, activated: false };
      this.platforms.push(pObj);
      return pObj;
    };

    await addPlat(0, 0, 0, 11.5, 11.5, 0, 0, true);
    this.px = 0; this.py = 1.5; this.pz = 0;
    this.vx = 0; this.vy = 0; this.vz = 0;
    this.checkpoint = { x: 0, y: 2, z: 0 };

    let curZ = -12.5;
    let curY = 0.5;
    const islandCount = 8 + diff;

    for (let i = 0; i < islandCount; i++) {
      const w = Math.max(6.2, 9.2 - diff * 0.28 + (i % 2) * 1.5);
      const d = Math.max(6.2, 8.5 - diff * 0.2);
      const ox = (i % 3 === 0) ? 0 : (i % 2 === 0 ? 4.4 : -4.4);
      const isCp = (i === Math.floor(islandCount / 2));
      const moveAmp = (!isCp && i % 2 === 1 && !isMagma) ? (2.2 + diff * 0.5) : 0;
      const moveAmpY = (!isCp && isMagma && i % 2 === 1) ? 2.4 : 0;
      const holo = (!isCp && isNeon && i % 3 === 2);
      const pl = await addPlat(ox, curY, curZ, w, d, moveAmp, 1.15 + diff * 0.18, isCp, moveAmpY, holo);

      // Decorative 3D Tree / Crystal on corners of larger static islands!
      if (moveAmp === 0 && ch.theme.tree && i % 2 === 0) {
        const deco = await this.spawnNormalizedGLB(ch.theme.tree, 3.1);
        deco.root.position.set(-w * 0.35, 0, -d * 0.32);
        pl.mesh.add(deco.root);
      }

      // Real 3D Coin.glb collectibles!
      for (let c = -1; c <= 1; c++) {
        const coinEnt = await this.spawnNormalizedGLB('Coin.glb', 0.95);
        coinEnt.root.position.set(ox + c * 1.55, curY + 0.85, curZ);
        scene.add(coinEnt.root);
        this.coins.push({ mesh: coinEnt.root, x: ox + c * 1.55, y: curY + 0.85, z: curZ, taken: false });
      }

      // Smashable 3D Treasure Chest (`Chest.glb`) on every 4th island!
      if (i % 4 === 2) {
        const chEnt = await this.spawnNormalizedGLB('Chest.glb', 1.45);
        chEnt.root.position.set(ox + w * 0.28, curY, curZ - d * 0.24);
        scene.add(chEnt.root);
        this.chests.push({ mesh: chEnt.root, plat: pl, lx: w * 0.28, lz: -d * 0.24, opened: false });
      }

      // Spinning Saw Trap (`Hazard_Saw.glb`) on higher difficulty chapters!
      if (diff >= 3 && i % 3 === 2) {
        const sawEnt = await this.spawnNormalizedGLB('Hazard_Saw.glb', 1.55);
        sawEnt.root.position.set(ox, curY + 0.2, curZ);
        scene.add(sawEnt.root);
        this.saws.push({ mesh: sawEnt.root, plat: pl, phase: i });
      }

      // Bouncer Trampoline
      if (i % 3 === 1) {
        const bm = await this.spawnNormalizedGLB('Bouncer.glb', 1.75);
        bm.root.position.set(ox, curY, curZ + 1.2);
        scene.add(bm.root);
        this.bouncers.push({ mesh: bm.root, plat: pl, lx: 0, lz: 1.2 });
      }

      // Enemy Squad
      if (!isCp && i > 0) {
        const eFile = ch.enemyModels[i % ch.enemyModels.length];
        const em = await this.spawnNormalizedGLB(eFile, 1.9);
        em.root.position.set(ox, curY, curZ);
        scene.add(em.root);
        this.playClip(em, ['walk', 'run', 'fly', 'idle'], true);
        this.enemies.push({
          ent: em, plat: pl, lx: 0, lz: 0, dir: 1,
          hp: 1 + Math.floor(diff * 0.65),
          chill: 0, dead: false
        });
      }

      curZ -= (10.5 + Math.min(3.4, diff * 0.42));
      curY += (i % 3 === 1) ? 2.4 : 0.45;
    }

    // 3 Side Rescue Islands with Caged .glb Friends!
    const rescueFiles = ch.rescueModels || ['Fox.glb', 'Duck.glb', 'Parrot.glb'];
    for (let r = 0; r < rescueFiles.length; r++) {
      const targetPlat = this.platforms[2 + r * 2] || this.platforms[2];
      const sideX = (r % 2 === 0 ? 1 : -1) * 9.4;
      const rPlat = await addPlat(targetPlat.baseX + sideX, targetPlat.y + 0.8, targetPlat.z, 6.4, 6.4, 0, 0, false);

      const friend = await this.spawnNormalizedGLB(rescueFiles[r], 2.0);
      friend.root.position.set(rPlat.x, rPlat.y, rPlat.z);
      scene.add(friend.root);
      this.playClip(friend, ['idle', 'survey', 'walk', 'fly'], true);

      const cageMesh = new THREE.Mesh(
        new THREE.BoxGeometry(2.5, 2.7, 2.5),
        new THREE.MeshStandardMaterial({ color: 0xffee55, wireframe: true })
      );
      cageMesh.position.set(rPlat.x, rPlat.y + 1.35, rPlat.z);
      scene.add(cageMesh);

      this.cages.push({
        friend, cageMesh, file: rescueFiles[r],
        x: rPlat.x, y: rPlat.y, z: rPlat.z, rescued: false
      });
    }

    // Pre-Boss Curriculum Gate Island
    const gatePlat = await addPlat(0, curY, curZ - 3, 12.5, 10, 0, 0, true);
    const gateArch = new THREE.Mesh(
      new THREE.TorusGeometry(3.3, 0.4, 12, 28, Math.PI),
      new THREE.MeshStandardMaterial({ color: 0xffbe1a, emissive: 0x663d00 })
    );
    gateArch.position.set(0, gatePlat.y, gatePlat.z - 2.5);
    const gateShield = new THREE.Mesh(
      new THREE.PlaneGeometry(6.0, 4.0),
      new THREE.MeshBasicMaterial({ color: 0x33d6ff, transparent: true, opacity: 0.55, side: THREE.DoubleSide })
    );
    gateShield.position.set(0, gatePlat.y + 1.8, gatePlat.z - 2.5);
    scene.add(gateArch, gateShield);
    this.gate = { x: 0, y: gatePlat.y, z: gatePlat.z - 2.5, shield: gateShield, unlocked: false };

    // GIANT BOSS ARENA ISLAND
    const bossZ = curZ - 23;
    await addPlat(0, curY, bossZ, 25, 25, 0, 0, false);
    const bossEnt = await this.spawnNormalizedGLB(ch.bossModel || 'Stan.glb', 5.8);
    bossEnt.root.position.set(0, curY, bossZ - 4);
    scene.add(bossEnt.root);
    this.playClip(bossEnt, ['idle', 'walk', 'run'], true);

    this.boss = {
      ent: bossEnt,
      name: ch.bossName,
      x: 0, y: curY, z: bossZ - 4,
      arenaZ: bossZ,
      arenaY: curY,
      hp: ch.bossHp || 12,
      maxHp: ch.bossHp || 12,
      atkTimer: 2.2,
      slamCount: 0,
      dizzy: 0,
      chill: 0,
      dead: false
    };
  },

  async buildStarfighterStage(ch, eq) {
    const THREE = this.THREE;
    const scene = this.scene;
    this.hero = await this.spawnNormalizedGLB(eq.ship.glb || 'Spaceship_Rae.glb', 3.5);
    this.hero.inner.rotation.y = Math.PI;
    scene.add(this.hero.root);

    this.px = 0; this.py = 0; this.pz = 0;
    this.vx = 0; this.vy = 0; this.vz = 0;
    this.killsCount = 0;
    this.gateUnlocked = false;
    this.spawnTimer = 0.6;
    this.ringTimer = 2.6;
    this.asteroidTimer = 1.5;
    this.boostTimer = 0;
    this.flyInTimer = 0;

    await this.loadGLB(ch.enemyShipGlb || 'Enemy_Flying.glb');
    await this.loadGLB(ch.bossModel || 'Dispatcher.glb');
    await this.loadGLB('RockPlatforms_Large.glb');

    if (ch.theme.planet) {
      const p1 = await this.spawnNormalizedGLB(ch.theme.planet, 34);
      p1.root.position.set(-40, 16, -135);
      scene.add(p1.root);
    }
    const p2 = await this.spawnNormalizedGLB('Planet_6.glb', 18);
    p2.root.position.set(42, -14, -155);
    scene.add(p2.root);
  },

  spawnParticleBurst(x, y, z, colorHex = 0xffdd33, count = 12) {
    const THREE = this.THREE;
    for (let i = 0; i < count; i++) {
      const m = new THREE.Mesh(
        new THREE.SphereGeometry(0.18, 6, 6),
        new THREE.MeshBasicMaterial({ color: colorHex })
      );
      m.position.set(x, y, z);
      this.scene.add(m);
      this.particles.push({
        mesh: m,
        vx: (Math.random() - 0.5) * 9,
        vy: Math.random() * 7 + 1,
        vz: (Math.random() - 0.5) * 9,
        life: 0.55 + Math.random() * 0.3
      });
    }
  },

  triggerAttack() {
    if (!this.active || !this.sceneReady || !this.hero || this.atkCd > 0 || this.flyInTimer > 0) return;
    const eq = this.getEquippedStats(this.saveRef);

    if (this.mode === 'starfighter') {
      this.atkCd = 0.19;
      AudioSys.tone(820, 0.07, 'sawtooth', 0.09, 0, 320);
      const count = eq.ship.shots || 2;
      for (let i = 0; i < count; i++) {
        const spread = (i - (count - 1) / 2) * 0.85;
        const bolt = new this.THREE.Mesh(
          new this.THREE.SphereGeometry(0.28, 8, 8),
          new this.THREE.MeshBasicMaterial({ color: 0x00ffcc })
        );
        bolt.position.set(this.px + spread * 0.75, this.py, this.pz - 2.0);
        this.scene.add(bolt);
        this.projectiles.push({ mesh: bolt, vx: spread * 2.4, vy: 0, vz: -70, dmg: 1 + Math.floor(eq.weapon.dmg * 0.35), enemy: false, life: 2.2 });
      }
      return;
    }

    this.atkCd = 0.34;
    this.atkAnim = 0.28;
    AudioSys.tone(520, 0.09, 'triangle', 0.14, 0, 220);
    this.playClip(this.hero, ['punch', 'attack', 'wave'], false);

    if (this.slashRing) {
      this.slashRing.position.set(this.px, this.py + 0.9, this.pz);
      this.slashRing.material.opacity = 0.92;
      this.slashRing.scale.set(0.6, 1, 0.6);
    }

    const range = eq.weapon.range || 3.8;
    const dmg = eq.weapon.dmg || 1;
    if (eq.weapon.id.includes('hammer')) {
      this.camShake = 0.45;
      AudioSys.playStomp(0.9);
    }

    // Open 3D Treasure Chests!
    for (const ch of this.chests) {
      if (!ch.opened && Math.hypot(ch.mesh.position.x - this.px, ch.mesh.position.z - this.pz) < range + 1.0) {
        ch.opened = true;
        this.scene.remove(ch.mesh);
        AudioSys.playFanfare();
        this.spawnParticleBurst(ch.mesh.position.x, ch.mesh.position.y + 1, ch.mesh.position.z, 0xffd43b, 20);
        this.callbacks.onCoins(18);
        this.callbacks.onToast('🎁 Hazine Sandığı Açıldı: +18 🪙 Altın!');
      }
    }

    // Break Rescue Cages!
    for (const cg of this.cages) {
      if (!cg.rescued && Math.hypot(cg.x - this.px, cg.z - this.pz) < range + 1.3 && Math.abs(cg.y - this.py) < 3.5) {
        cg.rescued = true;
        this.scene.remove(cg.cageMesh);
        this.rescuedCount++;
        this.playClip(cg.friend, ['dance', 'jump', 'wave', 'run'], true);
        AudioSys.playFanfare();
        this.spawnParticleBurst(cg.x, cg.y + 1.5, cg.z, 0xffdd33, 18);
        this.callbacks.onRescueBot(`${this.chapter.id}_${cg.file}`, cg.file.replace('.glb', ''));
        this.refreshAstroHud();
      }
    }

    for (const en of this.enemies) {
      if (en.dead) continue;
      const ex = en.ent.root.position.x, ey = en.ent.root.position.y, ez = en.ent.root.position.z;
      if (Math.hypot(ex - this.px, ez - this.pz) < range && Math.abs(ey - this.py) < 3.0) {
        this.damageEnemy(en, dmg);
      }
    }

    // Reflect Boss Joke-Bombs back at the Boss!
    for (const pr of this.projectiles) {
      if (pr.enemy && pr.reflectable && Math.hypot(pr.mesh.position.x - this.px, pr.mesh.position.z - this.pz) < range + 1.4) {
        pr.enemy = false;
        pr.dmg = 3;
        pr.life = 2.4;
        if (this.boss && !this.boss.dead) {
          const dx = this.boss.x - pr.mesh.position.x, dy = (this.boss.y + 1.8) - pr.mesh.position.y, dz = this.boss.z - pr.mesh.position.z;
          const dl = Math.hypot(dx, dy, dz) || 1;
          pr.vx = (dx / dl) * 28; pr.vy = (dy / dl) * 28; pr.vz = (dz / dl) * 28;
        } else {
          pr.vx = -pr.vx * 1.8; pr.vz = -pr.vz * 1.8;
        }
        pr.mesh.material.color.setHex(0x52ff7a);
        AudioSys.playFanfare();
        this.callbacks.onToast('🎾 Şaka Bombasını Boss\'a Geri Fırlattın!');
      }
    }

    if (this.boss && !this.boss.dead) {
      if (Math.hypot(this.boss.x - this.px, this.boss.z - this.pz) < range + 2.5 && Math.abs(this.boss.y - this.py) < 4.5) {
        const crit = this.boss.dizzy > 0 ? 2 : 1;
        if (crit > 1) this.callbacks.onToast('💥 SÜPER KRİTİK VURUŞ (2x)!');
        this.damageBoss(dmg * crit);
      }
    }
  },

  triggerGadget() {
    if (!this.active || !this.sceneReady || !this.hero || this.gadgetCd > 0 || this.flyInTimer > 0) return;

    if (this.mode === 'hub') {
      this.paradeMode = !this.paradeMode;
      AudioSys.playCharSignature('rakun');
      this.callbacks.onToast(this.paradeMode ? '🎶 Komiser Düdüğü! Tüm 3D dostlar peşine takıldı!' : '🌟 Dostlar serbest dansa döndü!');
      return;
    }

    const eq = this.getEquippedStats(this.saveRef);
    const THREE = this.THREE;

    if (this.mode === 'starfighter') {
      this.gadgetCd = 1.9;
      this.invuln = 1.2;
      AudioSys.tone(440, 0.18, 'sine', 0.14, 0, 920);
      // Fire 2 Auto-Locking Homing Missiles + Energy Shield!
      for (const side of [-1, 1]) {
        const msl = new THREE.Mesh(
          new THREE.ConeGeometry(0.36, 1.3, 8),
          new THREE.MeshBasicMaterial({ color: 0xffaa00 })
        );
        msl.rotation.x = -Math.PI / 2;
        msl.position.set(this.px + side * 1.4, this.py - 0.2, -1.8);
        this.scene.add(msl);
        this.projectiles.push({
          mesh: msl, vx: side * 6, vy: 2, vz: -52,
          dmg: 3, homing: true, enemy: false, life: 2.8
        });
      }
      this.callbacks.onToast('🚀 Güdümlü İkiz Füze + Enerji Kalkanı Aktif!');
      return;
    }

    const pwr = eq.glove.power;
    if (pwr === 'none') {
      this.triggerAttack();
      return;
    }

    if (pwr === 'balloon_lift') {
      this.gadgetCd = 2.4;
      this.balloonTimer = 1.5;
      this.vy = 14.5;
      this.grounded = false;
      AudioSys.tone(320, 0.35, 'sine', 0.14, 0, 860);
      this.callbacks.onToast('🎈 Ahtapot Balon Gücü ile Havalandın!');
      return;
    }

    this.gadgetCd = 0.68;
    AudioSys.tone(360, 0.14, 'square', 0.12, 0, 760);

    const count = pwr === 'triple_plasma' ? 3 : 1;
    const col = pwr === 'ice_blast' ? 0x66eeff : pwr === 'triple_plasma' ? 0xc77dff : 0x52ff7a;

    for (let i = 0; i < count; i++) {
      const ang = this.yaw + (i - (count - 1) / 2) * 0.25;
      let fist;
      if ((pwr === 'spring_punch' || pwr === 'magnet') && this.gloveProto) {
        fist = ThreeShared.SkeletonUtils.clone(this.gloveProto.scene);
        fist.scale.setScalar(1.35);
      } else {
        fist = new THREE.Mesh(
          new THREE.SphereGeometry(pwr === 'spring_punch' || pwr === 'magnet' ? 0.58 : 0.42, 12, 10),
          new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: 0.4 })
        );
      }
      fist.position.set(this.px + Math.sin(ang) * 1.1, this.py + 1.2, this.pz + Math.cos(ang) * 1.1);
      fist.rotation.y = ang;
      this.scene.add(fist);
      const proj = {
        mesh: fist,
        vx: Math.sin(ang) * 30,
        vy: 0,
        vz: Math.cos(ang) * 30,
        dmg: 2 + Math.floor(eq.weapon.dmg * 0.5),
        chill: pwr === 'ice_blast',
        spring: (pwr === 'spring_punch' || pwr === 'magnet') && i === 0,
        enemy: false,
        life: 0.78
      };
      if (proj.spring) this.springTarget = proj;
      this.projectiles.push(proj);
    }
  },

  triggerDash() {
    if (!this.active || !this.sceneReady || !this.hero || this.dashCd > 0 || this.flyInTimer > 0) return;
    const eq = this.getEquippedStats(this.saveRef);
    if ((this.mode === 'platformer' || this.mode === 'hub') && !eq.gadget.dash) {
      this.dashCd = 0.95;
      this.vx += Math.sin(this.yaw) * 9.5;
      this.vz += Math.cos(this.yaw) * 9.5;
      return;
    }
    this.dashCd = 1.05;
    this.dashTimer = 0.24;
    AudioSys.playPuff();
    this.spawnParticleBurst(this.px, this.py + 0.8, this.pz, 0x00eeff, 9);
  },

  damageEnemy(en, dmg, chill = false) {
    en.hp -= dmg;
    if (chill) en.chill = 3.5;
    this.spawnParticleBurst(en.ent.root.position.x, en.ent.root.position.y + 1, en.ent.root.position.z, 0xffaa22, 8);
    if (en.hp <= 0) {
      en.dead = true;
      this.scene.remove(en.ent.root);
      AudioSys.playPickup();
      this.callbacks.onCoins(4);
    }
  },

  damageBoss(dmg, chill = false) {
    if (!this.boss || this.boss.dead) return;
    this.boss.hp = Math.max(0, this.boss.hp - dmg);
    if (chill) this.boss.chill = 3.2;
    this.spawnParticleBurst(this.boss.x, this.boss.y + 2.5, this.boss.z, 0xff3b6b, 14);
    AudioSys.tone(240, 0.12, 'sawtooth', 0.14, 0, 120);
    this.refreshAstroHud();

    if (this.boss.hp <= 0) {
      this.boss.dead = true;
      this.scene.remove(this.boss.ent.root);
      this.spawnParticleBurst(this.boss.x, this.boss.y + 2.5, this.boss.z, 0xffdd33, 40);
      AudioSys.playFanfare();
      setTimeout(() => {
        if (this.active) this.callbacks.onChapterWin(this.chapter);
      }, 950);
    }
  },

  hurtPlayer() {
    if (this.invuln > 0 || this.mode === 'hub') return;
    const eq = this.getEquippedStats(this.saveRef);
    if (eq.gadget.shield && Math.random() < eq.gadget.shield) {
      this.invuln = 1.0;
      this.callbacks.onToast('🛡️ Altın Kalkan darbeyi engelledi!');
      AudioSys.playPickup();
      return;
    }
    this.hp = Math.max(1, this.hp - 1);
    this.invuln = 1.4;
    this.camShake = 0.4;
    AudioSys.playWrong();
    if (this.hp <= 1) {
      this.hp = this.maxHp;
      if (this.mode === 'platformer') {
        this.px = this.checkpoint.x;
        this.py = this.checkpoint.y + 2.2;
        this.pz = this.checkpoint.z;
        this.vx = 0; this.vy = 0; this.vz = 0;
      }
      this.callbacks.onToast('🤖 Kurtarma Dronu kalplerini yeniledi!');
    }
    this.refreshAstroHud();
  },

  refreshAstroHud() {
    const elHearts = document.getElementById('astroHearts');
    const elBots = document.getElementById('astroBots');
    const elGear = document.getElementById('astroGearLabel');
    const eq = this.getEquippedStats(this.saveRef);
    if (elHearts) elHearts.textContent = '❤️'.repeat(this.hp) + '🖤'.repeat(Math.max(0, this.maxHp - this.hp));
    if (elBots) {
      if (this.mode === 'starfighter') {
        elBots.textContent = `🛸 Filo: ${this.killsCount}/${this.chapter.targetKills || 14}`;
      } else if (this.mode === 'hub') {
        elBots.textContent = `🌟 Dostlar Üssü: ${this.hubFriends.length} 3D Karakter`;
      } else {
        elBots.textContent = `🤖 Dost: ${this.rescuedCount}/${(this.chapter.rescueModels || []).length}`;
      }
    }
    if (elGear) {
      elGear.textContent = this.mode === 'starfighter'
        ? `${eq.ship.icon} ${eq.ship.name}`
        : `${eq.suit.icon} · ${eq.weapon.icon} ${eq.weapon.name} · ${eq.glove.icon}`;
    }

    const bossBar = document.getElementById('bossBar');
    const bossName = document.getElementById('bossName');
    const bossPips = document.getElementById('bossPips');
    if (this.boss && !this.boss.dead && (this.mode === 'starfighter' || this.pz < this.boss.arenaZ + 21)) {
      bossBar.classList.remove('hidden');
      const dzTag = this.boss.dizzy > 0 ? ' 💫 SERSEMLEDİ (2x HASAR!)' : '';
      bossName.textContent = `${this.boss.name} (${this.boss.hp}/${this.boss.maxHp})${dzTag}`;
      const pct = Math.max(1, Math.round((this.boss.hp / this.boss.maxHp) * 10));
      bossPips.textContent = '🟥'.repeat(pct) + '⬛'.repeat(10 - pct);
    } else {
      bossBar.classList.add('hidden');
    }
  },

  update(dt, input, paused) {
    if (!this.active || !this.ready || !this.sceneReady || !this.hero || !this.scene) return;
    if (paused) {
      this.renderer.render(this.scene, this.camera);
      return;
    }

    this.atkCd = Math.max(0, this.atkCd - dt);
    this.gadgetCd = Math.max(0, this.gadgetCd - dt);
    this.dashCd = Math.max(0, this.dashCd - dt);
    this.invuln = Math.max(0, this.invuln - dt);
    this.camShake = Math.max(0, this.camShake - dt * 2.2);

    if (this.mode === 'starfighter') {
      this.updateStarfighter(dt, input);
    } else {
      this.updatePlatformer(dt, input);
    }

    // Expanding Boss Shockwave Rings!
    for (let i = this.shockRings.length - 1; i >= 0; i--) {
      const sr = this.shockRings[i];
      sr.r += dt * 11;
      sr.mesh.scale.set(sr.r, sr.r, 1);
      const dPlayer = Math.hypot(this.px - sr.x, this.pz - sr.z);
      if (Math.abs(dPlayer - sr.r) < 0.75 && this.py < sr.y + 1.1) {
        this.hurtPlayer();
      }
      if (sr.r > 16) {
        this.scene.remove(sr.mesh);
        this.shockRings.splice(i, 1);
      }
    }

    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const pr = this.projectiles[i];
      pr.life -= dt;

      // Homing missile tracking in Starfighter mode!
      if (pr.homing && !pr.enemy) {
        let tx = 0, ty = 0, tz = -60, found = false;
        if (this.boss && !this.boss.dead) {
          tx = this.boss.x; ty = this.boss.y; tz = this.boss.z; found = true;
        } else {
          for (const en of this.enemies) {
            if (!en.dead && en.ent.root.position.z < -4) {
              tx = en.ent.root.position.x; ty = en.ent.root.position.y; tz = en.ent.root.position.z;
              found = true; break;
            }
          }
        }
        if (found) {
          const dx = tx - pr.mesh.position.x, dy = ty - pr.mesh.position.y, dz = tz - pr.mesh.position.z;
          const dl = Math.hypot(dx, dy, dz) || 1;
          pr.vx += ((dx / dl) * 58 - pr.vx) * Math.min(1, dt * 7);
          pr.vy += ((dy / dl) * 58 - pr.vy) * Math.min(1, dt * 7);
          pr.vz += ((dz / dl) * 58 - pr.vz) * Math.min(1, dt * 7);
        }
      }

      pr.mesh.position.x += pr.vx * dt;
      pr.mesh.position.y += pr.vy * dt;
      pr.mesh.position.z += pr.vz * dt;
      let remove = pr.life <= 0;

      if (pr.enemy) {
        if (Math.hypot(pr.mesh.position.x - this.px, pr.mesh.position.y - (this.py + 1.0), pr.mesh.position.z - this.pz) < 1.35) {
          this.hurtPlayer();
          remove = true;
        }
      } else {
        // Spring Glove / Projectile can open 3D Chests, freeze Saws, and reflect Boss Joke-Bombs!
        for (const ch of this.chests) {
          if (!ch.opened && Math.hypot(ch.mesh.position.x - pr.mesh.position.x, (ch.mesh.position.y + 0.8) - pr.mesh.position.y, ch.mesh.position.z - pr.mesh.position.z) < 2.1) {
            ch.opened = true;
            this.scene.remove(ch.mesh);
            AudioSys.playFanfare();
            this.spawnParticleBurst(ch.mesh.position.x, ch.mesh.position.y + 1, ch.mesh.position.z, 0xffd43b, 20);
            this.callbacks.onCoins(18);
            this.callbacks.onToast('🧤 Eldiven Gücüyle Hazine Sandığı Açıldı: +18 🪙!');
            remove = true;
            break;
          }
        }
        if (pr.chill) {
          for (const sw of this.saws) {
            if (Math.hypot(sw.mesh.position.x - pr.mesh.position.x, sw.mesh.position.z - pr.mesh.position.z) < 2.2) {
              sw.frozen = 4.0;
              this.callbacks.onToast('❄️ Buz Eldiveni Dönen Testereyi Dondurdu!');
            }
          }
        }
        for (const other of this.projectiles) {
          if (other !== pr && other.enemy && other.reflectable && Math.hypot(other.mesh.position.x - pr.mesh.position.x, other.mesh.position.z - pr.mesh.position.z) < 2.2) {
            other.enemy = false;
            other.dmg = 3;
            other.life = 2.4;
            if (this.boss && !this.boss.dead) {
              const dx = this.boss.x - other.mesh.position.x, dy = (this.boss.y + 1.8) - other.mesh.position.y, dz = this.boss.z - other.mesh.position.z;
              const dl = Math.hypot(dx, dy, dz) || 1;
              other.vx = (dx / dl) * 28; other.vy = (dy / dl) * 28; other.vz = (dz / dl) * 28;
            }
            other.mesh.material.color.setHex(0x52ff7a);
            AudioSys.playFanfare();
            this.callbacks.onToast('🐸 Yaylı Eldivenle Şaka Bombası Boss\'a Geri Çarptı!');
            remove = true;
            break;
          }
        }
        for (const cg of this.cages) {
          if (!cg.rescued && Math.hypot(cg.x - pr.mesh.position.x, (cg.y + 1.2) - pr.mesh.position.y, cg.z - pr.mesh.position.z) < 2.0) {
            cg.rescued = true;
            this.scene.remove(cg.cageMesh);
            this.rescuedCount++;
            this.playClip(cg.friend, ['dance', 'jump', 'wave'], true);
            AudioSys.playFanfare();
            this.callbacks.onRescueBot(`${this.chapter.id}_${cg.file}`, cg.file.replace('.glb', ''));
            this.refreshAstroHud();
            remove = true;
            break;
          }
        }
        for (const ast of this.asteroids) {
          if (ast.dead || remove) continue;
          const ap = ast.ent.root.position;
          if (Math.hypot(ap.x - pr.mesh.position.x, ap.y - pr.mesh.position.y, ap.z - pr.mesh.position.z) < 2.8) {
            ast.hp -= pr.dmg;
            this.spawnParticleBurst(ap.x, ap.y, ap.z, 0xffaa44, 6);
            if (ast.hp <= 0) {
              ast.dead = true;
              this.scene.remove(ast.ent.root);
              AudioSys.playPickup();
              this.callbacks.onCoins(5);
            }
            remove = true;
            break;
          }
        }
        for (const en of this.enemies) {
          if (en.dead || remove) continue;
          const pos = en.ent.root.position;
          if (Math.hypot(pos.x - pr.mesh.position.x, (pos.y + 1) - pr.mesh.position.y, pos.z - pr.mesh.position.z) < 2.15) {
            this.damageEnemy(en, pr.dmg, pr.chill);
            if (this.mode === 'starfighter' && en.dead) {
              this.killsCount++;
              this.refreshAstroHud();
            }
            remove = true;
            break;
          }
        }
        if (!remove && this.boss && !this.boss.dead) {
          if (Math.hypot(this.boss.x - pr.mesh.position.x, (this.boss.y + 2.2) - pr.mesh.position.y, this.boss.z - pr.mesh.position.z) < 3.7) {
            this.damageBoss(pr.dmg * (this.boss.dizzy > 0 ? 2 : 1), pr.chill);
            remove = true;
          }
        }
      }

      if (remove) {
        if (this.springTarget === pr) this.springTarget = null;
        this.scene.remove(pr.mesh);
        this.projectiles.splice(i, 1);
      }
    }

    // Update 3D Stretching Spring Beam between Hero and Flying Glove!
    if (this.springBeam) {
      if (this.springTarget && this.mode !== 'starfighter') {
        const sx = this.px - Math.cos(this.yaw) * 0.7, sy = this.py + 1.15, sz = this.pz + Math.sin(this.yaw) * 0.7;
        const tx = this.springTarget.mesh.position.x, ty = this.springTarget.mesh.position.y, tz = this.springTarget.mesh.position.z;
        const dist = Math.hypot(tx - sx, ty - sy, tz - sz);
        this.springBeam.visible = dist > 0.3;
        this.springBeam.position.set((sx + tx) * 0.5, (sy + ty) * 0.5, (sz + tz) * 0.5);
        this.springBeam.scale.set(1, 1, Math.max(0.2, dist));
        this.springBeam.lookAt(tx, ty, tz);
      } else {
        this.springBeam.visible = false;
      }
    }

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const pt = this.particles[i];
      pt.life -= dt;
      pt.mesh.position.x += pt.vx * dt;
      pt.mesh.position.y += pt.vy * dt;
      pt.mesh.position.z += pt.vz * dt;
      pt.vy -= 14 * dt;
      if (pt.life <= 0) {
        this.scene.remove(pt.mesh);
        this.particles.splice(i, 1);
      }
    }

    this.renderer.render(this.scene, this.camera);
  },

  updatePlatformer(dt, input) {
    const eq = this.getEquippedStats(this.saveRef);
    const t = performance.now() / 1000;

    // Dual-Speeder Swoop-In Landing Animation!
    if (this.flyInTimer > 0) {
      this.flyInTimer -= dt;
      const u = Math.max(0, this.flyInTimer / 1.65);
      if (this.introShip) {
        this.introShip.root.position.set(Math.sin(u * 3) * 6, 3.2 + u * 14, u * 22);
        this.hero.root.position.set(this.introShip.root.position.x, this.introShip.root.position.y + 1.2, this.introShip.root.position.z);
        this.camera.position.set(0, 9 + u * 8, 16 + u * 14);
        this.camera.lookAt(this.introShip.root.position);
        if (this.flyInTimer <= 0) {
          this.scene.remove(this.introShip.root);
          this.introShip = null;
          this.px = 0; this.py = 2.4; this.pz = 0;
          this.vy = 5;
          AudioSys.playSuccess();
        }
      }
      return;
    }

    // Hub Monument & Rescued Friends Parade!
    if (this.mode === 'hub') {
      if (this.hubMonument) this.hubMonument.rotation.y += dt * 1.1;
      for (const hf of this.hubFriends) {
        if (hf.ent.mixer) hf.ent.mixer.update(dt);
        if (this.paradeMode) {
          const targetX = this.px - Math.sin(this.yaw) * (2.2 + hf.idx * 1.35);
          const targetZ = this.pz - Math.cos(this.yaw) * (2.2 + hf.idx * 1.35);
          hf.x += (targetX - hf.x) * Math.min(1, dt * 4.5);
          hf.z += (targetZ - hf.z) * Math.min(1, dt * 4.5);
          hf.ent.root.position.set(hf.x, 0, hf.z);
          hf.ent.root.rotation.y = Math.atan2(this.px - hf.x, this.pz - hf.z);
        }
      }
    }

    const isIce = this.chapter && this.chapter.id === 'ch16';
    for (const pl of this.platforms) {
      const prevX = pl.x, prevY = pl.y;
      if (pl.moveAmpX > 0) {
        pl.x = pl.baseX + Math.sin(t * pl.moveSpeed + pl.phase) * pl.moveAmpX;
        pl.mesh.position.x = pl.x;
      }
      if (pl.moveAmpY > 0) {
        pl.y = pl.baseY + Math.sin(t * pl.moveSpeed * 0.85 + pl.phase) * pl.moveAmpY;
        pl.mesh.position.y = pl.y;
      }
      if (pl.holo && pl.topMat) {
        const wave = Math.sin(t * 1.4 + pl.phase);
        pl.solid = wave > -0.62;
        pl.topMat.opacity = pl.solid ? (wave < -0.25 ? 0.45 : 0.88) : 0.14;
      }
      pl.dx = pl.x - prevX;
      pl.dy = pl.y - prevY;
    }

    const speed = this.dashTimer > 0 ? 22 : (isIce ? 12.2 : 10.6);
    if (this.dashTimer > 0) {
      this.dashTimer -= dt;
      this.vx = Math.sin(this.yaw) * speed;
      this.vz = Math.cos(this.yaw) * speed;
      this.vy = Math.max(0, this.vy);
    } else {
      const ix = input.dx, iz = input.dy;
      if (Math.hypot(ix, iz) > 0.06) {
        if (isIce && this.grounded) {
          this.vx += (ix * speed - this.vx) * Math.min(1, dt * 4.2);
          this.vz += (iz * speed - this.vz) * Math.min(1, dt * 4.2);
        } else {
          this.vx = ix * speed;
          this.vz = iz * speed;
        }
        this.yaw = Math.atan2(ix, iz);
      } else {
        const drag = (isIce && this.grounded) ? 0.14 : 0.001;
        this.vx *= Math.pow(drag, dt);
        this.vz *= Math.pow(drag, dt);
      }
    }

    if (this.gate && !this.gate.unlocked && this.pz < this.gate.z + 1.6 && Math.abs(this.px - this.gate.x) < 6) {
      this.pz = this.gate.z + 1.6;
      if (!this.gatePrompting) {
        this.gatePrompting = true;
        this.callbacks.onGateQuiz(this.chapter, () => {
          this.gate.unlocked = true;
          this.gate.shield.visible = false;
          this.gatePrompting = false;
          AudioSys.playSuccess();
          this.callbacks.onToast('🔓 Bilgi Kapısı Açıldı! Gezegen Boss\'una İlerle!');
        }, () => {
          this.gatePrompting = false;
          this.pz += 2.2;
        });
      }
    }

    if (this.grounded) {
      this.coyote = 0.14;
      this.jumpsLeft = 2;
      this.hoverFuel = eq.gadget.hoverSec || 1.5;
      this.hovering = false;
    } else {
      this.coyote = Math.max(0, this.coyote - dt);
    }

    if (input.jumpPressed) {
      input.jumpPressed = false;
      if (this.coyote > 0 || this.jumpsLeft > 0) {
        this.vy = this.coyote > 0 ? 13.8 : 12.2;
        if (this.coyote <= 0) this.jumpsLeft--;
        this.coyote = 0;
        this.grounded = false;
        AudioSys.tone(420, 0.1, 'sine', 0.12, 0, 740);
        this.playClip(this.hero, ['jump'], false);
      }
    }

    if (this.balloonTimer > 0) {
      this.balloonTimer -= dt;
      if (this.balloonMesh) this.balloonMesh.visible = true;
      this.vy = Math.max(4.5, this.vy - 6 * dt);
    } else if (this.balloonMesh) {
      this.balloonMesh.visible = false;
    }

    if (!this.grounded && input.jumpHeld && this.vy <= 1.5 && this.hoverFuel > 0 && this.balloonTimer <= 0) {
      this.hovering = true;
      this.hoverFuel -= dt;
      this.vy = Math.max(-1.1, this.vy + 26 * dt);
      if (Math.random() < 0.35) AudioSys.tone(980 + Math.random() * 220, 0.04, 'sawtooth', 0.04);

      for (const en of this.enemies) {
        if (en.dead) continue;
        const pos = en.ent.root.position;
        if (Math.hypot(pos.x - this.px, pos.z - this.pz) < 1.85 && pos.y <= this.py && this.py - pos.y < 6.5) {
          this.damageEnemy(en, dt * 7);
        }
      }
    } else {
      this.hovering = false;
    }

    if (!this.hovering && this.dashTimer <= 0 && this.balloonTimer <= 0) {
      this.vy -= 30 * dt;
    }

    const prevY = this.py;
    this.px += this.vx * dt;
    this.py += this.vy * dt;
    this.pz += this.vz * dt;

    this.grounded = false;
    let shadowY = -20;
    for (const pl of this.platforms) {
      if (pl.solid === false) continue;
      const withinXZ = Math.abs(this.px - pl.x) <= pl.w * 0.5 + 0.42 && Math.abs(this.pz - pl.z) <= pl.d * 0.5 + 0.42;
      if (withinXZ && pl.y <= this.py + 0.3 && pl.y > shadowY) {
        shadowY = pl.y;
      }
      if (withinXZ && this.vy <= 0 && prevY >= pl.y - 0.55 && this.py <= pl.y + 0.35) {
        this.py = pl.y;
        this.vy = 0;
        this.grounded = true;
        this.px += (pl.dx || 0);
        if (pl.checkpoint && !pl.activated) {
          pl.activated = true;
          this.checkpoint = { x: pl.baseX, y: pl.baseY + 1.5, z: pl.z };
          AudioSys.playPickup();
          this.callbacks.onToast('🚩 Kontrol Noktası Kaydedildi!');
        }
      }
    }

    if (this.py < -14) {
      this.px = this.checkpoint.x;
      this.py = this.checkpoint.y + 2.5;
      this.pz = this.checkpoint.z;
      this.vx = 0; this.vy = 0; this.vz = 0;
      AudioSys.tone(320, 0.16, 'triangle', 0.11, 0, 580);
      this.callbacks.onToast('🛸 Astro-Dron seni son kontrol noktasına taşıdı!');
    }

    this.hero.root.position.set(this.px, this.py, this.pz);
    this.hero.root.rotation.y = this.yaw;
    this.hero.root.visible = !(this.invuln > 0 && Math.floor(t * 16) % 2 === 0);

    if (this.grounded && this.atkAnim <= 0) {
      if (Math.hypot(this.vx, this.vz) > 0.8) this.playClip(this.hero, ['run', 'walk'], true);
      else this.playClip(this.hero, ['idle', 'standing'], true);
    }
    if (this.hero.mixer) this.hero.mixer.update(dt);

    if (this.atkAnim > 0) {
      this.atkAnim -= dt;
      if (this.weaponPivot) this.weaponPivot.rotation.y += dt * 22;
      if (this.slashRing) {
        this.slashRing.position.set(this.px, this.py + 0.9, this.pz);
        this.slashRing.scale.addScalar(dt * 4.5);
        this.slashRing.material.opacity = Math.max(0, this.atkAnim * 3);
      }
    } else if (this.weaponPivot) {
      this.weaponPivot.rotation.y = 0;
      if (this.slashRing) this.slashRing.material.opacity = 0;
    }

    this.laserLeft.visible = this.hovering;
    this.laserRight.visible = this.hovering;
    if (this.hovering) {
      this.laserLeft.position.set(this.px - 0.35, this.py - 3.0, this.pz);
      this.laserRight.position.set(this.px + 0.35, this.py - 3.0, this.pz);
    }

    this.dropShadow.visible = shadowY > -18;
    if (this.dropShadow.visible) {
      this.dropShadow.position.set(this.px, shadowY + 0.06, this.pz);
    }

    for (const b of this.bouncers) {
      b.mesh.position.x = b.plat.x + (b.lx || 0);
      b.mesh.position.y = b.plat.y;
      b.mesh.position.z = b.plat.z + (b.lz || 0);
      if (Math.hypot(this.px - b.mesh.position.x, this.pz - b.mesh.position.z) < 1.5 && Math.abs(this.py - b.plat.y) < 1.2) {
        this.vy = 20.8;
        this.grounded = false;
        this.jumpsLeft = 2;
        AudioSys.tone(330, 0.18, 'sine', 0.15, 0, 920);
      }
    }

    for (const ch of this.chests) {
      if (!ch.opened) {
        ch.mesh.position.x = ch.plat.x + ch.lx;
        ch.mesh.position.y = ch.plat.y;
        ch.mesh.position.z = ch.plat.z + ch.lz;
      }
    }

    for (const sw of this.saws) {
      if (sw.frozen && sw.frozen > 0) {
        sw.frozen -= dt;
        sw.mesh.position.y = sw.plat.y + 0.2;
        continue;
      }
      const sx = sw.plat.x + Math.sin(t * 2.5 + sw.phase) * (sw.plat.w * 0.34);
      const sz = sw.plat.z;
      sw.mesh.position.set(sx, sw.plat.y + 0.2, sz);
      sw.mesh.rotation.y += dt * 9;
      if (Math.hypot(this.px - sx, this.pz - sz) < 1.15 && Math.abs(this.py - sw.plat.y) < 1.1) {
        this.hurtPlayer();
      }
    }

    const magRange = eq.glove.power === 'magnet' ? 10.5 : 1.75;
    for (const c of this.coins) {
      if (c.taken) continue;
      c.mesh.rotation.y += dt * 3.2;
      const dist = Math.hypot(c.x - this.px, c.y - (this.py + 0.9), c.z - this.pz);
      if (dist < magRange && dist > 1.3) {
        c.x += (this.px - c.x) * dt * 8.5;
        c.y += (this.py + 0.9 - c.y) * dt * 8.5;
        c.z += (this.pz - c.z) * dt * 8.5;
        c.mesh.position.set(c.x, c.y, c.z);
      }
      if (dist < 1.45) {
        c.taken = true;
        this.scene.remove(c.mesh);
        AudioSys.playPickup();
        this.callbacks.onCoins(2);
      }
    }

    for (const cg of this.cages) {
      if (cg.friend.mixer) cg.friend.mixer.update(dt);
      if (!cg.rescued) cg.cageMesh.rotation.y += dt * 1.2;
    }

    for (const en of this.enemies) {
      if (en.dead) continue;
      if (en.chill > 0) en.chill -= dt;
      const spd = en.chill > 0 ? 1.1 : 3.2;
      en.lx += en.dir * spd * dt;
      const lim = Math.max(1.2, en.plat.w * 0.36);
      if (en.lx > lim) { en.lx = lim; en.dir = -1; }
      if (en.lx < -lim) { en.lx = -lim; en.dir = 1; }
      const ex = en.plat.x + en.lx, ey = en.plat.y, ez = en.plat.z;
      en.ent.root.position.set(ex, ey, ez);
      en.ent.root.rotation.y = en.dir > 0 ? Math.PI / 2 : -Math.PI / 2;
      if (en.ent.mixer) en.ent.mixer.update(dt);

      if (Math.hypot(ex - this.px, ez - this.pz) < 1.35 && Math.abs(ey - this.py) < 1.8) {
        if (this.vy < -2 && this.py > ey + 0.65) {
          this.vy = 13.8;
          this.damageEnemy(en, 2);
        } else if (this.dashTimer > 0) {
          this.damageEnemy(en, 2);
        } else {
          this.hurtPlayer();
        }
      }
    }

    // Multi-Phase Boss AI (Orb Volley + Reflectable Joke-Bomb + Shockwave Slam + Dizzy Weak-Point!)
    if (this.boss && !this.boss.dead) {
      if (this.boss.chill > 0) this.boss.chill -= dt;
      if (this.boss.dizzy > 0) this.boss.dizzy -= dt;
      if (this.boss.ent.mixer) this.boss.ent.mixer.update(dt);
      const nearBoss = this.pz < this.boss.arenaZ + 19;
      this.refreshAstroHud();

      if (nearBoss && this.boss.dizzy <= 0) {
        const ang = Math.atan2(this.px - this.boss.x, this.pz - this.boss.z);
        this.boss.ent.root.rotation.y = ang;
        const bSpd = (this.boss.chill > 0 ? 1.4 : 3.5);
        this.boss.x = clamp(this.boss.x + Math.sin(ang) * bSpd * dt, -9.5, 9.5);
        this.boss.z = clamp(this.boss.z + Math.cos(ang) * bSpd * dt, this.boss.arenaZ - 9.5, this.boss.arenaZ + 9.5);
        this.boss.ent.root.position.set(this.boss.x, this.boss.y, this.boss.z);

        this.boss.atkTimer -= dt;
        if (this.boss.atkTimer <= 0) {
          this.boss.slamCount++;
          if (this.boss.slamCount % 3 === 0) {
            // Phase 3: Shockwave Ring Slam + Dizzy Window!
            const ringM = new this.THREE.Mesh(
              new this.THREE.RingGeometry(0.85, 1.15, 28),
              new this.THREE.MeshBasicMaterial({ color: 0x00eeff, side: this.THREE.DoubleSide })
            );
            ringM.rotation.x = -Math.PI / 2;
            ringM.position.set(this.boss.x, this.boss.y + 0.25, this.boss.z);
            this.scene.add(ringM);
            this.shockRings.push({ mesh: ringM, x: this.boss.x, y: this.boss.y, z: this.boss.z, r: 1.0 });
            AudioSys.playStomp(1.1);
            this.camShake = 0.35;
            this.boss.dizzy = 2.6;
            this.boss.atkTimer = 3.0;
          } else {
            this.boss.atkTimer = Math.max(1.1, 2.3 - (this.chapter.difficulty || 1) * 0.18);
            for (let k = -1; k <= 1; k++) {
              const a = ang + k * 0.28;
              const isBomb = k === 0;
              const orb = new this.THREE.Mesh(
                new this.THREE.SphereGeometry(isBomb ? 0.68 : 0.48, 12, 10),
                new this.THREE.MeshBasicMaterial({ color: isBomb ? 0xffbe1a : 0xff2e63 })
              );
              orb.position.set(this.boss.x, this.boss.y + 1.4, this.boss.z);
              this.scene.add(orb);
              this.projectiles.push({
                mesh: orb,
                vx: Math.sin(a) * (isBomb ? 10 : 12),
                vy: 0,
                vz: Math.cos(a) * (isBomb ? 10 : 12),
                reflectable: isBomb,
                enemy: true,
                life: 3.4
              });
            }
          }
        }

        if (Math.hypot(this.boss.x - this.px, this.boss.z - this.pz) < 2.3 && Math.abs(this.boss.y - this.py) < 2.8) {
          this.hurtPlayer();
        }
      }
    }

    const shkX = this.camShake > 0 ? (Math.random() - 0.5) * this.camShake * 1.4 : 0;
    const shkY = this.camShake > 0 ? (Math.random() - 0.5) * this.camShake * 1.2 : 0;
    this.camera.position.x += (this.px * 0.72 - this.camera.position.x) * Math.min(1, dt * 6) + shkX;
    this.camera.position.y += (this.py + 8.2 - this.camera.position.y) * Math.min(1, dt * 5) + shkY;
    this.camera.position.z += (this.pz + 13.8 - this.camera.position.z) * Math.min(1, dt * 6);
    this.camera.lookAt(this.px * 0.85, this.py + 1.5, this.pz - 3.2);
    this.sunLight.position.set(this.px + 20, this.py + 40, this.pz + 20);
    this.sunLight.target.position.set(this.px, this.py, this.pz);
    this.sunLight.target.updateMatrixWorld();
  },

  async spawnEnemyFighter() {
    const ch = this.chapter;
    const ent = await this.spawnNormalizedGLB(ch.enemyShipGlb || 'Enemy_Flying.glb', 2.9);
    const sx = (Math.random() - 0.5) * 26;
    const sy = (Math.random() - 0.5) * 13;
    ent.root.position.set(sx, sy, -110);
    this.scene.add(ent.root);
    this.enemies.push({
      ent,
      hp: 2 + Math.floor((ch.difficulty || 2) * 0.5),
      shootT: 1.0 + Math.random() * 1.2,
      vz: 17 + (ch.difficulty || 2) * 2.6,
      sway: (Math.random() - 0.5) * 4,
      dead: false
    });
  },

  async spawnSpaceBoss() {
    const ch = this.chapter;
    const ent = await this.spawnNormalizedGLB(ch.bossModel || 'Dispatcher.glb', 8.8);
    ent.root.position.set(0, 1, -42);
    this.scene.add(ent.root);
    this.boss = {
      ent,
      name: ch.bossName,
      x: 0, y: 1, z: -42,
      hp: ch.bossHp || 20,
      maxHp: ch.bossHp || 20,
      atkTimer: 1.4,
      dizzy: 0,
      dead: false
    };
    this.refreshAstroHud();
  },

  async spawnAsteroid() {
    const ent = await this.spawnNormalizedGLB('RockPlatforms_Large.glb', 3.4);
    ent.root.position.set((Math.random() - 0.5) * 26, (Math.random() - 0.5) * 14, -120);
    this.scene.add(ent.root);
    this.asteroids.push({ ent, hp: 3, vz: 21 + Math.random() * 6, rx: Math.random() * 2, ry: Math.random() * 2, dead: false });
  },

  spawnBoostRing() {
    const THREE = this.THREE;
    const mesh = new THREE.Mesh(
      new THREE.TorusGeometry(2.6, 0.28, 12, 28),
      new THREE.MeshBasicMaterial({ color: 0xffd43b })
    );
    mesh.position.set((Math.random() - 0.5) * 20, (Math.random() - 0.5) * 10, -115);
    this.scene.add(mesh);
    this.boostRings.push({ mesh, vz: 24, taken: false });
  },

  updateStarfighter(dt, input) {
    const eq = this.getEquippedStats(this.saveRef);
    const t = performance.now() / 1000;
    if (this.boostTimer > 0) this.boostTimer = Math.max(0, this.boostTimer - dt);
    const boostMult = this.boostTimer > 0 ? 1.45 : 1.0;
    const spd = 19.5 * (eq.ship.speed || 1) * boostMult;

    this.px = clamp(this.px + input.dx * spd * dt, -14, 14);
    this.py = clamp(this.py - input.dy * spd * 0.82 * dt, -7.5, 8.5);

    this.hero.root.position.set(this.px, this.py, 0);
    this.hero.root.rotation.z = -input.dx * 0.45;
    this.hero.root.rotation.x = input.dy * 0.25;
    this.hero.root.visible = !(this.invuln > 0 && Math.floor(t * 16) % 2 === 0);

    if (input.jumpHeld || input.fireHeld || this.boostTimer > 0) {
      this.triggerAttack();
    }

    this.starField.position.z += dt * (this.boostTimer > 0 ? 92 : 48);
    if (this.starField.position.z > 90) this.starField.position.z = 0;

    // Spawn 3D Asteroids & Golden Turbo Boost Rings!
    this.asteroidTimer = (this.asteroidTimer || 1.5) - dt;
    if (this.asteroidTimer <= 0 && this.asteroids.filter(a => !a.dead).length < 4) {
      this.asteroidTimer = 2.4;
      this.spawnAsteroid();
    }
    this.ringTimer = (this.ringTimer || 2.8) - dt;
    if (this.ringTimer <= 0 && this.boostRings.length < 3) {
      this.ringTimer = 4.2;
      this.spawnBoostRing();
    }

    for (const ast of this.asteroids) {
      if (ast.dead) continue;
      const p = ast.ent.root.position;
      p.z += ast.vz * dt;
      ast.ent.root.rotation.x += ast.rx * dt;
      ast.ent.root.rotation.y += ast.ry * dt;
      if (Math.hypot(p.x - this.px, p.y - this.py, p.z) < 2.5) {
        this.hurtPlayer();
        ast.dead = true;
        this.scene.remove(ast.ent.root);
      } else if (p.z > 12) {
        ast.dead = true;
        this.scene.remove(ast.ent.root);
      }
    }

    for (let i = this.boostRings.length - 1; i >= 0; i--) {
      const br = this.boostRings[i];
      br.mesh.position.z += br.vz * dt;
      br.mesh.rotation.z += dt * 2.5;
      if (!br.taken && Math.abs(br.mesh.position.z) < 1.8 && Math.hypot(br.mesh.position.x - this.px, br.mesh.position.y - this.py) < 2.9) {
        br.taken = true;
        this.boostTimer = 2.5;
        this.invuln = Math.max(this.invuln, 1.5);
        AudioSys.playFanfare();
        this.callbacks.onCoins(6);
        this.callbacks.onToast('⚡ ALTIN TURBO HALKASI! Süper Hız + Otomatik Lazer +6 🪙!');
      }
      if (br.taken || br.mesh.position.z > 12) {
        this.scene.remove(br.mesh);
        this.boostRings.splice(i, 1);
      }
    }

    const targetKills = this.chapter.targetKills || 14;

    if (this.killsCount < targetKills) {
      this.spawnTimer -= dt;
      if (this.spawnTimer <= 0 && this.enemies.filter(e => !e.dead).length < 6) {
        this.spawnTimer = 1.0;
        this.spawnEnemyFighter();
      }
    } else if (!this.gateUnlocked && !this.gatePrompting) {
      this.gatePrompting = true;
      this.callbacks.onGateQuiz(this.chapter, () => {
        this.gateUnlocked = true;
        this.gatePrompting = false;
        this.callbacks.onToast('🚨 Kalkan Şifresi Kırıldı! ANA UZAY KRUVAZÖRÜ GELİYOR!');
        this.spawnSpaceBoss();
      }, () => {
        this.gatePrompting = false;
      });
    }

    for (const en of this.enemies) {
      if (en.dead) continue;
      const p = en.ent.root.position;
      p.z += en.vz * dt;
      p.x += Math.sin(t * 2 + en.sway) * 3 * dt;
      en.shootT -= dt;
      if (en.shootT <= 0 && p.z < -12) {
        en.shootT = 1.8;
        const orb = new this.THREE.Mesh(
          new this.THREE.SphereGeometry(0.38, 8, 8),
          new this.THREE.MeshBasicMaterial({ color: 0xff3355 })
        );
        orb.position.set(p.x, p.y, p.z + 2);
        this.scene.add(orb);
        const dx = this.px - p.x, dy = this.py - p.y, dz = -p.z;
        const dl = Math.hypot(dx, dy, dz) || 1;
        this.projectiles.push({ mesh: orb, vx: (dx / dl) * 26, vy: (dy / dl) * 26, vz: (dz / dl) * 26, enemy: true, life: 3.5 });
      }
      if (Math.hypot(p.x - this.px, p.y - this.py, p.z) < 2.3) {
        this.hurtPlayer();
        en.dead = true;
        this.scene.remove(en.ent.root);
      } else if (p.z > 12) {
        en.dead = true;
        this.scene.remove(en.ent.root);
      }
    }

    if (this.boss && !this.boss.dead) {
      this.boss.x = Math.sin(t * 1.25) * 10;
      this.boss.y = 1.5 + Math.cos(t * 1.7) * 4;
      this.boss.ent.root.position.set(this.boss.x, this.boss.y, this.boss.z);
      this.boss.atkTimer -= dt;
      if (this.boss.atkTimer <= 0) {
        this.boss.atkTimer = 1.25;
        for (let k = -1; k <= 1; k++) {
          const orb = new this.THREE.Mesh(
            new this.THREE.SphereGeometry(0.5, 10, 8),
            new this.THREE.MeshBasicMaterial({ color: 0xffae00 })
          );
          orb.position.set(this.boss.x + k * 2, this.boss.y, this.boss.z + 3);
          this.scene.add(orb);
          const dx = this.px - (this.boss.x + k * 2), dy = this.py - this.boss.y, dz = -this.boss.z;
          const dl = Math.hypot(dx, dy, dz) || 1;
          this.projectiles.push({ mesh: orb, vx: (dx / dl) * 28, vy: (dy / dl) * 28, vz: (dz / dl) * 28, enemy: true, life: 3.0 });
        }
      }
    }

    this.camera.position.set(this.px * 0.45, this.py * 0.45 + 3.6, 11.5);
    this.camera.lookAt(this.px * 0.65, this.py * 0.65, -26);
  }
};
