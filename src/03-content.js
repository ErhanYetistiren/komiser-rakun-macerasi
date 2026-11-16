/* ============================================================================
   03-CONTENT.JS — KOMİSER RAKUN VE ŞAPŞAL KAHRAMANLAR AKADEMİSİ
   8 Özel Karakter + MEB 2. Sınıf Tüm Dersler (12 Tam Bölüm) İçerik ve Soru Havuzu
   ============================================================================ */

const CHARACTERS = {
  rakun: {
    id: 'rakun',
    name: 'Komiser Rakun',
    badge: '🦝 Komiser Rakun',
    role: 'Baş Kahraman',
    mouthRig: 'snout_under_nose',
    sfx: 'rakun',
    voice: { pitch: 1.05, rate: 1.04 },
    scale: 1.0,
    colors: { fur: '#7d8491', dark: '#2a2d38', white: '#f5f6fa', coat: '#1e3566', badge: '#ffd233' },
    desc: 'Lacivert polis üniformalı, altın yıldız rozetli cesur ama biraz sakar başkomiser.'
  },
  vudi: {
    id: 'vudi',
    name: 'Yardımcı Vudi',
    badge: '🐦 Vudi Ağaçkakan',
    role: 'Yardımcı Kahraman',
    mouthRig: 'hinged_beak',
    sfx: 'vudi',
    voice: { pitch: 1.48, rate: 1.24 },
    scale: 0.78,
    colors: { crest: '#f02828', beak: '#ffbe1e', body: '#2c6be0', belly: '#f9fbff', vest: '#1b3160' },
    desc: 'Kırmızı ibikli, uzun sarı menteşeli gagalı, küçük polis yelekli hiperaktif yardımcı.'
  },
  palyaco: {
    id: 'palyaco',
    name: 'Doktor Palyaço',
    badge: '🤡 Doktor Palyaço',
    role: 'Baş Kötü Mucit',
    mouthRig: 'clown_under_nose',
    sfx: 'palyaco',
    voice: { pitch: 1.26, rate: 1.08 },
    scale: 1.18,
    colors: { coat: '#f8f9ff', nose: '#ff1e2d', hair1: '#ff55b8', hair2: '#39d47a', hair3: '#9c4dff', bowtie: '#ffbe1a' },
    desc: 'Beyaz laboratuvar önlüklü, kırmızı top burunlu, rengârenk kabarık saçlı ve dev papyonlu çılgın mucit.'
  },
  karga: {
    id: 'karga',
    name: 'Kurnaz Karga',
    badge: '🐦‍⬛ Kurnaz Karga',
    role: 'Kötü Ortak',
    mouthRig: 'hinged_beak',
    sfx: 'karga',
    voice: { pitch: 1.32, rate: 1.14 },
    scale: 0.92,
    colors: { feather: '#252636', beret: '#863bff', scarf: '#e62e3a', beak: '#e0a92b' },
    desc: 'Mor bereli, kırmızı atkılı, parlak şeylere dayanamayan sinsi hırsız karga.'
  },
  trex: {
    id: 'trex',
    name: 'Şapşal T-Rex',
    badge: '🦖 Şapşal T-Rex',
    role: 'Komik Dinozor',
    mouthRig: 'hinged_jaw',
    sfx: 'trex',
    voice: { pitch: 0.72, rate: 0.92 },
    scale: 1.55,
    colors: { skin: '#4cc95b', belly: '#b9f27c', spine: '#2a8f3b', eye: '#ffffff' },
    desc: 'Minicik kollu, kocaman iri gözlü, acıkınca kafası karışan sevimli yeşil T-Rex.'
  },
  ejderha: {
    id: 'ejderha',
    name: 'Komik Ejderha',
    badge: '🐉 Komik Ejderha',
    role: 'Dumanlı Dost',
    mouthRig: 'hinged_jaw',
    sfx: 'ejderha',
    voice: { pitch: 1.16, rate: 1.12 },
    scale: 1.32,
    smokePuffs: true,
    colors: { scale: '#f25c29', belly: '#ffd24c', wing: '#ff8e3c', horn: '#fff0c2' },
    desc: 'Küçük kanatlı, turuncu-kırmızı pullu, heyecanlanınca burnundan duman pufçukları çıkaran sevimli ejderha.'
  },
  godzilla: {
    id: 'godzilla',
    name: 'Şehir Devi Godzilla',
    badge: '🦎 Şehir Devi Godzilla',
    role: 'Mavi Dikenli Dev',
    mouthRig: 'hinged_jaw',
    sfx: 'godzilla',
    voice: { pitch: 0.55, rate: 0.84 },
    scale: 2.05,
    stompShake: true,
    colors: { skin: '#3b5856', belly: '#6c8f88', spikes: '#33d6ff', glow: '#8cf0ff' },
    desc: 'Sırtı parlayan mavi dikenli, adım attıkça yeri sarsan karikatür tarzı dev ama iyi kalpli şehir canavarı.'
  },
  kurt: {
    id: 'kurt',
    name: 'Kurnaz Kurt',
    badge: '🐺 Kurnaz Kurt',
    role: 'Havalı Kurt',
    mouthRig: 'snout_under_nose',
    sfx: 'kurt',
    voice: { pitch: 0.82, rate: 0.98 },
    scale: 1.08,
    colors: { fur: '#858d99', light: '#cfd5de', vest: '#22252e', bandana: '#d92938' },
    desc: 'Gri tüylü, sivri kulaklı, siyah yelekli ve kırmızı bandanalı karizmatik çizgi film kurdu.'
  }
};

const COAT_SWATCHES = [
  { id: 'navy', label: 'Klasik Lacivert', hex: '#1e3566' },
  { id: 'royal', label: 'Gece Mavisi', hex: '#284b8c' },
  { id: 'emerald', label: 'Orman Polis Yeşili', hex: '#1d6b52' },
  { id: 'burgundy', label: 'Akademi Bordosu', hex: '#6e2540' },
  { id: 'violet', label: 'Dedektif Moru', hex: '#4c2f7a' }
];

const WARDROBE_ITEMS = [
  { id: 'cap', name: 'Polis Kepi', icon: '👮', cost: 0, slot: 'hat' },
  { id: 'sheriff', name: 'Altın Şerif Şapkası', icon: '🤠', cost: 25, slot: 'hat' },
  { id: 'crown', name: 'Başkomiser Tacı', icon: '👑', cost: 80, slot: 'hat' },
  { id: 'none_hat', name: 'Şapkasız (Kulaklar Açık)', icon: '🦝', cost: 0, slot: 'hat' },
  { id: 'cape_none', name: 'Pelerinsiz', icon: '🧥', cost: 0, slot: 'back' },
  { id: 'cape_gold', name: 'Süper Dedektif Pelerini', icon: '🦸', cost: 40, slot: 'back' },
  { id: 'cape_dragon', name: 'Ejderha Rozet Pelerini', icon: '🔥', cost: 65, slot: 'back' },
  { id: 'glasses_none', name: 'Gözlüksüz', icon: '👀', cost: 0, slot: 'eye' },
  { id: 'glasses_cool', name: 'Dedektif Gözlüğü', icon: '🕶️', cost: 30, slot: 'eye' }
];

