/* ============================================================================
   06-RENDER2D.JS — CANLI PORTRELER, 2D HİKÂYE KİTABI GÖRÜNÜMÜ VE DİPLOMA ÇİZİCİ
   8 Karakterin Birebir İkonik Detayları + Menteşeli Gaga / Çene / Burun Altı Ağız
   ============================================================================ */

const R2D = {
  drawPortrait(cv, charId, t, custom = {}) {
    if (!cv) return;
    const c = cv.getContext('2d');
    const w = cv.width, h = cv.height;
    c.clearRect(0, 0, w, h);

    const bgMap = {
      rakun: ['#d4ecff', '#9ad0ff'],
      vudi: ['#fff2cc', '#ffd97d'],
      palyaco: ['#f3dcff', '#d5a6ff'],
      karga: ['#e0dcf8', '#b8b0eb'],
      trex: ['#dcfae0', '#9be8a8'],
      ejderha: ['#ffe4d1', '#ffb88c'],
      godzilla: ['#d4f5ff', '#8ce0ff'],
      kurt: ['#e6eaf0', '#bcc6d6']
    };
    const [b0, b1] = bgMap[charId] || bgMap.rakun;
    const grd = c.createRadialGradient(w * 0.5, h * 0.45, 10, w * 0.5, h * 0.5, w * 0.65);
    grd.addColorStop(0, b0);
    grd.addColorStop(1, b1);
    c.fillStyle = grd;
    c.fillRect(0, 0, w, h);

    const mouth = AudioSys.mouthOpenFor(charId, t);
    c.save();
    c.translate(w * 0.5, h * 0.78);
    const pScale = charId === 'godzilla' ? 0.95 : charId === 'trex' ? 1.05 : 1.25;
    c.scale(pScale, pScale);
    this.drawChar2D(c, charId, 0, 0, t, false, mouth, custom, true);
    c.restore();
  },

  drawChar2D(c, id, x, y, t, moving, mouthOpen, custom = {}, portrait = false) {
    const def = CHARACTERS[id] || CHARACTERS.rakun;
    const sc = portrait ? 1 : (def.scale || 1) * 0.92;
    const bob = moving ? Math.abs(Math.sin(t * 11)) * 4 : Math.sin(t * 2.8 + x * 0.02) * 1.6;

    c.save();
    c.translate(x, y - bob);
    c.scale(sc, sc);

    if (!portrait) {
      c.fillStyle = 'rgba(20,34,66,0.22)';
      c.beginPath();
      c.ellipse(0, bob + 4, 22, 9, 0, 0, TAU);
      c.fill();
    }

    c.lineWidth = 2.6;
    c.strokeStyle = '#231c35';

    if (id === 'rakun') {
      const coat = custom.coatHex || '#1e3566';
      // Striped tail
      c.save();
      c.rotate(Math.sin(t * 6) * 0.18 - 0.35);
      c.fillStyle = '#7d8491';
      c.beginPath(); c.ellipse(-22, -10, 16, 8, 0, 0, TAU); c.fill(); c.stroke();
      c.fillStyle = '#2a2d38';
      c.fillRect(-26, -15, 6, 10);
      c.restore();
      // Navy Police Coat + Gold Star
      c.fillStyle = coat;
      c.beginPath(); c.roundRect(-16, -34, 32, 30, 9); c.fill(); c.stroke();
      c.fillStyle = '#ffd233';
      c.beginPath(); c.arc(7, -22, 5, 0, TAU); c.fill(); c.stroke();
      // Head + Bandit Mask
      c.fillStyle = '#858d9c';
      c.beginPath(); c.ellipse(0, -52, 20, 17, 0, 0, TAU); c.fill(); c.stroke();
      // Ears
      c.fillStyle = '#2a2d38';
      c.beginPath(); c.moveTo(-16, -63); c.lineTo(-9, -76); c.lineTo(-3, -65); c.closePath(); c.fill(); c.stroke();
      c.beginPath(); c.moveTo(16, -63);  c.lineTo(9, -76);  c.lineTo(3, -65);  c.closePath(); c.fill(); c.stroke();
      // Mask
      c.fillStyle = '#262936';
      c.beginPath(); c.ellipse(-8, -53, 8, 5.5, -0.1, 0, TAU); c.fill();
      c.beginPath(); c.ellipse(8, -53, 8, 5.5, 0.1, 0, TAU); c.fill();
      // Eyes
      c.fillStyle = '#fff';
      c.beginPath(); c.arc(-7, -53, 3.6, 0, TAU); c.arc(7, -53, 3.6, 0, TAU); c.fill();
      c.fillStyle = '#111';
      c.beginPath(); c.arc(-7, -53, 1.8, 0, TAU); c.arc(7, -53, 1.8, 0, TAU); c.fill();
      // Snout + Locked Under-Nose Mouth
      c.fillStyle = '#f5f6fa';
      c.beginPath(); c.ellipse(0, -44, 8, 5.5, 0, 0, TAU); c.fill(); c.stroke();
      c.fillStyle = '#161820';
      c.beginPath(); c.arc(0, -47, 2.8, 0, TAU); c.fill();
      c.fillStyle = '#b8253c';
      c.beginPath(); c.roundRect(-4.5, -42, 9, 2 + mouthOpen * 5.5, 2.5); c.fill();
      // Police Cap
      if ((custom.hat || 'cap') !== 'none_hat') {
        c.fillStyle = (custom.hat === 'crown') ? '#ffd226' : coat;
        c.beginPath(); c.roundRect(-16, -74, 32, 11, 5); c.fill(); c.stroke();
        c.fillStyle = '#111c38';
        c.beginPath(); c.ellipse(0, -64, 18, 4, 0, 0, Math.PI); c.fill();
        c.fillStyle = '#ffd233';
        c.beginPath(); c.arc(0, -69, 3.5, 0, TAU); c.fill();
      }
    } else if (id === 'vudi') {
      // Vudi Woodpecker: Red crest, navy vest, hinged yellow beak!
      c.fillStyle = '#2c6be0';
      c.beginPath(); c.ellipse(0, -22, 14, 16, 0, 0, TAU); c.fill(); c.stroke();
      c.fillStyle = '#1b3160';
      c.beginPath(); c.roundRect(-13, -28, 26, 16, 6); c.fill(); c.stroke();
      c.fillStyle = '#ffd233';
      c.beginPath(); c.arc(5, -21, 3.2, 0, TAU); c.fill();
      // Head + Red Crest
      c.fillStyle = '#2c6be0';
      c.beginPath(); c.arc(0, -45, 14, 0, TAU); c.fill(); c.stroke();
      c.fillStyle = '#f02828';
      c.beginPath(); c.moveTo(-4, -57); c.lineTo(-12, -73); c.lineTo(3, -64); c.lineTo(10, -72); c.lineTo(8, -56); c.closePath(); c.fill(); c.stroke();
      c.fillStyle = '#fff';
      c.beginPath(); c.arc(-5, -47, 4.2, 0, TAU); c.arc(5, -47, 4.2, 0, TAU); c.fill();
      c.fillStyle = '#111';
      c.beginPath(); c.arc(-5, -47, 2, 0, TAU); c.arc(5, -47, 2, 0, TAU); c.fill();
      // Hinged Yellow Beak!
      c.fillStyle = '#ffbe1e';
      c.beginPath(); c.moveTo(-4, -43); c.lineTo(19, -42 - mouthOpen * 3); c.lineTo(-2, -39); c.closePath(); c.fill(); c.stroke();
      c.fillStyle = '#e09600';
      c.beginPath(); c.moveTo(-3, -39); c.lineTo(17, -36 + mouthOpen * 7); c.lineTo(-3, -35 + mouthOpen * 3); c.closePath(); c.fill(); c.stroke();
    } else if (id === 'palyaco') {
      // Doktor Palyaço: White lab coat, rainbow hair, giant bowtie, red ball nose + locked under-nose mouth!
      c.fillStyle = '#f8f9ff';
      c.beginPath(); c.roundRect(-18, -36, 36, 33, 8); c.fill(); c.stroke();
      // Rainbow Hair Puffs
      const hairs = [['#ff55b8', -20, -55], ['#39d47a', 20, -55], ['#9c4dff', -14, -67], ['#29b6f6', 14, -67]];
      for (const [hc, hx, hy] of hairs) {
        c.fillStyle = hc;
        c.beginPath(); c.arc(hx, hy, 10, 0, TAU); c.fill(); c.stroke();
      }
      // Face
      c.fillStyle = '#fff5f7';
      c.beginPath(); c.arc(0, -52, 17, 0, TAU); c.fill(); c.stroke();
      // Giant Bowtie
      c.fillStyle = '#ffbe1a';
      c.beginPath(); c.moveTo(0, -34); c.lineTo(-15, -40); c.lineTo(-15, -28); c.closePath(); c.fill(); c.stroke();
      c.fillStyle = '#ff55b8';
      c.beginPath(); c.moveTo(0, -34); c.lineTo(15, -40); c.lineTo(15, -28); c.closePath(); c.fill(); c.stroke();
      // Eyes + Red Ball Nose + Locked Under-Nose Mouth
      c.fillStyle = '#221833';
      c.beginPath(); c.arc(-6, -56, 2.8, 0, TAU); c.arc(6, -56, 2.8, 0, TAU); c.fill();
      c.fillStyle = '#ff1e2d';
      c.beginPath(); c.arc(0, -50, 5.8, 0, TAU); c.fill(); c.stroke();
      c.fillStyle = '#8c0d22';
      c.beginPath(); c.roundRect(-7, -43, 14, 2.8 + mouthOpen * 7, 3); c.fill(); c.stroke();
    } else if (id === 'karga') {
      c.fillStyle = '#252636';
      c.beginPath(); c.ellipse(0, -24, 15, 17, 0, 0, TAU); c.fill(); c.stroke();
      c.fillStyle = '#e62e3a';
      c.beginPath(); c.roundRect(-14, -36, 28, 7, 4); c.fill(); c.stroke();
      c.fillStyle = '#252636';
      c.beginPath(); c.arc(0, -48, 14, 0, TAU); c.fill(); c.stroke();
      // Purple Beret
      c.fillStyle = '#863bff';
      c.beginPath(); c.ellipse(2, -60, 16, 6, -0.15, 0, TAU); c.fill(); c.stroke();
      c.fillStyle = '#fff59d';
      c.beginPath(); c.arc(-5, -50, 3.4, 0, TAU); c.arc(5, -50, 3.4, 0, TAU); c.fill();
      c.fillStyle = '#111';
      c.beginPath(); c.arc(-5, -50, 1.6, 0, TAU); c.arc(5, -50, 1.6, 0, TAU); c.fill();
      c.fillStyle = '#e0a92b';
      c.beginPath(); c.moveTo(-3, -46); c.lineTo(16, -44 - mouthOpen * 2); c.lineTo(-2, -41); c.closePath(); c.fill(); c.stroke();
      c.beginPath(); c.moveTo(-2, -41); c.lineTo(14, -38 + mouthOpen * 6); c.lineTo(-2, -37 + mouthOpen * 3); c.closePath(); c.fill(); c.stroke();
    } else if (id === 'trex') {
      c.fillStyle = '#4cc95b';
      c.beginPath(); c.ellipse(0, -28, 20, 22, 0, 0, TAU); c.fill(); c.stroke();
      c.fillStyle = '#b9f27c';
      c.beginPath(); c.ellipse(3, -26, 12, 16, 0, 0, TAU); c.fill();
      // Tiny arms
      c.fillStyle = '#4cc95b';
      c.fillRect(12, -32, 9, 5); c.strokeRect(12, -32, 9, 5);
      // Big head + hinged jaw
      c.beginPath(); c.roundRect(-16, -64, 34, 18, 7); c.fill(); c.stroke();
      c.fillStyle = '#3aa849';
      c.beginPath(); c.roundRect(-13, -46 + mouthOpen * 6, 30, 9, 5); c.fill(); c.stroke();
      c.fillStyle = '#fff';
      c.beginPath(); c.arc(-5, -64, 6, 0, TAU); c.arc(7, -64, 6, 0, TAU); c.fill(); c.stroke();
      c.fillStyle = '#111';
      c.beginPath(); c.arc(-4, -64, 2.5, 0, TAU); c.arc(8, -64, 2.5, 0, TAU); c.fill();
    } else if (id === 'ejderha') {
      // Cute wings
      c.fillStyle = '#ff8e3c';
      c.beginPath(); c.ellipse(-20, -34, 10, 6, -0.4, 0, TAU); c.fill(); c.stroke();
      c.beginPath(); c.ellipse(20, -34, 10, 6, 0.4, 0, TAU); c.fill(); c.stroke();
      c.fillStyle = '#f25c29';
      c.beginPath(); c.ellipse(0, -26, 18, 20, 0, 0, TAU); c.fill(); c.stroke();
      c.fillStyle = '#ffd24c';
      c.beginPath(); c.ellipse(0, -24, 11, 14, 0, 0, TAU); c.fill();
      c.fillStyle = '#f25c29';
      c.beginPath(); c.arc(0, -52, 16, 0, TAU); c.fill(); c.stroke();
      // Smoke puffs from nostrils!
      const pf = (t * 2) % 1;
      c.fillStyle = `rgba(240,245,255,${(1 - pf) * 0.75})`;
      c.beginPath(); c.arc(12 + pf * 10, -54 - pf * 14, 4 + pf * 5, 0, TAU); c.fill();
      c.fillStyle = '#fff';
      c.beginPath(); c.arc(-5, -56, 4.2, 0, TAU); c.arc(5, -56, 4.2, 0, TAU); c.fill();
      c.fillStyle = '#111';
      c.beginPath(); c.arc(-5, -56, 2, 0, TAU); c.arc(5, -56, 2, 0, TAU); c.fill();
      c.fillStyle = '#ffd24c';
      c.beginPath(); c.roundRect(-9, -43 + mouthOpen * 5, 18, 6, 3); c.fill(); c.stroke();
    } else if (id === 'godzilla') {
      // Blue glowing dorsal spikes
      c.fillStyle = '#33d6ff';
      for (let i = 0; i < 3; i++) {
        c.beginPath();
        c.moveTo(-16, -24 - i * 13);
        c.lineTo(-29, -30 - i * 13);
        c.lineTo(-15, -35 - i * 13);
        c.closePath(); c.fill(); c.stroke();
      }
      c.fillStyle = '#3b5856';
      c.beginPath(); c.ellipse(0, -30, 22, 25, 0, 0, TAU); c.fill(); c.stroke();
      c.fillStyle = '#6c8f88';
      c.beginPath(); c.ellipse(2, -28, 13, 18, 0, 0, TAU); c.fill();
      c.fillStyle = '#3b5856';
      c.beginPath(); c.roundRect(-16, -66, 32, 18, 6); c.fill(); c.stroke();
      c.fillStyle = '#6c8f88';
      c.beginPath(); c.roundRect(-14, -48 + mouthOpen * 6, 28, 8, 4); c.fill(); c.stroke();
      c.fillStyle = '#fff59d';
      c.beginPath(); c.arc(-5, -59, 4, 0, TAU); c.arc(7, -59, 4, 0, TAU); c.fill();
      c.fillStyle = '#111';
      c.beginPath(); c.arc(-5, -59, 1.8, 0, TAU); c.arc(7, -59, 1.8, 0, TAU); c.fill();
    } else if (id === 'kurt') {
      c.fillStyle = '#22252e';
      c.beginPath(); c.roundRect(-15, -34, 30, 29, 8); c.fill(); c.stroke();
      c.fillStyle = '#d92938';
      c.beginPath(); c.roundRect(-14, -37, 28, 7, 3); c.fill(); c.stroke();
      c.fillStyle = '#858d99';
      c.beginPath(); c.arc(0, -52, 16, 0, TAU); c.fill(); c.stroke();
      c.beginPath(); c.moveTo(-14, -62); c.lineTo(-10, -78); c.lineTo(-2, -65); c.closePath(); c.fill(); c.stroke();
      c.beginPath(); c.moveTo(14, -62);  c.lineTo(10, -78);  c.lineTo(2, -65);  c.closePath(); c.fill(); c.stroke();
      c.fillStyle = '#ffeb7a';
      c.beginPath(); c.arc(-6, -55, 3.2, 0, TAU); c.arc(6, -55, 3.2, 0, TAU); c.fill();
      c.fillStyle = '#111';
      c.beginPath(); c.arc(-6, -55, 1.5, 0, TAU); c.arc(6, -55, 1.5, 0, TAU); c.fill();
      c.fillStyle = '#cfd5de';
      c.beginPath(); c.roundRect(-7, -49, 16, 7, 3); c.fill(); c.stroke();
      c.fillStyle = '#9e2438';
      c.beginPath(); c.roundRect(-5, -42, 12, 2.2 + mouthOpen * 5.5, 2); c.fill();
    }

    c.restore();
  },

  /* ---- 2D YEDEK DÜNYA ÇİZİMİ + 3D ÜZERİNDEKİ METİN ETİKETLERİ ---- */
  renderOverlayAnd2D(cv, stateObj) {
    const c = cv.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 1.65);
    const w = Math.max(1, Math.round(window.innerWidth * dpr));
    const h = Math.max(1, Math.round(window.innerHeight * dpr));
    if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; }
    c.clearRect(0, 0, w, h);

    if (stateObj.astroActive) return; // Astro 3D Galaxy uses its own Three.js canvas + HUD

    const use3D = R3D.ok && R3D.on;
    const t = stateObj.time;

    if (!use3D) {
      // Full 2D Storybook Camera & World Fallback
      c.save();
      c.fillStyle = stateObj.worldId === 'lab' ? '#2c1e4a' : '#4ba8ff';
      c.fillRect(0, 0, w, h);

      const camX = stateObj.mode === 'title' ? 1200 + Math.cos(t * 0.22) * 260 : (stateObj.seaActive ? (stateObj.sea.bx + stateObj.sea.kx) * 0.5 : stateObj.player.x);
      const camY = stateObj.mode === 'title' ? 900 + Math.sin(t * 0.22) * 180 : (stateObj.seaActive ? (stateObj.sea.by + stateObj.sea.ky) * 0.5 : stateObj.player.y);
      const zoom = Math.min(w / 1050, h / 720) * 0.95;

      c.translate(w * 0.5, h * 0.52);
      c.scale(zoom, zoom);
      c.translate(-camX, -camY);

      if (!stateObj.seaActive) {
        c.fillStyle = '#f5e1a4';
        c.beginPath(); c.roundRect(80, 120, 2240, 1560, 90); c.fill();
        c.fillStyle = stateObj.worldId === 'lab' ? '#48386b' : '#69cf61';
        c.beginPath(); c.roundRect(130, 160, 2140, 1480, 75); c.fill();
        c.fillStyle = '#edd39c';
        c.fillRect(260, 840, 1880, 120);
        c.fillRect(1140, 240, 120, 1320);

        for (const tr of (stateObj.worldDef.trees || [])) {
          c.fillStyle = '#36ad52';
          c.beginPath(); c.arc(tr.x, tr.y - 18, 28 * (tr.s || 1), 0, TAU); c.fill();
        }
        for (const b of (stateObj.worldDef.buildings || [])) {
          c.fillStyle = '#fff3d9';
          c.strokeStyle = '#243b6b';
          c.lineWidth = 4;
          c.beginPath(); c.roundRect(b.x - 68, b.y - 54, 136, 86, 14); c.fill(); c.stroke();
          c.fillStyle = '#243b6b';
          c.font = '800 15px Nunito, sans-serif';
          c.textAlign = 'center';
          c.fillText(b.label || '', b.x, b.y - 12);
        }
        for (const pad of (stateObj.pads || [])) {
          c.fillStyle = '#fff';
          c.strokeStyle = '#ffae00';
          c.lineWidth = 4;
          c.beginPath(); c.ellipse(pad.x, pad.y, 44, 28, 0, 0, TAU); c.fill(); c.stroke();
          c.fillStyle = '#1e2c4f';
          c.font = '900 18px Nunito, sans-serif';
          c.textAlign = 'center';
          c.fillText(pad.label, pad.x, pad.y + 6);
        }
        for (const it of (stateObj.items || [])) {
          if (it.taken) continue;
          c.font = '30px sans-serif';
          c.textAlign = 'center';
          c.fillText(it.icon || '💼', it.x, it.y);
        }
        for (const hz of (stateObj.hazards || [])) {
          c.fillStyle = hz.ring ? 'rgba(51,214,255,0.35)' : 'rgba(255,40,60,0.75)';
          c.beginPath(); c.arc(hz.x, hz.y, hz.ring ? hz.r : 18, 0, TAU); c.fill();
        }
        for (const npc of (stateObj.npcs || [])) {
          this.drawChar2D(c, npc.id, npc.x, npc.y, t, !!npc.moving, AudioSys.mouthOpenFor(npc.id, t));
        }
        this.drawChar2D(c, 'vudi', stateObj.vudi.x, stateObj.vudi.y, t, stateObj.vudi.moving, AudioSys.mouthOpenFor('vudi', t));
        this.drawChar2D(c, 'rakun', stateObj.player.x, stateObj.player.y, t, stateObj.player.moving, AudioSys.mouthOpenFor('rakun', t), stateObj.wardrobe);
      } else {
        const S = stateObj.sea;
        c.fillStyle = '#1e3a73';
        c.beginPath(); c.roundRect(S.bx - 34, S.by - 48, 68, 96, 18); c.fill();
        this.drawChar2D(c, 'rakun', S.bx, S.by, t, false, 0, stateObj.wardrobe);
        c.fillStyle = '#8a5830';
        c.beginPath(); c.roundRect(S.kx - 34, S.ky - 40, 68, 80, 12); c.fill();
        this.drawChar2D(c, 'karga', S.kx, S.ky, t, false, 0);
        if (S.crate) {
          c.font = '32px sans-serif'; c.textAlign = 'center';
          c.fillText('📦', S.crate.x, S.crate.y);
        }
      }
      c.restore();
      return;
    }

    // In 3D Mode: Project crisp floating labels for Answer Cloud Pads, Buildings, NPC names, Sea Aiming Arc & Confetti onto cv2d!
    const drawPill = (sx, sy, txt, bg = 'rgba(255,253,245,0.92)', fg = '#1e3566', fs = 16) => {
      c.save();
      c.font = `900 ${Math.round(fs * dpr)}px Nunito, sans-serif`;
      const tw = c.measureText(txt).width;
      const pw = tw + 22 * dpr, ph = (fs + 13) * dpr;
      c.fillStyle = bg;
      c.strokeStyle = '#1e3566';
      c.lineWidth = 2.6 * dpr;
      c.beginPath();
      c.roundRect(sx - pw / 2, sy - ph / 2, pw, ph, 999);
      c.fill();
      c.stroke();
      c.fillStyle = fg;
      c.textAlign = 'center';
      c.textBaseline = 'middle';
      c.fillText(txt, sx, sy + 1);
      c.restore();
    };

    if (stateObj.mode !== 'title') {
      // Building signs
      for (const b of (stateObj.worldDef.buildings || [])) {
        if (!b.label || stateObj.seaActive) continue;
        const p2 = R3D.project(b.x, 128, b.y, w, h);
        if (p2 && p2.x > 40 && p2.x < w - 40 && p2.y > 40 && p2.y < h - 40) {
          drawPill(p2.x, p2.y, b.label, 'rgba(30,53,102,0.88)', '#ffd233', 13);
        }
      }

      // Answer Cloud Pad Labels (Chapters 5 & 11!)
      for (const pad of (stateObj.pads || [])) {
        const p2 = R3D.project(pad.x, 26, pad.y, w, h);
        if (p2) {
          drawPill(p2.x, p2.y, pad.label, '#fff7cc', '#18284c', 20);
        }
      }

      // NPC Nameplate when close
      if (!stateObj.seaActive) {
        for (const npc of (stateObj.npcs || [])) {
          const dist = Math.hypot(npc.x - stateObj.player.x, npc.y - stateObj.player.y);
          if (dist < 380 || npc.marker) {
            const p2 = R3D.project(npc.x, 76 * (CHARACTERS[npc.id]?.scale || 1), npc.y, w, h);
            if (p2) {
              const tag = (npc.marker ? '❗ ' : '') + (CHARACTERS[npc.id]?.name || npc.id);
              drawPill(p2.x, p2.y, tag, npc.marker ? '#ffdd33' : 'rgba(255,255,255,0.88)', '#1e3566', 14);
            }
          }
        }
      }

      // Sea Cannon Aiming Arc & Crate Marker (Chapter 8!)
      if (stateObj.seaActive) {
        const S = stateObj.sea;
        if (S.crate) {
          const cp = R3D.project(S.crate.x, 34, S.crate.y, w, h);
          if (cp) drawPill(cp.x, cp.y, '📦 Soru Sandığı!', '#ffdd33', '#1e3566', 15);
        }
        if (S.loaded) {
          const bp = R3D.project(S.bx, 48, S.by, w, h);
          if (bp) drawPill(bp.x, bp.y, '🎯 Top Dolu! Ekranda Sürükle veya Boşluk ile Ateş Et!', '#3ecb68', '#ffffff', 15);
        }
        if (S.aiming) {
          const steps = 8;
          for (let i = 1; i <= steps; i++) {
            const u = i / steps;
            const ax = S.bx + (S.aimX - S.bx) * u;
            const ay = S.by + (S.aimY - S.by) * u;
            const az = 18 + Math.sin(u * Math.PI) * 95;
            const sp = R3D.project(ax, az, ay, w, h);
            if (sp) {
              c.fillStyle = i === steps ? '#3ecb68' : '#ffdd33';
              c.beginPath();
              c.arc(sp.x, sp.y, (i === steps ? 16 : 6) * dpr, 0, TAU);
              c.fill();
            }
          }
        }
      }
    }

    // Floating Confetti & Popups (works in all modes!)
    for (const cf of (stateObj.confetti || [])) {
      c.save();
      c.translate(cf.x * dpr, cf.y * dpr);
      c.rotate(cf.rot);
      c.fillStyle = cf.col;
      c.fillRect(-5 * dpr, -3 * dpr, 10 * dpr, 6 * dpr);
      c.restore();
    }
  },

  /* ---- YÜKSEK ÇÖZÜNÜRLÜKLÜ BAŞKOMİSER BAŞARI DİPLOMASI ---- */
  renderCertificate(cv, save) {
    const c = cv.getContext('2d');
    const w = cv.width, h = cv.height;

    const g = c.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, '#fffdf2');
    g.addColorStop(1, '#ffefc2');
    c.fillStyle = g;
    c.fillRect(0, 0, w, h);

    // Ornate Navy & Gold Border
    c.strokeStyle = '#1e3566';
    c.lineWidth = 18;
    c.strokeRect(28, 28, w - 56, h - 56);
    c.strokeStyle = '#ffbe1a';
    c.lineWidth = 6;
    c.strokeRect(46, 46, w - 92, h - 92);

    c.fillStyle = '#1e3566';
    c.font = '900 46px Fredoka, Nunito, sans-serif';
    c.textAlign = 'center';
    c.fillText('★ BAŞKOMİSER & GALAKSİ KAHRAMANI DİPLOMASI ★', w / 2, 122);

    c.fillStyle = '#d96b16';
    c.font = '800 24px Nunito, sans-serif';
    c.fillText('ŞAPŞAL KAHRAMANLAR AKADEMİSİ · MEB 2. SINIF TÜM DERSLER & ASTRO GALAKSİ', w / 2, 166);

    c.fillStyle = '#2b2340';
    c.font = '900 54px Fredoka, Nunito, sans-serif';
    c.fillText(save.playerName || 'Cesur Dedektif', w / 2, 250);

    c.font = '700 24px Nunito, sans-serif';
    c.fillStyle = '#3c3556';
    const stars = (save.completedChapters || []).length;
    c.fillText(`Tamamlanan Bölüm: ${stars} / 20   |   Doğru Cevap: ${save.totalCorrect || 0}   |   Kurtarılan 3D Dost: ${(save.rescuedBots || []).length}`, w / 2, 305);
    c.fillText(`Toplanan Altın: ${save.coins || 0} 🪙   |   Gizli İpuçları: ${(save.secrets || []).length} / 8 🔍`, w / 2, 344);

    // Draw cast of heroes along the diploma!
    const cast = ['rakun', 'vudi', 'trex', 'ejderha', 'godzilla', 'kurt', 'palyaco', 'karga'];
    cast.forEach((id, idx) => {
      const cx = 145 + idx * 130;
      c.save();
      c.translate(cx, 545);
      c.scale(1.18, 1.18);
      this.drawChar2D(c, id, 0, 0, 1.2, false, 0.15, save.wardrobe || {}, true);
      c.restore();
      c.fillStyle = '#1e3566';
      c.font = '800 15px Nunito, sans-serif';
      c.fillText(CHARACTERS[id].name, cx, 585);
    });

    // Gold Seal & Date
    c.fillStyle = '#ffbe1a';
    c.beginPath(); c.arc(w / 2, 685, 52, 0, TAU); c.fill();
    c.strokeStyle = '#b87400'; c.lineWidth = 5; c.stroke();
    c.fillStyle = '#1e3566';
    c.font = '900 20px Fredoka, sans-serif';
    c.fillText('ONAYLI', w / 2, 682);
    c.fillText('BAŞKOMİSER', w / 2, 704);

    const dt = new Date().toLocaleDateString('tr-TR');
    c.fillStyle = '#4a4366';
    c.font = '800 20px Nunito, sans-serif';
    c.textAlign = 'left';
    c.fillText(`Tarih: ${dt}`, 85, 715);
    c.textAlign = 'right';
    c.fillText('İmza: Komiser Rakun & Yardımcı Vudi', w - 85, 715);
  }
};
