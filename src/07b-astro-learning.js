/* ============================================================================
   07B-ASTRO-LEARNING.JS — ÇOKLU İNTERAKTİF SORU TÜRLERİ (HECE/SAYI TRENİ,
   4'LÜ DEVRE EŞLEŞTİRME, ROBOT KODLAMA, BİLSEM 3D KÜP SAYMA, DOĞRU/YANLIŞ),
   3D TERAZİ/KESİR/İNGİLİZCE KÖPRÜLERİ, BİLİM ANSİKLOPEDİSİ & ADAPTİF ÖĞRETMEN!
   ============================================================================ */

const INTERACTIVE_PUZZLES = {
  turkce: [
    {
      type: 'order',
      q: '🚂 Hece Treni: "CUMHURİYET" kelimesinin hecelerini doğru sırayla vagonlara diz!',
      v: '🇹🇷 4 Heceli Kelime',
      tokens: ['CUM', 'HU', 'Rİ', 'YET'],
      exp: 'CUM - HU - Rİ - YET şeklinde 4 heceye ayrılır!'
    },
    {
      type: 'order',
      q: '🚂 Cümle Kurma: Karışık kelimeleri anlamlı ve kurallı bir cümle olacak şekilde sırala!',
      v: '📚 Kurallı Cümle (İş/Oluş Sonda!)',
      tokens: ['Komiser', 'Rakun', 'kitap', 'okuyor.'],
      exp: 'Kurallı cümlelerde yapılan iş (okuyor) cümlenin sonunda yer alır!'
    },
    {
      type: 'match',
      q: '🔌 Astro Devresi: EŞ ANLAMLI (anlamdaş) kelimeleri birbirine bağla!',
      v: '⚡ Eş Anlamlı Çiftler',
      pairs: [
        ['Siyah', 'Kara'],
        ['Okul', 'Mektep'],
        ['Kırmızı', 'Al'],
        ['Hediye', 'Armağan']
      ],
      exp: 'Siyah-Kara, Okul-Mektep, Kırmızı-Al ve Hediye-Armağan eş anlamlıdır!'
    },
    {
      type: 'match',
      q: '🔌 Astro Devresi: ZIT (KARŞIT) ANLAMLI kelimeleri eşleştirerek kapıya güç ver!',
      v: '↔️ Zıt Anlamlı Çiftler',
      pairs: [
        ['Uzun', 'Kısa'],
        ['Taze', 'Bayat'],
        ['Acı', 'Tatlı'],
        ['Gece', 'Gündüz']
      ],
      exp: 'Birbirinin tam tersi anlam taşıyan kelimelere zıt anlamlı kelimeler denir!'
    },
    {
      type: 'tf_blitz',
      q: '⚡ Kalkan Düellosu: Özel isimlerin (Atatürk, Ankara, Türkiye) ilk harfi her zaman BÜYÜK yazılır.',
      v: '✍️ Yazım Kuralları',
      answerBool: true,
      exp: 'Evet! Özel isimler cümlenin neresinde olursa olsun büyük harfle başlar.'
    },
    {
      type: 'tf_blitz',
      q: '⚡ Kalkan Düellosu: "TREN" kelimesi iki heceli bir kelimedir.',
      v: '🚂 Ünlü Harf Sayısına Dikkat!',
      answerBool: false,
      exp: 'Yanlış! "TREN" kelimesinde yalnızca tek ünlü harf (E) olduğu için 1 hecelidir!'
    }
  ],

  matematik: [
    {
      type: 'order',
      q: '🚂 Sayı Treni: Verilen doğal sayıları KÜÇÜKTEN BÜYÜĞE doğru sırala!',
      v: '🔢 Küçükten → Büyüğe',
      tokens: ['19', '34', '58', '82'],
      exp: 'Onlar basamağına bakarak: 19 < 34 < 58 < 82 şeklinde sıralanır!'
    },
    {
      type: 'order',
      q: '🚂 Ritmik Tren: 4\'er ileriye ritmik saymayı doğru sırayla diz!',
      v: '🐸 +4 Ritmik Sayma',
      tokens: ['12', '16', '20', '24'],
      exp: '4\'er sayarken her adımda 4 eklenir: 12 - 16 - 20 - 24!'
    },
    {
      type: 'match',
      q: '🔌 Matematik Devresi: Kesir, zaman ve grup kavramlarını doğru değerleriyle eşleştir!',
      v: '🍕 ⏰ ✏️',
      pairs: [
        ['1 Bütün', '4 Çeyrek'],
        ['Yarım Saat', '30 Dakika'],
        ['1 Düzine', '12 Adet'],
        ['1 Deste', '10 Adet']
      ],
      exp: '1 bütün = 4 çeyrek, yarım saat = 30 dk, düzine = 12, deste = 10!'
    },
    {
      type: 'match',
      q: '🔌 Çarpım Devresi: Çarpma işlemlerini doğru sonuçlarıyla eşleştir!',
      v: '✖️ Çarpım Tablosu',
      pairs: [
        ['4 × 5', '20'],
        ['3 × 8', '24'],
        ['5 × 7', '35'],
        ['4 × 9', '36']
      ],
      exp: '4×5=20, 3×8=24, 5×7=35 ve 4×9=36!'
    },
    {
      type: 'tf_blitz',
      q: '⚡ Kalkan Düellosu: 16 tane elmanın ÇEYREĞİ (4\'te 1\'i) 4 elma eder.',
      v: '🍎 16 ÷ 4 = 4',
      answerBool: true,
      exp: 'Doğru! Çeyreğini bulmak için 4\'e böleriz: 16 ÷ 4 = 4.'
    },
    {
      type: 'tf_blitz',
      q: '⚡ Kalkan Düellosu: "63" sayısını en yakın onluğa yuvarlarsak "70" olur.',
      v: '🎯 60 <--- 63 ---> 70',
      answerBool: false,
      exp: 'Yanlış! Birler basamağı 3 (5\'ten küçük) olduğu için 60\'a yuvarlanır.'
    }
  ],

  hayat: [
    {
      type: 'order',
      q: '☀️ Uzay Kaşifi: Güneş\'e EN YAKIN gezegenden başlayarak ilk 4 gezegeni sırayla diz!',
      v: '☀️ → Gezegen Sırası',
      tokens: ['Merkür', 'Venüs', 'Dünya', 'Mars'],
      exp: 'Güneş\'e en yakından itibaren: 1. Merkür, 2. Venüs, 3. Dünya, 4. Mars!'
    },
    {
      type: 'match',
      q: '🔌 Uzay & Doğa Devresi: Bilgileri doğru kavramlarla eşleştir!',
      v: '🌍 🌙 ♻️ 🚑',
      pairs: [
        ['Dünya\'nın Uydusu', 'Ay'],
        ['Acil Yardım Numarası', '112'],
        ['Kızıl Gezegen', 'Mars'],
        ['Atık Pil Kutusu', 'Geri Dönüşüm']
      ],
      exp: 'Ay Dünya\'mızın uydusudur, Mars Kızıl Gezegendir ve tüm acil durumlar 112\'dir!'
    },
    {
      type: 'tf_blitz',
      q: '⚡ Kalkan Düellosu: Dünya\'nın kendi etrafında dönmesi sonucu GECE ve GÜNDÜZ oluşur.',
      v: '🌍☀️ Gece & Gündüz',
      answerBool: true,
      exp: 'Doğru! Dünya kendi ekseni etrafında 24 saatte döner ve gece-gündüz oluşur.'
    }
  ],

  ingilizce: [
    {
      type: 'order',
      q: '🚂 English Train: "Bir kuş uçabilir" anlamına gelen İngilizce cümleyi doğru sırayla diz!',
      v: '🐦✈️ Can = Yapabilmek',
      tokens: ['A', 'bird', 'can', 'fly.'],
      exp: '"A bird can fly." = Bir kuş uçabilir!'
    },
    {
      type: 'match',
      q: '🔌 English Circuit: İngilizce hayvan ve doğa kelimelerini Türkçeleriyle eşleştir!',
      v: '🦊 🐝 🐸 🦆',
      pairs: [
        ['Fox', 'Tilki'],
        ['Bee', 'Arı'],
        ['Frog', 'Kurbağa'],
        ['Duck', 'Ördek']
      ],
      exp: 'Fox=Tilki, Bee=Arı, Frog=Kurbağa, Duck=Ördek!'
    },
    {
      type: 'match',
      q: '🔌 Color & Number Circuit: İngilizce sayı ve renkleri eşleştir!',
      v: '🎨 🔢',
      pairs: [
        ['Twelve', '12'],
        ['Twenty', '20'],
        ['Purple', 'Mor'],
        ['Yellow', 'Sarı']
      ],
      exp: 'Twelve=12, Twenty=20, Purple=Mor, Yellow=Sarı!'
    },
    {
      type: 'tf_blitz',
      q: '⚡ Shield Duel: "A fish CAN SWIM, but it CAN\'T FLY." cümlesi DOĞRU bir bilgidir.',
      v: '🐟🌊 Balık yüzebilir ama uçamaz!',
      answerBool: true,
      exp: 'Doğru! Fish can swim (yüzebilir), can\'t fly (uçamaz)!'
    }
  ],

  bilsem: [
    {
      type: 'robot_code',
      q: '🤖 Mini-Astro Kodlama 1: Yardımcı robotu 🔋 Enerji Piline ulaştırmak için komutları sırayla ekle ve Çalıştır\'a bas!',
      v: '⬆️ İleri · ⬅️ Sola Dön · ➡️ Sağa Dön',
      gridW: 4, gridH: 4,
      start: { x: 0, y: 3, dir: 0 }, // dir: 0=Up, 1=Right, 2=Down, 3=Left
      goal: { x: 2, y: 1 },
      rocks: [{ x: 0, y: 1 }, { x: 1, y: 2 }],
      exp: 'Harika algoritma! Engellerin etrafından dolaşarak hedefe ulaştın!'
    },
    {
      type: 'robot_code',
      q: '🤖 Mini-Astro Kodlama 2: Kayalara çarpmadan 🔋 Altın Bataryaya giden algoritmayı kur!',
      v: '🧠 Önce yönünü düşün, sonra ilerle!',
      gridW: 4, gridH: 4,
      start: { x: 0, y: 2, dir: 1 }, // facing Right!
      goal: { x: 3, y: 0 },
      rocks: [{ x: 2, y: 2 }, { x: 1, y: 0 }],
      exp: 'Süper kodlama! Robot yönünü değiştirip kayaların etrafından başarıyla geçti!'
    },
    {
      type: 'cube_count',
      q: '🧱 BİLSEM 3D Küp Sayma: Aşağıdaki 3 boyutlu kulede (altta kalan gizli küpler dahil!) toplam KAÇ BİRİM KÜP vardır?',
      v: '👁️ Katman katman saymayı dene!',
      stacks: [[2, 1], [1, 1]], // 2+1+1+1 = 5
      opts: ['5 birim küp', '4 birim küp', '6 birim küp'],
      ans: 0,
      exp: 'Sol arkada 2 katlı küp (alttaki 1 + üstteki 1 = 2) ve öndeki 3 tekli küple birlikte: 2 + 1 + 1 + 1 = 5 küp!'
    },
    {
      type: 'cube_count',
      q: '🧱 BİLSEM 3D Küp Sayma: Bu merdiven kulesinde (arkada/altta duran küpler dahil) toplam KAÇ BİRİM KÜP vardır?',
      v: '🧠 Sütun yüksekliği = o sütundaki küp sayısı!',
      stacks: [[3, 2, 1], [2, 1, 0]], // 3+2+1+2+1 = 9
      opts: ['9 birim küp', '7 birim küp', '10 birim küp'],
      ans: 0,
      exp: 'Arka sırada 3 + 2 + 1 = 6 küp, ön sırada 2 + 1 = 3 küp vardır. Toplam: 6 + 3 = 9 birim küp!'
    },
    {
      type: 'cube_count',
      q: '🧱 BİLSEM Köşe Kulesi: Bu 3D yapıda toplam KAÇ BİRİM KÜP kullanılmıştır?',
      v: '🏗️ Her sütunun yüksekliğini topla!',
      stacks: [[3, 2], [2, 1]], // 3+2+2+1 = 8
      opts: ['8 birim küp', '6 birim küp', '9 birim küp'],
      ans: 0,
      exp: 'Sütunları toplarsak: 3 + 2 + 2 + 1 = 8 birim küp vardır!'
    }
  ]
};

