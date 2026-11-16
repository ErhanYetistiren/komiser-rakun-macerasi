/* ============================================================================
   08-ASTRO3D-ENGINE.JS — V2.0 SABİT 60 FPS iPAD & KONSOL KALİTESİ ASTRO-BOT MOTORU
   Tekil WebGLRenderer + PBR Gökyüzü Yansıması + InstancedMesh Altınlar +
   Kenara Tutunma (Ledge-Grab) + 3D Hologram/Terazi/İngilizce Köprüler +
   Şifreli Dost Kafesleri & Kutlama Kamerası + Uzay Asteroit Kapıları +
   Mega-Titan & Krono Güçleri + 3D Yardımcı Pet/Wingman + Büyüyen 3D Dostlar Üssü!
   ============================================================================ */

const AstroEngine = {
  ready: false,
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
  petEnt: null,
  petShotTimer: 2.5,
  introShip: null,
  flyInTimer: 0,
  rescueCamTimer: 0,
  rescueCamTarget: null,
  weaponPivot: null,
  laserLeft: null,
  laserRight: null,
  slashRing: null,
  dropShadow: null,
  balloonMesh: null,
  balloonTimer: 0,
  springBeam: null,
  springTarget: null,
  gloveProto: null,

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
  titanTimer: 0,
  chronoTimer: 0,
  footstepTimer: 0,
  hp: 4,
  maxHp: 4,
  checkpoint: { x: 0, y: 2, z: 0 },

  platforms: [],
  eduBridges: [],
  bouncers: [],
  coins: [],
  coinInstanced: null,
  coinDummy: null,
  powerOrbs: [],
  heartPickups: [],
  chests: [],
  saws: [],
  cages: [],
  hubFriends: [],
  hubWheel: null,
  hubGachaSpot: null,
  paradeMode: false,
  enemies: [],
  asteroids: [],
  spaceGates: [],
  nextSpaceGateAt: 5,
  boostRings: [],
  boostTimer: 0,
  shockRings: [],
  projectiles: [],
  particles: [],
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
      this.renderer = ThreeShared.getRenderer();
      this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.25, 420);
      this.coinDummy = new THREE.Object3D();
      window.addEventListener('resize', () => {
        if (!this.camera) return;
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
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

  async spawnNormalizedGLB(filename, targetSize = 2.2, castShadow = false) {
    return ThreeShared.spawnGLB(filename, targetSize, castShadow);
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
    const eq = (save && save.equipped) || {};
    const upg = (save && save.upgrades) || {};
    const suit = ARSENAL.suits.find(s => s.id === eq.suits) || ARSENAL.suits[0];
    const weapon = ARSENAL.weapons.find(w => w.id === eq.weapons) || ARSENAL.weapons[0];
    const glove = ARSENAL.gloves.find(g => g.id === eq.gloves) || ARSENAL.gloves[0];
    const gadget = ARSENAL.gadgets.find(g => g.id === eq.gadgets) || ARSENAL.gadgets[0];
    const armor = ARSENAL.armors.find(a => a.id === eq.armors) || ARSENAL.armors[0];
    const ship = ARSENAL.ships.find(s => s.id === eq.ships) || ARSENAL.ships[0];
    const pet = (ARSENAL.pets && ARSENAL.pets.find(p => p.id === eq.pets)) || (ARSENAL.pets ? ARSENAL.pets[0] : { id: 'none_pet', bonusHearts: 0 });
    const weaponLv = upg[weapon.id] || 1;
    const armorLv = upg[armor.id] || 1;
    return { suit, weapon, glove, gadget, armor, ship, pet, weaponLv, armorLv };
  },

  project3D(wx, wy, wz, vw, vh) {
    if (!this.camera || !this.THREE) return null;
    const v = new this.THREE.Vector3(wx, wy, wz);
    v.project(this.camera);
    if (v.z > 1 || v.z < -1) return null;
    return {
      x: (v.x * 0.5 + 0.5) * vw,
      y: (0.5 - v.y * 0.5) * vh
    };
  },

  collectLabels(out, vw, vh) {
    if (!this.active || !this.sceneReady) return;
    // 1. 3D Educational Answer Bridges on Planets!
    for (const grp of this.eduBridges) {
      if (Math.abs(grp.z - this.pz) > 34) continue;
      if (!grp.solved) {
        const pp = this.project3D(0, grp.y + 4.3, grp.z, vw, vh);
        if (pp) out.push({ x: pp.x, y: pp.y, txt: grp.prompt, bg: '#1e3566', fg: '#ffd233', fs: 14.5 });
      }
      for (const b of grp.items) {
        if (b.broken) continue;
        const bp = this.project3D(b.x, b.y + 1.35, b.z, vw, vh);
        if (bp) out.push({ x: bp.x, y: bp.y, txt: b.txt, bg: grp.solved && b.ok ? '#38c962' : '#fffdf5', fg: '#132244', fs: 17 });
      }
    }
    // 2. Starfighter Asteroid Math/English Gates!
    for (const sg of this.spaceGates) {
      if (sg.done) continue;
      const pp = this.project3D(0, 7.2, sg.z, vw, vh);
      if (pp) out.push({ x: pp.x, y: Math.max(88, pp.y), txt: sg.prompt, bg: '#24113b', fg: '#ffd233', fs: 15.5 });
      for (const node of sg.nodes) {
        if (node.hit) continue;
        const np = this.project3D(node.x, node.y + 2.1, sg.z, vw, vh);
        if (np) out.push({ x: np.x, y: np.y, txt: `🎯 ${node.txt}`, bg: '#ffe066', fg: '#132244', fs: 18 });
      }
    }
    // 3. Hub Landmarks!
    if (this.mode === 'hub') {
      const gp = this.project3D(-8.5, 3.6, 2.5, vw, vh);
      if (gp) out.push({ x: gp.x, y: gp.y, txt: '🎰 Sürpriz Kapsül Makinesi (30🪙)', bg: '#ff8533', fg: '#ffffff', fs: 13.5 });
      if (this.hubWheel) {
        const wp = this.project3D(0, 9.5, -15, vw, vh);
        if (wp) out.push({ x: wp.x, y: wp.y, txt: '🎡 Dostlar Dönme Dolabı', bg: '#8854ff', fg: '#ffffff', fs: 13 });
      }
    }
  },

  setupBaseScene(skyTopHex, skyBotHex, denseSpace = false) {
    const THREE = this.THREE;
    const scene = new THREE.Scene();
    if (ThreeShared.envMap) scene.environment = ThreeShared.envMap;
    this.scene = scene;

    const topCol = new THREE.Color(skyTopHex || '#102554');
    const botCol = new THREE.Color(skyBotHex || '#6ad8ff');
    scene.background = topCol.clone().lerp(botCol, 0.42);
    scene.fog = new THREE.FogExp2(scene.background.getHex(), denseSpace ? 0.0050 : 0.0058);

    const hemi = new THREE.HemisphereLight(0xffffff, 0x3b4d7a, 1.38);
    scene.add(hemi);
    const dir = new THREE.DirectionalLight(0xfff6e0, 1.65);
    dir.position.set(24, 46, 24);
    dir.castShadow = true;
    dir.shadow.mapSize.set(768, 768);
    dir.shadow.camera.near = 4;
    dir.shadow.camera.far = 145;
    const d = 42;
    dir.shadow.camera.left = -d; dir.shadow.camera.right = d;
    dir.shadow.camera.top = d; dir.shadow.camera.bottom = -d;
    scene.add(dir);
    this.sunLight = dir;

    const starGeo = new THREE.BufferGeometry();
    const starCount = denseSpace ? 750 : 340;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 260;
      starPos[i * 3 + 1] = (Math.random() - 0.2) * 140;
      starPos[i * 3 + 2] = -Math.random() * 340 + 45;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.6 }));
    scene.add(stars);
    this.starField = stars;

    this.platforms = [];
    this.eduBridges = [];
    this.bouncers = [];
    this.coins = [];
    this.coinInstanced = null;
    this.powerOrbs = [];
    this.heartPickups = [];
    this.chests = [];
    this.saws = [];
    this.cages = [];
    this.hubFriends = [];
    this.hubWheel = null;
    this.enemies = [];
    this.asteroids = [];
    this.spaceGates = [];
    this.nextSpaceGateAt = 5;
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
    this.titanTimer = 0;
    this.chronoTimer = 0;
    this.rescueCamTimer = 0;
    this.rescueCamTarget = null;
    this.camShake = 0;
    this.balloonTimer = 0;
  },

  buildInstancedCoins() {
    if (!this.coins.length) return;
    const THREE = this.THREE;
    const geo = new THREE.CylinderGeometry(0.46, 0.46, 0.14, 14);
    geo.rotateX(Math.PI / 2);
    const mat = new THREE.MeshStandardMaterial({
      color: 0xffd43b,
      metalness: 0.72,
      roughness: 0.22,
      emissive: 0x664400,
      emissiveIntensity: 0.35
    });
    const inst = new THREE.InstancedMesh(geo, mat, this.coins.length);
    inst.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.scene.add(inst);
    this.coinInstanced = inst;
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
    document.getElementById('astroHud').classList.remove('hidden');
    const hs = document.getElementById('hubActionStrip');
    if (hs) hs.classList.add('hidden');

    this.setupBaseScene(ch.theme.skyTop, ch.theme.skyBot, this.mode === 'starfighter');

    const eq = this.getEquippedStats(save);
    this.maxHp = eq.armor.hearts + (eq.armorLv - 1) + (eq.pet.bonusHearts || 0);
    this.hp = Math.min(this.maxHp, callbacks.getHearts ? callbacks.getHearts(this.maxHp) : this.maxHp);

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

  /* ---- YAŞAYAN & BÜYÜYEN 3D KURTARILAN DOSTLAR ÜSSÜ (DÖNME DOLAP + KAPSÜL MAKİNESİ + BOT KULESİ!) ---- */
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
      title: '🌟 Kurtarılan 3D Dostlar Üssü & Bilim Parkı',
      subject: 'ASTRO ÜS', subjectColor: '#ffbe1a',
      rescueModels: []
    };
    this.mode = 'hub';
    this.active = true;
    this.paradeMode = false;
    document.body.classList.add('astro-mode');
    document.getElementById('astroHud').classList.remove('hidden');
    const hs = document.getElementById('hubActionStrip');
    if (hs) hs.classList.remove('hidden');

    this.setupBaseScene('#1b6be0', '#9beeff', false);
    const THREE = this.THREE;
    const eq = this.getEquippedStats(save);
    this.maxHp = eq.armor.hearts + (eq.armorLv - 1) + (eq.pet.bonusHearts || 0);
    this.hp = this.maxHp;

    // Lush Hub Plaza Island + Rippling Sea Rim!
    const sea = new THREE.Mesh(
      new THREE.CircleGeometry(95, 32),
      new THREE.MeshStandardMaterial({ color: 0x22a6f5, roughness: 0.18, metalness: 0.15 })
    );
    sea.rotation.x = -Math.PI / 2;
    sea.position.y = -1.3;
    this.scene.add(sea);

    const mainPlat = new THREE.Group();
    const topM = new THREE.Mesh(new THREE.CylinderGeometry(26, 24, 1.2, 32), new THREE.MeshStandardMaterial({ color: 0x5bd966, roughness: 0.55 }));
    topM.position.y = -0.6; topM.receiveShadow = true;
    const botM = new THREE.Mesh(new THREE.CylinderGeometry(23, 12, 8, 28), new THREE.MeshStandardMaterial({ color: 0xc98a4b, roughness: 0.75 }));
    botM.position.y = -5.2;
    const ringPath = new THREE.Mesh(new THREE.RingGeometry(6.5, 10.5, 32), new THREE.MeshStandardMaterial({ color: 0xffe8a3, side: THREE.DoubleSide }));
    ringPath.rotation.x = -Math.PI / 2;
    ringPath.position.y = 0.03;
    mainPlat.add(topM, botM, ringPath);
    this.scene.add(mainPlat);
    this.platforms.push({ mesh: mainPlat, baseX: 0, baseY: 0, x: 0, y: 0, z: 0, w: 46, d: 46, moveAmpX: 0, moveAmpY: 0, moveSpeed: 0, phase: 0, solid: true });

    const starMon = await this.spawnNormalizedGLB('Star.glb', 4.8);
    starMon.root.position.set(0, 1.2, -5.5);
    this.scene.add(starMon.root);
    this.hubMonument = starMon.root;

    const parkedShip = await this.spawnNormalizedGLB(eq.ship.glb || 'Spaceship_Rae.glb', 5.2);
    parkedShip.root.position.set(12, 0.2, -7);
    parkedShip.root.rotation.y = -0.5;
    this.scene.add(parkedShip.root);

    // 🎰 3D GACHA SURPRISE CAPSULE MACHINE!
    const gachaGrp = new THREE.Group();
    const gBase = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.6, 1.5, 18), new THREE.MeshStandardMaterial({ color: 0xff4c5b, metalness: 0.3, roughness: 0.3 }));
    gBase.position.y = 0.75;
    const gGlass = new THREE.Mesh(new THREE.SphereGeometry(1.45, 18, 14), new THREE.MeshStandardMaterial({ color: 0x9beeff, transparent: true, opacity: 0.55, metalness: 0.4, roughness: 0.1 }));
    gGlass.position.y = 2.25;
    for (let k = 0; k < 6; k++) {
      const capCol = [0xffd233, 0x38c962, 0xa66bff, 0xff8533, 0x3fa4ff, 0xff4c5b][k];
      const ball = new THREE.Mesh(new THREE.SphereGeometry(0.36, 10, 8), new THREE.MeshStandardMaterial({ color: capCol, roughness: 0.2 }));
      ball.position.set(Math.cos(k) * 0.65, 1.85 + (k % 2) * 0.45, Math.sin(k) * 0.65);
      gachaGrp.add(ball);
    }
    gachaGrp.add(gBase, gGlass);
    gachaGrp.position.set(-8.5, 0, 2.5);
    this.scene.add(gachaGrp);
    this.hubGachaSpot = gachaGrp;

    // 🎡 3D FERRIS WHEEL (Unlocks as soon as you visit Hub or rescue bots!)
    const rescuedTotal = (save.rescuedBots || []).length;
    if (rescuedTotal >= 1 || (save.completedChapters || []).length >= 1) {
      const wheelGrp = new THREE.Group();
      wheelGrp.position.set(0, 6.2, -15.5);
      const leg1 = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.35, 7, 8), new THREE.MeshStandardMaterial({ color: 0x1e3566 }));
      leg1.position.set(-2.2, -3.0, 0); leg1.rotation.z = -0.25;
      const leg2 = leg1.clone(); leg2.position.x = 2.2; leg2.rotation.z = 0.25;
      const rotor = new THREE.Group();
      const rim = new THREE.Mesh(new THREE.TorusGeometry(4.6, 0.22, 10, 28), new THREE.MeshStandardMaterial({ color: 0xffd233, metalness: 0.5, roughness: 0.25 }));
      rotor.add(rim);
      for (let s = 0; s < 6; s++) {
        const a = (s / 6) * Math.PI * 2;
        const pod = new THREE.Mesh(new THREE.SphereGeometry(0.62, 12, 10), new THREE.MeshStandardMaterial({ color: [0xff4c5b, 0x38c962, 0x3fa4ff, 0xff8533, 0xa66bff, 0xffd233][s] }));
        pod.position.set(Math.cos(a) * 4.6, Math.sin(a) * 4.6, 0);
        rotor.add(pod);
      }
      wheelGrp.add(leg1, leg2, rotor);
      this.scene.add(wheelGrp);
      this.hubWheel = rotor;
    }

    // Display collected Gacha Trophy Statues on golden pedestals!
    const ownedGacha = save.gachaOwned || [];
    for (let g = 0; g < ownedGacha.length; g++) {
      const def = GACHA_CAPSULES.find(c => c.id === ownedGacha[g]);
      if (!def) continue;
      const gx = -12 + g * 3.2, gz = 9.5;
      const ped = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.9, 0.8, 14), new THREE.MeshStandardMaterial({ color: 0xffd233, metalness: 0.6, roughness: 0.25 }));
      ped.position.set(gx, 0.4, gz);
      this.scene.add(ped);
      const st = await this.spawnNormalizedGLB(def.glb, 1.7);
      st.root.position.set(gx, 0.8, gz);
      this.scene.add(st.root);
    }

    for (let i = 0; i < 6; i++) {
      const ang = (i / 6) * Math.PI * 2;
      const tr = await this.spawnNormalizedGLB('Tree_Fruit.glb', 4.2);
      tr.root.position.set(Math.cos(ang) * 19.5, 0, Math.sin(ang) * 19.5);
      this.scene.add(tr.root);
    }
    const bnc = await this.spawnNormalizedGLB('Bouncer.glb', 1.9);
    bnc.root.position.set(-11, 0, -4);
    this.scene.add(bnc.root);
    this.bouncers.push({ mesh: bnc.root, plat: this.platforms[0], lz: -4, lx: -11 });

    await this.spawnHeroRig(eq);
    this.px = 0; this.py = 1.2; this.pz = 6;
    this.flyInTimer = 0;

    const rescuedIds = (save.rescuedBots && save.rescuedBots.length)
      ? save.rescuedBots.map(k => k.split('_').slice(1).join('_'))
      : ['Fox.glb', 'Duck.glb', 'Astronaut_Frog.glb', 'Trex.glb'];

    const uniqueFiles = Array.from(new Set(rescuedIds)).slice(0, 18);
    for (let i = 0; i < uniqueFiles.length; i++) {
      const fr = await this.spawnNormalizedGLB(uniqueFiles[i], 2.0);
      // First 4 rescued friends build an Astro-Bot Living Totem Tower when >= 6 rescued!
      if (uniqueFiles.length >= 6 && i < 4) {
        fr.root.position.set(8.5, i * 1.85, 2.5);
      } else {
        const ang = (i / uniqueFiles.length) * Math.PI * 2;
        const rad = 6.8 + (i % 2) * 3.0;
        fr.root.position.set(Math.cos(ang) * rad, 0, -4 + Math.sin(ang) * rad);
        fr.root.rotation.y = -ang;
      }
      this.scene.add(fr.root);
      this.playClip(fr, ['dance', 'wave', 'idle', 'walk'], true);
      this.hubFriends.push({ ent: fr, x: fr.root.position.x, y: fr.root.position.y, z: fr.root.position.z, idx: i });
    }

    if (token !== this.loadToken) return false;
    this.sceneReady = true;
    if (lp) lp.classList.add('hidden');
    this.refreshAstroHud();
    AudioSys.setMusicTheme('town');
    return true;
  },

  async spawnGachaInHub(def) {
    if (!this.active || this.mode !== 'hub' || !this.scene) return;
    const idx = ((this.saveRef.gachaOwned || []).length - 1);
    const gx = -12 + idx * 3.2, gz = 9.5;
    const ped = new this.THREE.Mesh(new this.THREE.CylinderGeometry(0.75, 0.9, 0.8, 14), new this.THREE.MeshStandardMaterial({ color: 0xffd233, metalness: 0.6, roughness: 0.25 }));
    ped.position.set(gx, 0.4, gz);
    this.scene.add(ped);
    const st = await this.spawnNormalizedGLB(def.glb, 1.75);
    st.root.position.set(gx, 0.8, gz);
    this.scene.add(st.root);
    this.spawnParticleBurst(gx, 2.0, gz, 0xffd233, 18);
  },

  stop() {
    this.loadToken++;
    this.active = false;
    this.sceneReady = false;
    document.body.classList.remove('astro-mode');
    const lp = document.getElementById('loadingPill');
    const ah = document.getElementById('astroHud');
    const bb = document.getElementById('bossBar');
    if (lp) lp.classList.add('hidden');
    if (ah) ah.classList.add('hidden');
    if (bb) bb.classList.add('hidden');
  },

  async spawnHeroRig(eq) {
    const THREE = this.THREE;
    this.hero = await this.spawnNormalizedGLB(eq.suit.glb || 'RobotExpressive.glb', eq.suit.size || 2.35, true);
    if (eq.suit.goldTint) {
      this.hero.root.traverse(n => {
        if (n.isMesh && n.material) {
          n.material = n.material.clone();
          n.material.color.setHex(0xffd43b);
          n.material.metalness = 0.72;
          n.material.roughness = 0.2;
        }
      });
    }
    this.scene.add(this.hero.root);
    await this.attachEquipmentToHero(eq);
    this.playClip(this.hero, ['idle', 'standing'], true);

    const laserGeo = new THREE.CylinderGeometry(0.11, 0.18, 6, 8);
    const laserMat = new THREE.MeshBasicMaterial({ color: 0x00eeff, transparent: true, opacity: 0.85 });
    this.laserLeft = new THREE.Mesh(laserGeo, laserMat);
    this.laserRight = new THREE.Mesh(laserGeo, laserMat);
    this.laserLeft.visible = false;
    this.laserRight.visible = false;
    this.scene.add(this.laserLeft, this.laserRight);

    const wScale = 1 + (eq.weaponLv - 1) * 0.14;
    const slashGeo = new THREE.RingGeometry(1.0, (eq.weapon.range || 3.8) * 0.72 * wScale, 24);
    slashGeo.rotateX(-Math.PI / 2);
    this.slashRing = new THREE.Mesh(
      slashGeo,
      new THREE.MeshBasicMaterial({ color: eq.weapon.color || '#5effc8', side: THREE.DoubleSide, transparent: true, opacity: 0 })
    );
    this.scene.add(this.slashRing);

    const dsGeo = new THREE.RingGeometry(0.36, 0.80, 20);
    dsGeo.rotateX(-Math.PI / 2);
    this.dropShadow = new THREE.Mesh(
      dsGeo,
      new THREE.MeshBasicMaterial({ color: 0x00eeff, side: THREE.DoubleSide, transparent: true, opacity: 0.82 })
    );
    this.scene.add(this.dropShadow);

    this.balloonMesh = new THREE.Mesh(
      new THREE.SphereGeometry(1.25, 14, 12),
      new THREE.MeshStandardMaterial({ color: 0xff4da6, roughness: 0.25 })
    );
    this.balloonMesh.position.set(0, 2.9, 0);
    this.balloonMesh.visible = false;
    this.hero.root.add(this.balloonMesh);

    const sbGeo = new THREE.CylinderGeometry(0.12, 0.12, 1, 8);
    sbGeo.rotateX(Math.PI / 2);
    this.springBeam = new THREE.Mesh(
      sbGeo,
      new THREE.MeshBasicMaterial({ color: 0x52ff7a, transparent: true, opacity: 0.88 })
    );
    this.springBeam.visible = false;
    this.scene.add(this.springBeam);

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
      const lvScale = 1.65 + (eq.weaponLv - 1) * 0.16;
      const wm = await this.spawnNormalizedGLB(eq.weapon.glb, lvScale);
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

    // Spawn 3D Companion Pet / Wingman!
    if (this.petEnt && this.scene) {
      this.scene.remove(this.petEnt.root);
      this.petEnt = null;
    }
    if (eq.pet && eq.pet.glb && this.scene) {
      this.petEnt = await this.spawnNormalizedGLB(eq.pet.glb, 1.35);
      this.scene.add(this.petEnt.root);
      this.playClip(this.petEnt, ['fly', 'walk', 'idle'], true);
    }
  },

  async buildPlatformerStage(ch, eq) {
    const THREE = this.THREE;
    const scene = this.scene;

    await this.spawnHeroRig(eq);

    this.introShip = await this.spawnNormalizedGLB(eq.ship.glb || 'Spaceship_Rae.glb', 3.8);
    this.introShip.inner.rotation.y = Math.PI;
    scene.add(this.introShip.root);
    this.flyInTimer = 1.45;
    AudioSys.tone(260, 0.45, 'sawtooth', 0.1, 0, 620);

    if (ch.theme.planet) {
      const bgP = await this.spawnNormalizedGLB(ch.theme.planet, 28);
      bgP.root.position.set(-38, 22, -135);
      scene.add(bgP.root);
    }
    for (let cl = 0; cl < 4; cl++) {
      const cloud = await this.spawnNormalizedGLB('Cloud_1.glb', 6.5);
      cloud.root.position.set((cl % 2 === 0 ? -18 : 18), 8 + cl * 2, -18 - cl * 28);
      scene.add(cloud.root);
    }

    const platColor = new THREE.Color(ch.theme.plat || '#59d665');
    const sideColor = new THREE.Color(ch.theme.side || '#b87a3d');
    const diff = ch.difficulty || 1;
    const isIce = ch.id === 'ch16';
    const isMagma = ch.id === 'ch17';
    const isNeon = ch.id === 'ch19' || ch.id === 'ch20' || ch.id === 'ch21';

    const addPlat = async (x, y, z, w, d, moveAmpX = 0, moveSpeed = 1.4, checkpoint = false, moveAmpY = 0, holo = false) => {
      const grp = new THREE.Group();
      const topMat = new THREE.MeshStandardMaterial({
        color: holo ? 0x00f5d4 : platColor,
        roughness: isIce ? 0.14 : 0.48,
        metalness: isIce ? 0.28 : 0.08,
        emissive: holo ? 0x005566 : 0x000000,
        transparent: holo,
        opacity: holo ? 0.88 : 1.0
      });
      const topM = new THREE.Mesh(new THREE.BoxGeometry(w, 0.75, d), topMat);
      topM.position.y = -0.37;
      topM.receiveShadow = true;
      const bodyM = new THREE.Mesh(
        new THREE.BoxGeometry(w * 0.9, 2.8, d * 0.9),
        new THREE.MeshStandardMaterial({ color: sideColor, roughness: 0.72 })
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

    const addEduBridgeGroup = (z, y, bridgeIdx) => {
      const chData = ASTRO_BRIDGE_CHALLENGES[(ch.num + bridgeIdx * 3) % ASTRO_BRIDGE_CHALLENGES.length];
      const grpObj = { z, y, prompt: chData.prompt, solved: false, items: [] };
      const xs = [-5.2, 0, 5.2];
      chData.bridges.forEach((bDef, idx) => {
        const mat = new THREE.MeshStandardMaterial({
          color: bDef.col,
          emissive: bDef.col,
          emissiveIntensity: 0.28,
          roughness: 0.25,
          metalness: 0.2
        });
        const m = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.55, 6.8), mat);
        m.position.set(xs[idx], y - 0.28, z);
        scene.add(m);
        const pObj = { mesh: m, topMat: mat, baseX: xs[idx], baseY: y, x: xs[idx], y, z, w: 3.8, d: 6.8, moveAmpX: 0, moveAmpY: 0, moveSpeed: 0, phase: 0, solid: true, eduBridge: null };
        const bItem = { txt: bDef.txt, ok: bDef.ok, x: xs[idx], y, z, mesh: m, mat, plat: pObj, broken: false, parent: grpObj };
        pObj.eduBridge = bItem;
        this.platforms.push(pObj);
        grpObj.items.push(bItem);
      });
      this.eduBridges.push(grpObj);
    };

    await addPlat(0, 0, 0, 11.5, 11.5, 0, 0, true);
    this.px = 0; this.py = 1.5; this.pz = 0;
    this.vx = 0; this.vy = 0; this.vz = 0;
    this.checkpoint = { x: 0, y: 2, z: 0 };

    let curZ = -12.0;
    let curY = 0.5;
    const islandCount = 8 + Math.min(4, diff);

    for (let i = 0; i < islandCount; i++) {
      // Insert 2 In-World 3D Educational Bridge Chasms at i===2 and i===6!
      if (i === 2 || i === 6) {
        addEduBridgeGroup(curZ, curY + 0.4, i === 2 ? 0 : 1);
        curZ -= 10.5;
      }

      const w = Math.max(6.4, 9.2 - diff * 0.22 + (i % 2) * 1.5);
      const d = Math.max(6.4, 8.6 - diff * 0.18);
      const ox = (i % 3 === 0) ? 0 : (i % 2 === 0 ? 4.2 : -4.2);
      const isCp = (i === Math.floor(islandCount / 2));
      const moveAmp = (!isCp && i % 2 === 1 && !isMagma) ? (2.0 + diff * 0.45) : 0;
      const moveAmpY = (!isCp && isMagma && i % 2 === 1) ? 2.2 : 0;
      const holo = (!isCp && isNeon && i % 3 === 2);
      const pl = await addPlat(ox, curY, curZ, w, d, moveAmp, 1.15 + diff * 0.15, isCp, moveAmpY, holo);

      if (moveAmp === 0 && ch.theme.tree && i % 2 === 0) {
        const deco = await this.spawnNormalizedGLB(ch.theme.tree, 3.1);
        deco.root.position.set(-w * 0.35, 0, -d * 0.32);
        pl.mesh.add(deco.root);
      }

      // Queue Coin data for single 1-Draw-Call InstancedMesh!
      for (let c = -1; c <= 1; c++) {
        this.coins.push({ x: ox + c * 1.55, y: curY + 0.85, z: curZ, taken: false });
      }

      // Mega-Titan Growth Crystal (i===3) & Chrono Slow-Time Crystal (i===5) & Heart Pickup (isCp)!
      if (i === 3) {
        const starM = await this.spawnNormalizedGLB('Star.glb', 1.65);
        starM.root.position.set(ox, curY + 0.9, curZ - 1.4);
        scene.add(starM.root);
        this.powerOrbs.push({ mesh: starM.root, plat: pl, lx: 0, lz: -1.4, kind: 'titan', taken: false });
      } else if (i === 5 && diff >= 3) {
        const gemM = await this.spawnNormalizedGLB('Gem_Blue.glb', 1.45);
        gemM.root.position.set(ox, curY + 0.9, curZ - 1.4);
        scene.add(gemM.root);
        this.powerOrbs.push({ mesh: gemM.root, plat: pl, lx: 0, lz: -1.4, kind: 'chrono', taken: false });
      }
      if (isCp) {
        const hEnt = await this.spawnNormalizedGLB('Heart.glb', 1.35);
        hEnt.root.position.set(ox + 2.0, curY + 0.9, curZ);
        scene.add(hEnt.root);
        this.heartPickups.push({ mesh: hEnt.root, x: ox + 2.0, y: curY + 0.9, z: curZ, taken: false });
      }

      if (i % 4 === 2) {
        const chEnt = await this.spawnNormalizedGLB('Chest.glb', 1.45);
        chEnt.root.position.set(ox + w * 0.28, curY, curZ - d * 0.24);
        scene.add(chEnt.root);
        this.chests.push({ mesh: chEnt.root, plat: pl, lx: w * 0.28, lz: -d * 0.24, opened: false });
      }

      if (diff >= 3 && i % 3 === 2) {
        const sawEnt = await this.spawnNormalizedGLB('Hazard_Saw.glb', 1.55);
        sawEnt.root.position.set(ox, curY + 0.2, curZ);
        scene.add(sawEnt.root);
        this.saws.push({ mesh: sawEnt.root, plat: pl, phase: i, frozen: 0 });
      }

      if (i % 3 === 1) {
        const bm = await this.spawnNormalizedGLB('Bouncer.glb', 1.75);
        bm.root.position.set(ox, curY, curZ + 1.2);
        scene.add(bm.root);
        this.bouncers.push({ mesh: bm.root, plat: pl, lx: 0, lz: 1.2 });
      }

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

      curZ -= (10.2 + Math.min(3.0, diff * 0.35));
      curY += (i % 3 === 1) ? 2.2 : 0.4;
    }

    // Build 1-Draw-Call InstancedMesh for all coins!
    this.buildInstancedCoins();

    // 3 Side Rescue Islands with Smart-Locked Caged .glb Friends!
    const rescueFiles = ch.rescueModels || ['Fox.glb', 'Duck.glb', 'Parrot.glb'];
    for (let r = 0; r < rescueFiles.length; r++) {
      const targetPlat = this.platforms[3 + r * 3] || this.platforms[2];
      const sideX = (r % 2 === 0 ? 1 : -1) * 9.0;
      const rPlat = await addPlat(targetPlat.baseX + sideX, targetPlat.baseY + 0.7, targetPlat.z, 6.4, 6.4, 0, 0, false);

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
        x: rPlat.x, y: rPlat.y, z: rPlat.z,
        prompting: false, rescued: false
      });
    }

    // Pre-Boss Interactive Gate Island
    const gatePlat = await addPlat(0, curY, curZ - 3, 12.5, 10, 0, 0, true);
    const gateArch = new THREE.Mesh(
      new THREE.TorusGeometry(3.3, 0.4, 12, 26, Math.PI),
      new THREE.MeshStandardMaterial({ color: 0xffbe1a, metalness: 0.6, roughness: 0.25 })
    );
    gateArch.position.set(0, gatePlat.y, gatePlat.z - 2.5);
    const gateShield = new THREE.Mesh(
      new THREE.PlaneGeometry(6.0, 4.0),
      new THREE.MeshBasicMaterial({ color: 0x33d6ff, transparent: true, opacity: 0.55, side: THREE.DoubleSide })
    );
    gateShield.position.set(0, gatePlat.y + 1.8, gatePlat.z - 2.5);
    scene.add(gateArch, gateShield);
    this.gate = { x: 0, y: gatePlat.y, z: gatePlat.z - 2.5, shield: gateShield, unlocked: false };

    // GIANT BOSS ARENA ISLAND + 50% HP ENERGY SHIELD!
    const bossZ = curZ - 23;
    await addPlat(0, curY, bossZ, 25, 25, 0, 0, false);
    const bossEnt = await this.spawnNormalizedGLB(ch.bossModel || 'Stan.glb', 5.8, true);
    bossEnt.root.position.set(0, curY, bossZ - 4);
    scene.add(bossEnt.root);
    this.playClip(bossEnt, ['idle', 'walk', 'run'], true);

    const bossShieldMesh = new THREE.Mesh(
      new THREE.SphereGeometry(3.8, 16, 14),
      new THREE.MeshBasicMaterial({ color: 0x00eeff, wireframe: true, transparent: true, opacity: 0.65 })
    );
    bossShieldMesh.visible = false;
    scene.add(bossShieldMesh);

    this.boss = {
      ent: bossEnt,
      shieldMesh: bossShieldMesh,
      shielded: false,
      shieldDone: false,
      shieldPrompting: false,
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
    const scene = this.scene;
    this.hero = await this.spawnNormalizedGLB(eq.ship.glb || 'Spaceship_Rae.glb', 3.5, true);
    this.hero.inner.rotation.y = Math.PI;
    scene.add(this.hero.root);

    if (eq.pet && eq.pet.glb) {
      this.petEnt = await this.spawnNormalizedGLB(eq.pet.glb, 1.5);
      this.petEnt.inner.rotation.y = Math.PI;
      scene.add(this.petEnt.root);
    }

    this.px = 0; this.py = 0; this.pz = 0;
    this.vx = 0; this.vy = 0; this.vz = 0;
    this.killsCount = 0;
    this.nextSpaceGateAt = 5;
    this.gateUnlocked = false;
    this.spawnTimer = 0.6;
    this.ringTimer = 2.8;
    this.asteroidTimer = 1.6;
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

  spawnParticleBurst(x, y, z, colorHex = 0xffdd33, count = 10) {
    if (this.particles.length > 48) return; // Cap particles for 60 FPS iPad budget!
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
        life: 0.48 + Math.random() * 0.25
      });
    }
  },

  unlockCageSuccess(cg) {
    if (cg.rescued) return;
    cg.rescued = true;
    cg.prompting = false;
    this.scene.remove(cg.cageMesh);
    this.rescuedCount++;
    this.playClip(cg.friend, ['dance', 'jump', 'wave', 'run'], true);
    AudioSys.playFanfare();
    this.spawnParticleBurst(cg.x, cg.y + 1.5, cg.z, 0xffdd33, 14);
    // Astro-Bot Rescue Celebration Camera Zoom!
    this.rescueCamTimer = 1.15;
    this.rescueCamTarget = { x: cg.x, y: cg.y + 1.2, z: cg.z };
    this.callbacks.onRescueBot(`${this.chapter.id}_${cg.file}`, cg.file.replace('.glb', ''), cg.file);
    this.refreshAstroHud();
  },

  tryOpenCage(cg) {
    if (cg.rescued || cg.prompting) return;
    if (this.callbacks.onCagePuzzle) {
      cg.prompting = true;
      this.callbacks.onCagePuzzle(this.chapter, cg, () => {
        this.unlockCageSuccess(cg);
      }, () => {
        cg.prompting = false;
      });
    } else {
      this.unlockCageSuccess(cg);
    }
  },

  triggerAttack() {
    if (!this.active || !this.sceneReady || !this.hero || this.atkCd > 0 || this.flyInTimer > 0) return;
    const eq = this.getEquippedStats(this.saveRef);

    if (this.mode === 'starfighter') {
      this.atkCd = 0.18;
      AudioSys.tone(820, 0.06, 'sawtooth', 0.08, 0, 320);
      const count = eq.ship.shots || 2;
      const dmg = 1 + Math.floor((eq.weapon.dmg + eq.weaponLv - 1) * 0.4);
      for (let i = 0; i < count; i++) {
        const spread = (i - (count - 1) / 2) * 0.85;
        const bolt = new this.THREE.Mesh(
          new this.THREE.SphereGeometry(0.28, 8, 8),
          new this.THREE.MeshBasicMaterial({ color: 0x00ffcc })
        );
        bolt.position.set(this.px + spread * 0.75, this.py, -2.0);
        this.scene.add(bolt);
        this.projectiles.push({ mesh: bolt, vx: spread * 2.2, vy: 0, vz: -72, dmg, enemy: false, life: 2.1 });
      }
      // Wingman bonus shot!
      if (this.petEnt && eq.pet.autoShot) {
        const wBolt = new this.THREE.Mesh(
          new this.THREE.SphereGeometry(0.26, 8, 8),
          new this.THREE.MeshBasicMaterial({ color: 0xffdd33 })
        );
        wBolt.position.copy(this.petEnt.root.position);
        this.scene.add(wBolt);
        this.projectiles.push({ mesh: wBolt, vx: 0, vy: 0, vz: -74, dmg, enemy: false, life: 2.0 });
      }
      return;
    }

    this.atkCd = 0.32;
    this.atkAnim = 0.28;
    AudioSys.tone(520, 0.09, 'triangle', 0.14, 0, 220);
    this.playClip(this.hero, ['punch', 'attack', 'wave'], false);

    if (this.slashRing) {
      this.slashRing.position.set(this.px, this.py + 0.9, this.pz);
      this.slashRing.material.opacity = 0.92;
      this.slashRing.scale.set(0.65, 1, 0.65);
    }

    const titanMult = this.titanTimer > 0 ? 1.65 : 1.0;
    const range = ((eq.weapon.range || 3.8) + (eq.weaponLv - 1) * 0.35) * titanMult;
    const dmg = ((eq.weapon.dmg || 1) + (eq.weaponLv - 1)) * (this.titanTimer > 0 ? 2 : 1);
    if (eq.weapon.id.includes('hammer') || this.titanTimer > 0) {
      this.camShake = 0.4;
      AudioSys.playStomp(0.85);
    }

    for (const ch of this.chests) {
      if (!ch.opened && Math.hypot(ch.mesh.position.x - this.px, ch.mesh.position.z - this.pz) < range + 1.0) {
        ch.opened = true;
        this.scene.remove(ch.mesh);
        AudioSys.playFanfare();
        this.spawnParticleBurst(ch.mesh.position.x, ch.mesh.position.y + 1, ch.mesh.position.z, 0xffd43b, 14);
        this.callbacks.onCoins(20);
        this.callbacks.onToast('🎁 Hazine Sandığı Açıldı: +20 🪙 Altın!');
      }
    }

    for (const cg of this.cages) {
      if (!cg.rescued && Math.hypot(cg.x - this.px, cg.z - this.pz) < range + 1.4 && Math.abs(cg.y - this.py) < 3.6) {
        this.tryOpenCage(cg);
      }
    }

    for (const en of this.enemies) {
      if (en.dead) continue;
      const ex = en.ent.root.position.x, ey = en.ent.root.position.y, ez = en.ent.root.position.z;
      if (Math.hypot(ex - this.px, ez - this.pz) < range && Math.abs(ey - this.py) < 3.2) {
        this.damageEnemy(en, dmg);
      }
    }

    for (const pr of this.projectiles) {
      if (pr.enemy && pr.reflectable && Math.hypot(pr.mesh.position.x - this.px, pr.mesh.position.z - this.pz) < range + 1.4) {
        pr.enemy = false;
        pr.dmg = 4;
        pr.life = 2.4;
        if (this.boss && !this.boss.dead) {
          const dx = this.boss.x - pr.mesh.position.x, dy = (this.boss.y + 1.8) - pr.mesh.position.y, dz = this.boss.z - pr.mesh.position.z;
          const dl = Math.hypot(dx, dy, dz) || 1;
          pr.vx = (dx / dl) * 28; pr.vy = (dy / dl) * 28; pr.vz = (dz / dl) * 28;
        }
        pr.mesh.material.color.setHex(0x52ff7a);
        AudioSys.playFanfare();
        this.callbacks.onToast('🎾 Şaka Bombasını Boss\'a Geri Fırlattın!');
      }
    }

    if (this.boss && !this.boss.dead) {
      if (Math.hypot(this.boss.x - this.px, this.boss.z - this.pz) < range + 2.6 && Math.abs(this.boss.y - this.py) < 4.5) {
        const crit = this.boss.dizzy > 0 ? 2 : 1;
        if (crit > 1) this.callbacks.onToast('💥 SÜPER KRİTİK VURUŞ (2x)!');
        this.damageBoss(dmg * crit);
      }
    }
  },

  triggerGadget() {
    if (!this.active || !this.sceneReady || !this.hero || this.gadgetCd > 0 || this.flyInTimer > 0) return;

    if (this.mode === 'hub') {
      if (this.hubGachaSpot && Math.hypot(this.px - (-8.5), this.pz - 2.5) < 4.5 && this.callbacks.onHubGacha) {
        this.callbacks.onHubGacha();
        return;
      }
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
          dmg: 3 + eq.weaponLv, homing: true, enemy: false, life: 2.8
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

    this.gadgetCd = 0.65;
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
          new THREE.SphereGeometry(0.5, 10, 8),
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
        dmg: 2 + Math.floor((eq.weapon.dmg + eq.weaponLv) * 0.5),
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
      this.dashCd = 0.9;
      this.vx += Math.sin(this.yaw) * 10;
      this.vz += Math.cos(this.yaw) * 10;
      return;
    }
    this.dashCd = 1.0;
    this.dashTimer = 0.24;
    AudioSys.playPuff();
    this.spawnParticleBurst(this.px, this.py + 0.8, this.pz, 0x00eeff, 7);
  },

  damageEnemy(en, dmg, chill = false) {
    en.hp -= dmg;
    if (chill) en.chill = 3.5;
    this.spawnParticleBurst(en.ent.root.position.x, en.ent.root.position.y + 1, en.ent.root.position.z, 0xffaa22, 6);
    if (en.hp <= 0) {
      en.dead = true;
      this.scene.remove(en.ent.root);
      AudioSys.playPickup();
      this.callbacks.onCoins(4);
    }
  },

  damageBoss(dmg, chill = false) {
    if (!this.boss || this.boss.dead) return;
    if (this.boss.shielded) {
      if (!this.boss.shieldPrompting && this.callbacks.onBossShieldQuiz) {
        this.boss.shieldPrompting = true;
        this.callbacks.onBossShieldQuiz(this.chapter, () => {
          this.boss.shielded = false;
          this.boss.shieldDone = true;
          this.boss.shieldPrompting = false;
          if (this.boss.shieldMesh) this.boss.shieldMesh.visible = false;
          this.boss.dizzy = 3.5;
          AudioSys.playFanfare();
          this.callbacks.onToast('⚡ Boss Kalkanı Kırıldı! 3.5 sn SERSEMLEDİ (2x HASAR)!');
          this.refreshAstroHud();
        }, () => {
          this.boss.shieldPrompting = false;
        });
      }
      return;
    }

    this.boss.hp = Math.max(0, this.boss.hp - dmg);
    if (chill) this.boss.chill = 3.2;
    this.spawnParticleBurst(this.boss.x, this.boss.y + 2.5, this.boss.z, 0xff3b6b, 10);
    AudioSys.tone(240, 0.12, 'sawtooth', 0.14, 0, 120);

    // Activate 50% HP Boss Energy Shield Duel in Platformer!
    if (this.mode === 'platformer' && !this.boss.shieldDone && this.boss.hp > 0 && this.boss.hp <= Math.ceil(this.boss.maxHp * 0.5)) {
      this.boss.shielded = true;
      if (this.boss.shieldMesh) {
        this.boss.shieldMesh.position.set(this.boss.x, this.boss.y + 2.2, this.boss.z);
        this.boss.shieldMesh.visible = true;
      }
      this.callbacks.onToast('🛡️ Boss Yarı-Can Kalkanı Açtı! Vurarak Şifre Düellosunu Başlat!');
    }

    this.refreshAstroHud();

    if (this.boss.hp <= 0) {
      this.boss.dead = true;
      this.scene.remove(this.boss.ent.root);
      if (this.boss.shieldMesh) this.scene.remove(this.boss.shieldMesh);
      this.spawnParticleBurst(this.boss.x, this.boss.y + 2.5, this.boss.z, 0xffdd33, 28);
      AudioSys.playFanfare();
      setTimeout(() => {
        if (this.active) this.callbacks.onChapterWin(this.chapter);
      }, 950);
    }
  },

  hurtPlayer(reason = 'Engele çarptın!') {
    if (this.invuln > 0 || this.titanTimer > 0 || this.mode === 'hub') return;
    const eq = this.getEquippedStats(this.saveRef);
    if (eq.gadget.shield && Math.random() < eq.gadget.shield) {
      this.invuln = 1.1;
      this.callbacks.onToast('🛡️ Altın Kalkan darbeyi engelledi!');
      AudioSys.playPickup();
      return;
    }
    this.invuln = 1.5;
    this.camShake = 0.45;
    if (this.callbacks && this.callbacks.onLoseHeart) {
      this.hp = this.callbacks.onLoseHeart(reason);
    } else {
      this.hp = Math.max(0, this.hp - 1);
    }
    this.refreshAstroHud();
  },

  respawnAtCheckpoint(fullHp) {
    this.hp = fullHp || this.maxHp;
    if (this.mode === 'platformer') {
      this.px = this.checkpoint.x;
      this.py = this.checkpoint.y + 2.4;
      this.pz = this.checkpoint.z;
      this.vx = 0; this.vy = 0; this.vz = 0;
    }
    this.invuln = 1.8;
    this.refreshAstroHud();
  },

  refreshAstroHud() {
    const elHearts = document.getElementById('astroHearts');
    const elBots = document.getElementById('astroBots');
    const elGear = document.getElementById('astroGearLabel');
    const eq = this.getEquippedStats(this.saveRef);
    if (elHearts) elHearts.textContent = '❤️'.repeat(Math.max(0, this.hp)) + '🖤'.repeat(Math.max(0, this.maxHp - this.hp));
    if (elBots) {
      if (this.mode === 'starfighter') {
        elBots.textContent = `🛸 Filo: ${this.killsCount}/${this.chapter.targetKills || 14}`;
      } else if (this.mode === 'hub') {
        elBots.textContent = `🌟 Üs: ${this.hubFriends.length} Dost · ${(this.saveRef.gachaOwned || []).length}/${GACHA_CAPSULES.length} Heykel`;
      } else {
        elBots.textContent = `🤖 Dost: ${this.rescuedCount}/${(this.chapter.rescueModels || []).length}`;
      }
    }
    if (elGear) {
      elGear.textContent = this.mode === 'starfighter'
        ? `${eq.ship.icon} ${eq.ship.name}`
        : `${eq.suit.icon} · ${eq.weapon.icon} Lv.${eq.weaponLv} · ${eq.glove.icon}`;
    }

    const bossBar = document.getElementById('bossBar');
    const bossName = document.getElementById('bossName');
    const bossPips = document.getElementById('bossPips');
    if (this.boss && !this.boss.dead && (this.mode === 'starfighter' || this.pz < this.boss.arenaZ + 21)) {
      bossBar.classList.remove('hidden');
      const dzTag = this.boss.shielded ? ' 🛡️ KALKAN AKTİF!' : this.boss.dizzy > 0 ? ' 💫 SERSEMLEDİ (2x)!' : '';
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
    this.titanTimer = Math.max(0, this.titanTimer - dt);
    this.chronoTimer = Math.max(0, this.chronoTimer - dt);
    this.camShake = Math.max(0, this.camShake - dt * 2.2);

    if (this.mode === 'starfighter') {
      this.updateStarfighter(dt, input);
    } else {
      this.updatePlatformer(dt, input);
    }

    const slowFactor = this.chronoTimer > 0 ? 0.35 : 1.0;

    for (let i = this.shockRings.length - 1; i >= 0; i--) {
      const sr = this.shockRings[i];
      sr.r += dt * 11 * slowFactor;
      sr.mesh.scale.set(sr.r, sr.r, 1);
      const dPlayer = Math.hypot(this.px - sr.x, this.pz - sr.z);
      if (Math.abs(dPlayer - sr.r) < 0.75 && this.py < sr.y + 1.1) {
        this.hurtPlayer('Boss şok halkasına çarptın!');
      }
      if (sr.r > 16) {
        this.scene.remove(sr.mesh);
        this.shockRings.splice(i, 1);
      }
    }

    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const pr = this.projectiles[i];
      const pDt = pr.enemy ? dt * slowFactor : dt;
      pr.life -= pDt;

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

      pr.mesh.position.x += pr.vx * pDt;
      pr.mesh.position.y += pr.vy * pDt;
      pr.mesh.position.z += pr.vz * pDt;
      let remove = pr.life <= 0;

      if (pr.enemy) {
        if (Math.hypot(pr.mesh.position.x - this.px, pr.mesh.position.y - (this.py + 1.0), pr.mesh.position.z - this.pz) < 1.35) {
          this.hurtPlayer('Düşman mermisine çarptın!');
          remove = true;
        }
      } else {
        for (const ch of this.chests) {
          if (!ch.opened && Math.hypot(ch.mesh.position.x - pr.mesh.position.x, (ch.mesh.position.y + 0.8) - pr.mesh.position.y, ch.mesh.position.z - pr.mesh.position.z) < 2.1) {
            ch.opened = true;
            this.scene.remove(ch.mesh);
            AudioSys.playFanfare();
            this.spawnParticleBurst(ch.mesh.position.x, ch.mesh.position.y + 1, ch.mesh.position.z, 0xffd43b, 14);
            this.callbacks.onCoins(20);
            this.callbacks.onToast('🧤 Eldivenle Hazine Sandığı Açıldı: +20 🪙!');
            remove = true; break;
          }
        }
        if (pr.chill) {
          for (const sw of this.saws) {
            if (Math.hypot(sw.mesh.position.x - pr.mesh.position.x, sw.mesh.position.z - pr.mesh.position.z) < 2.2) {
              sw.frozen = 4.0;
              this.callbacks.onToast('❄️ Buz Eldiveni Testereyi Dondurdu!');
            }
          }
        }
        for (const other of this.projectiles) {
          if (other !== pr && other.enemy && other.reflectable && Math.hypot(other.mesh.position.x - pr.mesh.position.x, other.mesh.position.z - pr.mesh.position.z) < 2.2) {
            other.enemy = false; other.dmg = 4; other.life = 2.4;
            if (this.boss && !this.boss.dead) {
              const dx = this.boss.x - other.mesh.position.x, dy = (this.boss.y + 1.8) - other.mesh.position.y, dz = this.boss.z - other.mesh.position.z;
              const dl = Math.hypot(dx, dy, dz) || 1;
              other.vx = (dx / dl) * 28; other.vy = (dy / dl) * 28; other.vz = (dz / dl) * 28;
            }
            other.mesh.material.color.setHex(0x52ff7a);
            AudioSys.playFanfare();
            remove = true; break;
          }
        }
        for (const cg of this.cages) {
          if (!cg.rescued && Math.hypot(cg.x - pr.mesh.position.x, (cg.y + 1.2) - pr.mesh.position.y, cg.z - pr.mesh.position.z) < 2.0) {
            this.tryOpenCage(cg);
            remove = true; break;
          }
        }
        // Starfighter Educational Asteroid Gate Check!
        for (const sg of this.spaceGates) {
          if (sg.done || remove) continue;
          for (const nd of sg.nodes) {
            if (nd.hit) continue;
            if (Math.hypot(nd.x - pr.mesh.position.x, nd.y - pr.mesh.position.y, sg.z - pr.mesh.position.z) < 2.6) {
              nd.hit = true;
              this.scene.remove(nd.mesh);
              if (nd.ok) {
                sg.done = true;
                for (const o of sg.nodes) { if (o.mesh) this.scene.remove(o.mesh); }
                this.boostTimer = 2.5;
                AudioSys.playFanfare();
                this.callbacks.onCoins(15);
                this.callbacks.onToast('✅ DOĞRU ASTEROİT! Süper Hız +15 🪙!');
              } else {
                this.hurtPlayer('Yanlış asteroiti vurdun! Soruyu dikkatli hesapla!');
              }
              remove = true; break;
            }
          }
        }
        for (const ast of this.asteroids) {
          if (ast.dead || remove) continue;
          const ap = ast.ent.root.position;
          if (Math.hypot(ap.x - pr.mesh.position.x, ap.y - pr.mesh.position.y, ap.z - pr.mesh.position.z) < 2.8) {
            ast.hp -= pr.dmg;
            if (ast.hp <= 0) {
              ast.dead = true;
              this.scene.remove(ast.ent.root);
              AudioSys.playPickup();
              this.callbacks.onCoins(5);
            }
            remove = true; break;
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
            remove = true; break;
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
    const slowFactor = this.chronoTimer > 0 ? 0.35 : 1.0;

    if (this.flyInTimer > 0) {
      this.flyInTimer -= dt;
      const u = Math.max(0, this.flyInTimer / 1.45);
      if (this.introShip) {
        this.introShip.root.position.set(Math.sin(u * 3) * 6, 3.2 + u * 13, u * 20);
        this.hero.root.position.set(this.introShip.root.position.x, this.introShip.root.position.y + 1.2, this.introShip.root.position.z);
        this.camera.position.set(0, 9 + u * 8, 16 + u * 13);
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

    if (this.mode === 'hub') {
      if (this.hubMonument) this.hubMonument.rotation.y += dt * 1.1;
      if (this.hubWheel) this.hubWheel.rotation.z += dt * 0.45;
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
        pl.x = pl.baseX + Math.sin(t * pl.moveSpeed * slowFactor + pl.phase) * pl.moveAmpX;
        pl.mesh.position.x = pl.x;
      }
      if (pl.moveAmpY > 0) {
        pl.y = pl.baseY + Math.sin(t * pl.moveSpeed * 0.85 * slowFactor + pl.phase) * pl.moveAmpY;
        pl.mesh.position.y = pl.y;
      }
      if (pl.holo && pl.topMat) {
        const wave = Math.sin(t * 1.35 * slowFactor + pl.phase);
        pl.solid = wave > -0.62;
        pl.topMat.opacity = pl.solid ? (wave < -0.25 ? 0.45 : 0.88) : 0.14;
      }
      pl.dx = pl.x - prevX;
      pl.dy = pl.y - prevY;
    }

    const speed = this.dashTimer > 0 ? 22 : (isIce ? 12.2 : 10.8);
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
      this.coyote = 0.15;
      this.jumpsLeft = 2;
      this.hoverFuel = eq.gadget.hoverSec || 1.5;
      this.hovering = false;
    } else {
      this.coyote = Math.max(0, this.coyote - dt);
    }

    if (input.jumpPressed) {
      input.jumpPressed = false;
      if (this.coyote > 0 || this.jumpsLeft > 0) {
        this.vy = this.coyote > 0 ? 13.8 : 12.4;
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
      const withinXZ = Math.abs(this.px - pl.x) <= pl.w * 0.5 + 0.44 && Math.abs(this.pz - pl.z) <= pl.d * 0.5 + 0.44;
      if (withinXZ && pl.y <= this.py + 0.3 && pl.y > shadowY) {
        shadowY = pl.y;
      }
      if (withinXZ && this.vy <= 0 && prevY >= pl.y - 0.58 && this.py <= pl.y + 0.35) {
        // Check 3D Educational Answer Bridge!
        if (pl.eduBridge && !pl.eduBridge.parent.solved) {
          const bItem = pl.eduBridge;
          if (bItem.ok) {
            bItem.parent.solved = true;
            bItem.mat.color.setHex(0xffd233);
            AudioSys.playFanfare();
            this.spawnParticleBurst(bItem.x, bItem.y + 1, bItem.z, 0xffd233, 14);
            this.callbacks.onCoins(12);
            this.callbacks.onToast('✅ DOĞRU 3D KÖPRÜ! (+12 🪙)');
          } else {
            bItem.broken = true;
            pl.solid = false;
            this.scene.remove(bItem.mesh);
            this.hurtPlayer('Yanlış 3D cevap köprüsüne bastın!');
            continue;
          }
        }
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
      } else if (!this.grounded && !pl.eduBridge && this.vy <= 1.2 && this.py >= pl.y - 1.45 && this.py < pl.y - 0.12) {
        // ASTRO-BOT LEDGE-GRAB & AUTO-MANTLE!
        const nearEdgeXZ = Math.abs(this.px - pl.x) <= pl.w * 0.5 + 0.92 && Math.abs(this.pz - pl.z) <= pl.d * 0.5 + 0.92;
        if (nearEdgeXZ) {
          this.py = pl.y + 0.05;
          this.vy = 5.8;
          this.px += (pl.x - this.px) * 0.25;
          this.pz += (pl.z - this.pz) * 0.25;
          this.jumpsLeft = 2;
          AudioSys.playLedgeGrab?.();
        }
      }
    }

    if (this.py < -14) {
      this.hurtPlayer('Boşluğa düştün!');
      this.px = this.checkpoint.x;
      this.py = this.checkpoint.y + 2.5;
      this.pz = this.checkpoint.z;
      this.vx = 0; this.vy = 0; this.vz = 0;
    }

    // Hero Scale (Mega-Titan 2.3x Growth Power!) & Footstep Trail!
    const hScale = this.titanTimer > 0 ? 2.25 : 1.0;
    this.hero.root.scale.setScalar(hScale);
    this.hero.root.position.set(this.px, this.py, this.pz);
    this.hero.root.rotation.y = this.yaw;
    this.hero.root.visible = !(this.invuln > 0 && Math.floor(t * 16) % 2 === 0);

    if (this.grounded && Math.hypot(this.vx, this.vz) > 2.5 && (eq.weaponLv >= 2 || eq.suit.id !== 'robot_suit')) {
      this.footstepTimer -= dt;
      if (this.footstepTimer <= 0) {
        this.footstepTimer = 0.18;
        this.spawnParticleBurst(this.px, this.py + 0.12, this.pz, new this.THREE.Color(eq.suit.trail || '#00eeff').getHex(), 1);
      }
    }

    // Update 3D Companion Pet!
    if (this.petEnt) {
      const tx = this.px + Math.cos(t * 2.2) * 1.65;
      const ty = this.py + 1.85 + Math.sin(t * 4.0) * 0.25;
      const tz = this.pz + Math.sin(t * 2.2) * 1.65;
      this.petEnt.root.position.lerp(new this.THREE.Vector3(tx, ty, tz), Math.min(1, dt * 8));
      this.petEnt.root.rotation.y = this.yaw;
      if (this.petEnt.mixer) this.petEnt.mixer.update(dt);
      if (eq.pet.autoShot) {
        this.petShotTimer -= dt;
        if (this.petShotTimer <= 0) {
          this.petShotTimer = 3.2;
          const nearEn = this.enemies.find(e => !e.dead && Math.hypot(e.ent.root.position.x - this.px, e.ent.root.position.z - this.pz) < 14);
          if (nearEn) {
            const pPos = nearEn.ent.root.position;
            const dx = pPos.x - tx, dy = (pPos.y + 0.8) - ty, dz = pPos.z - tz;
            const dl = Math.hypot(dx, dy, dz) || 1;
            const orb = new this.THREE.Mesh(new this.THREE.SphereGeometry(0.28, 8, 8), new this.THREE.MeshBasicMaterial({ color: 0xffd23b }));
            orb.position.set(tx, ty, tz);
            this.scene.add(orb);
            this.projectiles.push({ mesh: orb, vx: (dx / dl) * 26, vy: (dy / dl) * 26, vz: (dz / dl) * 26, dmg: 2, enemy: false, life: 1.5 });
          }
        }
      }
    }

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

    // Power-Up Crystals (Mega-Titan & Chrono-Clock) & Heart Pickups!
    for (const po of this.powerOrbs) {
      if (po.taken) continue;
      po.mesh.position.set(po.plat.x + po.lx, po.plat.y + 0.9 + Math.sin(t * 4) * 0.2, po.plat.z + po.lz);
      po.mesh.rotation.y += dt * 2.5;
      if (Math.hypot(po.mesh.position.x - this.px, po.mesh.position.z - this.pz) < 1.7 && Math.abs(po.plat.y - this.py) < 2.2) {
        po.taken = true;
        this.scene.remove(po.mesh);
        AudioSys.playFanfare();
        if (po.kind === 'titan') {
          this.titanTimer = 8.5;
          this.callbacks.onToast('🌟 MEGA-TİTAN GÜCÜ! 8 Saniye Dev Boyut & Testere Kırma!');
        } else {
          this.chronoTimer = 6.5;
          this.callbacks.onToast('⏱️ KRONO-SAAT! Tuzaklar ve Düşmanlar Yavaşladı!');
        }
      }
    }

    for (const hpObj of this.heartPickups) {
      if (hpObj.taken) continue;
      hpObj.mesh.rotation.y += dt * 2.8;
      if (Math.hypot(hpObj.x - this.px, hpObj.z - this.pz) < 1.65 && Math.abs(hpObj.y - (this.py + 0.9)) < 2.0) {
        hpObj.taken = true;
        this.scene.remove(hpObj.mesh);
        AudioSys.playSuccess();
        if (this.callbacks.onGainHeart) this.hp = this.callbacks.onGainHeart(1);
        this.refreshAstroHud();
      }
    }

    for (const b of this.bouncers) {
      b.mesh.position.set(b.plat.x + (b.lx || 0), b.plat.y, b.plat.z + (b.lz || 0));
      if (Math.hypot(this.px - b.mesh.position.x, this.pz - b.mesh.position.z) < 1.5 && Math.abs(this.py - b.plat.y) < 1.2) {
        this.vy = 20.8;
        this.grounded = false;
        this.jumpsLeft = 2;
        AudioSys.tone(330, 0.18, 'sine', 0.15, 0, 920);
      }
    }

    for (const ch of this.chests) {
      if (!ch.opened) {
        ch.mesh.position.set(ch.plat.x + ch.lx, ch.plat.y, ch.plat.z + ch.lz);
      }
    }

    for (const sw of this.saws) {
      if (sw.frozen && sw.frozen > 0) {
        sw.frozen -= dt;
        sw.mesh.position.y = sw.plat.y + 0.2;
        continue;
      }
      const sx = sw.plat.x + Math.sin(t * 2.5 * slowFactor + sw.phase) * (sw.plat.w * 0.34);
      const sz = sw.plat.z;
      sw.mesh.position.set(sx, sw.plat.y + 0.2, sz);
      sw.mesh.rotation.y += dt * 9 * slowFactor;
      if (Math.hypot(this.px - sx, this.pz - sz) < 1.2 && Math.abs(this.py - sw.plat.y) < 1.1) {
        if (this.titanTimer > 0) {
          sw.frozen = 8.0;
          this.spawnParticleBurst(sx, sw.plat.y + 0.5, sz, 0xffd233, 8);
        } else {
          this.hurtPlayer('Dönen testereye çarptın!');
        }
      }
    }

    // Update 1-Draw-Call InstancedMesh Coins!
    const magRange = (eq.glove.power === 'magnet' || (eq.pet && eq.pet.magnet)) ? 9.5 : 1.75;
    if (this.coinInstanced) {
      const d = this.coinDummy;
      for (let i = 0; i < this.coins.length; i++) {
        const c = this.coins[i];
        if (c.taken) {
          d.scale.set(0, 0, 0);
          d.updateMatrix();
          this.coinInstanced.setMatrixAt(i, d.matrix);
          continue;
        }
        const dist = Math.hypot(c.x - this.px, c.y - (this.py + 0.9), c.z - this.pz);
        if (dist < magRange && dist > 1.3) {
          c.x += (this.px - c.x) * dt * 9;
          c.y += (this.py + 0.9 - c.y) * dt * 9;
          c.z += (this.pz - c.z) * dt * 9;
        }
        if (dist < 1.5) {
          c.taken = true;
          AudioSys.playPickup();
          this.callbacks.onCoins(2);
          d.scale.set(0, 0, 0);
        } else {
          d.position.set(c.x, c.y, c.z);
          d.rotation.set(0, t * 3.0 + i * 0.4, 0);
          d.scale.set(1, 1, 1);
        }
        d.updateMatrix();
        this.coinInstanced.setMatrixAt(i, d.matrix);
      }
      this.coinInstanced.instanceMatrix.needsUpdate = true;
    }

    for (const cg of this.cages) {
      if (cg.friend.mixer) cg.friend.mixer.update(dt);
      if (!cg.rescued) cg.cageMesh.rotation.y += dt * 1.2;
    }

    for (const en of this.enemies) {
      if (en.dead) continue;
      if (en.chill > 0) en.chill -= dt;
      const spd = (en.chill > 0 ? 1.1 : 3.2) * slowFactor;
      en.lx += en.dir * spd * dt;
      const lim = Math.max(1.2, en.plat.w * 0.36);
      if (en.lx > lim) { en.lx = lim; en.dir = -1; }
      if (en.lx < -lim) { en.lx = -lim; en.dir = 1; }
      const ex = en.plat.x + en.lx, ey = en.plat.y, ez = en.plat.z;
      en.ent.root.position.set(ex, ey, ez);
      en.ent.root.rotation.y = en.dir > 0 ? Math.PI / 2 : -Math.PI / 2;
      if (en.ent.mixer) en.ent.mixer.update(dt);

      if (Math.hypot(ex - this.px, ez - this.pz) < (this.titanTimer > 0 ? 2.2 : 1.35) && Math.abs(ey - this.py) < 1.9) {
        if (this.titanTimer > 0 || this.dashTimer > 0) {
          this.damageEnemy(en, 3);
        } else if (this.vy < -2 && this.py > ey + 0.65) {
          this.vy = 13.8;
          this.damageEnemy(en, 2);
        } else {
          this.hurtPlayer('Gezegen düşmanına çarptın!');
        }
      }
    }

    if (this.boss && !this.boss.dead) {
      if (this.boss.chill > 0) this.boss.chill -= dt;
      if (this.boss.dizzy > 0) this.boss.dizzy -= dt;
      if (this.boss.ent.mixer) this.boss.ent.mixer.update(dt);
      const nearBoss = this.pz < this.boss.arenaZ + 19;
      if (this.boss.shieldMesh && this.boss.shielded) {
        this.boss.shieldMesh.position.set(this.boss.x, this.boss.y + 2.2, this.boss.z);
        this.boss.shieldMesh.rotation.y += dt * 1.8;
      }
      this.refreshAstroHud();

      if (nearBoss && this.boss.dizzy <= 0) {
        const ang = Math.atan2(this.px - this.boss.x, this.pz - this.boss.z);
        this.boss.ent.root.rotation.y = ang;
        const bSpd = (this.boss.chill > 0 ? 1.4 : 3.4) * slowFactor;
        this.boss.x = clamp(this.boss.x + Math.sin(ang) * bSpd * dt, -9.5, 9.5);
        this.boss.z = clamp(this.boss.z + Math.cos(ang) * bSpd * dt, this.boss.arenaZ - 9.5, this.boss.arenaZ + 9.5);
        this.boss.ent.root.position.set(this.boss.x, this.boss.y, this.boss.z);

        this.boss.atkTimer -= dt * slowFactor;
        if (this.boss.atkTimer <= 0) {
          this.boss.slamCount++;
          if (this.boss.slamCount % 3 === 0) {
            const ringM = new this.THREE.Mesh(
              new this.THREE.RingGeometry(0.85, 1.15, 24),
              new this.THREE.MeshBasicMaterial({ color: 0x00eeff, side: this.THREE.DoubleSide })
            );
            ringM.rotation.x = -Math.PI / 2;
            ringM.position.set(this.boss.x, this.boss.y + 0.25, this.boss.z);
            this.scene.add(ringM);
            this.shockRings.push({ mesh: ringM, x: this.boss.x, y: this.boss.y, z: this.boss.z, r: 1.0 });
            AudioSys.playStomp(1.0);
            this.camShake = 0.35;
            this.boss.dizzy = 2.6;
            this.boss.atkTimer = 3.0;
          } else {
            this.boss.atkTimer = Math.max(1.15, 2.3 - (this.chapter.difficulty || 1) * 0.16);
            for (let k = -1; k <= 1; k++) {
              const a = ang + k * 0.28;
              const isBomb = k === 0;
              const orb = new this.THREE.Mesh(
                new this.THREE.SphereGeometry(isBomb ? 0.65 : 0.46, 10, 8),
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
          this.hurtPlayer('Boss sana çarptı!');
        }
      }
    }

    // Rescue Celebration Camera Zoom OR Smooth Follow Camera!
    if (this.rescueCamTimer > 0 && this.rescueCamTarget) {
      this.rescueCamTimer -= dt;
      const rt = this.rescueCamTarget;
      this.camera.position.lerp(new this.THREE.Vector3(rt.x, rt.y + 2.8, rt.z + 5.8), Math.min(1, dt * 8));
      this.camera.lookAt(rt.x, rt.y + 0.4, rt.z);
    } else {
      const shkX = this.camShake > 0 ? (Math.random() - 0.5) * this.camShake * 1.3 : 0;
      const shkY = this.camShake > 0 ? (Math.random() - 0.5) * this.camShake * 1.1 : 0;
      this.camera.position.x += (this.px * 0.72 - this.camera.position.x) * Math.min(1, dt * 6) + shkX;
      this.camera.position.y += (this.py + 8.2 - this.camera.position.y) * Math.min(1, dt * 5) + shkY;
      this.camera.position.z += (this.pz + 13.8 - this.camera.position.z) * Math.min(1, dt * 6);
      this.camera.lookAt(this.px * 0.85, this.py + 1.5, this.pz - 3.2);
    }

    if (ThreeShared.gfxMode !== 'fast') {
      this.sunLight.position.set(this.px + 20, this.py + 40, this.pz + 20);
      this.sunLight.target.position.set(this.px, this.py, this.pz);
      this.sunLight.target.updateMatrixWorld();
    }
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
      vz: 17 + (ch.difficulty || 2) * 2.5,
      sway: (Math.random() - 0.5) * 4,
      dead: false
    });
  },

  spawnSpaceAsteroidGate(idx) {
    const def = SPACE_ASTEROID_GATES[(this.chapter.num + idx) % SPACE_ASTEROID_GATES.length];
    const xs = [-8.5, 0, 8.5];
    const nodes = def.opts.map((txt, i) => {
      const m = new this.THREE.Mesh(
        new this.THREE.OctahedronGeometry(1.9, 1),
        new this.THREE.MeshStandardMaterial({ color: 0xffbe1a, metalness: 0.4, roughness: 0.3 })
      );
      m.position.set(xs[i], 0.5, -92);
      this.scene.add(m);
      return { txt, ok: i === def.ans, x: xs[i], y: 0.5, mesh: m, hit: false };
    });
    this.spaceGates.push({ prompt: def.prompt, z: -92, vz: 14, nodes, done: false });
    this.callbacks.onToast(def.prompt);
  },

  async spawnSpaceBoss() {
    const ch = this.chapter;
    const ent = await this.spawnNormalizedGLB(ch.bossModel || 'Dispatcher.glb', 8.8, true);
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
    const mesh = new this.THREE.Mesh(
      new this.THREE.TorusGeometry(2.6, 0.28, 10, 24),
      new this.THREE.MeshBasicMaterial({ color: 0xffd43b })
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

    if (this.petEnt) {
      this.petEnt.root.position.set(this.px + 2.8, this.py + 0.6 + Math.sin(t * 4) * 0.25, 0.6);
      this.petEnt.root.rotation.z = -input.dx * 0.4;
    }

    if (input.jumpHeld || input.fireHeld || this.boostTimer > 0) {
      this.triggerAttack();
    }

    this.starField.position.z += dt * (this.boostTimer > 0 ? 92 : 48);
    if (this.starField.position.z > 90) this.starField.position.z = 0;

    // Trigger 3D Educational Asteroid Gates at 5 and 11 kills!
    if (this.killsCount >= this.nextSpaceGateAt && this.nextSpaceGateAt < (this.chapter.targetKills || 14)) {
      this.spawnSpaceAsteroidGate(this.nextSpaceGateAt);
      this.nextSpaceGateAt += 6;
    }

    for (let i = this.spaceGates.length - 1; i >= 0; i--) {
      const sg = this.spaceGates[i];
      if (!sg.done) {
        sg.z += sg.vz * dt;
        for (const nd of sg.nodes) {
          if (!nd.hit && nd.mesh) {
            nd.mesh.position.z = sg.z;
            nd.mesh.rotation.y += dt * 1.8;
          }
        }
        if (sg.z > 10) {
          sg.done = true;
          for (const nd of sg.nodes) { if (nd.mesh) this.scene.remove(nd.mesh); }
        }
      }
      if (sg.done) this.spaceGates.splice(i, 1);
    }

    this.asteroidTimer -= dt;
    if (this.asteroidTimer <= 0 && this.asteroids.filter(a => !a.dead).length < 3) {
      this.asteroidTimer = 2.6;
      this.spawnAsteroid();
    }
    this.ringTimer -= dt;
    if (this.ringTimer <= 0 && this.boostRings.length < 2) {
      this.ringTimer = 4.5;
      this.spawnBoostRing();
    }

    for (const ast of this.asteroids) {
      if (ast.dead) continue;
      const p = ast.ent.root.position;
      p.z += ast.vz * dt;
      ast.ent.root.rotation.x += ast.rx * dt;
      ast.ent.root.rotation.y += ast.ry * dt;
      if (Math.hypot(p.x - this.px, p.y - this.py, p.z) < 2.5) {
        this.hurtPlayer('Asteroite çarptın!');
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
        this.callbacks.onToast('⚡ ALTIN TURBO HALKASI! Süper Hız +6 🪙!');
      }
      if (br.taken || br.mesh.position.z > 12) {
        this.scene.remove(br.mesh);
        this.boostRings.splice(i, 1);
      }
    }

    const targetKills = this.chapter.targetKills || 14;
    if (this.killsCount < targetKills) {
      this.spawnTimer -= dt;
      if (this.spawnTimer <= 0 && this.enemies.filter(e => !e.dead).length < 5) {
        this.spawnTimer = 1.05;
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
        en.shootT = 1.9;
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
        this.hurtPlayer('Düşman uçağına çarptın!');
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
        this.boss.atkTimer = 1.3;
        for (let k = -1; k <= 1; k++) {
          const orb = new this.THREE.Mesh(
            new this.THREE.SphereGeometry(0.48, 10, 8),
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