const SECRETS_LIST = [
  { id: 'sec_donut', world: 'town', x: 540, y: 460, icon: '🍩', name: 'Komiserin Gizli Çörek Kutusu', line: 'Yaşasın! Karakolun arkasına sakladığım tarçınlı çörek hâlâ sıcak!' },
  { id: 'sec_wood', world: 'town', x: 1960, y: 420, icon: '🪵', name: 'Vudi\'nin Şarkı Söyleyen Kütüğü', line: 'Tak-tak-tak! Vudi bu kütüğe vurunca orman melodisi çalıyor!' },
  { id: 'sec_footprint', world: 'town', x: 1860, y: 1480, icon: '🐾', name: 'Dev Dinozor Ayak İzi', line: 'Vay canına! Şapşal T-Rex buradan geçerken koca bir ayak izi bırakmış!' },
  { id: 'sec_bone', world: 'valley', x: 480, y: 1420, icon: '🦴', name: 'Parlayan Antik Fosil', line: 'Harika bir keşif! Toprağın altından parlayan dev bir dinozor kemiği çıktı!' },
  { id: 'sec_gem', world: 'valley', x: 1980, y: 460, icon: '💎', name: 'Yanardağ Yakutu', line: 'Komik Ejderha\'nın hapşırığıyla parlayan nadir bir bilgi kristali!' },
  { id: 'sec_clock', world: 'city', x: 420, y: 440, icon: '🕰️', name: 'Altın Cep Saati', line: 'Kurnaz Karga bu altın cep saatini çalılığa düşürmüş!' },
  { id: 'sec_comic', world: 'city', x: 2020, y: 1480, icon: '📘', name: 'Godzilla Çizgi Romanı', line: 'Şehir Devi Godzilla\'nın en sevdiği süper kahraman dergisi!' },
  { id: 'sec_nose', world: 'island', x: 520, y: 500, icon: '🔴', name: 'Yedek Palyaço Burnu', line: 'Bip-bip! Doktor Palyaço yedek kırmızı top burnunu burada unutmuş!' }
];