/* ---- 3. SINIF HAZIRLIK & İLERİ ZORLUK EK SORU HAVUZU ---- */
const GRADE3_CHALLENGE_BANK = [
  { q: '🚀 3. Sınıf Hazırlık: "348" üç basamaklı sayısında "3" rakamının basamak değeri kaçtır?', v: '💯 Yüzler Basamağı!', opts: ['300', '30', '3'], ans: 0, exp: '3 rakamı yüzler basamağındadır; basamak değeri 3 × 100 = 300\'dür!' },
  { q: '🚀 3. Sınıf Hazırlık: Bir kenarı 6 metre olan KARE şeklindeki bahçenin ÇEVRESİ kaç metredir?', v: '🟦 Kare = 4 Eşit Kenar (4 × 6)', opts: ['24 metre', '12 metre', '36 metre'], ans: 0, exp: 'Karenin 4 eşit kenarı vardır: 4 × 6 = 24 metre!' },
  { q: '🚀 3. Sınıf Hazırlık: 7 × 8 çarpma işleminin sonucu kaçtır?', v: '⚡ Galaksi Çarpımı: 7 kere 8', opts: ['56', '54', '64'], ans: 0, exp: '7 × 8 = 56 eder!' },
  { q: '🚀 Fen & Bilim: Duran bir topu hareket ettirmek için ayağımızla vurduğumuzda hangi kuvveti uygularız?', v: '⚽👟 Kuvvet ve Hareket', opts: ['İtme kuvveti', 'Çekme kuvveti', 'Soğutma kuvveti'], ans: 0, exp: 'Topa vurmak ileri doğru bir İTME kuvvetidir!' }
];

