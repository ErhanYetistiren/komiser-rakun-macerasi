/* ============================================================================
   07-ARSENAL-AND-ASTRO-DATA.JS — 79 GERÇEK .GLB 3D MODEL İLE TAM DONANIMLI
   KILIÇLAR, ELDİVENLER, KALKANLAR, ZIRHLAR, KAHRAMAN KOSTÜMLERİ & UZAY GEMİLERİ
   + BÖLÜM 13–20 GİDEREK ZORLAŞAN ASTRO-GALAKSİ GEZEGENLERİ & UZAY SAVAŞLARI!
   ============================================================================ */

const ARSENAL = {
  suits: [
    { id: 'robot_suit', name: 'Astro-Robot Zırhı', icon: '🤖', glb: 'RobotExpressive.glb', size: 2.35, cost: 0, trail: '#00eeff', desc: 'İkonik mavi-beyaz Astro-Bot ekspresif 3D robotu!' },
    { id: 'rae_astro', name: 'Rakun Uzay Astronotu', icon: '🦝', glb: 'Astronaut_Rae.glb', size: 2.25, cost: 35, trail: '#ffd43b', desc: 'Komiser Rakun\'un özel uzay kasklı 3D astronot kostümü!' },
    { id: 'knight_hero', name: 'Galaksi Şövalyesi', icon: '⚔️', glb: 'KnightCharacter.glb', size: 2.35, cost: 70, trail: '#9be7ff', desc: 'Tam çelik zırhlı 3D şövalye kahraman!' },
    { id: 'trex_suit', name: 'Dino-Titan Kostümü', icon: '🦖', glb: 'Trex.glb', size: 2.65, cost: 95, starReq: 5, trail: '#52ff7a', desc: '5⭐ Kilidi! T-Rex kostümüyle koşarken zümrüt iz bırakır!' },
    { id: 'mech_rae', name: 'Dev Rakun Mek-Robotu', icon: '🦾', glb: 'Mech_Rae.glb', size: 2.85, cost: 135, starReq: 9, trail: '#ff6b2b', desc: '9⭐ Kilidi! Ağır zırhlı alev izli 3D Savaş Robotu!' },
    { id: 'gold_champ', name: 'Altın Şampiyon Astro', icon: '👑', glb: 'RobotExpressive.glb', size: 2.5, cost: 175, starReq: 15, goldTint: true, trail: '#ff38b8', desc: '15⭐ Kilidi! Saf altın kaplama robot + Gökkuşağı hız izi!' }
  ],
  weapons: [
    { id: 'club', name: 'Dedektif Copu', icon: '🏏', glb: 'Club.glb', cost: 0, dmg: 1, range: 3.5, color: '#6cb8ff', desc: 'Hızlı başlangıç dedektif silahı (Hasar: 1).' },
    { id: 'sword', name: 'Şövalye Gümüş Kılıcı', icon: '⚔️', glb: 'Sword.glb', cost: 25, dmg: 2, range: 4.2, color: '#9be7ff', desc: 'Geniş kavisli gümüş kılıç darbesi (Hasar: 2).' },
    { id: 'katana', name: 'Rüzgâr Katanası', icon: '🗡️', glb: 'Katana.glb', cost: 50, dmg: 3, range: 4.6, color: '#5effc8', desc: 'Çevik keskin rüzgâr kılıcı (Hasar: 3).' },
    { id: 'claymore', name: 'Ejderha Alev Kılıcı', icon: '🔥', glb: 'Claymore.glb', cost: 80, dmg: 4, range: 5.2, color: '#ff6b2b', desc: 'Ateş halkası saçan büyük savaş kılıcı (Hasar: 4)!' },
    { id: 'axe_gold', name: 'Altın Galaksi Baltası', icon: '🪓', glb: 'Axe_Double_Golden.glb', cost: 110, dmg: 5, range: 5.5, color: '#ffd43b', desc: 'Çift ağızlı altın savaş baltası (Hasar: 5)!' },
    { id: 'hammer', name: 'Godzilla Yıldırım Çekici', icon: '🔨', glb: 'Hammer_Double.glb', cost: 145, dmg: 7, range: 6.2, color: '#33d6ff', desc: 'Yere vurunca şok dalgası ve sarsıntı yaratır (Hasar: 7)!' },
    { id: 'sword_gold', name: 'Efsanevi Güneş Kılıcı', icon: '🌟', glb: 'Sword_big_Golden.glb', cost: 185, dmg: 9, range: 6.8, color: '#ffe047', desc: 'Devasa altın şampiyon kılıcı (Hasar: 9)!' },
    { id: 'hammer_gold', name: 'Kozmik Altın Çekiç', icon: '⚡', glb: 'Hammer_Double_Golden.glb', cost: 225, dmg: 12, range: 7.4, color: '#ffae00', desc: 'Galaksinin en güçlü altın yıldırım çekici (Hasar: 12)!' }
  ],
  gloves: [
    { id: 'basic_glove', name: 'Dedektif Eldiveni', icon: '🧤', glb: null, cost: 0, power: 'none', desc: 'Standart yakın dövüş eldiveni.' },
    { id: 'frog_glove', name: 'Kurbağa Yaylı Eldiveni', icon: '🐸', glb: 'Glove.glb', cost: 30, power: 'spring_punch', desc: 'Astro-Bot klasiği! E tuşuyla uzaktan yaylı dev yumruk fırlatır!' },
    { id: 'magnet_glove', name: 'Altın Mıknatıs Eldiveni', icon: '🧲', glb: 'Glove.glb', cost: 55, power: 'magnet', desc: 'Altınları uzaktan otomatik çeker + yaylı yumruk fırlatır!' },
    { id: 'balloon_glove', name: 'Ahtapot Balon Gücü', icon: '🎈', glb: 'Glove.glb', cost: 75, power: 'balloon_lift', desc: 'E tuşuyla balon gibi havalanıp yüksek adalara uçurur!' },
    { id: 'ice_glove', name: 'Kutup Buz Eldiveni', icon: '❄️', glb: 'Glove.glb', cost: 95, power: 'ice_blast', desc: 'E tuşuyla dondurucu buz küresi atar, Bossları yavaşlatır!' },
    { id: 'plasma_glove', name: 'Üçlü Plazma Eldiveni', icon: '⚡', glb: 'Glove.glb', cost: 135, power: 'triple_plasma', desc: 'E tuşuyla 3 yöne yıldırım plazması fırlatır!' }
  ],
  gadgets: [
    { id: 'jet_std', name: 'Hover-Lazer Çizmeler', icon: '🥾', glb: null, cost: 0, hoverSec: 1.5, dash: false, shield: 0, desc: 'Havada Zıpla tuşuna basılı tutunca mavi Hover-Lazer ile süzülür!' },
    { id: 'backpack_jet', name: 'Turbo Jet-Pack Çantası', icon: '🚀', glb: 'Backpack.glb', cost: 45, hoverSec: 2.7, dash: true, shield: 0, desc: '2.7 sn Hover-Lazer + Shift ile havada ileri Jet-Dash atılması!' },
    { id: 'shield_gold', name: 'Altın Kelt Kalkanı + Jet', icon: '🛡️', glb: 'Shield_Celtic_Golden.glb', cost: 95, hoverSec: 3.1, dash: true, shield: 0.4, desc: 'Sol kolda gerçek 3D altın kalkan + Jet-Dash + %40 koruma!' }
  ],
  armors: [
    { id: 'police_suit', name: 'Komiser Rozet Zırhı', icon: '👮', glb: null, cost: 0, hearts: 4, desc: '4 Kalp dayanıklılık.' },
    { id: 'knight_helm', name: 'Şövalye Zırh Miğferi', icon: '🪖', glb: 'Helmet1.glb', cost: 40, hearts: 6, desc: '6 Kalp dayanıklılık + 3D Şövalye Miğferi.' },
    { id: 'space_visor', name: 'Galaksi Uzay Kaskı', icon: '🧑‍🚀', glb: 'SpaceHelmet.glb', cost: 85, hearts: 8, desc: '8 Kalp dayanıklılık + 3D Uzay Kaskı.' },
    { id: 'gold_armor', name: 'Altın Şampiyon Zırhı', icon: '🛡️', glb: 'Armor_Golden.glb', cost: 140, hearts: 10, desc: '10 Kalp dayanıklılık + 3D Altın Zırh!' },
    { id: 'king_crown', name: 'Efsanevi Galaksi Tacı', icon: '👑', glb: 'Crown.glb', cost: 190, hearts: 12, desc: '12 Kalp dayanıklılık + 3D Altın Kraliyet Tacı!' }
  ],
  ships: [
    { id: 'rae_ship', name: 'Rakun Yıldız Jeti', icon: '🦝', glb: 'Spaceship_Rae.glb', cost: 0, shots: 2, speed: 1.05, desc: 'Komiser Rakun\'un özel çift lazerli uzay uçağı!' },
    { id: 'striker', name: 'Polis Yıldız Avcısı', icon: '✈️', glb: 'Striker.glb', cost: 35, shots: 3, speed: 1.12, desc: '3\'lü lazerli hızlı galaksi avcı uçağı!' },
    { id: 'frog_ship', name: 'Zümrüt Kurbağa Jeti', icon: '🐸', glb: 'Spaceship_Frog.glb', cost: 65, shots: 4, speed: 1.18, desc: '4\'lü plazma toplu süper çevik uzay gemisi!' },
    { id: 'dispatcher', name: 'Ağır Galaksi Kruvazörü', icon: '🛸', glb: 'Dispatcher.glb', cost: 100, shots: 5, speed: 1.22, desc: '5\'li yayılım lazeri + ağır kruvazör gövdesi!' },
    { id: 'bob_ace', name: 'Süper Fırtına Jet-X', icon: '🚀', glb: 'Bob.glb', cost: 145, shots: 6, speed: 1.32, desc: '6\'lı süper lazer fırtınası — Galaksi Hakimi!' }
  ],
  pets: [
    { id: 'none_pet', name: 'Yardımcı Dron Yok', icon: '🐾', glb: null, cost: 0, bonusHearts: 0, magnet: false, autoShot: false, desc: 'Tek başına macera.' },
    { id: 'vudi_pet', name: 'Uzaylı Vudi Dronu', icon: '🐦', glb: 'Parrot.glb', cost: 40, bonusHearts: 0, magnet: true, autoShot: false, desc: 'Yanında uçar ve yakındaki altınları senin için toplar!' },
    { id: 'bee_pet', name: 'Altın Arı Muhafızı', icon: '🐝', glb: 'Astronaut_Bee.glb', cost: 75, bonusHearts: 1, magnet: true, autoShot: false, desc: '+1 Ekstra Kalp kapasitesi + altın mıknatısı!' },
    { id: 'dino_pet', name: 'Mini T-Rex Koruyucu', icon: '🦖', glb: 'Trex.glb', cost: 115, bonusHearts: 1, magnet: false, autoShot: true, desc: '+1 Kalp + yakındaki düşmanlara otomatik plazma atar!' },
    { id: 'wing_pet', name: 'Zümrüt Kanat Dostu', icon: '🛸', glb: 'Spaceship_Frog.glb', cost: 155, starReq: 10, bonusHearts: 2, magnet: true, autoShot: true, desc: '10⭐ Kilidi! +2 Kalp, Mıknatıs ve Uzay Savaşında Kanat Uçağı ateşi!' }
  ]
};

