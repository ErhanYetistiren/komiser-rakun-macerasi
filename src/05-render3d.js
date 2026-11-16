/* ============================================================================
   05-RENDER3D.JS — THREE.JS SUNNY-HILL HİKÂYE KİTABI KALİTESİNDE 3D KÖY MOTORU
   Gerçek Yumuşak Güneş Gölgeleri (PCFSoftShadowMap), Gerçek .GLB Ağaçlar/Bulutlar/
   Gemiler/Sandıklar, Parlak Gözlü & Göz Kırpan 8 Eklemli Şapşal Kahraman Modeli!
   ============================================================================ */

const TAU = Math.PI * 2;
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

/* ---- PAYLAŞIMLI THREE.JS + DRACO + PBR ENVIRONMENT + TEKİL RENDERER (SABİT 60 FPS iPAD!) ---- */
const ThreeShared = {
  ready: false,
  loading: false,
  THREE: null,
  GLTFLoader: null,
  DRACOLoader: null,
  SkeletonUtils: null,
  loaderInstance: null,
  sharedRenderer: null,
  envMap: null,
  gfxMode: 'fast', // 'fast' (iPad 60 FPS) | 'hd' | 'ultra'
  glbCache: new Map(),

  async ensure() {
    if (this.ready) return true;
    if (this.loading) {
      while (this.loading) await new Promise(r => setTimeout(r, 35));
      return this.ready;
    }
    this.loading = true;
    try {
      const THREE = await import('./assets/libs/three.module.min.js');
      const { GLTFLoader } = await import('./assets/libs/GLTFLoader.js');
      const { DRACOLoader } = await import('./assets/libs/DRACOLoader.js');
      const SkeletonUtils = await import('./assets/libs/SkeletonUtils.js');

      const draco = new DRACOLoader();
      draco.setDecoderPath('./assets/libs/draco/');
      const loader = new GLTFLoader();
      loader.setDRACOLoader(draco);

      this.THREE = THREE;
      this.GLTFLoader = GLTFLoader;
      this.DRACOLoader = DRACOLoader;
      this.SkeletonUtils = SkeletonUtils;
      this.loaderInstance = loader;
      this.ready = true;
    } catch (e) {
      console.error('ThreeShared load error:', e);
      this.ready = false;
    }
    this.loading = false;
    return this.ready;
  },

  getRenderer() {
    if (this.sharedRenderer) return this.sharedRenderer;
    const THREE = this.THREE;
    const cv = document.getElementById('glCanvas');
    const renderer = new THREE.WebGLRenderer({
      canvas: cv,
      antialias: true,
      powerPreference: 'high-performance',
      stencil: false
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    this.sharedRenderer = renderer;
    this.applyGfxMode(this.gfxMode);

    // Build precomputed PBR Sky/Studio Environment Reflection Texture ONCE (0ms per frame!)
    try {
      const pmrem = new THREE.PMREMGenerator(renderer);
      const envScene = new THREE.Scene();
      envScene.background = new THREE.Color('#6ec6ff');
      const sunSphere = new THREE.Mesh(
        new THREE.SphereGeometry(6, 12, 10),
        new THREE.MeshBasicMaterial({ color: 0xfff5cc })
      );
      sunSphere.position.set(18, 26, 16);
      const skyDome = new THREE.Mesh(
        new THREE.SphereGeometry(40, 16, 12),
        new THREE.MeshBasicMaterial({ color: 0x8ae0ff, side: THREE.BackSide })
      );
      const groundBounce = new THREE.Mesh(
        new THREE.PlaneGeometry(80, 80),
        new THREE.MeshBasicMaterial({ color: 0x56c766, side: THREE.DoubleSide })
      );
      groundBounce.rotation.x = Math.PI / 2;
      groundBounce.position.y = -8;
      envScene.add(skyDome, sunSphere, groundBounce);
      this.envMap = pmrem.fromScene(envScene, 0.04).texture;
      pmrem.dispose();
    } catch (e) {}

    window.addEventListener('resize', () => {
      if (!this.sharedRenderer) return;
      this.applyGfxMode(this.gfxMode);
    });
    return renderer;
  },

  applyGfxMode(mode = 'fast') {
    this.gfxMode = mode;
    if (!this.sharedRenderer || !this.THREE) return;
    const THREE = this.THREE;
    const dpr = window.devicePixelRatio || 1;
    const cap = mode === 'ultra' ? 2.0 : mode === 'hd' ? 1.5 : 1.18;
    this.sharedRenderer.setPixelRatio(Math.min(dpr, cap));
    this.sharedRenderer.setSize(window.innerWidth, window.innerHeight);
    if (mode === 'fast') {
      this.sharedRenderer.shadowMap.enabled = false;
    } else {
      this.sharedRenderer.shadowMap.enabled = true;
      this.sharedRenderer.shadowMap.type = mode === 'ultra' ? THREE.PCFSoftShadowMap : THREE.BasicShadowMap;
    }
    this.sharedRenderer.shadowMap.needsUpdate = true;
  },

  async loadGLB(filename) {
    if (this.glbCache.has(filename)) return this.glbCache.get(filename);
    await this.ensure();
    const gltf = await new Promise((resolve, reject) => {
      this.loaderInstance.load(`./assets/models/${filename}`, resolve, undefined, reject);
    });
    this.glbCache.set(filename, gltf);
    return gltf;
  },

  async spawnGLB(filename, targetSize = 2.2, castShadow = false) {
    await this.ensure();
    const THREE = this.THREE;
    try {
      const gltf = await this.loadGLB(filename);
      const cloned = this.SkeletonUtils.clone(gltf.scene);
      cloned.updateMatrixWorld(true);
      const box = new THREE.Box3().setFromObject(cloned);
      const size = new THREE.Vector3();
      box.getSize(size);
      const maxDim = Math.max(size.x, size.y, size.z, 0.001);
      cloned.scale.multiplyScalar(targetSize / maxDim);
      cloned.updateMatrixWorld(true);
      const box2 = new THREE.Box3().setFromObject(cloned);
      const center2 = new THREE.Vector3();
      box2.getCenter(center2);
      cloned.position.set(-center2.x, -box2.min.y, -center2.z);

      const wrapper = new THREE.Group();
      wrapper.add(cloned);
      if (castShadow) {
        cloned.traverse(n => {
          if (n.isMesh) n.castShadow = true;
        });
      }

      let mixer = null;
      const clips = {};
      if (gltf.animations && gltf.animations.length) {
        mixer = new THREE.AnimationMixer(cloned);
        for (const clip of gltf.animations) {
          clips[clip.name.toLowerCase()] = clip;
        }
      }
      return { root: wrapper, inner: cloned, mixer, clips, animations: gltf.animations || [] };
    } catch (e) {
      const g = new THREE.Group();
      const m = new THREE.Mesh(
        new THREE.SphereGeometry(targetSize * 0.4, 14, 12),
        new THREE.MeshStandardMaterial({ color: 0x38b6ff, roughness: 0.3, metalness: 0.2 })
      );
      m.position.y = targetSize * 0.4;
      g.add(m);
      return { root: g, inner: m, mixer: null, clips: {}, animations: [] };
    }
  }
};

/* ---- ACT I: SUNNY-HILL KALİTESİNDE THREE.JS DÜNYA VE 8 KARAKTER MOTORU ---- */
const R3D = {
  ok: false,
  on: true,
  ready: false,
  renderer: null,
  scene: null,
  camera: null,
  sunLight: null,
  activeWorldId: null,
  worldGroup: null,
  waterMesh: null,
  windmillRotor: null,
  clouds: [],
  tallObjects: [],
  charRigs: new Map(),
  itemPool: new Map(),
  padMeshes: [],
  hazardPool: [],
  particlePool: [],
  arrowMesh: null,
  pedestalMesh: null,
  seaGroup: null,
  policeBoatMesh: null,
  crowRaftMesh: null,
  seaCrateMesh: null,

  // Map 2D world coords (0..2400, 0..1800) to crisp Three.js meters (1 unit = 12 map px)
  S: 1 / 12,
  wx(mx) { return (mx - 1200) / 12; },
  wz(my) { return (my - 900) / 12; },

  async init(canvas) {
    this.cv = canvas;
    const ok = await ThreeShared.ensure();
    if (!ok) { this.ok = false; this.on = false; return false; }
    try {
      const THREE = ThreeShared.THREE;
      const renderer = ThreeShared.getRenderer();
      this.renderer = renderer;

      const scene = new THREE.Scene();
      if (ThreeShared.envMap) scene.environment = ThreeShared.envMap;
      this.scene = scene;

      const camera = new THREE.PerspectiveCamera(34, window.innerWidth / window.innerHeight, 1, 460);
      this.camera = camera;

      const hemi = new THREE.HemisphereLight(0xe4f6ff, 0x4f7a3e, 1.35);
      scene.add(hemi);

      const sun = new THREE.DirectionalLight(0xfff4d6, 1.65);
      sun.position.set(45, 78, 42);
      sun.castShadow = true;
      sun.shadow.mapSize.set(1024, 1024);
      sun.shadow.camera.near = 5;
      sun.shadow.camera.far = 220;
      const sd = 62;
      sun.shadow.camera.left = -sd; sun.shadow.camera.right = sd;
      sun.shadow.camera.top = sd; sun.shadow.camera.bottom = -sd;
      sun.shadow.bias = -0.0008;
      scene.add(sun);
      this.sunLight = sun;

      // Vudi's Golden 3D Detective Arrow
      const arrG = new THREE.Group();
      const shaft = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.32, 1.3), new THREE.MeshStandardMaterial({ color: 0xffdd22, emissive: 0x664400, roughness: 0.3 }));
      shaft.position.z = -0.35;
      const head = new THREE.Mesh(new THREE.ConeGeometry(0.85, 1.25, 4), new THREE.MeshStandardMaterial({ color: 0xffaa00, emissive: 0x553300, roughness: 0.3 }));
      head.rotation.x = Math.PI / 2;
      head.rotation.y = Math.PI / 4;
      head.position.z = 0.7;
      arrG.add(shaft, head);
      arrG.visible = false;
      scene.add(arrG);
      this.arrowMesh = arrG;

      // Pedestal
      const pedG = new THREE.Group();
      const pedBase = new THREE.Mesh(new THREE.CylinderGeometry(1.7, 2.0, 2.0, 18), new THREE.MeshStandardMaterial({ color: 0x1e3566, roughness: 0.45 }));
      pedBase.position.y = 1.0; pedBase.castShadow = true; pedBase.receiveShadow = true;
      const pedTop = new THREE.Mesh(new THREE.CylinderGeometry(2.1, 2.1, 0.38, 18), new THREE.MeshStandardMaterial({ color: 0xffd233, metalness: 0.3, roughness: 0.25 }));
      pedTop.position.y = 2.1;
      pedG.add(pedBase, pedTop);
      pedG.visible = false;
      scene.add(pedG);
      this.pedestalMesh = pedG;

      window.addEventListener('resize', () => {
        if (!this.renderer || !this.camera) return;
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
      });

      // Preload common village GLBs in background for lush Sunny-Hill look
      Promise.all([
        ThreeShared.loadGLB('Tree_Fruit.glb'),
        ThreeShared.loadGLB('Tree_Floating.glb'),
        ThreeShared.loadGLB('Tree_Lava.glb'),
        ThreeShared.loadGLB('Cloud_1.glb'),
        ThreeShared.loadGLB('Chest.glb'),
        ThreeShared.loadGLB('Crystal1.glb'),
        ThreeShared.loadGLB('Sail_ship.glb'),
        ThreeShared.loadGLB('TurboCar.glb')
      ]).then(() => {
        this.activeWorldId = null; // trigger rebuild with full GLB trees/props once cached!
      }).catch(() => {});

      this.ok = true;
      this.ready = true;
    } catch (e) {
      console.warn('Three.js Village fallback to 2D:', e);
      this.ok = false;
      this.on = false;
    }
    return this.ok;
  },

  mat(hex, rough = 0.52, metal = 0.04, emissiveHex = null) {
    const THREE = ThreeShared.THREE;
    const opts = { color: new THREE.Color(hex), roughness: rough, metalness: metal };
    if (emissiveHex) { opts.emissive = new THREE.Color(emissiveHex); opts.emissiveIntensity = 0.45; }
    return new THREE.MeshStandardMaterial(opts);
  },

  /* ---- HİKÂYE KİTABI TARZI BİNALAR (YUMUŞAK GÖLGELİ, DETAYLI!) ---- */
  createStoryBuilding(type) {
    const THREE = ThreeShared.THREE;
    const g = new THREE.Group();

    const addPart = (geo, hex, x, y, z, rx = 0, ry = 0, rz = 0, emissive = null) => {
      const m = new THREE.Mesh(geo, this.mat(hex, 0.55, 0.05, emissive));
      m.position.set(x, y, z);
      m.rotation.set(rx, ry, rz);
      m.castShadow = true;
      m.receiveShadow = true;
      g.add(m);
      return m;
    };

    if (type === 'bPolice') {
      // Cozy Storybook Police Headquarters!
      addPart(new THREE.BoxGeometry(13.5, 6.8, 9.2), '#e8f1ff', 0, 3.4, 0);
      addPart(new THREE.BoxGeometry(14.6, 1.1, 10.2), '#1e3566', 0, 7.2, 0);
      addPart(new THREE.BoxGeometry(8.2, 2.8, 6.4), '#284b8c', 0, 9.0, -0.3);
      addPart(new THREE.CylinderGeometry(1.3, 1.3, 0.35, 16), '#ffd233', 0, 9.1, 3.05, Math.PI / 2, 0, 0, '#664400');
      addPart(new THREE.BoxGeometry(2.6, 3.8, 0.35), '#5c361e', 0, 1.9, 4.65);
      addPart(new THREE.BoxGeometry(3.6, 0.45, 1.8), '#1e3566', 0, 4.0, 5.2);
      for (const sx of [-4.2, 4.2]) {
        addPart(new THREE.BoxGeometry(2.3, 2.1, 0.3), '#8ce0ff', sx, 4.1, 4.65, 0, 0, 0, '#1e5577');
        addPart(new THREE.BoxGeometry(2.6, 0.35, 0.6), '#ff6b6b', sx, 2.9, 4.8);
      }
      addPart(new THREE.SphereGeometry(0.55, 12, 10), '#ff2e4c', -1.8, 10.7, -0.3, 0, 0, 0, '#ff1133');
      addPart(new THREE.SphereGeometry(0.55, 12, 10), '#2998ff', 1.8, 10.7, -0.3, 0, 0, 0, '#0077ff');
    } else if (type === 'bSchool') {
      addPart(new THREE.BoxGeometry(12.6, 6.4, 8.6), '#fff0cf', 0, 3.2, 0);
      addPart(new THREE.ConeGeometry(9.2, 3.6, 4), '#e04f38', 0, 8.2, 0, 0, Math.PI / 4, 0);
      addPart(new THREE.BoxGeometry(3.8, 3.8, 3.8), '#fff8e8', 0, 8.8, 0.8);
      addPart(new THREE.ConeGeometry(3.2, 2.4, 4), '#c93b28', 0, 11.9, 0.8, 0, Math.PI / 4, 0);
      addPart(new THREE.CylinderGeometry(1.15, 1.15, 0.25, 18), '#ffffff', 0, 9.0, 2.75, Math.PI / 2);
      addPart(new THREE.BoxGeometry(2.4, 3.6, 0.3), '#6e4226', 0, 1.8, 4.35);
      for (const sx of [-3.8, 3.8]) {
        addPart(new THREE.BoxGeometry(2.1, 2.0, 0.3), '#8ce0ff', sx, 3.8, 4.35);
      }
    } else if (type === 'bWindmill') {
      addPart(new THREE.CylinderGeometry(2.1, 3.1, 8.2, 14), '#fff5de', 0, 4.1, 0);
      addPart(new THREE.ConeGeometry(2.7, 2.8, 14), '#d94832', 0, 9.6, 0);
      addPart(new THREE.BoxGeometry(1.7, 2.9, 0.3), '#5c3820', 0, 1.45, 2.9);
      const rotor = new THREE.Group();
      rotor.position.set(0, 6.8, 2.5);
      const b1 = new THREE.Mesh(new THREE.BoxGeometry(7.8, 0.65, 0.18), this.mat('#fffdf5'));
      const b2 = new THREE.Mesh(new THREE.BoxGeometry(0.65, 7.8, 0.18), this.mat('#fffdf5'));
      const hub = new THREE.Mesh(new THREE.SphereGeometry(0.55, 10, 10), this.mat('#ffbe1a'));
      rotor.add(b1, b2, hub);
      g.add(rotor);
      g.userData.rotor = rotor;
    } else if (type === 'bVolcano') {
      addPart(new THREE.CylinderGeometry(4.6, 13.5, 12.2, 16), '#6e4c3e', 0, 6.1, 0);
      addPart(new THREE.CylinderGeometry(4.8, 5.2, 1.2, 16), '#4a3128', 0, 12.0, 0);
      addPart(new THREE.CylinderGeometry(3.8, 3.8, 0.3, 16), '#ff5511', 0, 12.5, 0, 0, 0, 0, '#ff3300');
    } else if (type === 'bClownCastle') {
      addPart(new THREE.BoxGeometry(13.0, 7.8, 9.4), '#efe0ff', 0, 3.9, 0);
      for (const sx of [-5.8, 5.8]) {
        addPart(new THREE.CylinderGeometry(1.9, 2.1, 9.4, 14), '#9146ff', sx, 4.7, 3.6);
        addPart(new THREE.ConeGeometry(2.5, 3.4, 14), '#ff3870', sx, 11.1, 3.6);
      }
      addPart(new THREE.SphereGeometry(1.45, 16, 14), '#ff1e2d', 0, 8.2, 4.9, 0, 0, 0, '#660011');
      addPart(new THREE.BoxGeometry(3.2, 4.4, 0.4), '#2d1b46', 0, 2.2, 4.75);
    } else {
      // Cozy Sunny-Hill Cottage!
      addPart(new THREE.BoxGeometry(9.2, 5.4, 7.6), '#fff6df', 0, 2.7, 0);
      addPart(new THREE.ConeGeometry(7.2, 3.6, 4), '#eb5e44', 0, 7.2, 0, 0, Math.PI / 4, 0);
      addPart(new THREE.BoxGeometry(1.1, 2.4, 1.1), '#d47a55', 2.4, 7.6, -1.2);
      addPart(new THREE.BoxGeometry(2.0, 3.2, 0.3), '#6e4427', 0, 1.6, 3.85);
      for (const sx of [-2.6, 2.6]) {
        addPart(new THREE.BoxGeometry(1.7, 1.7, 0.3), '#8ce0ff', sx, 3.1, 3.85);
        addPart(new THREE.BoxGeometry(2.0, 0.4, 0.55), '#68c957', sx, 2.1, 4.0);
      }
    }
    return g;
  },

  buildWorldScene(worldId, worldDef) {
    const THREE = ThreeShared.THREE;
    if (this.worldGroup) this.scene.remove(this.worldGroup);
    const wg = new THREE.Group();
    this.worldGroup = wg;
    this.scene.add(wg);
    this.tallObjects = [];
    this.clouds = [];
    this.windmillRotor = null;

    const pal = {
      town:   { sky: '#87d4ff', grass: '#62cf5a', path: '#f2d9a0', sea: '#2ea0f5', beach: '#fae5ad' },
      valley: { sky: '#8ce0d8', grass: '#74c94d', path: '#deb073', sea: '#28b5a4', beach: '#ebd098' },
      city:   { sky: '#8acbff', grass: '#5cc466', path: '#dce2ed', sea: '#3296eb', beach: '#e6ebf2' },
      island: { sky: '#7fd8ff', grass: '#55d672', path: '#ffe4a3', sea: '#24a8ff', beach: '#ffecb8' },
      lab:    { sky: '#2a1b47', grass: '#47366b', path: '#6d5999', sea: '#1e1336', beach: '#ffb82e' }
    }[worldId] || { sky: '#87d4ff', grass: '#62cf5a', path: '#f2d9a0', sea: '#2ea0f5', beach: '#fae5ad' };

    this.scene.background = new THREE.Color(pal.sky);
    this.scene.fog = new THREE.FogExp2(pal.sky, 0.0038);

    // Sparkling Ocean Plane
    const waterGeo = new THREE.PlaneGeometry(420, 420, 32, 32);
    waterGeo.rotateX(-Math.PI / 2);
    const waterMat = new THREE.MeshStandardMaterial({ color: pal.sea, roughness: 0.22, metalness: 0.12 });
    const water = new THREE.Mesh(waterGeo, waterMat);
    water.position.y = -0.65;
    wg.add(water);
    this.waterMesh = water;

    // Rounded Beach Rim + Lush Grass Island
    const beach = new THREE.Mesh(new THREE.CylinderGeometry(108, 114, 1.1, 40), this.mat(pal.beach, 0.8));
    beach.scale.set(1.0, 1, 0.76);
    beach.position.y = -0.55;
    beach.receiveShadow = true;
    wg.add(beach);

    const land = new THREE.Mesh(new THREE.CylinderGeometry(100, 104, 1.2, 40), this.mat(pal.grass, 0.72));
    land.scale.set(1.0, 1, 0.75);
    land.position.y = -0.3;
    land.receiveShadow = true;
    wg.add(land);

    // Sunny-Hill Cobblestone / Sandy Crossroad Paths + Central Town Plaza Circle
    const pathMat = this.mat(pal.path, 0.78);
    const pH = new THREE.Mesh(new THREE.BoxGeometry(158, 0.16, 11.5), pathMat);
    pH.position.y = 0.28; pH.receiveShadow = true;
    const pV = new THREE.Mesh(new THREE.BoxGeometry(11.5, 0.16, 112), pathMat);
    pV.position.y = 0.28; pV.receiveShadow = true;
    const plaza = new THREE.Mesh(new THREE.CylinderGeometry(17.5, 17.5, 0.18, 32), pathMat);
    plaza.position.y = 0.29; plaza.receiveShadow = true;
    wg.add(pH, pV, plaza);

    // Scenic Pond + Wooden Pier + Bobbing Sailboat in outdoor worlds!
    if (worldId !== 'lab') {
      const pond = new THREE.Mesh(new THREE.CylinderGeometry(15, 15, 0.18, 28), new THREE.MeshStandardMaterial({ color: '#37b6ff', roughness: 0.18 }));
      pond.scale.set(1.15, 1, 0.85);
      pond.position.set(this.wx(1920), 0.31, this.wz(1340));
      wg.add(pond);

      const pier = new THREE.Mesh(new THREE.BoxGeometry(8.2, 0.45, 3.2), this.mat('#9c6635', 0.7));
      pier.position.set(this.wx(1755), 0.55, this.wz(1340));
      pier.castShadow = true; pier.receiveShadow = true;
      wg.add(pier);

      if (ThreeShared.glbCache.has('Sail_ship.glb')) {
        ThreeShared.spawnGLB('Sail_ship.glb', 6.2).then(ship => {
          ship.root.position.set(this.wx(1960), 0.2, this.wz(1350));
          ship.root.rotation.y = 0.6;
          wg.add(ship.root);
        });
      }
    }

    // Buildings
    for (const b of (worldDef.buildings || [])) {
      const bm = this.createStoryBuilding(b.mesh);
      const bx = this.wx(b.x), bz = this.wz(b.y);
      bm.position.set(bx, 0.3, bz);
      if (b.yaw) bm.rotation.y = b.yaw;
      if (bm.userData.rotor) this.windmillRotor = bm.userData.rotor;
      wg.add(bm);
      this.tallObjects.push({ grp: bm, x: bx, z: bz, r: 7.8 });
    }

    // Decorative Props (Fountain, Real 3D Police Car `TurboCar.glb`, Colorful Flowerbeds!)
    for (const pr of (worldDef.props || [])) {
      const px = this.wx(pr.x), pz = this.wz(pr.y);
      if (pr.mesh === 'bFountain') {
        const fg = new THREE.Group();
        const basin = new THREE.Mesh(new THREE.CylinderGeometry(3.9, 4.1, 1.1, 24), this.mat('#dce6f2', 0.45));
        basin.position.y = 0.55; basin.castShadow = true; basin.receiveShadow = true;
        const pool = new THREE.Mesh(new THREE.CylinderGeometry(3.5, 3.5, 0.2, 24), new THREE.MeshStandardMaterial({ color: '#3ec2ff', roughness: 0.15 }));
        pool.position.y = 1.05;
        const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.9, 2.4, 14), this.mat('#cad6e6', 0.45));
        pillar.position.y = 1.6;
        const spray = new THREE.Mesh(new THREE.SphereGeometry(0.95, 14, 10), new THREE.MeshStandardMaterial({ color: '#9be8ff', roughness: 0.1, emissive: '#1e6688', emissiveIntensity: 0.3 }));
        spray.position.y = 3.0;
        fg.add(basin, pool, pillar, spray);
        fg.position.set(px, 0.3, pz);
        wg.add(fg);
      } else if (pr.mesh === 'bPoliceCar') {
        if (ThreeShared.glbCache.has('TurboCar.glb')) {
          ThreeShared.spawnGLB('TurboCar.glb', 4.8).then(car => {
            car.root.position.set(px, 0.35, pz);
            car.root.rotation.y = pr.yaw || 0.35;
            wg.add(car.root);
          });
        }
      } else if (pr.mesh === 'flowerbed') {
        const fb = new THREE.Group();
        const box = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.65, 1.7), this.mat('#8c5832', 0.75));
        box.position.y = 0.32; box.castShadow = true;
        fb.add(box);
        ['#ff4d79', '#ffd233', '#ff7b29', '#a66bff'].forEach((col, idx) => {
          const fl = new THREE.Mesh(new THREE.SphereGeometry(0.38, 10, 8), this.mat(col, 0.4));
          fl.position.set(-1.1 + idx * 0.74, 0.82, (idx % 2) * 0.2 - 0.1);
          fb.add(fl);
        });
        fb.position.set(px, 0.3, pz);
        wg.add(fb);
      }
    }

    // Lush Real 3D .GLB Trees (or smooth storybook fallback while loading)
    const treeGlb = worldId === 'valley' ? 'Tree_Lava.glb' : worldId === 'island' ? 'Tree_Floating.glb' : 'Tree_Fruit.glb';
    for (const tr of (worldDef.trees || [])) {
      const tx = this.wx(tr.x), tz = this.wz(tr.y);
      const sc = (tr.s || 1) * 5.8;
      if (ThreeShared.glbCache.has(treeGlb)) {
        ThreeShared.spawnGLB(treeGlb, sc).then(tEnt => {
          tEnt.root.position.set(tx, 0.3, tz);
          wg.add(tEnt.root);
          this.tallObjects.push({ grp: tEnt.root, x: tx, z: tz, r: 3.8 });
        });
      } else {
        const tg = new THREE.Group();
        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.7, 2.8, 10), this.mat('#7a4e2d', 0.8));
        trunk.position.y = 1.4; trunk.castShadow = true;
        const crown = new THREE.Mesh(new THREE.SphereGeometry(2.3, 14, 12), this.mat('#42c95a', 0.6));
        crown.position.y = 4.0; crown.castShadow = true;
        tg.add(trunk, crown);
        tg.position.set(tx, 0.3, tz);
        wg.add(tg);
      }
    }

    // Fluffy Drifting 3D Sky Clouds (`Cloud_1.glb`)!
    if (worldId !== 'lab' && ThreeShared.glbCache.has('Cloud_1.glb')) {
      for (let i = 0; i < 6; i++) {
        ThreeShared.spawnGLB('Cloud_1.glb', 8.5).then(cl => {
          cl.root.position.set(-70 + i * 28, 22 + (i % 2) * 3, -55 + (i * 23) % 95);
          wg.add(cl.root);
          this.clouds.push(cl.root);
        });
      }
    }

    this.activeWorldId = worldId;
  },

  /* ---- 8 KARAKTERİN PARLAK GÖZLÜ, GÖZ KIRPAN, TAM EKLEMLİ THREE.JS HEYKELLERİ ---- */
  createCharacterRig(id) {
    const THREE = ThreeShared.THREE;
    const def = CHARACTERS[id] || CHARACTERS.rakun;
    const C = def.colors;
    const root = new THREE.Group();
    const bodyGrp = new THREE.Group();
    root.add(bodyGrp);

    const addM = (parent, geo, hex, x, y, z, rx = 0, ry = 0, rz = 0, emissive = null) => {
      const m = new THREE.Mesh(geo, this.mat(hex, 0.45, 0.05, emissive));
      m.position.set(x, y, z);
      m.rotation.set(rx, ry, rz);
      m.castShadow = true;
      m.receiveShadow = true;
      parent.add(m);
      return m;
    };

    const addShinyEyes = (parent, ex, ey, ez, r = 0.24) => {
      const eyes = [];
      for (const s of [-1, 1]) {
        const white = addM(parent, new THREE.SphereGeometry(r, 12, 10), '#ffffff', s * ex, ey, ez);
        const pupil = addM(parent, new THREE.SphereGeometry(r * 0.56, 10, 8), '#141622', s * ex, ey, ez + r * 0.68);
        const spark = addM(parent, new THREE.SphereGeometry(r * 0.22, 8, 6), '#ffffff', s * ex + r * 0.2, ey + r * 0.22, ez + r * 1.05, 0, 0, 0, '#ffffff');
        eyes.push({ white, pupil, spark });
      }
      return eyes;
    };

    const rig = { id, root, bodyGrp, legL: null, legR: null, armL: null, armR: null, mouthPivot: null, upperBeak: null, bowtie: null, tail: null, wings: [], spikes: [], eyes: [], hatSlot: new THREE.Group() };

    if (id === 'rakun') {
      rig.legL = addM(bodyGrp, new THREE.CapsuleGeometry(0.28, 0.55, 6, 10), '#1b2847', -0.45, 0.55, 0);
      rig.legR = addM(bodyGrp, new THREE.CapsuleGeometry(0.28, 0.55, 6, 10), '#1b2847',  0.45, 0.55, 0);
      // Fluffy Striped Raccoon Tail
      const tailG = new THREE.Group();
      tailG.position.set(0, 1.0, -0.75);
      addM(tailG, new THREE.CapsuleGeometry(0.42, 0.9, 8, 12), C.fur, 0, 0.1, -0.55, Math.PI / 2.5);
      addM(tailG, new THREE.CylinderGeometry(0.44, 0.44, 0.26, 12), C.dark, 0, 0.05, -0.55, Math.PI / 2.5);
      addM(tailG, new THREE.CylinderGeometry(0.39, 0.39, 0.26, 12), C.dark, 0, 0.22, -0.92, Math.PI / 2.5);
      bodyGrp.add(tailG);
      rig.tail = tailG;
      // Navy Police Coat + Shiny Gold Star Badge
      rig.coatMesh = addM(bodyGrp, new THREE.CylinderGeometry(0.76, 0.92, 1.55, 16), C.coat, 0, 1.55, 0);
      addM(bodyGrp, new THREE.OctahedronGeometry(0.26, 0), C.badge, 0.36, 1.85, 0.82, 0, 0, 0, '#996600');
      rig.armL = addM(bodyGrp, new THREE.CapsuleGeometry(0.24, 0.65, 6, 10), C.coat, -1.02, 1.65, 0, 0, 0, 0.22);
      rig.armR = addM(bodyGrp, new THREE.CapsuleGeometry(0.24, 0.65, 6, 10), C.coat,  1.02, 1.65, 0, 0, 0, -0.22);
      // Head + Bandit Mask + Ears + Snout + Under-Nose Mouth
      const head = new THREE.Group();
      head.position.set(0, 3.05, 0);
      bodyGrp.add(head);
      addM(head, new THREE.SphereGeometry(1.08, 20, 16), C.fur, 0, 0, 0);
      addM(head, new THREE.SphereGeometry(0.52, 14, 10), C.dark, -0.46, 0.06, 0.76);
      addM(head, new THREE.SphereGeometry(0.52, 14, 10), C.dark,  0.46, 0.06, 0.76);
      addM(head, new THREE.SphereGeometry(0.42, 12, 10), C.white, -0.66, -0.25, 0.66);
      addM(head, new THREE.SphereGeometry(0.42, 12, 10), C.white,  0.66, -0.25, 0.66);
      rig.eyes = addShinyEyes(head, 0.42, 0.12, 1.02, 0.23);
      addM(head, new THREE.SphereGeometry(0.42, 14, 12), C.white, 0, -0.24, 1.02);
      addM(head, new THREE.SphereGeometry(0.17, 10, 8), '#161820', 0, -0.13, 1.40);
      rig.mouthPivot = addM(head, new THREE.BoxGeometry(0.44, 0.14, 0.25), '#c92642', 0, -0.48, 1.02);
      addM(head, new THREE.ConeGeometry(0.36, 0.68, 12), C.dark, -0.74, 0.96, 0, 0, 0, 0.25);
      addM(head, new THREE.ConeGeometry(0.36, 0.68, 12), C.dark,  0.74, 0.96, 0, 0, 0, -0.25);
      // Police Cap
      const cap = new THREE.Group();
      cap.position.set(0, 0.88, 0);
      addM(cap, new THREE.CylinderGeometry(0.92, 0.86, 0.55, 16), C.coat, 0, 0.2, 0);
      addM(cap, new THREE.BoxGeometry(1.3, 0.14, 0.72), '#111c38', 0, 0.02, 0.68);
      addM(cap, new THREE.OctahedronGeometry(0.2, 0), C.badge, 0, 0.28, 0.92, 0, 0, 0, '#885500');
      head.add(cap);
      rig.capGroup = cap;
    } else if (id === 'vudi') {
      rig.legL = addM(bodyGrp, new THREE.CylinderGeometry(0.12, 0.12, 0.6, 8), '#ffaa11', -0.28, 0.3, 0);
      rig.legR = addM(bodyGrp, new THREE.CylinderGeometry(0.12, 0.12, 0.6, 8), '#ffaa11',  0.28, 0.3, 0);
      addM(bodyGrp, new THREE.SphereGeometry(0.76, 18, 14), C.body, 0, 1.35, 0);
      addM(bodyGrp, new THREE.SphereGeometry(0.60, 14, 12), C.belly, 0, 1.3, 0.3);
      addM(bodyGrp, new THREE.CylinderGeometry(0.78, 0.8, 0.72, 16), C.vest, 0, 1.35, 0.02);
      addM(bodyGrp, new THREE.OctahedronGeometry(0.18, 0), '#ffd233', 0.28, 1.45, 0.78, 0, 0, 0, '#885500');
      const wL = addM(bodyGrp, new THREE.BoxGeometry(0.18, 0.85, 0.58), C.body, -0.82, 1.45, 0, 0, 0, 0.3);
      const wR = addM(bodyGrp, new THREE.BoxGeometry(0.18, 0.85, 0.58), C.body,  0.82, 1.45, 0, 0, 0, -0.3);
      rig.wings = [wL, wR];
      const head = new THREE.Group();
      head.position.set(0, 2.55, 0.06);
      bodyGrp.add(head);
      addM(head, new THREE.SphereGeometry(0.82, 18, 14), C.body, 0, 0, 0);
      addM(head, new THREE.ConeGeometry(0.38, 1.05, 10), C.crest, 0, 0.85, -0.15, -0.4);
      addM(head, new THREE.ConeGeometry(0.30, 0.8, 10), C.crest, 0, 0.65, -0.48, -0.8);
      rig.eyes = addShinyEyes(head, 0.35, 0.12, 0.68, 0.24);
      // Hinged Long Yellow Beak!
      rig.upperBeak = addM(head, new THREE.ConeGeometry(0.28, 1.35, 12), C.beak, 0, -0.04, 1.15, Math.PI / 2);
      rig.mouthPivot = addM(head, new THREE.ConeGeometry(0.22, 1.15, 12), '#e69500', 0, -0.22, 1.08, Math.PI / 2 + 0.14);
    } else if (id === 'palyaco') {
      rig.legL = addM(bodyGrp, new THREE.CapsuleGeometry(0.28, 0.65, 6, 10), '#3b2854', -0.46, 0.6, 0);
      rig.legR = addM(bodyGrp, new THREE.CapsuleGeometry(0.28, 0.65, 6, 10), '#3b2854',  0.46, 0.6, 0);
      addM(bodyGrp, new THREE.CylinderGeometry(0.85, 1.15, 1.95, 18), C.coat, 0, 1.75, 0);
      const bow = new THREE.Group();
      bow.position.set(0, 2.52, 0.92);
      addM(bow, new THREE.ConeGeometry(0.45, 0.85, 8), C.bowtie, -0.42, 0, 0, 0, 0, -Math.PI / 2);
      addM(bow, new THREE.ConeGeometry(0.45, 0.85, 8), C.hair1,  0.42, 0, 0, 0, 0,  Math.PI / 2);
      addM(bow, new THREE.SphereGeometry(0.22, 10, 8), C.nose, 0, 0, 0.08);
      bodyGrp.add(bow);
      rig.bowtie = bow;
      rig.armL = addM(bodyGrp, new THREE.CapsuleGeometry(0.25, 0.75, 6, 10), C.coat, -1.12, 1.9, 0, 0, 0, 0.25);
      rig.armR = addM(bodyGrp, new THREE.CapsuleGeometry(0.25, 0.75, 6, 10), C.coat,  1.12, 1.9, 0, 0, 0, -0.25);
      const head = new THREE.Group();
      head.position.set(0, 3.45, 0);
      bodyGrp.add(head);
      addM(head, new THREE.SphereGeometry(1.05, 20, 16), '#fff5f7', 0, 0, 0);
      addM(head, new THREE.SphereGeometry(0.62, 14, 12), C.hair1, -1.12, 0.15, -0.05);
      addM(head, new THREE.SphereGeometry(0.62, 14, 12), C.hair2,  1.12, 0.15, -0.05);
      addM(head, new THREE.SphereGeometry(0.56, 14, 12), C.hair3, -0.78, 0.78, -0.1);
      addM(head, new THREE.SphereGeometry(0.56, 14, 12), '#29b6f6', 0.78, 0.78, -0.1);
      rig.eyes = addShinyEyes(head, 0.38, 0.2, 0.9, 0.22);
      // Shiny Red Ball Nose + Locked Under-Nose Clown Mouth!
      addM(head, new THREE.SphereGeometry(0.35, 14, 12), C.nose, 0, -0.04, 1.15, 0, 0, 0, '#660000');
      rig.mouthPivot = addM(head, new THREE.BoxGeometry(0.68, 0.22, 0.26), '#b8142c', 0, -0.48, 0.98);
    } else if (id === 'karga') {
      rig.legL = addM(bodyGrp, new THREE.CylinderGeometry(0.12, 0.12, 0.65, 8), '#e09b24', -0.3, 0.32, 0);
      rig.legR = addM(bodyGrp, new THREE.CylinderGeometry(0.12, 0.12, 0.65, 8), '#e09b24',  0.3, 0.32, 0);
      addM(bodyGrp, new THREE.SphereGeometry(0.84, 18, 14), C.feather, 0, 1.45, 0);
      addM(bodyGrp, new THREE.TorusGeometry(0.68, 0.18, 10, 18), C.scarf, 0, 2.08, 0.04, Math.PI / 2);
      addM(bodyGrp, new THREE.BoxGeometry(0.34, 0.85, 0.15), C.scarf, 0.35, 1.65, -0.75, 0.35);
      const wL = addM(bodyGrp, new THREE.BoxGeometry(0.18, 0.95, 0.62), '#191a26', -0.88, 1.48, 0, 0, 0, 0.22);
      const wR = addM(bodyGrp, new THREE.BoxGeometry(0.18, 0.95, 0.62), '#191a26',  0.88, 1.48, 0, 0, 0, -0.22);
      rig.wings = [wL, wR];
      const head = new THREE.Group();
      head.position.set(0, 2.72, 0.06);
      bodyGrp.add(head);
      addM(head, new THREE.SphereGeometry(0.82, 18, 14), C.feather, 0, 0, 0);
      addM(head, new THREE.CylinderGeometry(0.88, 0.72, 0.34, 16), C.beret, 0.12, 0.72, 0, 0, 0, -0.2);
      rig.eyes = addShinyEyes(head, 0.34, 0.1, 0.7, 0.22);
      rig.upperBeak = addM(head, new THREE.ConeGeometry(0.30, 1.1, 12), C.beak, 0, -0.05, 1.05, Math.PI / 2);
      rig.mouthPivot = addM(head, new THREE.ConeGeometry(0.24, 0.95, 12), '#b88418', 0, -0.22, 0.98, Math.PI / 2 + 0.15);
    } else if (id === 'trex') {
      rig.legL = addM(bodyGrp, new THREE.CapsuleGeometry(0.38, 0.7, 8, 12), C.skin, -0.62, 0.65, 0);
      rig.legR = addM(bodyGrp, new THREE.CapsuleGeometry(0.38, 0.7, 8, 12), C.skin,  0.62, 0.65, 0);
      rig.tail = addM(bodyGrp, new THREE.ConeGeometry(0.62, 1.9, 12), C.skin, 0, 1.15, -1.25, -Math.PI / 2 + 0.28);
      addM(bodyGrp, new THREE.SphereGeometry(1.18, 20, 16), C.skin, 0, 1.78, 0);
      addM(bodyGrp, new THREE.SphereGeometry(0.88, 16, 14), C.belly, 0, 1.72, 0.42);
      rig.armL = addM(bodyGrp, new THREE.CapsuleGeometry(0.15, 0.38, 6, 8), C.skin, -0.95, 2.05, 0.68, Math.PI / 2.4);
      rig.armR = addM(bodyGrp, new THREE.CapsuleGeometry(0.15, 0.38, 6, 8), C.skin,  0.95, 2.05, 0.68, Math.PI / 2.4);
      const head = new THREE.Group();
      head.position.set(0, 3.25, 0.32);
      bodyGrp.add(head);
      addM(head, new THREE.BoxGeometry(1.42, 0.95, 1.65), C.skin, 0, 0.15, 0);
      rig.eyes = addShinyEyes(head, 0.52, 0.65, 0.22, 0.34);
      addM(head, new THREE.BoxGeometry(0.2, 0.18, 0.15), '#ffffff', -0.35, -0.36, 0.72);
      addM(head, new THREE.BoxGeometry(0.2, 0.18, 0.15), '#ffffff',  0.35, -0.36, 0.72);
      rig.mouthPivot = addM(head, new THREE.BoxGeometry(1.24, 0.38, 1.45), '#38a647', 0, -0.48, 0.08);
    } else if (id === 'ejderha') {
      rig.legL = addM(bodyGrp, new THREE.CapsuleGeometry(0.34, 0.6, 8, 10), C.scale, -0.56, 0.58, 0);
      rig.legR = addM(bodyGrp, new THREE.CapsuleGeometry(0.34, 0.6, 8, 10), C.scale,  0.56, 0.58, 0);
      rig.tail = addM(bodyGrp, new THREE.ConeGeometry(0.55, 1.75, 12), C.scale, 0, 1.1, -1.18, -Math.PI / 2 + 0.32);
      addM(bodyGrp, new THREE.SphereGeometry(1.12, 20, 16), C.scale, 0, 1.72, 0);
      addM(bodyGrp, new THREE.SphereGeometry(0.84, 16, 14), C.belly, 0, 1.66, 0.4);
      const wL = addM(bodyGrp, new THREE.BoxGeometry(0.92, 0.68, 0.16), C.wing, -1.12, 2.2, -0.42, 0.2, -0.35, 0.35);
      const wR = addM(bodyGrp, new THREE.BoxGeometry(0.92, 0.68, 0.16), C.wing,  1.12, 2.2, -0.42, 0.2,  0.35, -0.35);
      rig.wings = [wL, wR];
      const head = new THREE.Group();
      head.position.set(0, 3.12, 0.22);
      bodyGrp.add(head);
      addM(head, new THREE.SphereGeometry(0.95, 18, 14), C.scale, 0, 0, 0);
      addM(head, new THREE.ConeGeometry(0.22, 0.68, 10), C.horn, -0.48, 0.78, -0.1, -0.25, 0, 0.2);
      addM(head, new THREE.ConeGeometry(0.22, 0.68, 10), C.horn,  0.48, 0.78, -0.1, -0.25, 0, -0.2);
      addM(head, new THREE.BoxGeometry(0.92, 0.55, 0.85), C.scale, 0, -0.12, 0.72);
      addM(head, new THREE.SphereGeometry(0.13, 8, 8), '#4a180b', -0.24, 0.14, 1.08);
      addM(head, new THREE.SphereGeometry(0.13, 8, 8), '#4a180b',  0.24, 0.14, 1.08);
      rig.eyes = addShinyEyes(head, 0.42, 0.28, 0.66, 0.25);
      rig.mouthPivot = addM(head, new THREE.BoxGeometry(0.82, 0.28, 0.82), C.belly, 0, -0.48, 0.66);
    } else if (id === 'godzilla') {
      rig.legL = addM(bodyGrp, new THREE.CapsuleGeometry(0.42, 0.75, 8, 12), C.skin, -0.68, 0.7, 0);
      rig.legR = addM(bodyGrp, new THREE.CapsuleGeometry(0.42, 0.75, 8, 12), C.skin,  0.68, 0.7, 0);
      rig.tail = addM(bodyGrp, new THREE.ConeGeometry(0.7, 2.1, 12), C.skin, 0, 1.15, -1.35, -Math.PI / 2 + 0.25);
      addM(bodyGrp, new THREE.SphereGeometry(1.25, 20, 16), C.skin, 0, 1.88, 0);
      addM(bodyGrp, new THREE.SphereGeometry(0.92, 16, 14), C.belly, 0, 1.82, 0.44);
      for (let i = 0; i < 4; i++) {
        const sp = addM(bodyGrp, new THREE.ConeGeometry(0.36, 0.95, 6), C.spikes, 0, 2.85 - i * 0.52, -0.82 - i * 0.2, -1.15, 0, 0, '#00b8ff');
        rig.spikes.push(sp);
      }
      rig.armL = addM(bodyGrp, new THREE.CapsuleGeometry(0.28, 0.65, 6, 10), C.skin, -1.18, 1.85, 0.2, 0.3, 0, 0.28);
      rig.armR = addM(bodyGrp, new THREE.CapsuleGeometry(0.28, 0.65, 6, 10), C.skin,  1.18, 1.85, 0.2, 0.3, 0, -0.28);
      const head = new THREE.Group();
      head.position.set(0, 3.35, 0.22);
      bodyGrp.add(head);
      addM(head, new THREE.BoxGeometry(1.36, 0.92, 1.38), C.skin, 0, 0.1, 0);
      rig.eyes = addShinyEyes(head, 0.46, 0.34, 0.66, 0.25);
      rig.mouthPivot = addM(head, new THREE.BoxGeometry(1.18, 0.34, 1.2), C.belly, 0, -0.45, 0.15);
    } else if (id === 'kurt') {
      rig.legL = addM(bodyGrp, new THREE.CapsuleGeometry(0.26, 0.65, 6, 10), '#363b47', -0.44, 0.6, 0);
      rig.legR = addM(bodyGrp, new THREE.CapsuleGeometry(0.26, 0.65, 6, 10), '#363b47',  0.44, 0.6, 0);
      rig.tail = addM(bodyGrp, new THREE.CapsuleGeometry(0.32, 0.85, 8, 10), C.fur, 0, 1.1, -0.95, -0.6);
      addM(bodyGrp, new THREE.CylinderGeometry(0.76, 0.88, 1.6, 16), C.vest, 0, 1.6, 0);
      addM(bodyGrp, new THREE.TorusGeometry(0.72, 0.16, 10, 18), C.bandana, 0, 2.35, 0.05, Math.PI / 2);
      rig.armL = addM(bodyGrp, new THREE.CapsuleGeometry(0.23, 0.68, 6, 10), C.fur, -0.98, 1.68, 0, 0, 0, 0.2);
      rig.armR = addM(bodyGrp, new THREE.CapsuleGeometry(0.23, 0.68, 6, 10), C.fur,  0.98, 1.68, 0, 0, 0, -0.2);
      const head = new THREE.Group();
      head.position.set(0, 3.12, 0);
      bodyGrp.add(head);
      addM(head, new THREE.SphereGeometry(0.96, 18, 14), C.fur, 0, 0, 0);
      addM(head, new THREE.ConeGeometry(0.34, 0.88, 10), C.fur, -0.65, 0.88, -0.05, 0, 0, 0.16);
      addM(head, new THREE.ConeGeometry(0.34, 0.88, 10), C.fur,  0.65, 0.88, -0.05, 0, 0, -0.16);
      rig.eyes = addShinyEyes(head, 0.4, 0.14, 0.82, 0.22);
      addM(head, new THREE.BoxGeometry(0.64, 0.4, 0.82), C.light, 0, -0.18, 0.95);
      addM(head, new THREE.SphereGeometry(0.17, 10, 8), '#16181f', 0, -0.06, 1.38);
      rig.mouthPivot = addM(head, new THREE.BoxGeometry(0.52, 0.16, 0.62), '#9e2438', 0, -0.44, 0.88);
    }

    const sc = (def.scale || 1) * 1.15;
    // Soft grounded circular contact shadow under every character (0ms cost, works even in 60FPS Fast mode!)
    const cShadow = new THREE.Mesh(
      new THREE.CircleGeometry(1.18, 16),
      new THREE.MeshBasicMaterial({ color: 0x0f1e3a, transparent: true, opacity: 0.28, depthWrite: false })
    );
    cShadow.rotation.x = -Math.PI / 2;
    cShadow.position.y = 0.04;
    root.add(cShadow);
    root.scale.set(sc, sc, sc);
    return rig;
  },

  getOrCreateRig(key, charId) {
    if (!this.charRigs.has(key)) {
      const rig = this.createCharacterRig(charId);
      this.scene.add(rig.root);
      this.charRigs.set(key, rig);
    }
    return this.charRigs.get(key);
  },

  animateRig(rig, wx, wy, wz, yaw, t, moving, mouthOpen, wardrobe = null) {
    rig.root.visible = true;
    rig.root.position.set(wx, wy, wz);
    rig.root.rotation.y = yaw;

    const walk = moving ? Math.sin(t * 11) : 0;
    const bob = moving ? Math.abs(Math.sin(t * 11)) * 0.22 : Math.sin(t * 2.7 + wx) * 0.06;
    rig.bodyGrp.position.y = bob;

    if (rig.legL) rig.legL.rotation.x = walk * 0.5;
    if (rig.legR) rig.legR.rotation.x = -walk * 0.5;
    if (rig.armL) rig.armL.rotation.x = -walk * 0.55;
    if (rig.armR) rig.armR.rotation.x = walk * 0.55;
    if (rig.tail) rig.tail.rotation.y = Math.sin(t * 5.5) * 0.25;
    if (rig.bowtie) rig.bowtie.rotation.z = mouthOpen > 0.05 ? t * 10 : Math.sin(t * 2.5) * 0.12;
    if (rig.wings.length === 2) {
      const flap = Math.sin(t * (moving || mouthOpen > 0.05 ? 22 : 7)) * 0.42;
      rig.wings[0].rotation.z = 0.3 + flap;
      rig.wings[1].rotation.z = -0.3 - flap;
    }

    // Natural Cute Eye Blink every ~3.8 seconds!
    const blink = (t + Math.abs(wx * 0.1)) % 3.8 < 0.13 ? 0.12 : 1.0;
    for (const e of rig.eyes) {
      e.white.scale.y = blink;
      e.pupil.scale.y = blink;
      e.spark.visible = blink > 0.5;
    }

    // Articulated Beak / Jaw / Under-Nose Mouth Rig!
    if (rig.mouthPivot) {
      if (rig.upperBeak) {
        rig.upperBeak.rotation.x = Math.PI / 2 - mouthOpen * 0.18;
        rig.mouthPivot.rotation.x = Math.PI / 2 + 0.14 + mouthOpen * 0.48;
      } else {
        rig.mouthPivot.rotation.x = mouthOpen * 0.42;
        rig.mouthPivot.scale.y = 1 + mouthOpen * 1.6;
      }
    }

    if (rig.id === 'rakun' && wardrobe) {
      if (rig.coatMesh && wardrobe.coatHex) rig.coatMesh.material.color.set(wardrobe.coatHex);
      if (rig.capGroup) rig.capGroup.visible = (wardrobe.hat || 'cap') !== 'none_hat';
    }
  },

  project(mx, myHeight, mz, w, h) {
    if (!this.camera) return null;
    const THREE = ThreeShared.THREE;
    const v = new THREE.Vector3(this.wx(mx), myHeight / 12, this.wz(mz));
    v.project(this.camera);
    if (v.z > 1) return null;
    return {
      x: (v.x * 0.5 + 0.5) * w,
      y: (0.5 - v.y * 0.5) * h
    };
  },

  screenToWorld(clientX, clientY) {
    if (!this.camera || !ThreeShared.THREE) return null;
    const THREE = ThreeShared.THREE;
    const ndc = new THREE.Vector2(
      (clientX / Math.max(1, window.innerWidth)) * 2 - 1,
      -(clientY / Math.max(1, window.innerHeight)) * 2 + 1
    );
    const ray = new THREE.Raycaster();
    ray.setFromCamera(ndc, this.camera);
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.3);
    const hit = new THREE.Vector3();
    if (ray.ray.intersectPlane(plane, hit)) {
      return { x: hit.x * 12 + 1200, y: hit.z * 12 + 900 };
    }
    return null;
  },

  renderScene(stateObj, dt) {
    if (!this.ok || !this.on || !this.ready) return;
    const THREE = ThreeShared.THREE;

    if (this.activeWorldId !== stateObj.worldId) {
      this.buildWorldScene(stateObj.worldId, stateObj.worldDef);
    }

    const t = stateObj.time;

    // Animate Windmill & Drifting Clouds
    if (this.windmillRotor) this.windmillRotor.rotation.z = t * 1.1;
    for (let i = 0; i < this.clouds.length; i++) {
      this.clouds[i].position.x += dt * 1.2;
      if (this.clouds[i].position.x > 95) this.clouds[i].position.x = -95;
    }

    // Hide all character rigs first, then enable active ones
    for (const rig of this.charRigs.values()) rig.root.visible = false;

    const px = this.wx(stateObj.player.x), pz = this.wz(stateObj.player.y);

    // Fast Cached Building & Tree Occlusion Fade (Zero per-frame .traverse()!)
    for (const o of this.tallObjects) {
      const blocking = stateObj.mode !== 'title' && !stateObj.seaActive &&
        o.z > pz + 1.2 && Math.abs(o.x - px) < o.r && (o.z - pz) < 22;
      const targetOp = blocking ? 0.32 : 1.0;
      const prev = o.fade === undefined ? 1.0 : o.fade;
      o.fade = prev + (targetOp - prev) * Math.min(1, dt * 8);
      if (Math.abs(o.fade - (o.appliedFade ?? 1.0)) > 0.025) {
        o.appliedFade = o.fade;
        if (!o.meshes) {
          o.meshes = [];
          o.grp.traverse((n) => {
            if (n.isMesh && n.material) {
              n.material = n.material.clone();
              o.meshes.push(n.material);
            }
          });
        }
        const isFaded = o.fade < 0.97;
        for (let m = 0; m < o.meshes.length; m++) {
          o.meshes[m].transparent = isFaded;
          o.meshes[m].opacity = o.fade;
        }
      }
    }

    // Camera (Sunny-Hill 42° Picture-Book Angle + Dialog Framing + Shake!)
    let fx = px, fz = pz, dist = 54, pitch = 42 * Math.PI / 180;
    if (stateObj.mode === 'title') {
      fx = Math.cos(t * 0.22) * 26;
      fz = Math.sin(t * 0.22) * 18;
      dist = 62;
    } else if (stateObj.seaActive) {
      fx = this.wx((stateObj.sea.bx + stateObj.sea.kx) * 0.5);
      fz = this.wz((stateObj.sea.by + stateObj.sea.ky) * 0.5);
      dist = 74;
    } else if (stateObj.dialogOpen && stateObj.dialogFocus) {
      fx = (px + this.wx(stateObj.dialogFocus.x)) * 0.5;
      fz = (pz + this.wz(stateObj.dialogFocus.y)) * 0.5 + 3;
      dist = 42;
    } else if (stateObj.arenaWide) {
      dist = 66;
    }

    const shkX = stateObj.shake > 0 ? (Math.random() - 0.5) * stateObj.shake * 1.8 : 0;
    const shkY = stateObj.shake > 0 ? (Math.random() - 0.5) * stateObj.shake * 1.4 : 0;

    this.camera.position.set(fx + shkX, 1.5 + Math.sin(pitch) * dist + shkY, fz + Math.cos(pitch) * dist);
    this.camera.lookAt(fx + shkX, 1.4 + shkY, fz);

    this.sunLight.position.set(fx + 35, 68, fz + 35);
    this.sunLight.target.position.set(fx, 0, fz);
    this.sunLight.target.updateMatrixWorld();

    // SEA BATTLE MODE (Chapter 8!)
    if (this.worldGroup) this.worldGroup.visible = !stateObj.seaActive;
    if (!this.seaGroup) {
      this.seaGroup = new THREE.Group();
      const ocean = new THREE.Mesh(new THREE.PlaneGeometry(420, 420), new THREE.MeshStandardMaterial({ color: '#2498f0', roughness: 0.2 }));
      ocean.rotation.x = -Math.PI / 2;
      this.seaGroup.add(ocean);
      this.policeBoatMesh = new THREE.Mesh(new THREE.BoxGeometry(4.8, 1.6, 8.2), this.mat('#1e3a73'));
      this.crowRaftMesh = new THREE.Mesh(new THREE.BoxGeometry(5.2, 1.0, 6.4), this.mat('#8a5830'));
      this.seaCrateMesh = new THREE.Mesh(new THREE.BoxGeometry(2.2, 2.2, 2.2), this.mat('#ff9f1c'));
      this.seaGroup.add(this.policeBoatMesh, this.crowRaftMesh, this.seaCrateMesh);
      this.scene.add(this.seaGroup);
    }
    this.seaGroup.visible = !!stateObj.seaActive;

    if (stateObj.seaActive) {
      const S = stateObj.sea;
      const sbx = this.wx(S.bx), sbz = this.wz(S.by);
      const skx = this.wx(S.kx), skz = this.wz(S.ky);
      this.policeBoatMesh.position.set(sbx, 0.6 + Math.sin(t * 2.5) * 0.16, sbz);
      this.policeBoatMesh.rotation.y = S.byaw;
      this.crowRaftMesh.position.set(skx, 0.4 + Math.cos(t * 2.7) * 0.16, skz);
      this.crowRaftMesh.rotation.y = S.kyaw;

      this.animateRig(this.getOrCreateRig('player', 'rakun'), sbx, 1.3, sbz, S.byaw, t, false, AudioSys.mouthOpenFor('rakun', t), stateObj.wardrobe);
      this.animateRig(this.getOrCreateRig('sea_karga', 'karga'), skx, 0.9, skz, S.kyaw, t, false, AudioSys.mouthOpenFor('karga', t));

      this.seaCrateMesh.visible = !!S.crate;
      if (S.crate) {
        this.seaCrateMesh.position.set(this.wx(S.crate.x), 0.9 + Math.sin(t * 3.5) * 0.25, this.wz(S.crate.y));
        this.seaCrateMesh.rotation.y = t * 1.4;
      }
      if (!this.seaBallMeshes) this.seaBallMeshes = [];
      while (this.seaBallMeshes.length < (S.balls || []).length) {
        const bm = new THREE.Mesh(new THREE.SphereGeometry(0.95, 12, 10), this.mat('#ffdd33', 0.2, 0.1, '#aa6600'));
        this.seaGroup.add(bm);
        this.seaBallMeshes.push(bm);
      }
      this.seaBallMeshes.forEach((bm, idx) => {
        const b = (S.balls || [])[idx];
        bm.visible = !!b;
        if (b) {
          bm.position.set(this.wx(b.x), (b.zH || 20) / 12, this.wz(b.y));
          bm.material.color.set(b.enemy ? '#ff385c' : '#00f5d4');
        }
      });
      this.pedestalMesh.visible = false;
      this.arrowMesh.visible = false;
      this.renderer.render(this.scene, this.camera);
      return;
    }

    // Playable Sunny-Hill Town Soccer Ball & Goal Net!
    if (!this.soccerGrp) {
      const sg = new THREE.Group();
      const postMat = this.mat('#ffffff', 0.3);
      const pL = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 2.4, 8), postMat); pL.position.set(-2.6, 1.2, 0);
      const pR = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 2.4, 8), postMat); pR.position.set(2.6, 1.2, 0);
      const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 5.4, 8), postMat); bar.rotation.z = Math.PI / 2; bar.position.set(0, 2.4, 0);
      sg.add(pL, pR, bar);
      this.scene.add(sg);
      this.soccerGoal = sg;
      this.soccerBallMesh = new THREE.Mesh(new THREE.SphereGeometry(0.68, 16, 14), this.mat('#ffffff', 0.35));
      this.soccerBallMesh.castShadow = true;
      this.scene.add(this.soccerBallMesh);
    }
    const showSoccer = stateObj.soccer && stateObj.worldId !== 'lab' && !stateObj.arenaWide;
    this.soccerGoal.visible = !!showSoccer;
    this.soccerBallMesh.visible = !!showSoccer;
    if (showSoccer) {
      this.soccerGoal.position.set(this.wx(stateObj.soccer.gx), 0.3, this.wz(stateObj.soccer.gy));
      this.soccerBallMesh.position.set(this.wx(stateObj.soccer.bx), 0.95 + Math.abs(Math.sin(stateObj.soccer.bvx * 0.02)) * 0.2, this.wz(stateObj.soccer.by));
    }

    // Pedestal
    this.pedestalMesh.visible = !!stateObj.pedestal;
    if (stateObj.pedestal) {
      this.pedestalMesh.position.set(this.wx(stateObj.pedestal.x), 0.3, this.wz(stateObj.pedestal.y));
    }

    // Answer Cloud Pads (Chapters 5 & 11)
    while (this.padMeshes.length < (stateObj.pads || []).length) {
      const pm = new THREE.Mesh(new THREE.CylinderGeometry(3.6, 3.4, 0.75, 20), this.mat('#ffffff', 0.35));
      pm.receiveShadow = true;
      this.scene.add(pm);
      this.padMeshes.push(pm);
    }
    this.padMeshes.forEach((pm, idx) => {
      const pad = (stateObj.pads || [])[idx];
      pm.visible = !!pad;
      if (pad) {
        pm.position.set(this.wx(pad.x), 0.55, this.wz(pad.y));
        pm.material.color.set(pad.tint || '#ffffff');
      }
    });

    // World Collectibles & Carried Item
    for (const m of this.itemPool.values()) m.visible = false;
    const allItems = (stateObj.items || []).filter(i => !i.taken);
    allItems.forEach((it) => {
      let im = this.itemPool.get(it.id);
      if (!im) {
        const col = it.mesh === 'fruit' ? '#ff3d57' : it.mesh === 'pizza' ? '#ffae2b' : it.mesh === 'crystal' ? '#38e8ff' : '#ff9f1c';
        im = new THREE.Mesh(new THREE.OctahedronGeometry(1.15, 1), this.mat(col, 0.25, 0.1, col));
        im.castShadow = true;
        this.scene.add(im);
        this.itemPool.set(it.id, im);
      }
      im.visible = true;
      im.position.set(this.wx(it.x), 1.5 + Math.sin(t * 3.5 + it.x) * 0.3, this.wz(it.y));
      im.rotation.y = t * 1.8;
    });

    if (stateObj.carrying) {
      let cm = this.itemPool.get('__carry');
      if (!cm) {
        cm = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.3, 1.1), this.mat('#ff9f1c', 0.3, 0.1, '#663300'));
        this.scene.add(cm);
        this.itemPool.set('__carry', cm);
      }
      cm.visible = true;
      cm.position.set(px, 5.8 + Math.sin(t * 5) * 0.2, pz);
      cm.rotation.y = t * 2.2;
    }

    // Hazards (Barrels / Clown Bombs / Godzilla Blue Shockwaves!)
    while (this.hazardPool.length < (stateObj.hazards || []).length) {
      const hm = new THREE.Mesh(new THREE.SphereGeometry(1.2, 14, 12), this.mat('#ff2e63', 0.3, 0.1, '#660022'));
      this.scene.add(hm);
      this.hazardPool.push(hm);
    }
    this.hazardPool.forEach((hm, idx) => {
      const hz = (stateObj.hazards || [])[idx];
      hm.visible = !!hz;
      if (hz) {
        if (hz.ring) {
          hm.position.set(this.wx(hz.x), 0.5, this.wz(hz.y));
          hm.scale.set(hz.r / 14, 0.12, hz.r / 14);
          hm.material.color.set('#33d6ff');
        } else {
          hm.position.set(this.wx(hz.x), (hz.h || 14) / 12, this.wz(hz.y));
          hm.scale.set(1, 1, 1);
          hm.material.color.set(hz.mesh === 'clownBomb' ? '#ff2e63' : '#d97228');
        }
      }
    });

    // Smoke Puffs from Komik Ejderha's Nostrils!
    while (this.particlePool.length < (stateObj.particles || []).length) {
      const pm = new THREE.Mesh(new THREE.SphereGeometry(0.55, 10, 8), new THREE.MeshBasicMaterial({ color: 0xf4f7ff, transparent: true, opacity: 0.75 }));
      this.scene.add(pm);
      this.particlePool.push(pm);
    }
    this.particlePool.forEach((pm, idx) => {
      const pt = (stateObj.particles || [])[idx];
      pm.visible = !!pt;
      if (pt) {
        pm.position.set(this.wx(pt.x), pt.zH / 12, this.wz(pt.y));
        pm.scale.setScalar(pt.s);
        pm.material.color.set(pt.flame ? '#ff7b1c' : '#f2f6ff');
        pm.material.opacity = clamp(pt.alpha, 0, 0.85);
      }
    });

    // Player (Komiser Rakun) + Yardımcı Vudi + World NPCs
    this.animateRig(
      this.getOrCreateRig('player', 'rakun'),
      px, 0.3, pz,
      stateObj.player.yaw, t, stateObj.player.moving,
      AudioSys.mouthOpenFor('rakun', t), stateObj.wardrobe
    );

    const vx = this.wx(stateObj.vudi.x), vz = this.wz(stateObj.vudi.y);
    this.animateRig(
      this.getOrCreateRig('vudi', 'vudi'),
      vx, 0.3, vz,
      stateObj.vudi.yaw, t, stateObj.vudi.moving,
      AudioSys.mouthOpenFor('vudi', t)
    );

    stateObj.npcs.forEach((npc, idx) => {
      this.animateRig(
        this.getOrCreateRig(`npc_${idx}_${npc.id}`, npc.id),
        this.wx(npc.x), 0.3, this.wz(npc.y),
        npc.yaw || 0, t, !!npc.moving,
        AudioSys.mouthOpenFor(npc.id, t)
      );
    });

    // Vudi's Golden 3D Detective Arrow toward Objective!
    if (stateObj.mode === 'play' && stateObj.questTarget) {
      const qx = this.wx(stateObj.questTarget.x), qz = this.wz(stateObj.questTarget.y);
      if (Math.hypot(qx - px, qz - pz) > 10) {
        this.arrowMesh.visible = true;
        const ax = vx + (vx >= px ? 2.1 : -2.1), az = vz;
        this.arrowMesh.position.set(ax, 4.6 + Math.sin(t * 5) * 0.3, az);
        this.arrowMesh.rotation.y = Math.atan2(qx - ax, qz - az);
      } else {
        this.arrowMesh.visible = false;
      }
    } else {
      this.arrowMesh.visible = false;
    }

    this.renderer.render(this.scene, this.camera);
  }
};