/* ---- 3D GEZEGEN KÖPRÜLERİ (TERAZİ, KESİR, İNGİLİZCE RENK/ŞEKİL AKSİYON KÖPRÜLERİ!) ---- */
const ASTRO_BRIDGE_CHALLENGES = [
  { prompt: '⚖️ 3D TERAZİ KÖPRÜSÜ: Sol kefede 25 kg var! Hangi köprü teraziyi dengeler?', bridges: [{ txt: '10 + 15', col: 0x38d9ff, ok: true }, { txt: '10 + 12', col: 0xff9f1c, ok: false }, { txt: '8 + 14', col: 0xa66bff, ok: false }] },
  { prompt: '🍕 3D KESİR KÖPRÜSÜ: 20 enerjinin ÇEYREĞİ (4\'te 1\'i) hangi köprüdedir?', bridges: [{ txt: '10', col: 0xff6b6b, ok: false }, { txt: '5', col: 0x45e06f, ok: true }, { txt: '4', col: 0x38d9ff, ok: false }] },
  { prompt: '🌍 ENGLISH ACTION: "JUMP ON THE GREEN BRIDGE!" (Yeşil Köprüye Zıpla!)', bridges: [{ txt: 'RED 🔴', col: 0xff3b5c, ok: false }, { txt: 'BLUE 🔵', col: 0x2998ff, ok: false }, { txt: 'GREEN 🟢', col: 0x38d864, ok: true }] },
  { prompt: '🌍 ENGLISH NUMBER: "STEP ON SIXTEEN!" (16 Sayısına Zıpla!)', bridges: [{ txt: '16', col: 0xffbe1a, ok: true }, { txt: '60', col: 0x38d9ff, ok: false }, { txt: '14', col: 0xa66bff, ok: false }] },
  { prompt: '🔤 TÜRKÇE ZIT ANLAM: "TAZE" kelimesinin ZIT anlamlısı hangi köprüdedir?', bridges: [{ txt: 'YENİ', col: 0x38d9ff, ok: false }, { txt: 'BAYAT', col: 0xffbe1a, ok: true }, { txt: 'TEMİZ', col: 0x45e06f, ok: false }] },
  { prompt: '✖️ ÇARPIM KÖPRÜSÜ: "4 × 8 = ?" işleminin doğru sonucu hangi köprüdedir?', bridges: [{ txt: '28', col: 0xa66bff, ok: false }, { txt: '36', col: 0xff6b6b, ok: false }, { txt: '32', col: 0x45e06f, ok: true }] },
  { prompt: '☀️ UZAY BİLİMİ: Güneş\'e EN YAKIN gezegen hangisidir?', bridges: [{ txt: 'MERKÜR', col: 0xffbe1a, ok: true }, { txt: 'MARS', col: 0xff5722, ok: false }, { txt: 'JÜPİTER', col: 0x38d9ff, ok: false }] },
  { prompt: '⚖️ 3D EŞİTLİK: "40 - 15 = ?" işlemini dengeleyen enerji köprüsüne atla!', bridges: [{ txt: '35', col: 0xff6b6b, ok: false }, { txt: '25', col: 0x45e06f, ok: true }, { txt: '20', col: 0x38d9ff, ok: false }] }
];