const ASTRO_CHAPTERS = [
  {
    num: 13,
    id: 'ch13',
    astroType: 'platformer',
    difficulty: 1,
    subject: 'ASTRO-TÜRKÇE',
    subjectKey: 'turkce',
    subjectColor: '#ff7b29',
    topic: 'Eş Sesli (Sesteş) Kelimeler ve Deyimler',
    title: 'Bölüm 13: Gökyüzü Bahçesi Gezegeni (Astro 1. Gezegen)',
    theme: { skyTop: '#1e64d8', skyBot: '#8ce6ff', plat: '#59d665', side: '#c98a4b', tree: 'Tree_Fruit.glb', planet: 'Planet_1.glb' },
    rescueModels: ['Fox.glb', 'Duck.glb', 'Flamingo.glb'],
    enemyModels: ['Frog.glb', 'Bee.glb', 'Crab.glb'],
    bossModel: 'Mech_Frog.glb',
    bossName: 'BAHÇE BEKÇİSİ DEV KURBAĞA-MEK',
    bossHp: 10,
    rewardUnlock: { type: 'gloves', id: 'frog_glove', label: '🐸 Kurbağa Yaylı Eldiveni!' },
    summary: 'Uzay uçağınla Gökyüzü Bahçesi\'ne in! Çift zıpla, Hover-Lazer ile süzül, Tilki, Ördek ve Flamingo\'yu kurtar ve Kurbağa-Mek\'i yen!',
    questions: [
      { q: 'Aşağıdaki kelimelerden hangisi EŞ SESLİ (yazılışı aynı, anlamı farklı olan) bir kelimedir?', v: '🌹 GÜL / 😄 GÜL!', opts: ['YÜZ (Sayı / Surat / Suda yüzmek)', 'KALEM', 'PENCERE'], ans: 0, exp: '"Yüz" hem 100 sayısı, hem suratımız, hem de suda yüzmek anlamlarına gelen eş sesli bir kelimedir.' },
      { q: '"Ağzı kulaklarına varmak" deyimi ne anlama gelir?', v: '😄🎉', opts: ['Çok sevinmek, çok mutlu olmak', 'Kulakları ağrımak', 'Çok uykusu gelmek'], ans: 0, exp: 'Çok sevinen insanların genişçe gülümsemesini anlatan bir deyimdir.' },
      { q: '"ÇAY" kelimesinin iki farklı anlamı hangi seçenekte doğru verilmiştir?', v: '🍵 & 🏞️', opts: ['İçtiğimiz sıcak içecek — Küçük akarsu/dere', 'Büyük deniz — Yüksek dağ', 'Meyve ağacı — Okul çantası'], ans: 0, exp: 'Çay hem içtiğimiz içecek hem de dereden büyük, ırmaktan küçük akarsudur.' }
    ]
  },
  {
    num: 14,
    id: 'ch14',
    astroType: 'starfighter',
    difficulty: 2,
    subject: 'GALAKSİ MATEMATİK',
    subjectKey: 'matematik',
    subjectColor: '#2998ff',
    topic: 'Hızlı Zihinden Toplama ve Çıkarma',
    title: 'Bölüm 14: Galaksi Uzay Uçağı Savaşı I — Asteroit Kuşağı!',
    theme: { skyTop: '#070b24', skyBot: '#1c1247', planet: 'Planet_3.glb' },
    enemyShipGlb: 'Enemy_Flying.glb',
    bossModel: 'Dispatcher.glb',
    bossName: 'KARGA\'NIN ANA UZAY KRUVAZÖRÜ',
    bossHp: 18,
    targetKills: 14,
    rewardUnlock: { type: 'weapons', id: 'sword', label: '⚔️ Şövalye Gümüş Kılıcı!' },
    summary: 'Rakun Yıldız Jetini uçur! Asteroitlerden kaç, Karga\'nın 14 uzay dronunu vur, Matematik kalkanını kır ve Ana Kruvazörü patlat!',
    questions: [
      { q: 'Zihinden işlem: 50 + 30 + 15 işleminin sonucu kaçtır?', v: '🚀 50 + 30 + 15', opts: ['95', '85', '90'], ans: 0, exp: '50 + 30 = 80, üstüne 15 eklersek 95 eder!' },
      { q: '100 sayısından önce 40, sonra 15 çıkarırsak kaç kalır?', v: '🛸 100 - 40 - 15', opts: ['45', '55', '35'], ans: 0, exp: '100 - 40 = 60; 60 - 15 = 45 kalır!' },
      { q: 'Bir uzay filosunda 28 mavi uçak, 22 sarı uçak vardır. Toplam kaç uçak vardır?', v: '✈️ 28 + 22', opts: ['50', '40', '60'], ans: 0, exp: '8 + 2 = 10, 20 + 20 + 10 = 50 uçak!' }
    ]
  },
  {
    num: 15,
    id: 'ch15',
    astroType: 'platformer',
    difficulty: 2,
    subject: 'ASTRO-HAYAT BİLGİSİ',
    subjectKey: 'hayat',
    subjectColor: '#2ec462',
    topic: 'Hayvanlar, Bitkiler ve Doğal Yaşam',
    title: 'Bölüm 15: Zümrüt Dino-Cangıl & Yaylı Eldiven Gezegeni',
    theme: { skyTop: '#0d5c46', skyBot: '#7ae89c', plat: '#3eb857', side: '#6e472b', tree: 'Tree_Floating.glb', planet: 'Planet_6.glb' },
    rescueModels: ['Trex.glb', 'Triceratops.glb', 'Parrot.glb'],
    enemyModels: ['Spider.glb', 'Snake_angry.glb', 'Frog.glb'],
    bossModel: 'Enemy_Large.glb',
    bossName: 'DEV CANGIL MUHAFIZI GORGON',
    bossHp: 14,
    rewardUnlock: { type: 'gadgets', id: 'backpack_jet', label: '🚀 Turbo Jet-Pack Çantası!' },
    summary: 'Kurbağa Yaylı Eldivenini (E tuşu) kullanarak örümcekleri uzaktan devir, T-Rex, Triceratops ve Papağan\'ı kurtar!',
    questions: [
      { q: 'Sokakta yaşayan kedi, köpek ve kuşları korumak için sıcak yaz ve soğuk kış günlerinde ne yapmalıyız?', v: '🐾🥣💧', opts: ['Kapımızın önüne temiz bir kap su ve mama koymalıyız', 'Onları korkutup kovalamalıyız', 'Yuvalarını bozmalıyız'], ans: 0, exp: 'Hayvanları korumak ve onlara su/yiyecek sağlamak doğaya karşı sorumluluğumuzdur.' },
      { q: 'Ormanların zarar görmemesi için piknik yaptıktan sonra ne yapmalıyız?', v: '🌲🔥🗑️', opts: ['Ateşi tamamen söndürmeli ve çöplerimizi çöp kutusuna atmalıyız', 'Cam şişeleri çimenlerin üstünde bırakmalıyız', 'Ağaç dallarını kırmalıyız'], ans: 0, exp: 'Cam kırıkları ve sönmemiş ateş orman yangınlarına yol açar.' },
      { q: 'Arılar doğamız için neden çok önemlidir?', v: '🐝🌸🍯', opts: ['Hem bal yaparlar hem de çiçeklerin tozlaşmasını sağlarlar', 'Hiçbir faydaları yoktur', 'Ağaçları kuruturlar'], ans: 0, exp: 'Arılar bitkilerin çoğalması (tozlaşma) ve bal üretimi için vazgeçilmezdir.' }
    ]
  },
  {
    num: 16,
    id: 'ch16',
    astroType: 'platformer',
    difficulty: 3,
    subject: 'ASTRO-MATEMATİK',
    subjectKey: 'matematik',
    subjectColor: '#2998ff',
    topic: 'Kesirler, Zaman ve Uzunluk Problemleri',
    title: 'Bölüm 16: Kristal Buzul Gezegeni & Jet-Dash Parkuru',
    theme: { skyTop: '#163d7a', skyBot: '#bdf0ff', plat: '#8ce4ff', side: '#467ab3', tree: 'Crystal1.glb', planet: 'Planet_1.glb' },
    rescueModels: ['Wolf.glb', 'ShibaInu.glb', 'Astronaut_Flamingo.glb'],
    enemyModels: ['Wasp.glb', 'Crab.glb', 'Spider.glb'],
    bossModel: 'Stan.glb',
    bossName: 'BUZUL KALESİ DEV MEK-STAN',
    bossHp: 18,
    rewardUnlock: { type: 'gloves', id: 'ice_glove', label: '❄️ Kutup Buz Eldiveni!' },
    summary: 'Kaygan kristal adalarda Shift ile Jet-Dash yap, dönen testerelerden atla, Kurt, Shiba ve Astronot Flamingo\'yu kurtar!',
    questions: [
      { q: 'Bir düzine (12) kalemin ÇEYREĞİ (4\'te 1\'i) kaç kalem eder?', v: '✏️ 12 ÷ 4 = ?', opts: ['3 kalem', '6 kalem', '4 kalem'], ans: 0, exp: 'Bir çokluğun çeyreğini bulmak için 4 eş parçaya böleriz: 12 ÷ 4 = 3!' },
      { q: 'Saat 14.00\'te başlayan bir çizgi film YARIM SAAT sürdüğüne göre saat kaçta biter?', v: '🕑 + 30 dk', opts: ['14.30\'da biter', '15.00\'te biter', '14.15\'te biter'], ans: 0, exp: 'Yarım saat 30 dakikadır: 14.00 + 30 dk = 14.30.' },
      { q: 'Her biri 2 metre olan 4 ip uç uca eklenirse toplam uzunluk kaç metre olur?', v: '📏 4 × 2 m', opts: ['8 metre', '6 metre', '10 metre'], ans: 0, exp: '4 × 2 = 8 metre (yani 800 santimetre) olur.' }
    ]
  },
  {
    num: 17,
    id: 'ch17',
    astroType: 'platformer',
    difficulty: 4,
    subject: 'ASTRO-TÜRKÇE',
    subjectKey: 'turkce',
    subjectColor: '#ff5722',
    topic: 'Okuduğunu Anlama, Sebep-Sonuç ve Noktalama',
    title: 'Bölüm 17: Magma Demirhanesi & Ejderha Alev Kılıcı!',
    theme: { skyTop: '#3d0c11', skyBot: '#ff7733', plat: '#5c4340', side: '#2b1918', tree: 'Tree_Lava.glb', planet: 'Planet_3.glb' },
    rescueModels: ['KnightCharacter.glb', 'Soldier.glb', 'Astronaut_Frog.glb'],
    enemyModels: ['Snake_angry.glb', 'Wasp.glb', 'Enemy_Flying.glb'],
    bossModel: 'Leela.glb',
    bossName: 'KIZGIN MAGMA TİTANI LEELA',
    bossHp: 22,
    rewardUnlock: { type: 'weapons', id: 'claymore', label: '🔥 Ejderha Alev Kılıcı!' },
    summary: 'Lav nehirlerinin üstündeki platformları ve testereleri aş! Şövalye, Asker ve Astronot Kurbağa\'yı kurtar, Magma Titanını devir!',
    questions: [
      { q: '"Yağmur şiddetli yağdığı için maç ertelendi." cümlesinde maçın ertelenmesinin SEBEBİ nedir?', v: '🌧️⚽', opts: ['Yağmurun şiddetli yağması', 'Havanın çok sıcak olması', 'Topun patlaması'], ans: 0, exp: '"...dığı için" ifadesi cümlenin sebebini (nedenini) gösterir.' },
      { q: '"Pazardan elma( ) armut( ) çilek ve muz aldık." cümlesinde yay ayraçların içine hangi işaret konmalıdır?', v: '🍎🍐🍓🍌', opts: ['Virgül (,)', 'Soru işareti (?)', 'Ünlem (!)'], ans: 0, exp: 'Eş görevli kelimeleri sıralarken aralarına virgül (,) konur.' },
      { q: 'Aşağıdaki kelime çiftlerinden hangisi ZIT ANLAMLI bir çifttir?', v: '↔️ Karşıt Anlam', opts: ['ACI — TATLI', 'OKUL — MEKTEP', 'BEYAZ — AK'], ans: 0, exp: 'Okul-Mektep ve Beyaz-Ak eş anlamlıdır; Acı-Tatlı ise zıt anlamlıdır.' }
    ]
  },
  {
    num: 18,
    id: 'ch18',
    astroType: 'starfighter',
    difficulty: 4,
    subject: 'GALAKSİ İNGİLİZCE',
    subjectKey: 'ingilizce',
    subjectColor: '#9c5cff',
    topic: '2. Sınıf İngilizce Yetenekler (Can/Can\'t), Renkler ve Konumlar',
    title: 'Bölüm 18: Galaksi Savaşı II — Karanlık Filo Kuşatması!',
    theme: { skyTop: '#05021a', skyBot: '#2e0f54', planet: 'Planet_6.glb' },
    enemyShipGlb: 'Bob.glb',
    bossModel: 'Mech_Rae.glb',
    bossName: 'KORSAN GÖLGE MEK-KRUVAZÖRÜ',
    bossHp: 28,
    targetKills: 20,
    rewardUnlock: { type: 'ships', id: 'frog_ship', label: '🐸 Zümrüt Kurbağa Jeti (4\'lü Plazma)!' },
    summary: 'Hızlı düşman avcı filosu! 20 düşman gemisini düşür, İngilizce güvenlik kalkanını kır ve Korsan Mek-Kruvazörünü patlat!',
    questions: [
      { q: '"A bird CAN FLY, a fish CAN SWIM." cümlesinin Türkçesi nedir?', v: '🐦✈️ 🐟🌊', opts: ['Bir kuş uçabilir, bir balık yüzebilir.', 'Bir kuş koşabilir, bir balık yürüyebilir.', 'Bir kedi şarkı söyleyebilir.'], ans: 0, exp: 'Can fly = Uçabilir, Can swim = Yüzebilir!' },
      { q: '"How are you today?" — "I am HAPPY!" diyen bir çocuk kendini nasıl hissediyordur?', v: '😊🌟', opts: ['Mutlu', 'Üzgün (Sad)', 'Yorgun (Tired)'], ans: 0, exp: 'Happy = Mutlu, Sad = Üzgün, Angry = Kızgın!' },
      { q: '"Where is the cat?" — "It is ON the table." cümlesine göre kedi nerededir?', v: '🐱🪑', opts: ['Masanın ÜSTÜNDE', 'Masanın ALTINDA (Under)', 'Kutunun İÇİNDE (In)'], ans: 0, exp: 'On = Üstünde, In = İçinde, Under = Altında!' }
    ]
  },
  {
    num: 19,
    id: 'ch19',
    astroType: 'platformer',
    difficulty: 5,
    subject: 'ASTRO-MATEMATİK',
    subjectKey: 'matematik',
    subjectColor: '#00c8ff',
    topic: 'İki İşlemli 2. Sınıf Problemleri & Çarpma-Bölme',
    title: 'Bölüm 19: Siber-Neon Kulesi & Godzilla Yıldırım Çekici!',
    theme: { skyTop: '#090d2b', skyBot: '#3c1e70', plat: '#273c75', side: '#00d8ff', tree: 'Crystal1.glb', planet: 'Planet_1.glb' },
    rescueModels: ['Xbot.glb', 'Michelle.glb', 'Astronaut_Bee.glb'],
    enemyModels: ['Enemy_Flying.glb', 'Spider.glb', 'Wasp.glb'],
    bossModel: 'BrainStem.glb',
    bossName: 'SİBER-KOMUTAN OMEGA',
    bossHp: 26,
    rewardUnlock: { type: 'weapons', id: 'hammer', label: '🔨 Godzilla Yıldırım Çekici!' },
    summary: 'Yüksek hızda kayan siber adalarda şok dalgalarından atla! Xbot, Michelle ve Astronot Arı\'yı kurtar, Siber-Komutan Omega\'yı yen!',
    questions: [
      { q: 'Tanesi 4 TL olan kalemlerden 5 tane alan Zeynep, kırtasiyeciye 50 TL verdi. Kaç TL para üstü alır?', v: '✏️ 50 - (5 × 4)', opts: ['30 TL', '20 TL', '25 TL'], ans: 0, exp: 'Kalemler 5 × 4 = 20 TL tutar. 50 - 20 = 30 TL para üstü alır!' },
      { q: 'Bir otobüste 34 yolcu vardı. İlk durakta 12 yolcu indi, 9 yolcu bindi. Otobüste kaç yolcu oldu?', v: '🚌 34 - 12 + 9', opts: ['31 yolcu', '22 yolcu', '37 yolcu'], ans: 0, exp: '34 - 12 = 22 yolcu kaldı; 9 yolcu binince 22 + 9 = 31 yolcu oldu!' },
      { q: '5\'erli 6 grup yıldızdan 8 tanesi kayarsa geriye kaç yıldız kalır?', v: '⭐ (6 × 5) - 8', opts: ['22 yıldız', '30 yıldız', '24 yıldız'], ans: 0, exp: '6 × 5 = 30 yıldız; 30 - 8 = 22 yıldız kalır!' }
    ]
  },
  {
    num: 20,
    id: 'ch20',
    astroType: 'platformer',
    difficulty: 6,
    subject: 'ŞAMPİYONLUK FİNALİ',
    subjectKey: 'karma',
    subjectColor: '#ff2e63',
    topic: '2. Sınıf Tüm Dersler Galaksi Şampiyonluk Sınavı!',
    title: 'Bölüm 20: Doktor Palyaço\'nun Kozmik Lunapark Kalesi!',
    theme: { skyTop: '#1f0838', skyBot: '#ff3b7f', plat: '#ffd233', side: '#7b2cbf', tree: 'Star.glb', planet: 'Planet_6.glb' },
    rescueModels: ['CesiumMan.glb', 'Horse.glb', 'Stork.glb'],
    enemyModels: ['Enemy_Flying.glb', 'Spider.glb', 'Wasp.glb', 'Snake_angry.glb'],
    bossModel: 'Stan.glb',
    bossName: 'DOKTOR PALYAÇO — KOZMİK PALYAÇOTRON-9000',
    bossHp: 35,
    rewardUnlock: { type: 'weapons', id: 'sword_gold', label: '🌟 Efsanevi Güneş Kılıcı + Şampiyon Tacı!' },
    summary: '20. BÖLÜM BÜYÜK FİNAL! Tüm kılıç, eldiven ve Hover-Lazer güçlerinle Kozmik Lunapark Kalesini aş, son dostlarını kurtar ve Dev Palyaçotron-9000\'i yen!',
    questions: [
      { q: '"Atatürk 19 Mayıs 1919\'da Samsun\'a çıkarak Kurtuluş Savaşı\'nı başlattı." Bu tarihi gün hangi bayramımızdır?', v: '🇹🇷🚢', opts: ['19 Mayıs Atatürk\'ü Anma, Gençlik ve Spor Bayramı', '30 Ağustos Zafer Bayramı', '23 Nisan Ulusal Egemenlik ve Çocuk Bayramı'], ans: 0, exp: '19 Mayıs Atatürk\'ü Anma, Gençlik ve Spor Bayramımızdır!' },
      { q: 'Bir çiftlikte 6 tavuk ve 4 koyun vardır. Bu hayvanların AYAK SAYILARI TOPLAMI kaçtır?', v: '🐔(2 ayak) × 6 + 🐑(4 ayak) × 4', opts: ['28 ayak', '20 ayak', '24 ayak'], ans: 0, exp: '6 tavuk = 6 × 2 = 12 ayak. 4 koyun = 4 × 4 = 16 ayak. 12 + 16 = 28 ayak!' },
      { q: '"CUMHURİYET" kelimesi kaç hecelidir ve "BAĞIMSIZLIK" bizim için ne ifade eder?', v: '🇹🇷 CUM-HU-Rİ-YET', opts: ['4 hecelidir — Özgür ve hür yaşamak demektir', '3 hecelidir — Oyun oynamak demektir', '5 hecelidir — Tatil yapmak demektir'], ans: 0, exp: 'CUM - HU - Rİ - YET 4 hecelidir; bağımsızlık milletimizin özgür yaşamasıdır!' },
      { q: 'İngilizcede "TEN RED APPLES and FIVE BLUE BIRDS" ifadesinin Türkçesi nedir?', v: '🍎×10 & 🐦×5', opts: ['10 kırmızı elma ve 5 mavi kuş', '5 sarı muz ve 10 yeşil kurbağa', '10 mavi top ve 5 kırmızı araba'], ans: 0, exp: 'Ten(10) red(kırmızı) apples(elma) ve five(5) blue(mavi) birds(kuş)!' }
    ]
  },
  {
    num: 21,
    id: 'ch21',
    astroType: 'platformer',
    difficulty: 6,
    starReq: 10,
    subject: 'BİLSEM & BİLİM ŞAMPİYONLUĞU',
    subjectKey: 'bilsem',
    subjectColor: '#ff9f1c',
    topic: 'Robot Kodlama, 3D Küp Sayma, Uzay Bilimi ve Mantık Zirvesi!',
    title: 'Bölüm 21 (Gizli): Gökkuşağı Şampiyonlar Galaksisi!',
    theme: { skyTop: '#12063b', skyBot: '#00d2ff', plat: '#ffe066', side: '#5f27cd', tree: 'Star.glb', planet: 'Planet_3.glb' },
    rescueModels: ['Astronaut_Rae.glb', 'KnightCharacter.glb', 'Mech_Frog.glb'],
    enemyModels: ['Enemy_Flying.glb', 'Wasp.glb', 'Crab.glb'],
    bossModel: 'Mech_Rae.glb',
    bossName: 'ALTIN GALAKSİ MUHAFIZI SÜPER-MEK',
    bossHp: 40,
    rewardUnlock: { type: 'armors', id: 'king_crown', label: '👑 Efsanevi Galaksi Tacı!' },
    summary: '10⭐ ile açılan Gizli Şampiyonluk Gezegeni! 3D Terazi köprülerini geç, Robot Kodlama ve BİLSEM Küp bulmacalarını çöz, Altın Muhafızı yen!',
    questions: [
      { q: 'Güneş sistemimizde Güneş\'e EN YAKIN gezegen hangisidir ve Dünya\'mız kaçıncı sıradadır?', v: '☀️ → 1. ? → 2. Venüs → 3. Dünya', opts: ['En yakın Merkür — Dünya 3. sıradadır', 'En yakın Mars — Dünya 1. sıradadır', 'En yakın Jüpiter — Dünya 5. sıradadır'], ans: 0, exp: 'Sıralama: Merkür, Venüs, Dünya (3.), Mars, Jüpiter, Satürn, Uranüs, Neptün!' },
      { q: 'Bir sayı örüntüsü "2 - 5 - 11 - 23 - ?" şeklinde ilerliyorsa (2 katının 1 fazlası), soru işareti yerine kaç gelir?', v: '🧠 ×2 + 1 Kuralı!', opts: ['47', '45', '35'], ans: 0, exp: 'Her sayı 2 ile çarpılıp 1 ekleniyor: 23 × 2 = 46, 46 + 1 = 47!' },
      { q: 'Maddenin belirli bir şekli olan sert haline KATI denir. Buz eridiğinde maddenin hangi haline geçer?', v: '🧊 → 💧', opts: ['Sıvı haline (Su)', 'Gaz haline (Buhar)', 'Kaya haline'], ans: 0, exp: 'Katı buz ısı alarak erir ve sıvı (su) haline geçer!' }
    ]
  }
];