/* ---- 12 TAM BÖLÜM: MEB 2. SINIF TÜM DERSLER MÜFREDATI ---- */
const CHAPTERS = [
  {
    num: 1,
    id: 'ch1',
    world: 'town',
    subject: 'TÜRKÇE',
    subjectKey: 'turkce',
    subjectColor: '#e86a2c',
    topic: 'Harf Bilgisi, Heceleme ve Alfabetik Sıra',
    title: 'Bölüm 1: Kayıp Harf Sandıkları',
    mode: 'carry_evidence',
    npc: 'vudi',
    targetCount: 4,
    summary: 'Doktor Palyaço karakolun tabela harflerini 4 sandığa dağıttı! Sandıkları toplayıp Karakol Kürsüsüne taşı ve hece şifrelerini çöz.',
    introLines: [
      ['vudi', 'Tak-tak-tak! Günaydın Komiser Rakun! Acil durum var, hemen uyan!'],
      ['rakun', 'Eyvah şapkam ters dönmüş! Ne oldu Vudi, yoksa çörekler mi bitti?'],
      ['vudi', 'Hayır Komiserim! Doktor Palyaço ve Kurnaz Karga karakolun Bilgi Harflerini 4 ipucu çantasına saklayıp kasabaya dağıttı!'],
      ['rakun', 'Merak etme Vudi! Kasabadaki 4 parlak ipucu çantasını toplayıp Karakol Kürsüsüne getirelim ve Türkçe şifrelerini çözelim!']
    ],
    outroLines: [
      ['vudi', 'Tak-tak-tak! Harikasın Komiserim! Harf ve hece şifrelerinin tamamı çözüldü!'],
      ['rakun', 'Birinci Bilgi Yıldızı cebimizde! Ama bak, mahallede Kurnaz Kurt dolaşıyor!']
    ],
    questions: [
      { q: 'Türk alfabemizde toplam kaç harf vardır ve bunların kaçı ünlü (sesli) harftir?', v: '🔤 A E İ O Ö U Ü I', opts: ['29 harf — 8 ünlü harf', '28 harf — 6 ünlü harf', '30 harf — 10 ünlü harf'], ans: 0, exp: 'Alfabemizde 29 harf vardır; a, e, ı, i, o, ö, u, ü olmak üzere 8 tanesi ünlüdür.' },
      { q: '"İLKOKUL" kelimesi hecelerine hangi seçenekte doğru ayrılmıştır?', v: '🏫 İL - KO - KUL ?', opts: ['İL - KO - KUL', 'İLK - O - KUL', 'İL - KOK - UL'], ans: 0, exp: 'Kelime "İL - KO - KUL" şeklinde 3 heceye ayrılır; ulama kurallarına dikkat edilir.' },
      { q: 'Aşağıdaki kelimelerden hangisi TEK HECELİ bir kelimedir?', v: '🚂 🎈 🍎', opts: ['TREN', 'ELMA', 'KALEM'], ans: 0, exp: '"TREN" kelimesinde tek ünlü harf (E) olduğu için tek hecelidir!' },
      { q: 'Sözlük (alfabetik) sıralamasına göre hangi kelime diğerlerinden ÖNCE gelir?', v: '📖 A → B → C → Ç...', opts: ['BALIK', 'CEVİZ', 'KALEM'], ans: 0, exp: 'B harfi alfabede C ve K harflerinden önce gelir.' },
      { q: '"AĞAÇKAKAN" kelimesinde kaç hece vardır? (Ünlü harfleri sayabilirsin!)', v: '🐦 A-ĞAÇ-KA-KAN', opts: ['4 hece', '3 hece', '5 hece'], ans: 0, exp: 'A - ĞAÇ - KA - KAN: 4 ünlü harf olduğu için 4 hecelidir.' },
      { q: 'Sözlük sırasına göre "KEDİ, Kuş, KALEM" kelimelerinden hangisi İLK sırada yer alır?', v: '🐱 🐦 ✏️', opts: ['KALEM', 'KEDİ', 'KUŞ'], ans: 0, exp: 'İlk harfleri aynı (K); ikinci harflerine bakarız: A, E ve U\'dan önce gelir (KALEM).' },
      { q: '"SPOR" kelimesinin hece sayısı kaçtır?', v: '⚽🏃', opts: ['1 hecelidir', '2 hecelidir', '3 hecelidir'], ans: 0, exp: '"SPOR" kelimesinde yalnızca "O" ünlü harfi vardır, bu yüzden 1 hecelidir.' },
      { q: 'Satır sonuna sığmayan "ÇOCUKLAR" kelimesi kısa çizgiyle nasıl doğru bölünür?', v: '✍️ ÇO-CUK-LAR', opts: ['ÇO- / CUKLAR', 'ÇOC- / UKLAR', 'ÇOCU- / KLAR'], ans: 0, exp: 'Satır sonunda kelimeler hecelerinden bölünür: ÇO-CUK-LAR.' }
    ]
  },
  {
    num: 2,
    id: 'ch2',
    world: 'town',
    subject: 'HAYAT BİLGİSİ',
    subjectKey: 'hayat',
    subjectColor: '#2ea853',
    topic: 'Okulumuzda ve Evimizde Hayat & Nezaket',
    title: 'Bölüm 2: Kurnaz Kurt\'un Saklambaç Oyunu',
    mode: 'wolf_stations',
    npc: 'kurt',
    targetCount: 4,
    summary: 'Kurnaz Kurt kasabanın 4 köşesinde kuralları test ediyor! Kurt\'u 4 noktada bulup Hayat Bilgisi sorularını yanıtla.',
    introLines: [
      ['kurt', 'Auuuu-hmph! Demek ünlü Komiser Rakun sensin! Kasabada kuralları kim daha iyi biliyor görelim!'],
      ['vudi', 'Dikkat et Komiserim! Kurnaz Kurt siyah yeleğini giymiş, bizi 4 durakta sınayacak!'],
      ['rakun', 'Okul ve ev kuralları bizim işimiz Kurt kardeş! Göster bakalım ilk durağını!']
    ],
    outroLines: [
      ['kurt', 'Hmph... Fena değilsin Komiser! Söz veriyorum artık kurallara ben de uyacağım!'],
      ['rakun', 'Harika! İkinci Bilgi Yıldızını da aldık! Ama çatıda mor bereli bir gölge var... Kurnaz Karga!']
    ],
    questions: [
      { q: 'Sınıfta söz alarak konuşmak istediğimizde ne yapmalıyız?', v: '🙋‍♂️📚', opts: ['Parmak kaldırıp öğretmenimizin söz vermesini beklemeliyiz', 'Arkadaşımızın sözünü kesip bağırmalıyız', 'Sıranın üstüne çıkmalıyız'], ans: 0, exp: 'Söz hakkı isteyerek konuşmak hem saygı hem de sınıf düzeni kuralıdır.' },
      { q: 'Aşağıdakilerden hangisi "İSTEK" değil, temel bir "İHTİYAÇTIR"?', v: '🍞 🧥 🎮', opts: ['Beslenme ve barınma', 'Yeni ışıklı oyuncak araba', 'Çizgi film çıkartmaları'], ans: 0, exp: 'Yemek, su, barınma ve giyinme yaşamak için zorunlu temel ihtiyaçlarımızdır.' },
      { q: 'Evde elektrik ve su kaynaklarını tasarruflu kullanmak için hangisini yapmalıyız?', v: '💡🚿', opts: ['Diş fırçalarken musluğu kapatmalı, gereksiz lambaları söndürmeliyiz', 'Televizyonu kimse izlemese de açık bırakmalıyız', 'Musluğu sonuna kadar açık unutmalıyız'], ans: 0, exp: 'Kaynakları özenli kullanmak hem doğayı hem aile bütçesini korur.' },
      { q: 'Yanlışlıkla bir arkadaşımıza çarptığımızda hangi nezaket ifadesini kullanmalıyız?', v: '🤝💛', opts: ['Özür dilerim / Affedersin', 'Çekil yolumdan!', 'Bana ne!'], ans: 0, exp: '"Özür dilerim, lütfen, teşekkür ederim" nezaket ifadelerimizdir.' },
      { q: 'Okul çantamızı ne zaman ve nasıl hazırlamalıyız?', v: '🎒📅', opts: ['Akşamdan ders programına bakarak hazırlamalıyız', 'Sabah servis gelirken rastgele doldurmalıyız', 'Bütün kitapları her gün taşımalıyız'], ans: 0, exp: 'Akşamdan haftalık ders programına göre çanta hazırlamak planlı olmayı sağlar.' },
      { q: 'Acil bir durumda ailemize ulaşabilmek için neyi ezbere bilmeliyiz?', v: '🏠📞', opts: ['Ev adresimizi ve aile büyüklerimizin telefon numarasını', 'En sevdiğimiz çizgi filmin saatini', 'Komşunun kedi adını'], ans: 0, exp: 'Güvenliğimiz için ev adresimizi ve ebeveyn telefonumuzu bilmeliyiz.' },
      { q: 'Grup çalışmalarında başarılı olmak için hangisi doğrudur?', v: '👧👦🎨', opts: ['Görev paylaşımı yapıp birbirimize yardımcı olmak', 'Bütün işi tek bir kişiye bırakmak', 'Sadece kendi dediğimizi yaptırmak'], ans: 0, exp: 'İş birliği ve yardımlaşma grup çalışmasının temelidir.' },
      { q: 'Aile içinde karar alınırken en doğru davranış hangisidir?', v: '👨‍👩‍👧‍👦💬', opts: ['Aile bireylerinin fikrini alıp birlikte konuşmak', 'Kimseye sormadan karar vermek', 'Küsüp odamıza kapanmak'], ans: 0, exp: 'Demokratik ailede herkes fikrini saygıyla paylaşır.' }
    ]
  },
  {
    num: 3,
    id: 'ch3',
    world: 'town',
    subject: 'MATEMATİK',
    subjectKey: 'matematik',
    subjectColor: '#2986e3',
    topic: 'Doğal Sayılar, Basamak Değeri, Ritmik Sayma, Deste-Düzine',
    title: 'Bölüm 3: Kurnaz Karga\'nın Kasa Şifreleri',
    mode: 'crow_chase',
    npc: 'karga',
    targetCount: 5,
    summary: 'Mor bereli Kurnaz Karga altın rozetleri kaçırıyor! Kasabada Karga\'yı 5 kez yakala ve sayı şifrelerini çöz!',
    introLines: [
      ['karga', 'Gaaak! Gaaak! Parlak altın rozetleri sayı şifreli keseme sakladım! Beni yakalayamazsınız!'],
      ['vudi', 'Tak-tak! Karga meydanda zıplaya zıplaya kaçıyor Komiserim! Koşup yakalayalım!'],
      ['rakun', 'Dur bakalım kırmızı atkılı Karga! 2. sınıf Matematik bilgimizle tüm şifrelerini çözeceğiz!']
    ],
    outroLines: [
      ['karga', 'Gaaak! Onlukları da düzineyi de bildiniz! Doktor Palyaço Dinozor Vadisi\'ne kaçtı, ben de uçuyorum!'],
      ['vudi', 'Yaşasın! Kasabanın üç yıldızını da topladık! Şimdi Dinozor Vadisi\'ne geçiyoruz!']
    ],
    questions: [
      { q: '"74" sayısında "7" rakamının basamak değeri kaçtır?', v: '🔢 7 onluk + 4 birlik', opts: ['70', '7', '40'], ans: 0, exp: '7 rakamı onlar basamağında olduğu için basamak değeri 7 × 10 = 70\'tir.' },
      { q: 'Bir DESTE kalem ile bir DÜZİNE kalemin toplamı kaç kalem eder?', v: '✏️ 1 Deste (10) + 1 Düzine (12)', opts: ['22', '20', '24'], ans: 0, exp: '1 deste = 10, 1 düzine = 12 tanedir. 10 + 12 = 22 eder!' },
      { q: '4\'er ileriye ritmik sayarken "16"dan hemen sonra hangi sayı gelir?', v: '🐸 4 - 8 - 12 - 16 - ?', opts: ['20', '18', '24'], ans: 0, exp: '16\'ya 4 eklersek 20 sayısına ulaşırız.' },
      { q: '"57" sayısını en yakın ONLUĞA yuvarladığımızda hangi sayıyı buluruz?', v: '🎯 50 <--- 57 ---> 60', opts: ['60', '50', '55'], ans: 0, exp: 'Birler basamağı 5 veya 5\'ten büyük (7) olduğu için üst onluk olan 60\'a yuvarlanır.' },
      { q: '"3 - 6 - 9 - 12 - ? - 18" sayı örüntüsünde soru işareti yerine kaç gelmelidir?', v: '🔗 +3 Örüntüsü', opts: ['15', '14', '16'], ans: 0, exp: 'Sayılar 3\'er artıyor: 12 + 3 = 15.' },
      { q: '8 onluk ve 3 birlikten oluşan doğal sayı kaçtır?', v: '🧱 8 Onluk + 3 Birlik', opts: ['83', '38', '80'], ans: 0, exp: '8 onluk (80) + 3 birlik (3) = 83 eder.' },
      { q: '"42" sayısını en yakın onluğa yuvarlarsak sonuç kaç olur?', v: '🎯 40 <--- 42 ---> 50', opts: ['40', '50', '45'], ans: 0, exp: 'Birler basamağında 2 (5\'ten küçük) olduğu için kendi onluğu olan 40\'a yuvarlanır.' },
      { q: '5\'er geriye ritmik sayarken: "45 - 40 - 35 - ?" sıradaki sayı kaçtır?', v: '⏳ -5 Geriye Sayma', opts: ['30', '25', '32'], ans: 0, exp: '35\'ten 5 geriye saydığımızda 30 gelir.' }
    ]
  },
  {
    num: 4,
    id: 'ch4',
    world: 'valley',
    subject: 'TÜRKÇE',
    subjectKey: 'turkce',
    subjectColor: '#e86a2c',
    topic: 'Eş Anlamlı, Zıt Anlamlı Kelimeler ve Noktalama',
    title: 'Bölüm 4: Şapşal T-Rex\'i Doyurma Macerası!',
    mode: 'boss_trex',
    npc: 'trex',
    targetCount: 6,
    summary: 'Şapşal T-Rex çok acıkmış ve zıpladıkça taşlar yuvarlanıyor! Kırmızı halkalardan kaç, 6 Dino-Meyveye koşup Türkçe sorularını çöz!',
    introLines: [
      ['trex', 'RÖÖÖAAR-Höhöhö! Karnım gurulduyoor! Doktor Palyaço bana Ters-Düz şurubu içirdi, kelimelerim karıştı!'],
      ['vudi', 'Eyvah Komiserim! T-Rex koca çenesini açıp zıplıyor ama kolları minicik olduğu için meyvelere uzanamıyor!'],
      ['rakun', 'Sakin ol koca dostum! Yuvarlanan kayalardan kaçıp 6 meyveyi toplayacağız ve eş-zıt anlam sorularını çözeceğiz!']
    ],
    outroLines: [
      ['trex', 'Höhöhöö! Karnım doydu, kelimelerim düzeldi! Teşekkür ederim Komiser Rakun! Yanardağda arkadaşım Ejderha sizi bekliyor!'],
      ['rakun', 'Afiyet olsun Şapşal T-Rex! Hadi yanardağ patikasına gidelim Vudi!']
    ],
    questions: [
      { q: '"HEDİYE" kelimesinin EŞ ANLAMLISI (anlamdaşı) aşağıdakilerden hangisidir?', v: '🎁 = ?', opts: ['ARMAĞAN', 'OYUNCAK', 'PAKET'], ans: 0, exp: 'Yazılışları farklı ama anlamları aynı: Hediye = Armağan.' },
      { q: '"UZUN" kelimesinin ZIT (KARŞIT) ANLAMLISI hangisidir?', v: '📏 ↕️', opts: ['KISA', 'BÜYÜK', 'GENİŞ'], ans: 0, exp: 'Uzun kelimesinin tam karşıtı "Kısa"dır.' },
      { q: '"Yaşasın, yarışmayı kazandık( )" cümlesinin sonuna hangi noktalama işareti konmalıdır?', v: '🎉😄', opts: ['Ünlem işareti (!)', 'Soru işareti (?)', 'Virgül (,)'], ans: 0, exp: 'Sevinç, heyecan, korku veya şaşma bildiren cümlelerin sonuna ünlem (!) konur.' },
      { q: '"KIRMIZI" kelimesinin eş anlamlısı olan kelime hangisidir? (Bayrağımızdan hatırla!)', v: '🇹🇷 🔴', opts: ['AL', 'AK', 'KARA'], ans: 0, exp: 'Kırmızı = Al, Beyaz = Ak, Siyah = Kara demektir!' },
      { q: '"TAZE" kelimesinin ZIT anlamlısı aşağıdakilerden hangisidir?', v: '🥖', opts: ['BAYAT', 'YENİ', 'SICAK'], ans: 0, exp: 'Taze ekmeğin zıt anlamlısı "Bayat"tır.' },
      { q: '"Yarın okula gelecek misin( )" cümlesinin sonuna hangi noktalama işareti gelmelidir?', v: '❓🤔', opts: ['Soru işareti (?)', 'Nokta (.)', 'Kısa çizgi (-)'], ans: 0, exp: 'Soru anlamı taşıyan cümlelerin sonuna soru işareti (?) konur.' },
      { q: 'Özel isimlere gelen ekleri ayırmak için hangi noktalama işareti kullanılır? (Örn: İzmir\'e)', v: '✍️ İzmir( )e gittik.', opts: ['Kesme işareti (\')', 'Virgül (,)', 'İki nokta (:)'], ans: 0, exp: 'Özel adlara getirilen çekim ekleri kesme işareti (\') ile ayrılır.' },
      { q: '"YAŞLI" kelimesinin EŞ ANLAMLISI aşağıdakilerden hangisidir?', v: '👴👵', opts: ['İHTİYAR', 'GENÇ', 'ÇOCUK'], ans: 0, exp: 'Yaşlı kelimesinin eş anlamlısı "İhtiyar", zıt anlamlısı ise "Genç"tir.' }
    ]
  },
  {
    num: 5,
    id: 'ch5',
    world: 'valley',
    subject: 'MATEMATİK',
    subjectKey: 'matematik',
    subjectColor: '#2986e3',
    topic: 'Eldeli Toplama, Onluk Bozarak Çıkarma ve Problemler',
    title: 'Bölüm 5: Komik Ejderha\'nın Duman Bulutları!',
    mode: 'pad_arena',
    npc: 'ejderha',
    targetCount: 6,
    summary: 'Komik Ejderha burnundan duman pufçukları üflüyor! Yukarıdaki işlemi oku ve yerde beliren 3 buluttan DOĞRU SONUCA koş!',
    introLines: [
      ['ejderha', 'Pufff-fşşş! Hapşuu! Ay kusura bakmayın Komiserim, heyecanlanınca burnumdan duman pufçukları çıkıyor!'],
      ['vudi', 'Tak-tak! Çok sevimlisin Ejderha kardeş! Duman bulutların sayı köprüsünü kapattı, nasıl açacağız?'],
      ['ejderha', 'Pufff! Ben size toplama ve çıkarma soruları üfleyeceğim; yerde çıkan 3 buluttan doğru cevabın üstüne koşarsanız köprü açılır!']
    ],
    outroLines: [
      ['ejderha', 'Pufff-harika! Bütün toplama ve çıkarmaları şimşek gibi çözdünüz! Sırtımdaki küçük kanatlar bile mutluluktan çırpınıyor!'],
      ['rakun', 'Teşekkürler Komik Ejderha! Beşinci Bilgi Yıldızımız da tamam!']
    ],
    questions: [
      { q: '38 + 27 işleminin sonucu kaçtır?', v: '➕ 38 + 27 = ?', opts: ['65', '55', '64'], ans: 0, exp: '8 + 7 = 15 (elde var 1). 3 + 2 + 1 = 6 onluk → 65!' },
      { q: '62 - 25 işleminin sonucu kaçtır?', v: '➖ 62 - 25 = ?', opts: ['37', '47', '43'], ans: 0, exp: 'Komşudan 1 onluk alırız: 12 - 5 = 7, kalan 5 onluktan 2 çıkarsa 3 → 37!' },
      { q: 'Bir ağaçta 24 kuş vardı. Önce 15 kuş daha geldi, sonra 9 kuş uçtu. Ağaçta kaç kuş kaldı?', v: '🐦 24 + 15 - 9', opts: ['30', '29', '32'], ans: 0, exp: '24 + 15 = 39 kuş oldu. 39 - 9 = 30 kuş kaldı!' },
      { q: '□ + 18 = 45 işleminde kutu (verilmeyen toplanan) yerine kaç gelmelidir?', v: '🧩 ? + 18 = 45', opts: ['27', '23', '63'], ans: 0, exp: 'Verilmeyen toplananı bulmak için toplamdan verilen toplananı çıkarırız: 45 - 18 = 27.' },
      { q: '80 - 36 işleminin sonucu kaçtır?', v: '➖ 80 - 36 = ?', opts: ['44', '54', '46'], ans: 0, exp: '10 - 6 = 4, 7 onluk - 3 onluk = 4 onluk → 44.' },
      { q: '46 + 39 işleminin sonucu kaçtır?', v: '➕ 46 + 39 = ?', opts: ['85', '75', '84'], ans: 0, exp: '6 + 9 = 15 (elde 1), 4 + 3 + 1 = 8 → 85.' },
      { q: 'Vudi sabah 19 fındık, öğleden sonra sabahkinden 8 fazla fındık topladı. Toplam kaç fındık topladı?', v: '🌰 19 + (19 + 8)', opts: ['46', '27', '38'], ans: 0, exp: 'Öğleden sonra 19 + 8 = 27 fındık; toplamda 19 + 27 = 46 fındık!' },
      { q: '73 - 28 işleminin sonucu kaçtır?', v: '➖ 73 - 28 = ?', opts: ['45', '55', '43'], ans: 0, exp: '13 - 8 = 5, 6 - 2 = 4 → 45!' }
    ]
  },
  {
    num: 6,
    id: 'ch6',
    world: 'valley',
    subject: 'HAYAT BİLGİSİ',
    subjectKey: 'hayat',
    subjectColor: '#2ea853',
    topic: 'Sağlıklı Hayat, Trafik Kuralları ve 112 Acil Durum',
    title: 'Bölüm 6: Güvenli Vadi Devriyesi',
    mode: 'wolf_stations',
    npc: 'kurt',
    targetCount: 4,
    summary: 'Kurnaz Kurt vadide güvenlik ve sağlık bilmeceleri hazırladı! 4 Güvenlik İstasyonunu tamamla.',
    introLines: [
      ['kurt', 'Auuuu! Yeniden karşılaştık Komiser! Vadiden Büyük Şehir\'e geçmeden önce sağlık ve güvenlik bilginizi görelim!'],
      ['rakun', 'Polis Akademisi\'nde ilk dersimiz güvenliktir Kurt dostum! Başlayalım!']
    ],
    outroLines: [
      ['kurt', 'Helal olsun Komiser! Artık Büyük Şehir Meydanı\'na gidebilirsiniz — ama dikkat edin, orada dev Godzilla yürüyor!'],
      ['vudi', 'Tak-tak! Yerin sarsıldığını şimdiden hissediyorum! Büyük Şehir\'e gidiyoruz!']
    ],
    questions: [
      { q: 'Ambulans, İtfaiye veya Polis gerektiren acil durumlarda Türkiye\'de hangi tek numarayı aramalıyız?', v: '🚑🚒🚓 📞', opts: ['112 Acil Çağrı Merkezi', '999', '188'], ans: 0, exp: 'Ülkemizde tüm acil yardım numaraları 112 Acil Çağrı Merkezi\'nde birleşmiştir!' },
      { q: 'Karşıdan karşıya geçerken yayalar için YAYA TRAFİK IŞIĞI hangi renk yandığında geçmeliyiz?', v: '🚦🚶‍♂️', opts: ['Yeşil ışık yandığında (yolu da kontrol ederek)', 'Kırmızı ışık yandığında', 'Hiç bakmadan koşarak'], ans: 0, exp: 'Yayalar için yeşil ışık geç, kırmızı ışık dur demektir.' },
      { q: 'Sağlıklı büyümek ve hastalıklardan korunmak için hangisini yapmalıyız?', v: '🥗🍎😴🧼', opts: ['Dengeli beslenmeli, ellerimizi yıkamalı ve düzenli uyumalıyız', 'Her öğün sadece cips ve şeker yemeliyiz', 'Gece geç saatlere kadar uyanık kalmalıyız'], ans: 0, exp: 'Sebze-meyve tüketimi, el hijyeni ve yeterli uyku sağlığımızın temelidir.' },
      { q: 'Bisiklet, kaykay veya paten sürerken güvenliğimiz için mutlaka ne takmalıyız?', v: '🚲⛑️', opts: ['Kask, dizlik ve dirseklik', 'Sadece güneş gözlüğü', 'Hiçbir şey takmamalıyız'], ans: 0, exp: 'Kask, dizlik ve dirseklik düşmelerde bizi yaralanmalardan korur.' },
      { q: 'Tanımadığımız bir kişi bize şeker verip bir yere çağırdığında ne yapmalıyız?', v: '🛑🙅', opts: ['Kesinlikle kabul etmeyip uzaklaşmalı ve ailemize/öğretmenimize söylemeliyiz', 'Hemen peşinden gitmeliyiz', 'Ev adresimizi vermeliyiz'], ans: 0, exp: 'Yabancıların tekliflerini reddetmek kişisel güvenliğimizin altın kuralıdır.' },
      { q: 'Kış mevsiminde dışarı çıkarken sağlığımızı korumak için nasıl giyinmeliyiz?', v: '❄️🧣🧥', opts: ['Mont, atkı, bere ve bot gibi kalın giysiler seçmeliyiz', 'Kısa kollu tişört ve terlikle çıkmalıyız', 'İnce yazlık şapka takmalıyız'], ans: 0, exp: 'Mevsim şartlarına uygun giyinmek hastalıklardan korur.' }
    ]
  },
  {
    num: 7,
    id: 'ch7',
    world: 'city',
    subject: 'MATEMATİK',
    subjectKey: 'matematik',
    subjectColor: '#2986e3',
    topic: 'Çarpma, Bölme ve Kesirler (Bütün - Yarım - Çeyrek)',
    title: 'Bölüm 7: Şehir Devi Godzilla\'nın Paylaşım Meydanı!',
    mode: 'boss_godzilla',
    npc: 'godzilla',
    targetCount: 6,
    summary: 'BÜÜM! Godzilla adım attıkça ekran sarsılıyor ve mavi enerji halkaları yayılıyor! Halkalardan kaçıp 6 Paylaşım Paketi ile çarpma, bölme ve kesirleri çöz!',
    introLines: [
      ['godzilla', 'BÜÜÜM!! GÜM!! Merhaba minik polisler! Ben kötü değilim ama şehir fırınındaki pizzaları arkadaşlarıma eşit paylaştıramadım!'],
      ['vudi', 'Vaaay! Sırtındaki mavi dikenler parlıyor ve her adımında tüm ekran sallanıyor Komiserim!'],
      ['rakun', 'Sakin ol koca Godzilla! Mavi şok halkalarına dikkat ederek 6 Paylaşım Paketini toplayıp çarpma, bölme ve kesirleri çözeceğiz!']
    ],
    outroLines: [
      ['godzilla', 'BÜÜÜM-HAHA! Yaşasın! Artık bütün, yarım, çeyrek ve çarpma-bölmeyi öğrendim! Siz benim en iyi dostumsunuz!'],
      ['rakun', 'Rica ederiz koca dostum! Şimdi Saat Kulesi ve Liman\'a bakalım!']
    ],
    questions: [
      { q: '4 tabakta 5\'er kurabiye vardır. Toplam kurabiye sayısını veren ÇARPMA işlemi ve sonucu hangisidir?', v: '🍪🍪🍪🍪🍪 × 4', opts: ['4 × 5 = 20', '4 + 5 = 9', '5 × 5 = 25'], ans: 0, exp: '4 tane 5\'in toplamı: 4 × 5 = 20 kurabiye eder!' },
      { q: '18 elmayı 3 arkadaşa EŞİT olarak paylaştırırsak her birine kaç elma düşer?', v: '🍎 18 ÷ 3 = ?', opts: ['6 elma', '5 elma', '9 elma'], ans: 0, exp: '18 ÷ 3 = 6 elma düşer (3 × 6 = 18).' },
      { q: '1 BÜTÜN pizza tam ortadan eş parçalara bölündüğünde kaç YARIM, kaç ÇEYREK eder?', v: '🍕 Bütün → Yarım → Çeyrek', opts: ['2 yarım ve 4 çeyrek eder', '3 yarım ve 6 çeyrek eder', '4 yarım ve 2 çeyrek eder'], ans: 0, exp: '1 bütün = 2 yarım = 4 çeyrektir!' },
      { q: '8 yarım elma birleştirilirse kaç BÜTÜN elma eder?', v: '🍎 2 yarım = 1 bütün', opts: ['4 bütün elma', '8 bütün elma', '2 bütün elma'], ans: 0, exp: 'Her 2 yarım 1 bütün yaptığı için 8 ÷ 2 = 4 bütün elma eder.' },
      { q: '3 × 8 işleminin sonucu kaçtır?', v: '✖️ 3 tane 8', opts: ['24', '21', '27'], ans: 0, exp: '8 + 8 + 8 = 24 yani 3 × 8 = 24.' },
      { q: '20 balonu 4\'erli gruplara ayırırsak kaç grup oluşur?', v: '🎈 20 ÷ 4 = ?', opts: ['5 grup', '4 grup', '6 grup'], ans: 0, exp: '20 ÷ 4 = 5 grup oluşur.' },
      { q: '3 BÜTÜN ekmekte toplam kaç ÇEYREK ekmek vardır?', v: '🍞 Her bütünde 4 çeyrek!', opts: ['12 çeyrek', '6 çeyrek', '8 çeyrek'], ans: 0, exp: '1 bütünde 4 çeyrek vardır; 3 × 4 = 12 çeyrek eder!' },
      { q: 'Bir sayıyı "0" (sıfır) ile çarparsak sonuç her zaman kaç olur? (Örn: 9 × 0)', v: '0️⃣ Yutan Eleman!', opts: ['0', '9', '1'], ans: 0, exp: '0 çarpma işleminde yutan elemandır; sonuç her zaman 0\'dır!' }
    ]
  },
  {
    num: 8,
    id: 'ch8',
    world: 'city',
    subject: 'MATEMATİK',
    subjectKey: 'matematik',
    subjectColor: '#2986e3',
    topic: 'Saatler, Paralarımız, Geometrik Cisimler ve Ölçme',
    title: 'Bölüm 8: Denizde Kurnaz Karga\'ya Su Topu Savaşı!',
    mode: 'sea_battle',
    npc: 'karga',
    targetCount: 5,
    summary: 'Polis Devriye Teknesine atla! Yüzen sandıklardan soru çözerek Konfeti-Su Topunu doldur, sürükleyip nişan al ve Kurnaz Karga\'nın salını 5 kez vur!',
    introLines: [
      ['vudi', 'Tak-tak-tak! Komiserim! Kurnaz Karga Saat Kulesi\'nin altın çarklarını alıp korsan salıyla denize açıldı!'],
      ['karga', 'Gaaak! Denizde beni asla vuramazsınız! Saatleri de paraları da karıştırdım!'],
      ['rakun', 'Polis Devriye Teknesi hazır! Önce yüzen sandığa gidip 2 soru çözelim, sonra Ateş düğmesini sürükleyip Karga\'nın salına nişan alalım!']
    ],
    outroLines: [
      ['karga', 'Gaaak! Sırılsıklam oldum! Tamam tamam, altın saat çarklarını geri veriyorum!'],
      ['vudi', 'Tam isabet Kaptan Komiser! Teknemizi limana bağladık, şimdi Şehir Gazetesi vakasına dönelim!']
    ],
    questions: [
      { q: 'Akrep 3 ile 4\'ün arasında, yelkovan tam 6\'nın üzerindeyse saat kaçtır?', v: '🕞 Yelkovan 6\'da = Buçuk!', opts: ['03.30 (Üç buçuk)', '03.00 (Tam üç)', '06.15'], ans: 0, exp: 'Yelkovan 6\'yı gösterdiğinde yarım saat (30 dakika / buçuk) geçmiştir: 03.30.' },
      { q: 'Küp şeklindeki bir kutunun kaç YÜZÜ, kaç KÖŞESİ ve kaç AYRIITI (kenarı) vardır?', v: '🧊 Küp / Zar', opts: ['6 yüzü, 8 köşesi, 12 ayrıtı', '4 yüzü, 4 köşesi, 8 ayrıtı', '6 yüzü, 6 köşesi, 6 ayrıtı'], ans: 0, exp: 'Küp ve kare prizmanın 6 yüzü, 8 köşesi ve 12 ayrıtı vardır.' },
      { q: 'Tanesi 15 TL olan defterlerden 2 tane alan Efe, satıcıya 50 TL verdi. Kaç TL para üstü alır?', v: '💵 50 TL - (15 + 15)', opts: ['20 TL', '30 TL', '15 TL'], ans: 0, exp: '2 defter 15 + 15 = 30 TL tutar. 50 - 30 = 20 TL para üstü alır.' },
      { q: '1 METRE kaç SANTİMETREYE eşittir?', v: '📏 1 m = ? cm', opts: ['100 santimetre', '10 santimetre', '50 santimetre'], ans: 0, exp: '1 metre tam 100 santimetredir (1 m = 100 cm).' },
      { q: 'Köşesi ve ayrıtı OLMAYAN, tamamen yuvarlak yüzeye sahip geometrik cisim hangisidir?', v: '⚽🌍', opts: ['Küre', 'Küp', 'Üçgen Prizma'], ans: 0, exp: 'Top ve Dünya modeli gibi kürelerin köşesi ve ayrıtı yoktur.' },
      { q: '4 tane 25 kuruş bir araya gelirse kaç Türk Lirası (TL) eder?', v: '🪙 25 kr × 4', opts: ['1 TL (100 kuruş)', '2 TL', '50 kuruş'], ans: 0, exp: '100 kuruş = 1 TL\'dir. 4 × 25 kuruş = 100 kuruş = 1 TL eder!' },
      { q: 'Bir yılda kaç MEVSİM ve kaç AY vardır?', v: '🌸☀️🍂❄️', opts: ['4 mevsim ve 12 ay', '4 mevsim ve 7 ay', '12 mevsim ve 52 ay'], ans: 0, exp: '1 yılda 4 mevsim, 12 ay ve 52 hafta vardır.' },
      { q: 'Marketten aldığımız elma ve patatesin kütlesini (ağırlığını) hangi birimle ölçeriz?', v: '⚖️🍏🥔', opts: ['Kilogram (kg)', 'Metre (m)', 'Saat'], ans: 0, exp: 'Katı maddelerin kütlesi kilogram (ve gram) ile ölçülür.' }
    ]
  },
  {
    num: 9,
    id: 'ch9',
    world: 'city',
    subject: 'TÜRKÇE',
    subjectKey: 'turkce',
    subjectColor: '#e86a2c',
    topic: 'Okuduğunu Anlama, 5N1K ve Yazım Kuralları',
    title: 'Bölüm 9: Dedektiflik Panosu ve 5N1K İpuçları',
    mode: 'carry_evidence',
    npc: 'vudi',
    targetCount: 4,
    summary: 'Doktor Palyaço\'nun gizli adasını bulmak için şehirdeki 4 Gazete İpucunu toplayıp Dedektiflik Panosuna getir!',
    introLines: [
      ['rakun', 'Vudi, Doktor Palyaço\'nun nereye saklandığını bulmak için iyi bir dedektif gibi 5N1K sorularını sormalıyız!'],
      ['vudi', 'Tak-tak! Kim? Ne? Nerede? Ne zaman? Nasıl? Niçin? Şehirdeki 4 gizli mektubu toplayıp panoya getirelim!']
    ],
    outroLines: [
      ['vudi', 'Bulduk Komiserim! Mektuplardaki şifre çözüldü: Doktor Palyaço "Lunapark Bilim Adası"nda!'],
      ['rakun', 'Harika! Dokuzuncu yıldızımız tamam! Gemimizle Bilim Adası\'na yelken açıyoruz!']
    ],
    questions: [
      { q: '"Komiser Rakun sabah parkta kayıp rozeti dikkatlice aradı." cümlesinde "NE ZAMAN?" sorusunun cevabı hangisidir?', v: '🕵️‍♂️ 5N1K', opts: ['Sabah', 'Parkta', 'Komiser Rakun'], ans: 0, exp: 'Sabah = Ne zaman, Parkta = Nerede, Komiser Rakun = Kim, Dikkatlice = Nasıl.' },
      { q: 'Aşağıdaki cümlelerin hangisinde BÜYÜK HARFLERİN yazımıyla ilgili bir YANLIŞLIK yapılmıştır?', v: '✍️ Büyük Harf Kuralı', opts: ['Kedim pamuk bugün ankaraya gitti.', 'Kedim Pamuk bugün Ankara\'ya gitti.', 'Cumhuriyet Bayramı\'nı coşkuyla kutladık.'], ans: 0, exp: 'Hayvanlara verilen özel adlar (Pamuk) ve şehir adları (Ankara\'ya) büyük harfle başlar.' },
      { q: 'Soru eki olan "mı / mi / mu / mü" cümlede nasıl yazılır?', v: '❓ Sen de gelecek ___?', opts: ['Kendisinden önceki kelimeden AYRI yazılır (gelecek misin)', 'Kelimeye her zaman bitişik yazılır', 'Sadece büyük harfle yazılır'], ans: 0, exp: 'Soru eki mi/mı/mu/mü her zaman kelimeden ayrı yazılır!' },
      { q: '"kitap - okudum - akşam - güzel - bir" kelimeleriyle anlamlı ve kurallı bir cümle kurarsak hangisi olur?', v: '📚 Kurallı Cümle', opts: ['Akşam güzel bir kitap okudum.', 'Okudum akşam kitap güzel bir.', 'Kitap bir güzel okudum akşam.'], ans: 0, exp: 'Kurallı cümlede iş/hareket bildiren kelime (okudum) en sonda bulunur.' },
      { q: '"Vudi sevinçten havalara uçtu." cümlesinde "havalara uçmak" ne anlama gelir?', v: '🐦🎉', opts: ['Çok sevinmek, mutlu olmak', 'Uçağa binmek', 'Gökyüzünde kaybolmak'], ans: 0, exp: '"Havalara uçmak" çok sevinmek anlamında kullanılan bir deyimdir.' },
      { q: '"T-Rex kütüphaneye gitti çünkü yeni masal kitabı almak istiyordu." cümlesinde "NİÇİN?" sorusunun cevabı nedir?', v: '🦖📖', opts: ['Yeni masal kitabı almak istediği için', 'Kütüphaneye', 'T-Rex'], ans: 0, exp: '"Çünkü" ifadesi eylemin nedenini (niçin yapıldığını) açıklar.' }
    ]
  },
  {
    num: 10,
    id: 'ch10',
    world: 'island',
    subject: 'HAYAT BİLGİSİ',
    subjectKey: 'hayat',
    subjectColor: '#2ea853',
    topic: 'Ülkemizde Hayat, Doğada Hayat, Geri Dönüşüm ve Gökyüzü',
    title: 'Bölüm 10: Bilim Adası Doğa ve Kültür Görevi',
    mode: 'carry_evidence',
    npc: 'ejderha',
    targetCount: 4,
    summary: 'Bilim Adası\'na ulaştık! Doktor Palyaço etrafa geri dönüşüm kutularını dağıtmış. 4 Geri Dönüşüm / Kültür sembolünü toplayıp Ejderha\'nın yanındaki istasyona taşı!',
    introLines: [
      ['ejderha', 'Pufff! Bilim Adası\'na hoş geldiniz Komiserim! Doktor Palyaço kalesine kapandı ama adanın doğasını karıştırdı!'],
      ['rakun', 'Hem güzel ülkemizin değerlerini hem de doğamızı korumak bizim görevimiz! 4 sembolü toplayıp istasyona getirelim!']
    ],
    outroLines: [
      ['ejderha', 'Pufff-yaşasın! Ada pırıl pırıl oldu! Şimdi Doktor Palyaço\'nun kalesinin dış kapısındaki İngilizce kilidine gidebilirsiniz!'],
      ['vudi', 'Tak-tak! Onuncu yıldız da bizim! Kale kapısına koşalım!']
    ],
    questions: [
      { q: 'Türkiye Cumhuriyeti\'nin başkenti neresidir ve İstiklal Marşımızın şairi kimdir?', v: '🇹🇷🏛️', opts: ['Başkentimiz Ankara — Şairimiz Mehmet Akif Ersoy', 'Başkentimiz İstanbul — Şairimiz Ömer Seyfettin', 'Başkentimiz İzmir — Şairimiz Ziya Gökalp'], ans: 0, exp: 'Başkentimiz Ankara\'dır; İstiklal Marşımızı Mehmet Akif Ersoy yazmıştır.' },
      { q: 'Ulu Önder Mustafa Kemal Atatürk çocuklara hangi milli bayramımızı armağan etmiştir?', v: '🎈🇹🇷 23 Nisan', opts: ['23 Nisan Ulusal Egemenlik ve Çocuk Bayramı', '29 Ekim Cumhuriyet Bayramı', '30 Ağustos Zafer Bayramı'], ans: 0, exp: 'TBMM\'nin açıldığı 23 Nisan gününü Atatürk tüm dünya çocuklarına armağan etmiştir.' },
      { q: 'Bitmiş pilleri, kağıtları, cam şişeleri ve plastikleri nereye atmalıyız?', v: '♻️🌍', opts: ['Türlerine göre ayrılmış Geri Dönüşüm / Atık Pil kutularına', 'Toprağa veya denize', 'Hepsini sokağa'], ans: 0, exp: 'Geri dönüşüm doğayı korur; atık piller kesinlikle toprağa/çöpe değil atık pil kutusuna atılır.' },
      { q: 'Dünya\'nın kendi etrafında dönmesi sonucu ne oluşur? Güneş etrafında dolanmasıyla ne oluşur?', v: '🌍☀️🌙', opts: ['Kendi etrafında: Gece-Gündüz (1 gün) / Güneş etrafında: Mevsimler-Yıl', 'Kendi etrafında: Mevsimler / Güneş etrafında: 1 saat', 'Hiçbiri değişmez'], ans: 0, exp: 'Dünya kendi etrafında 24 saatte döner (gün); Güneş etrafında 1 yılda dolanır (mevsimler).' },
      { q: 'Güneş sabah hangi yönden doğar ve akşam hangi yönden batar?', v: '🧭🌅', opts: ['Doğu\'dan doğar, Batı\'dan batar', 'Kuzey\'den doğar, Güney\'den batar', 'Batı\'dan doğar, Doğu\'dan batar'], ans: 0, exp: 'Güneş her sabah Doğu yönünden doğar, akşam Batı yönünden batar.' },
      { q: 'Bitkilerin sağlıklı büyüyebilmesi için aşağıdakilerden hangilerine ihtiyacı vardır?', v: '🌱💧☀️', opts: ['Su, güneş ışığı, hava ve toprak', 'Sadece karanlık bir dolap', 'Şekerli gazoz'], ans: 0, exp: 'Bitkiler canlıdır; büyümek için su, güneş ışığı, hava ve toprağa ihtiyaç duyar.' }
    ]
  },
  {
    num: 11,
    id: 'ch11',
    world: 'island',
    subject: 'İNGİLİZCE',
    subjectKey: 'ingilizce',
    subjectColor: '#8e5cff',
    topic: '2. Sınıf İngilizce Tüm Üniteler (Sayılar, Renkler, Hayvanlar, Meyveler, Sınıf, Vücudumuz)',
    title: 'Bölüm 11: Kale Kapısının İngilizce Şifre Bulutları!',
    mode: 'pad_arena',
    npc: 'vudi',
    targetCount: 6,
    summary: 'Doktor Palyaço kalenin kapısına İngilizce şifre koymuş! Vudi\'nin okuduğu sorunun DOĞRU cevabı olan buluta koşarak şifreyi kır!',
    introLines: [
      ['vudi', 'Tak-tak-tak! Komiserim, kalenin kapısında İngilizce kilit var! İyi ki 2. sınıf İngilizce kelimelerinin hepsini biliyoruz!'],
      ['rakun', 'Harika! Sen soruyu söyle Vudi, ben de yerde parlayan 3 şifre bulutundan doğrusunun üstüne koşayım!']
    ],
    outroLines: [
      ['vudi', 'Harika iş (Great job) Komiserim! Kalenin kapısı ardına kadar açıldı!'],
      ['palyaco', 'MUAHAHAHA! Hihohaha! Demek kaleme kadar geldiniz! Bakalım Şapşaltron-3000 karşısında ne yapacaksınız?!']
    ],
    questions: [
      { q: 'İngilizcede "GOOD MORNING" ne demektir?', v: '☀️👋', opts: ['Günaydın', 'İyi geceler', 'Görüşürüz'], ans: 0, exp: 'Good morning = Günaydın, Good night = İyi geceler, Goodbye = Hoşça kal!' },
      { q: '"RED - BLUE - YELLOW" renklerinin Türkçesi sırasıyla hangisidir?', v: '🔴 🔵 🟡', opts: ['Kırmızı - Mavi - Sarı', 'Yeşil - Mor - Turuncu', 'Sarı - Siyah - Beyaz'], ans: 0, exp: 'Red = Kırmızı, Blue = Mavi, Yellow = Sarı!' },
      { q: 'İngilizcede "SEVEN" ve "TEN" hangi sayılardır?', v: '🔢 7 & 10', opts: ['7 ve 10', '6 ve 9', '5 ve 8'], ans: 0, exp: 'One(1), Two(2), Three(3), Four(4), Five(5), Six(6), Seven(7), Eight(8), Nine(9), Ten(10)!' },
      { q: 'Sınıf eşyalarından "BOOK - PENCIL - DESK" kelimelerinin anlamı nedir?', v: '📕 ✏️ 🪑', opts: ['Kitap - Kurşun kalem - Sıra', 'Çanta - Silgi - Kapı', 'Defter - Cetvel - Pencere'], ans: 0, exp: 'Book = Kitap, Pencil = Kurşun kalem, Desk = Sıra/Masa.' },
      { q: 'Vücudumuzun bölümlerinden "EYES - EARS - HANDS" hangileridir?', v: '👀 👂 👐', opts: ['Gözler - Kulaklar - Eller', 'Burun - Ağız - Ayaklar', 'Saç - Baş - Kollar'], ans: 0, exp: 'Eyes = Gözler, Ears = Kulaklar, Hands = Eller!' },
      { q: '"MONKEY - BIRD - CAT" hayvanlarının Türkçesi sırasıyla hangisidir?', v: '🐒 🐦 🐱', opts: ['Maymun - Kuş - Kedi', 'Köpek - Balık - Aslan', 'Kurbağa - Ördek - At'], ans: 0, exp: 'Monkey = Maymun, Bird = Kuş, Cat = Kedi!' },
      { q: '"I like APPLES and BANANAS!" diyen biri hangi meyveleri seviyordur?', v: '🍎 🍌', opts: ['Elma ve Muz', 'Portakal ve Çilek', 'Karpuz ve Üzüm'], ans: 0, exp: 'Apple = Elma, Banana = Muz demektir!' },
      { q: 'Oyun parkında "JUMP and RUN!" diyen arkadaşımız ne yapmamızı söylüyor?', v: '🏃‍♂️🦘', opts: ['Zıpla ve Koş!', 'Otur ve Uyu!', 'Şarkı söyle ve Boya!'], ans: 0, exp: 'Jump = Zıplamak, Run = Koşmak demektir!' }
    ]
  },
  {
    num: 12,
    id: 'ch12',
    world: 'lab',
    subject: 'TÜM DERSLER FİNAL',
    subjectKey: 'karma',
    subjectColor: '#ff3b5c',
    topic: '2. Sınıf Tüm Dersler Büyük Final Sınavı!',
    title: 'Bölüm 12: Doktor Palyaço ve Şapşaltron-3000!',
    mode: 'boss_palyaco',
    npc: 'palyaco',
    targetCount: 8,
    summary: 'BÜYÜK FİNAL! Doktor Palyaço laboratuvarında zıplayan şaka topları fırlatıyor! Toplardan kaç, 8 Altın Bilgi Kristalini topla ve Şapşaltron-3000\'i durdur!',
    introLines: [
      ['palyaco', 'MUAHAHAHA! Hihohaha! Kırmızı top burnum aşkına, laboratuvarıma hoş geldiniz! Şapşaltron-3000 bütün bilgileri şakaya çevirecek!'],
      ['karga', 'Gaaak! Patron, dikkat et, Komiser Rakun ve Vudi buraya kadar tek bir soruyu bile kaçırmadı!'],
      ['vudi', 'Tak-tak-tak! Korkma Komiserim! T-Rex, Ejderha, Godzilla ve Kurt da kapıdan bize tezahürat yapıyor!'],
      ['rakun', 'Teslim ol Doktor Palyaço! Zıplayan şaka toplarından kaçıp 8 Bilgi Kristalini kurtaracağız!']
    ],
    outroLines: [
      ['palyaco', 'Bip-bip! Olamaz! Papyonum fırıldak gibi döndü, Şapşaltron-3000 kapandı! Hihoha... tamam kabul ediyorum, 2. sınıf bilginiz yenilmezmiş!'],
      ['trex', 'RÖÖÖAAR! Yaşasın Komiser Rakun ve Vudi!'],
      ['godzilla', 'BÜÜÜM! İşte gerçek Başkomiser!'],
      ['rakun', 'Yaşasın! 12 Bilgi Yıldızının tamamını kurtardık! Şimdi Başkomiser Başarı Diplomamızı alma zamanı!']
    ],
    questions: [
      { q: '"ÖĞRENCİ" kelimesinin eş anlamlısı nedir ve kaç hecelidir?', v: '🎒📖', opts: ['TALEBE — 3 hecelidir (ÖĞ-REN-Cİ)', 'ÖĞRETMEN — 4 hecelidir', 'OKUL — 2 hecelidir'], ans: 0, exp: 'Öğrenci kelimesinin eş anlamlısı "Talebe"dir ve ÖĞ-REN-Cİ olarak 3 hecelidir!' },
      { q: 'Bir sınıfta 4 sıra grubu, her grupta 6 öğrenci vardır. Sınıfa 5 öğrenci daha gelirse toplam kaç öğrenci olur?', v: '🧮 (4 × 6) + 5', opts: ['29 öğrenci', '24 öğrenci', '15 öğrenci'], ans: 0, exp: '4 × 6 = 24 öğrenci vardı; 5 öğrenci daha gelince 24 + 5 = 29 öğrenci olur!' },
      { q: '29 Ekim 1923 tarihinde ülkemizde hangi çok önemli olay gerçekleşmiştir?', v: '🇹🇷✨', opts: ['Cumhuriyet ilan edilmiştir', 'Yaz tatili başlamıştır', 'Saatler geri alınmıştır'], ans: 0, exp: '29 Ekim 1923\'te Cumhuriyet ilan edilmiş ve her yıl Cumhuriyet Bayramı olarak kutlanmaktadır.' },
      { q: 'İngilizcede "How old are you?" sorusuna 8 yaşındaki bir çocuk nasıl cevap verir?', v: '🎂8️⃣', opts: ['I am eight years old.', 'I am fine, thank you.', 'This is a red apple.'], ans: 0, exp: '"How old are you?" = Kaç yaşındasın? → "I am eight (8) years old."' },
      { q: 'Bir saat 60 dakikadır. Öyleyse YARIM SAAT ve ÇEYREK SAAT kaç dakikadır?', v: '⏰ 60 dk', opts: ['Yarım saat 30 dk — Çeyrek saat 15 dk', 'Yarım saat 20 dk — Çeyrek saat 10 dk', 'Yarım saat 50 dk — Çeyrek saat 25 dk'], ans: 0, exp: '60\'ın yarısı 30 dakika, çeyreği (dörtte biri) ise 15 dakikadır!' },
      { q: 'Aşağıdaki cümlelerden hangisinde yazım ve noktalama TAMAMEN DOĞRUDUR?', v: '✅✍️', opts: ['Yarın Vudi ile İstanbul\'a gidecek misin?', 'yarın vudi ile istanbula gidecek misin.', 'Yarın Vudi ile İstanbul\'a gidecekmisin!'], ans: 0, exp: 'Cümle başı ve özel adlar büyük başlar, kesme işaretiyle ayrılır, "misin" ayrı yazılır ve soru işareti konur.' },
      { q: 'Deprem sırasında bina içindeysek güvenli bir eşyanın yanında hangi hareketi yapmalıyız?', v: '🛡️ ÇÖK - KAPAN - TUTUN', opts: ['Çök - Kapan - Tutun hareketini yapmalıyız', 'Asansöre binmeliyiz', 'Balkondan atlamalıyız'], ans: 0, exp: 'Deprem anında sağlam bir nesnenin yanında Çök-Kapan-Tutun uygulanır, asansör asla kullanılmaz.' },
      { q: '92 sayısından, "3 onluk 7 birlik"ten oluşan sayıyı çıkarırsak kaç kalır?', v: '🔢 92 - 37 = ?', opts: ['55', '65', '53'], ans: 0, exp: '3 onluk 7 birlik = 37 eder. 92 - 37 = 55 kalır!' }
    ]
  }
];