/* ---- UZAY UÇAĞI SAVAŞINDA "DOĞRU ASTEROİTİ VUR!" HİPER-KAPILARI ---- */
const SPACE_ASTEROID_GATES = [
  { prompt: '☄️ ASTEROİT ŞİFRESİ: "6 × 5 = ?" olan asteroiti lazerle patlat!', opts: ['30', '25', '35'], ans: 0 },
  { prompt: '☄️ ASTEROİT ŞİFRESİ: "45 + 25 = ?" olan asteroiti vur!', opts: ['60', '70', '80'], ans: 1 },
  { prompt: '☄️ ENGLISH TARGET: Shoot "TWENTY" (Yirmi)!', opts: ['12', '20', '22'], ans: 1 },
  { prompt: '☄️ ASTEROİT ŞİFRESİ: "90 - 35 = ?" olan asteroiti patlat!', opts: ['65', '45', '55'], ans: 2 }
];

/* ---- KURTARILAN 3D DOSTLAR BİLİM & DOĞA ANSİKLOPEDİSİ ("BİLİYOR MUYDUN?") ---- */
const SCIENCE_CARDS = {
  'Fox.glb': { title: '🦊 Kızıl Tilki', fact: 'Biliyor muydun? Tilkiler Dünya\'nın manyetik alanını hissederek karın altındaki avlarını bile duyabilir!' },
  'Duck.glb': { title: '🦆 Yeşilbaş Ördek', fact: 'Biliyor muydun? Ördeklerin tüyleri doğal bir yağla kaplıdır; suya dalsalar bile alt tüyleri hiç ıslanmaz!' },
  'Flamingo.glb': { title: '🦩 Pembe Flamingo', fact: 'Biliyor muydun? Flamingolar doğduklarında beyaz-gridir; yedikleri yosun ve karidesler tüylerini pembeye boyar!' },
  'Trex.glb': { title: '🦖 Tyrannosaurus Rex', fact: 'Biliyor muydun? T-Rex\'in koku alma duyusu günümüzdeki birçok yırtıcı kuştan bile daha güçlüydü!' },
  'Triceratops.glb': { title: '🦕 Triceratops', fact: 'Biliyor muydun? Otçul bir dinozor olan Triceratops\'un başındaki kemik kalkan onu dev yırtıcılardan korurdu!' },
  'Parrot.glb': { title: '🦜 Renkli Papağan', fact: 'Biliyor muydun? Papağanlar ayaklarıyla tıpkı bizim ellerimiz gibi meyveleri tutup soyabilir!' },
  'Wolf.glb': { title: '🐺 Boz Kurt', fact: 'Biliyor muydun? Kurtlar sürü halinde yardımlaşarak yaşar ve ulumaları 10 kilometre uzaktan duyulabilir!' },
  'ShibaInu.glb': { title: '🐕 Sadık Köpek', fact: 'Biliyor muydun? Köpeklerin burun izi tıpkı insanların parmak izi gibi her köpekte tamamen benzersizdir!' },
  'Astronaut_Bee.glb': { title: '🐝 Uzay Arısı', fact: 'Biliyor muydun? Arılar kanatlarını saniyede 200 kez çırpar ve dünyadaki meyve-sebzelerin tozlaşmasını sağlar!' },
  'Astronaut_Frog.glb': { title: '🐸 Astronot Kurbağa', fact: 'Biliyor muydun? Kurbağalar kendi boylarının 20 katı uzağa zıplayabilir ve derileriyle de nefes alabilir!' },
  'Astronaut_Flamingo.glb': { title: '🪐 Satürn Kaşifi', fact: 'Biliyor muydun? Satürn\'ün etrafındaki parlak halkalar milyarlarca buz ve kaya parçasından oluşur!' },
  'KnightCharacter.glb': { title: '⚔️ Demir ve Mıknatıs', fact: 'Biliyor muydun? Mıknatıslar demir, nikel ve kobalt metallerini temas etmeden bile kendine çeker!' },
  'Soldier.glb': { title: '🧭 Pusula Ustası', fact: 'Biliyor muydun? Pusulanın renkli ucu her zaman KUZEY yönünü gösterir!' },
  'Xbot.glb': { title: '🤖 Yapay Zeka Botu', fact: 'Biliyor muydun? Robotlar, insanların adım adım yazdığı ALGORİTMA adı verilen komut dizileriyle çalışır!' },
  'Michelle.glb': { title: '🌍 Mavi Gezegen Dünya', fact: 'Biliyor muydun? Dünya yüzeyinin yaklaşık dörtte üçü sularla kaplı olduğu için uzaydan masmavi görünür!' },
  'CesiumMan.glb': { title: '🌙 Ay Yürüyüşçüsü', fact: 'Biliyor muydun? Ay\'da yer çekimi Dünya\'nın altıda biri kadardır; orada 6 kat daha yükseğe zıplayabilirsin!' },
  'Horse.glb': { title: '🐎 Dörtnala At', fact: 'Biliyor muydun? Atlar hem ayakta hem de yatarak uyuyabilir ve neredeyse 360 derece çevresini görebilir!' },
  'Stork.glb': { title: '🦢 Göçmen Leylek', fact: 'Biliyor muydun? Leylekler her yıl sıcak ülkelere uçmak için binlerce kilometre göç eder ve eski yuvalarını unutmaz!' },
  'Astronaut_Rae.glb': { title: '🦝 Kaptan Rakun', fact: 'Biliyor muydun? Rakunların ön patileri o kadar hassastır ki karanlıkta bile dokunarak nesneleri tanıyabilirler!' },
  'Mech_Frog.glb': { title: '⚡ Güneş Enerjisi', fact: 'Biliyor muydun? Uzay istasyonları dev güneş panelleriyle Güneş ışığını doğrudan elektriğe dönüştürür!' }
};

