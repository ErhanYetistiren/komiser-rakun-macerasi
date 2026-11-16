/* ============================================================================
   03B-EXTRA-QUESTIONS.JS — GENİŞLETİLMİŞ MEB 2. SINIF EK SORU BANKASI
   Antrenman Turları ve Tekrar Oynanış İçin Zenginleştirilmiş Müfredat Soruları
   ============================================================================ */

const EXTRA_QUESTION_BANK = {
  turkce: [
    { q: '"TRAKTÖR" kelimesi kaç hecelidir?', v: '🚜 TRAK - TÖR', opts: ['2 hecelidir', '3 hecelidir', '1 hecelidir'], ans: 0, exp: 'TRAK - TÖR kelimesinde A ve Ö olmak üzere 2 ünlü harf vardır, 2 hecelidir.' },
    { q: '"CEVAP" kelimesinin EŞ ANLAMLISI aşağıdakilerden hangisidir?', v: '💬 Cevap = ?', opts: ['YANIT', 'SORU', 'ÖDEV'], ans: 0, exp: 'Cevap kelimesinin eş anlamlısı "Yanıt", zıt anlamlısı ise "Soru"dur.' },
    { q: '"ACEMİ" kelimesinin ZIT ANLAMLISI hangisidir?', v: '🛠️↔️', opts: ['USTA', 'YENİ', 'ÇIRAK'], ans: 0, exp: 'Acemi kelimesinin karşıt (zıt) anlamlısı "Usta"dır.' },
    { q: '"DOKTOR" kelimesinin eş anlamlısı olan kelime hangisidir?', v: '🩺👨‍⚕️', opts: ['HEKİM', 'HEMŞİRE', 'ECZACI'], ans: 0, exp: 'Doktor ve Hekim eş anlamlı kelimelerdir.' },
    { q: '"KARA" kelimesinin ZIT anlamlısı ve EŞ anlamlısı sırasıyla hangisidir?', v: '⚫↔️⚪', opts: ['Zıt: AK/BEYAZ — Eş: SİYAH', 'Zıt: SİYAH — Eş: KIRMIZI', 'Zıt: MAVİ — Eş: YEŞİL'], ans: 0, exp: 'Kara = Siyah (eş anlam); Kara ↔ Ak/Beyaz (zıt anlam).' },
    { q: '"Atatürk 1881 yılında Selanik( )te doğdu." cümlesinde yay ayraç içine ne gelmelidir?', v: '✍️ Özel İsim Eki', opts: ['Kesme işareti (\')', 'Nokta (.)', 'Ünlem (!)'], ans: 0, exp: 'Selanik özel isim olduğu için gelen ek kesme işaretiyle ayrılır: Selanik\'te.' },
    { q: 'Sözlük sırasına göre "ELMA - ERİK - EKMEK" kelimelerinden hangisi BİRİNCİ sırada yer alır?', v: '📖 E-K / E-L / E-R', opts: ['EKMEK', 'ELMA', 'ERİK'], ans: 0, exp: 'İlk harfler E; ikinci harflere bakılır: K harfi L ve R harflerinden önce gelir!' },
    { q: '"Kardeşim sütü bir dikişte içti." cümlesinde "KIM?" sorusunun cevabı nedir?', v: '🥛👦', opts: ['Kardeşim', 'Sütü', 'Bir dikişte'], ans: 0, exp: 'İşi yapan kişi "Kardeşim"dir.' },
    { q: '"YIL" kelimesinin eş anlamlısı aşağıdakilerden hangisidir?', v: '📅 365 Gün', opts: ['SENE', 'ASIR', 'MEVSİM'], ans: 0, exp: 'Yıl kelimesinin eş anlamlısı "Sene"dir.' },
    { q: '"Eyvah, şemsiyemi evde unuttum( )" cümlesinin sonuna hangi işaret konmalıdır?', v: '☔😮', opts: ['Ünlem işareti (!)', 'Soru işareti (?)', 'Kısa çizgi (-)'], ans: 0, exp: '"Eyvah" şaşma/telaş bildirdiği için cümle sonuna ünlem (!) konur.' }
  ],
  matematik: [
    { q: 'İki basamaklı EN BÜYÜK doğal sayı kaçtır?', v: '🔢 99 ?', opts: ['99', '98', '90'], ans: 0, exp: 'İki basamaklı en büyük doğal sayı 99, en küçük doğal sayı (pozitif) 10\'dur.' },
    { q: '2 DÜZİNE boya kaleminden 5 tanesi kaybolursa geriye kaç kalem kalır?', v: '🖍️ (12 + 12) - 5', opts: ['19 kalem', '15 kalem', '24 kalem'], ans: 0, exp: '1 düzine 12\'dir; 2 düzine = 24 kalem. 24 - 5 = 19 kalem kalır!' },
    { q: '65 sayısını en yakın onluğa yuvarlarsak sonuç kaç olur?', v: '🎯 60 <--- 65 ---> 70', opts: ['70', '60', '65'], ans: 0, exp: 'Birler basamağı 5 olduğu için bir üst onluğa yani 70\'e yuvarlanır.' },
    { q: '4 × 7 işleminin sonucu kaçtır?', v: '✖️ 4 kere 7', opts: ['28', '24', '32'], ans: 0, exp: '4 × 7 = 28 eder.' },
    { q: '35 fındığı 5 sincaba EŞİT olarak paylaştırırsak her sincaba kaç fındık düşer?', v: '🐿️ 35 ÷ 5 = ?', opts: ['7 fındık', '6 fındık', '8 fındık'], ans: 0, exp: '35 ÷ 5 = 7 fındık düşer.' },
    { q: '16 çeyrek elma birleştirilirse kaç BÜTÜN elma eder?', v: '🍎 4 çeyrek = 1 bütün', opts: ['4 bütün elma', '8 bütün elma', '2 bütün elma'], ans: 0, exp: 'Her 4 çeyrek 1 bütün yaptığı için 16 ÷ 4 = 4 bütün elma eder.' },
    { q: 'Üçgen prizmanın tabanları hangi geometrik şekildir?', v: '⛺ Prizma', opts: ['Üçgen', 'Çember', 'Kare'], ans: 0, exp: 'Üçgen prizmanın alt ve üst tabanları üçgen, yan yüzleri dikdörtgendir.' },
    { q: 'Saat 09.15\'i nasıl okuruz?', v: '🕘 + 15 dk', opts: ['Dokuzu çeyrek geçiyor', 'Dokuz buçuk', 'Dokuz tam'], ans: 0, exp: '15 dakika = çeyrek saattir; 09.15 "dokuzu çeyrek geçiyor" diye okunur.' },
    { q: '2 tane 50 kuruş + 3 tane 1 TL toplam kaç TL eder?', v: '🪙 50kr+50kr + 3 TL', opts: ['4 TL', '5 TL', '3 TL'], ans: 0, exp: '2 tane 50 kuruş = 100 kuruş = 1 TL eder. 1 TL + 3 TL = 4 TL!' },
    { q: '54 + 29 işleminin sonucu kaçtır?', v: '➕ 54 + 29', opts: ['83', '73', '84'], ans: 0, exp: '4 + 9 = 13 (elde 1), 5 + 2 + 1 = 8 → 83!' }
  ],
  hayat: [
    { q: 'Cumhuriyetimizin kurucusu Mustafa Kemal Atatürk\'ün kabri (Anıtkabir) hangi ilimizdedir?', v: '🏛️🇹🇷', opts: ['Ankara', 'İstanbul', 'Samsun'], ans: 0, exp: 'Anıtkabir başkentimiz Ankara\'dadır.' },
    { q: 'Okul koridorlarında neden koşmamalıyız?', v: '🏫🚶', opts: ['Arkadaşlarımıza çarpıp düşmemek ve yaralanmamak için', 'Daha geç kalmak için', 'Ayakkabımız eskimesin diye'], ans: 0, exp: 'Koridor ve merdivenlerde koşmak kazalara yol açabilir.' },
    { q: 'Aşağıdakilerden hangisi KİŞİSEL BAKIM eşyalarımızdan biridir ve başkasıyla paylaşılmaz?', v: '🪥🧼', opts: ['Diş fırçası ve tarak', 'Futbol topu', 'Hikâye kitabı'], ans: 0, exp: 'Diş fırçası, tarak, havlu ve tırnak makası kişiye özeldir.' },
    { q: 'Servis veya otomobilde yolculuk yaparken ilk yapmamız gereken güvenlik kuralı nedir?', v: '🚗💺', opts: ['Emniyet kemerimizi takmak', 'Camdan sarkmak', 'Ayakta durmak'], ans: 0, exp: 'Araçta arka koltuğa oturup emniyet kemeri takmak hayat kurtarır.' },
    { q: 'Ağaçların yapraklarını döktüğü, havaların soğumaya başladığı ve okulların açıldığı mevsim hangisidir?', v: '🍂🎒', opts: ['Sonbahar', 'İlkbahar', 'Yaz'], ans: 0, exp: 'Eylül, Ekim ve Kasım ayları Sonbahar mevsimidir.' },
    { q: 'Kızılay hangi amaçla çalışan çok önemli bir kurumumuzdur?', v: '🌙❤️', opts: ['Afetlerde ve ihtiyaç sahiplerine insani yardım ulaştırmak', 'Oyuncak üretmek', 'Bilet satmak'], ans: 0, exp: 'Türk Kızılayı deprem, sel gibi afetlerde çadır, gıda ve kan yardımı sağlar.' },
    { q: 'Yemek yemeden önce ve tuvaletten çıktıktan sonra mutlaka ne yapmalıyız?', v: '🧼👐', opts: ['Ellerimizi su ve sabunla en az 20 saniye yıkamalıyız', 'Sadece peçeteye silmeliyiz', 'Hiçbir şey yapmamalıyız'], ans: 0, exp: 'Mikroplardan korunmanın en etkili yolu el yıkamaktır.' },
    { q: '30 Ağustos tarihinde hangi milli bayramımızı kutlarız?', v: '🇹🇷🎖️', opts: ['Zafer Bayramı', 'Cumhuriyet Bayramı', 'Ulusal Egemenlik ve Çocuk Bayramı'], ans: 0, exp: '30 Ağustos Zafer Bayramımızdır.' }
  ],
  ingilizce: [
    { q: 'İngilizcede "GREEN - ORANGE - PURPLE" renklerinin Türkçesi sırasıyla nedir?', v: '🟢 🟠 🟣', opts: ['Yeşil - Turuncu - Mor', 'Mavi - Pembe - Kahverengi', 'Sarı - Kırmızı - Siyah'], ans: 0, exp: 'Green = Yeşil, Orange = Turuncu, Purple = Mor!' },
    { q: '"OPEN THE WINDOW, PLEASE!" diyen öğretmenimiz ne yapmamızı rica ediyor?', v: '🪟👋', opts: ['Lütfen pencereyi aç!', 'Lütfen kapıyı kapat!', 'Lütfen tahtayı sil!'], ans: 0, exp: 'Open = Açmak, Window = Pencere, Please = Lütfen!' },
    { q: '"DOG - FISH - RABBIT" evcil hayvanlarının Türkçesi nedir?', v: '🐶 🐟 🐰', opts: ['Köpek - Balık - Tavşan', 'Kedi - Kaplumbağa - Kuş', 'At - İnek - Ördek'], ans: 0, exp: 'Dog = Köpek, Fish = Balık, Rabbit = Tavşan!' },
    { q: 'İngilizcede "WHAT IS YOUR NAME?" sorusu ne anlama gelir?', v: '🙋‍♂️💬', opts: ['Senin adın ne?', 'Kaç yaşındasın?', 'Nerelisin?'], ans: 0, exp: '"What is your name?" = Senin adın ne? → "My name is ..."' },
    { q: '"NOSE - MOUTH - HEAD" vücut bölümlerinin Türkçesi sırasıyla hangisidir?', v: '👃 👄 🙂', opts: ['Burun - Ağız - Baş', 'Göz - Kulak - Kol', 'El - Ayak - Diz'], ans: 0, exp: 'Nose = Burun, Mouth = Ağız, Head = Baş/Kafa!' },
    { q: 'Meyvelerden "STRAWBERRY - LEMON - WATERMELON" hangileridir?', v: '🍓 🍋 🍉', opts: ['Çilek - Limon - Karpuz', 'Elma - Armut - Muz', 'Üzüm - Şeftali - Kiraz'], ans: 0, exp: 'Strawberry = Çilek, Lemon = Limon, Watermelon = Karpuz!' },
    { q: '"ONE, TWO, THREE, FOUR, FIVE" sayılarının toplamı kaç eder?', v: '🔢 1+2+3+4+5', opts: ['15 (Fifteen)', '10 (Ten)', '12 (Twelve)'], ans: 0, exp: '1 + 2 + 3 + 4 + 5 = 15 eder!' },
    { q: '"ELEPHANT is BIG, MOUSE is SMALL." cümlesinin anlamı nedir?', v: '🐘 & 🐭', opts: ['Fil büyüktür, fare küçüktür.', 'Fil hızlıdır, fare yavaştır.', 'Fil mavidir, fare sarıdır.'], ans: 0, exp: 'Big = Büyük, Small = Küçük!' }
  ]
};