/* ---- 3D ÜS SÜRPRİZ KAPSÜL MAKİNESİ (GACHA KOLEKSİYON HEYKELLERİ!) ---- */
const GACHA_CAPSULES = [
  { id: 'gacha_star', name: '🌟 Altın Süpernova Kupası', glb: 'Star.glb' },
  { id: 'gacha_crown', name: '👑 Galaksi Kraliyet Tacı Heykeli', glb: 'Crown.glb' },
  { id: 'gacha_trex', name: '🦖 Minyatür Şapşal T-Rex Figürü', glb: 'Trex.glb' },
  { id: 'gacha_ship', name: '🚀 Altın Yıldız Jeti Maketi', glb: 'Spaceship_Rae.glb' },
  { id: 'gacha_crab', name: '🦀 Kozmik Yengeç Figürü', glb: 'Crab.glb' },
  { id: 'gacha_gem', name: '💎 Efsanevi Safir Kristal', glb: 'Gem_Blue.glb' },
  { id: 'gacha_chest', name: '🎁 Korsan Hazine Sandığı', glb: 'Chest.glb' },
  { id: 'gacha_car', name: '🚓 Komiser Turbo Polis Arabası', glb: 'TurboCar.glb' }
];

/* ---- AKILLI UYARLANABİLİR ÖĞRETMEN VE 3D GÖRSEL BULMACA ÇİZİCİ ---- */
const AdaptiveTeacher = {
  recordResult(save, subjKey, questionObj, firstTryOk) {
    if (!save.subjectStats) save.subjectStats = {};
    const key = subjKey || 'karma';
    if (!save.subjectStats[key]) save.subjectStats[key] = { right: 0, wrong: 0 };
    if (firstTryOk) {
      save.subjectStats[key].right++;
      if (save.missedQueue && questionObj && questionObj.q) {
        save.missedQueue = save.missedQueue.filter(m => m.q !== questionObj.q);
      }
    } else {
      save.subjectStats[key].wrong++;
      if (questionObj && questionObj.opts) {
        if (!save.missedQueue) save.missedQueue = [];
        if (!save.missedQueue.some(m => m.q === questionObj.q)) {
          save.missedQueue.push(Object.assign({ reviewTag: true }, questionObj));
          if (save.missedQueue.length > 8) save.missedQueue.shift();
        }
      }
    }
  },

  buildEncounterPack(ch, save, count = 2, preferInteractive = false) {
    const out = [];
    const tier = (save.settings && save.settings.tier) || 'grade2';

    // 1. If the child previously struggled on a question, re-serve 1 review item with encouraging tag!
    if (save.missedQueue && save.missedQueue.length > 0 && Math.random() < 0.45) {
      const rev = save.missedQueue.shift();
      out.push(Object.assign({}, rev, { q: '🔄 Pekiştirme Sorusu: ' + rev.q.replace(/^🔄 Pekiştirme Sorusu:\s*/, '') }));
    }

    // 2. Include diverse interactive puzzle in Astro chapters / Bilsem mode!
    if (preferInteractive || tier === 'bilsem' || ch.num >= 13) {
      const pPool = (INTERACTIVE_PUZZLES[ch.subjectKey] || [])
        .concat(tier === 'bilsem' || ch.subjectKey === 'bilsem' ? INTERACTIVE_PUZZLES.bilsem : [])
        .concat(ch.num >= 16 ? INTERACTIVE_PUZZLES.bilsem : []);
      if (pPool.length > 0 && out.length < count) {
        const idx = ((Game.qCursor++) + ch.num) % pPool.length;
        out.push(pPool[idx]);
      }
    }

    // 3. Include Grade-3 Prep questions if player selected 'grade3' tier!
    const basePool = (ch.questions || [])
      .concat(EXTRA_QUESTION_BANK[ch.subjectKey] || EXTRA_QUESTION_BANK.matematik || [])
      .concat(tier === 'grade3' ? GRADE3_CHALLENGE_BANK : []);

    while (out.length < count && basePool.length > 0) {
      out.push(basePool[(Game.qCursor++) % basePool.length]);
    }
    return out;
  },

  // Draw crisp isometric 3D BİLSEM unit-cube stack onto #puzzleCanvas!
  drawCubeTower(cv, stacks) {
    if (!cv) return;
    const c = cv.getContext('2d');
    const w = cv.width, h = cv.height;
    c.clearRect(0, 0, w, h);
    c.fillStyle = '#eef7ff';
    c.fillRect(0, 0, w, h);

    const tw = 38, th = 20, chH = 32;
    const rows = stacks.length;
    const cols = stacks[0].length;
    const originX = w * 0.5 - (cols - rows) * tw * 0.5;
    const originY = h * 0.58;

    const drawIsoCube = (gx, gy, gz) => {
      const sx = originX + (gx - gy) * tw;
      const sy = originY + (gx + gy) * th - gz * chH;

      // Top face
      c.beginPath();
      c.moveTo(sx, sy - chH - th);
      c.lineTo(sx + tw, sy - chH);
      c.lineTo(sx, sy - chH + th);
      c.lineTo(sx - tw, sy - chH);
      c.closePath();
      c.fillStyle = '#ffe066';
      c.fill();
      c.strokeStyle = '#1e3566';
      c.lineWidth = 2.5;
      c.stroke();

      // Left face
      c.beginPath();
      c.moveTo(sx - tw, sy - chH);
      c.lineTo(sx, sy - chH + th);
      c.lineTo(sx, sy + th);
      c.lineTo(sx - tw, sy);
      c.closePath();
      c.fillStyle = '#ff9f1c';
      c.fill();
      c.stroke();

      // Right face
      c.beginPath();
      c.moveTo(sx + tw, sy - chH);
      c.lineTo(sx, sy - chH + th);
      c.lineTo(sx, sy + th);
      c.lineTo(sx + tw, sy);
      c.closePath();
      c.fillStyle = '#e67700';
      c.fill();
      c.stroke();
    };

    for (let r = 0; r < rows; r++) {
      for (let col = 0; col < cols; col++) {
        const count = stacks[r][col] || 0;
        for (let z = 0; z < count; z++) {
          drawIsoCube(col, r, z);
        }
      }
    }
  },

  // Draw 4x4 Mini-Astro Coding Grid!
  drawRobotGrid(cv, puz, botState) {
    if (!cv) return;
    const c = cv.getContext('2d');
    const w = cv.width, h = cv.height;
    c.clearRect(0, 0, w, h);
    const cols = puz.gridW || 4, rows = puz.gridH || 4;
    const cell = Math.min(Math.floor((w - 24) / cols), Math.floor((h - 24) / rows));
    const ox = Math.floor((w - cols * cell) / 2);
    const oy = Math.floor((h - rows * cell) / 2);

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const px = ox + x * cell, py = oy + y * cell;
        c.fillStyle = (x + y) % 2 === 0 ? '#e3f2fd' : '#d0ebff';
        c.fillRect(px, py, cell, cell);
        c.strokeStyle = '#1e3566';
        c.lineWidth = 2;
        c.strokeRect(px, py, cell, cell);
      }
    }

    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.font = `${Math.floor(cell * 0.56)}px sans-serif`;

    for (const rk of (puz.rocks || [])) {
      c.fillText('🪨', ox + (rk.x + 0.5) * cell, oy + (rk.y + 0.5) * cell);
    }
    c.fillText('🔋', ox + (puz.goal.x + 0.5) * cell, oy + (puz.goal.y + 0.5) * cell);

    // Draw Mini-Astro + Direction Arrow!
    const bx = ox + (botState.x + 0.5) * cell;
    const by = oy + (botState.y + 0.5) * cell;
    c.save();
    c.translate(bx, by);
    c.fillStyle = '#1e3566';
    c.beginPath(); c.arc(0, 0, cell * 0.36, 0, Math.PI * 2); c.fill();
    c.fillStyle = '#00eeff';
    const arrows = ['⬆️', '➡️', '⬇️', '⬅️'];
    c.font = `${Math.floor(cell * 0.46)}px sans-serif`;
    c.fillText(arrows[botState.dir % 4], 0, 1);
    c.restore();
  }
};
