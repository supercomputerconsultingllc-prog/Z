import {
  VERSION, WIDTH, HEIGHT, LANES, MODES, WEAPONS, ENEMIES, MISSION_TEMPLATES,
  SKILL_TREES, LOOT
} from './config.js';
import { loadProfile, saveProfile, loadSettings, saveSettings, exportSave, importSave } from './storage.js';
import { AudioDirector } from './audio.js';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
const rand = (min, max) => min + Math.random() * (max - min);
const chance = (p) => Math.random() < p;

class ZombieMayhemV2 {
  constructor() {
    this.canvas = $('#gameCanvas');
    this.ctx = this.canvas.getContext('2d', { alpha: false });
    this.overlay = $('#overlay');
    this.profile = loadProfile();
    this.settings = loadSettings();
    this.audio = new AudioDirector(this.settings);
    this.mode = 'campaign';
    this.selectedWeapon = 'rifle';
    this.lastFrame = performance.now();
    this.fpsFrames = 0;
    this.fpsTime = 0;
    this.currentFps = 60;
    this.adaptiveQuality = 'high';
    this.frameHandle = 0;
    this.boundLoop = (time) => this.loop(time);
    this.resetRun(false);
    this.bindUi();
    this.applySettings();
    this.renderWeaponGrid();
    this.renderSkillTrees();
    this.refreshProfileSummary();
    this.render();
    this.frameHandle = requestAnimationFrame(this.boundLoop);
    window.__zombieV2 = {
      version: VERSION,
      snapshot: () => this.publicSnapshot(),
      start: () => this.startRun(),
      pause: () => this.togglePause()
    };
  }

  skill(id) { return Number(this.profile.skills[id] || 0); }
  modeConfig() { return MODES[this.mode]; }
  weapon() { return WEAPONS[this.selectedWeapon]; }

  bonuses() {
    return {
      startSquad: this.skill('command_squad') * 2,
      damage: 1 + this.skill('command_focus') * .04 + this.skill('heavy_damage') * .06,
      crit: this.skill('heavy_crit') * .03,
      revives: this.skill('command_revive'),
      startArmor: this.skill('medic_armor') * 12,
      recovery: this.skill('medic_recovery'),
      resist: clamp(this.skill('medic_resist') * .05, 0, .45),
      credits: 1 + this.skill('scavenger_credit') * .08,
      luck: this.skill('scavenger_luck') * .08,
      mastery: 1 + this.skill('scavenger_mastery') * .10,
      overdrive: 1 + this.skill('engineer_overdrive') * .12,
      explosive: 1 + this.skill('engineer_explosive') * .08,
      freeze: 1 + this.skill('engineer_freeze') * .10,
      heat: 1 - this.skill('heavy_heat') * .08
    };
  }

  resetRun(showTitle = true) {
    const b = this.bonuses?.() || { startSquad: 0, startArmor: 0, revives: 0 };
    this.state = {
      running: false,
      paused: true,
      gameOver: false,
      time: 0,
      distance: 0,
      wave: 1,
      lane: 1,
      squad: 8 + (b.startSquad || 0),
      armor: b.startArmor || 0,
      credits: 0,
      kills: 0,
      eliteKills: 0,
      bosses: 0,
      fireTimer: 0,
      spawnTimer: 0,
      overdrive: 100,
      overdriveUntil: 0,
      heat: 0,
      revives: 1 + (b.revives || 0),
      runDamage: 1,
      runLuck: 0,
      upgradePoints: 0,
      nextWaveDistance: 250,
      enemies: [],
      bullets: [],
      particles: [],
      decals: [],
      pickups: [],
      enemyProjectiles: [],
      shake: 0,
      weather: Math.random() < .45 ? 'rain' : 'clear',
      missionIndex: 0,
      mission: null,
      missionValue: 0,
      missionBase: 0,
      boss: null,
      bossQueued: false,
      feedUntil: 0,
      dailyModifier: this.dailyModifier(),
      qualityDrops: 0
    };
    this.setMission(0);
    if (showTitle) this.showTitle();
    this.syncHud();
  }

  dailyModifier() {
    const day = Math.floor(Date.now() / 86400000);
    return ['None', 'Fast Horde', 'Armored Night', 'Double Loot', 'Elite Surge'][day % 5];
  }

  bindUi() {
    $('#startBtn').addEventListener('click', () => this.startRun());
    $('#pauseBtn').addEventListener('click', () => this.togglePause());
    $('#settingsBtn').addEventListener('click', () => this.showSettings());
    $('#skillsBtn').addEventListener('click', () => this.showSkills());
    $('#saveToolsBtn').addEventListener('click', () => this.showSaveTools());
    $('#leftBtn').addEventListener('pointerdown', () => this.changeLane(-1));
    $('#rightBtn').addEventListener('pointerdown', () => this.changeLane(1));
    $('#abilityBtn').addEventListener('pointerdown', () => this.activateOverdrive());

    $$('#modeGrid button').forEach((button) => button.addEventListener('click', () => {
      this.mode = button.dataset.mode;
      $$('#modeGrid button').forEach((item) => item.classList.toggle('selected', item === button));
    }));

    $$('.upgrade-grid button').forEach((button) => button.addEventListener('click', () => this.buyRunUpgrade(button.dataset.upgrade)));

    window.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') this.changeLane(-1);
      if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') this.changeLane(1);
      if (event.key === ' ' || event.key.toLowerCase() === 'e') { event.preventDefault(); this.activateOverdrive(); }
      if (event.key.toLowerCase() === 'p' || event.key === 'Escape') this.togglePause();
      const index = Number(event.key) - 1;
      const keys = Object.keys(WEAPONS);
      if (index >= 0 && keys[index]) this.selectWeapon(keys[index]);
    });

    this.canvas.addEventListener('pointerdown', (event) => {
      if (!this.state.running || this.state.paused) return;
      const rect = this.canvas.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width * WIDTH;
      const nearest = LANES.reduce((best, laneX, index) => Math.abs(laneX - x) < Math.abs(LANES[best] - x) ? index : best, 0);
      this.state.lane = nearest;
    });

    window.addEventListener('beforeunload', () => {
      saveProfile(this.profile);
      saveSettings(this.settings);
      this.audio.dispose();
    });
  }

  startRun() {
    this.audio.ensure();
    this.resetRun(false);
    this.state.running = true;
    this.state.paused = false;
    this.overlay.classList.remove('active');
    this.audio.startMusic();
    this.feed(`Mode: ${this.modeConfig().label} · ${this.state.dailyModifier}`, '#b7f34a', 2400);
  }

  showTitle() {
    this.state.paused = true;
    this.audio.stopMusic();
    this.overlay.innerHTML = '';
    const original = $('#titlePanel');
    if (original) this.overlay.appendChild(original);
    else { location.reload(); return; }
    this.overlay.classList.add('active');
    this.refreshProfileSummary();
  }

  togglePause() {
    if (!this.state.running || this.state.gameOver) return;
    if (!this.state.paused) {
      this.state.paused = true;
      this.audio.stopMusic();
      this.overlay.innerHTML = `
        <section class="modal hero">
          <span class="eyebrow">RUN PAUSED</span><h2>Hold the line</h2>
          <p>Distance ${Math.floor(this.state.distance)}m · Wave ${this.state.wave} · ${this.state.kills} kills</p>
          <div class="modal-actions">
            <button id="resumeRun" class="primary">Resume</button>
            <button id="restartRun">Restart</button>
            <button id="quitRun">Title Screen</button>
          </div>
        </section>`;
      this.overlay.classList.add('active');
      $('#resumeRun').onclick = () => this.togglePause();
      $('#restartRun').onclick = () => this.startRun();
      $('#quitRun').onclick = () => { this.finishRun(false); this.showTitle(); };
    } else {
      this.state.paused = false;
      this.overlay.classList.remove('active');
      this.audio.startMusic();
    }
  }

  showSettings() {
    const panel = $('#settingsTemplate').content.cloneNode(true);
    this.overlay.innerHTML = '';
    this.overlay.append(panel);
    this.overlay.classList.add('active');
    const master = $('#masterVolume', this.overlay);
    const music = $('#musicVolume', this.overlay);
    const effects = $('#effectsVolume', this.overlay);
    const quality = $('#qualitySelect', this.overlay);
    const reduced = $('#reducedMotion', this.overlay);
    const contrast = $('#highContrast', this.overlay);
    const flashes = $('#damageFlashes', this.overlay);
    master.value = this.settings.masterVolume;
    music.value = this.settings.musicVolume;
    effects.value = this.settings.effectsVolume;
    quality.value = this.settings.quality;
    reduced.checked = this.settings.reducedMotion;
    contrast.checked = this.settings.highContrast;
    flashes.checked = this.settings.damageFlashes;
    const update = () => {
      Object.assign(this.settings, {
        masterVolume: Number(master.value), musicVolume: Number(music.value), effectsVolume: Number(effects.value),
        quality: quality.value, reducedMotion: reduced.checked, highContrast: contrast.checked, damageFlashes: flashes.checked
      });
      saveSettings(this.settings);
      this.audio.updateSettings(this.settings);
      this.applySettings();
    };
    [master, music, effects, quality, reduced, contrast, flashes].forEach((input) => input.addEventListener('input', update));
    $('[data-close]', this.overlay).onclick = () => this.closeModal();
  }

  showSkills() {
    const panel = $('#skillsTemplate').content.cloneNode(true);
    $('#skillTrees', panel).innerHTML = this.skillTreeMarkup();
    this.overlay.innerHTML = '';
    this.overlay.append(panel);
    this.overlay.classList.add('active');
    $$('[data-skill]', this.overlay).forEach((button) => button.onclick = () => this.buySkill(button.dataset.skill));
    $('[data-close]', this.overlay).onclick = () => this.closeModal();
  }

  showSaveTools() {
    const panel = $('#saveToolsTemplate').content.cloneNode(true);
    this.overlay.innerHTML = '';
    this.overlay.append(panel);
    this.overlay.classList.add('active');
    const area = $('#saveData', this.overlay);
    $('#exportSave', this.overlay).onclick = () => { area.value = exportSave(this.profile, this.settings); area.select(); };
    $('#importSave', this.overlay).onclick = () => {
      try {
        const data = importSave(area.value);
        this.profile = data.profile; this.settings = data.settings;
        this.audio.updateSettings(this.settings); this.applySettings(); this.refreshProfileSummary();
        area.value = 'Import successful.';
      } catch (error) { area.value = `Import failed: ${error.message}`; }
    };
    $('[data-close]', this.overlay).onclick = () => this.closeModal();
  }

  closeModal() {
    this.overlay.classList.remove('active');
    if (!this.state.running) location.reload();
    else if (this.state.paused) this.togglePause();
  }

  applySettings() {
    document.body.classList.toggle('reduced-motion', this.settings.reducedMotion);
    document.body.classList.toggle('high-contrast', this.settings.highContrast);
    $('#weatherLayer').className = `weather-layer ${this.settings.reducedMotion ? '' : this.state.weather}`;
  }

  renderSkillTrees() { this.refreshProfileSummary(); }

  skillTreeMarkup() {
    return Object.values(SKILL_TREES).map((tree) => `
      <section class="skill-tree"><h3>${tree.label}</h3>${tree.nodes.map((node) => {
        const level = this.skill(node.id);
        return `<button data-skill="${node.id}" ${level >= node.max || this.profile.skillPoints <= 0 ? 'disabled' : ''}>
          <b>${node.name} ${level}/${node.max}</b><small>${node.detail}</small>
        </button>`;
      }).join('')}</section>`).join('');
  }

  buySkill(id) {
    const node = Object.values(SKILL_TREES).flatMap((tree) => tree.nodes).find((item) => item.id === id);
    if (!node || this.profile.skillPoints <= 0 || this.skill(id) >= node.max) return;
    this.profile.skills[id] = this.skill(id) + 1;
    this.profile.skillPoints -= 1;
    saveProfile(this.profile);
    this.showSkills();
  }

  renderWeaponGrid() {
    const host = $('#weaponGrid');
    host.innerHTML = Object.entries(WEAPONS).map(([id, weapon], index) => {
      const unlocked = this.profile.unlockedWeapons.includes(id) || this.profile.accountLevel >= weapon.unlock;
      if (unlocked && !this.profile.unlockedWeapons.includes(id)) this.profile.unlockedWeapons.push(id);
      const mastery = Math.floor(this.profile.mastery[id] || 0);
      return `<button data-weapon="${id}" class="${id === this.selectedWeapon ? 'selected' : ''}" ${unlocked ? '' : 'disabled'}>
        <i>${index + 1}</i><b>${weapon.name}</b><span>${unlocked ? weapon.subtitle : `Unlock Lv. ${weapon.unlock}`}</span>
        <span>Mastery ${mastery}</span>
      </button>`;
    }).join('');
    $$('[data-weapon]', host).forEach((button) => button.onclick = () => this.selectWeapon(button.dataset.weapon));
    saveProfile(this.profile);
  }

  selectWeapon(id) {
    if (!WEAPONS[id]) return;
    const unlocked = this.profile.unlockedWeapons.includes(id) || this.profile.accountLevel >= WEAPONS[id].unlock;
    if (!unlocked) return;
    this.selectedWeapon = id;
    this.renderWeaponGrid();
    this.feed(`${WEAPONS[id].name} equipped`, WEAPONS[id].color, 900);
  }

  buyRunUpgrade(type) {
    if (!this.state.running || this.state.upgradePoints <= 0) return;
    this.state.upgradePoints--;
    if (type === 'damage') this.state.runDamage *= 1.12;
    if (type === 'squad') this.state.squad += 2;
    if (type === 'armor') this.state.armor += 22;
    if (type === 'luck') this.state.runLuck += .12;
    this.feed(`${type[0].toUpperCase() + type.slice(1)} upgraded`, '#b7f34a');
    this.syncHud();
  }

  changeLane(direction) {
    if (!this.state.running || this.state.paused) return;
    this.state.lane = clamp(this.state.lane + direction, 0, LANES.length - 1);
  }

  activateOverdrive() {
    if (!this.state.running || this.state.paused || this.state.overdrive < 100) return;
    const duration = 5500 * this.bonuses().overdrive;
    this.state.overdrive = 0;
    this.state.overdriveUntil = performance.now() + duration;
    this.feed('OVERDRIVE ENGAGED', '#f6d365', 1600);
    this.audio.mission();
  }

  setMission(index) {
    const template = MISSION_TEMPLATES[index % MISSION_TEMPLATES.length];
    const scale = 1 + Math.floor(index / MISSION_TEMPLATES.length) * .35;
    const target = Math.max(1, Math.round(template.target * scale));
    this.state.missionIndex = index;
    this.state.mission = { ...template, target, reward: Math.round(template.reward * scale) };
    this.state.missionValue = 0;
    this.state.missionBase = this.missionMetric(template.type);
    this.syncMission();
  }

  missionMetric(type) {
    if (type === 'kills') return this.state.kills;
    if (type === 'distance') return Math.floor(this.state.distance);
    if (type === 'elite') return this.state.eliteKills;
    if (type === 'credits') return this.state.credits;
    if (type === 'survive') return Math.floor(this.state.time);
    if (type === 'boss') return this.state.bosses;
    return 0;
  }

  updateMission() {
    const mission = this.state.mission;
    this.state.missionValue = Math.max(0, this.missionMetric(mission.type) - this.state.missionBase);
    if (this.state.missionValue >= mission.target) {
      this.state.credits += mission.reward;
      this.state.upgradePoints += 1;
      this.gainAccountXp(55 + mission.reward * .1);
      this.audio.mission();
      this.feed(`MISSION COMPLETE +${mission.reward}`, '#b7f34a', 2200);
      this.setMission(this.state.missionIndex + 1);
    }
    this.syncMission();
  }

  spawnEnemy(forcedType = null, lane = null) {
    const waveScale = 1 + (this.state.wave - 1) * .13;
    let type = forcedType;
    if (!type) {
      const available = Object.entries(ENEMIES).filter(([id]) => id !== 'boss' && this.state.wave >= this.enemyUnlockWave(id));
      let total = available.reduce((sum, [, enemy]) => sum + enemy.weight, 0);
      let roll = Math.random() * total;
      for (const [id, enemy] of available) { roll -= enemy.weight; if (roll <= 0) { type = id; break; } }
      type ||= 'walker';
    }
    const base = ENEMIES[type];
    const isElite = type !== 'boss' && chance(Math.min(.03 + this.state.wave * .006, .22));
    const armoredNight = this.state.dailyModifier === 'Armored Night' ? 1.22 : 1;
    const chosenLane = lane ?? Math.floor(Math.random() * LANES.length);
    const enemy = {
      id: crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`,
      type, name: base.name, lane: chosenLane, x: LANES[chosenLane], y: -base.size - rand(0, 90),
      hp: base.hp * waveScale * (isElite ? 1.75 : 1), maxHp: base.hp * waveScale * (isElite ? 1.75 : 1),
      armor: (base.armor || 0) * armoredNight * waveScale,
      speed: base.speed * this.modeConfig().speed * (isElite ? 1.08 : 1),
      damage: base.damage * (isElite ? 1.5 : 1), reward: base.reward * (isElite ? 2 : 1),
      size: base.size * (isElite ? 1.12 : 1), color: base.color, elite: isElite,
      status: {}, attackTimer: rand(1.2, 2.4), summonTimer: rand(4.5, 7.5), phase: 1, ...base
    };
    if (type === 'boss') {
      enemy.y = -100;
      this.state.boss = enemy;
      this.state.bossQueued = false;
      this.audio.boss();
      this.feed('BOSS INCOMING', '#fb5b5b', 2400);
    }
    this.state.enemies.push(enemy);
  }

  enemyUnlockWave(type) {
    return ({ walker: 1, runner: 1, crawler: 2, armored: 3, spitter: 3, exploder: 4, screamer: 5, leader: 5, tank: 6 })[type] || 1;
  }

  fireWeapon(now) {
    const weapon = this.weapon();
    const overdrive = now < this.state.overdriveUntil;
    const cooldown = weapon.cooldown / (overdrive ? 1.9 : 1);
    if (this.state.fireTimer > 0 || (weapon.heat && this.state.heat >= 100)) return;
    this.state.fireTimer = cooldown / 1000;
    if (weapon.heat) this.state.heat += 4.8 * this.bonuses().heat;
    this.audio.shot(this.selectedWeapon);
    const originX = LANES[this.state.lane];
    for (let i = 0; i < weapon.shots; i++) {
      const offset = weapon.shots === 1 ? 0 : (i - (weapon.shots - 1) / 2) * weapon.spread;
      this.state.bullets.push({
        x: originX + rand(-5, 5), y: HEIGHT - 115, vx: Math.sin(offset) * weapon.speed,
        vy: -Math.cos(offset) * weapon.speed,
        damage: weapon.damage * this.bonuses().damage * this.state.runDamage * (overdrive ? 1.3 : 1),
        radius: weapon.explosive ? 7 : weapon.status === 'flame' ? 8 : 3, color: weapon.color,
        crit: clamp(weapon.crit + this.bonuses().crit, 0, .75), pierce: weapon.pierce,
        knockback: weapon.knockback, status: weapon.status,
        explosive: (weapon.explosive || 0) * this.bonuses().explosive,
        chain: weapon.chain || 0, life: 1.7, weapon: this.selectedWeapon
      });
    }
    this.state.shake = Math.max(this.state.shake, weapon.explosive ? 8 : this.selectedWeapon === 'shotgun' ? 4 : 1.5);
    this.spawnParticles(originX, HEIGHT - 120, weapon.color, weapon.shots + 2, 120);
  }

  update(dt, now) {
    if (!this.state.running || this.state.paused || this.state.gameOver) return;
    const cfg = this.modeConfig();
    this.state.time += dt;
    this.state.distance += dt * 34 * cfg.speed;
    this.state.fireTimer = Math.max(0, this.state.fireTimer - dt);
    this.state.spawnTimer -= dt;
    this.state.heat = Math.max(0, this.state.heat - dt * 20);
    if (this.state.overdrive < 100 && now >= this.state.overdriveUntil) this.state.overdrive = Math.min(100, this.state.overdrive + dt * 6);

    if (this.state.distance >= this.state.nextWaveDistance) {
      this.state.wave++;
      this.state.nextWaveDistance += 250 + this.state.wave * 12;
      this.state.upgradePoints++;
      this.state.squad += this.bonuses().recovery;
      this.feed(`WAVE ${this.state.wave}`, '#53c5ff', 1300);
      if (this.state.wave % cfg.bossEvery === 0) this.state.bossQueued = true;
    }

    if (cfg.targetDistance && this.state.distance >= cfg.targetDistance) {
      this.feed('EXTRACTION COMPLETE', '#b7f34a', 2500);
      this.finishRun(true);
      return;
    }

    if (this.state.bossQueued && !this.state.boss) this.spawnEnemy('boss', 1);
    const fastModifier = this.state.dailyModifier === 'Fast Horde' ? 1.22 : 1;
    const eliteModifier = this.state.dailyModifier === 'Elite Surge' ? .75 : 1;
    if (this.state.spawnTimer <= 0 && !this.state.boss) {
      const interval = clamp(1.05 - this.state.wave * .035, .25, 1.05) / cfg.spawn / fastModifier * eliteModifier;
      this.state.spawnTimer = interval;
      const count = this.state.wave >= 8 && chance(.25) ? 2 : 1;
      for (let i = 0; i < count; i++) this.spawnEnemy();
    }

    this.fireWeapon(now);
    this.updateBullets(dt);
    this.updateEnemies(dt);
    this.updateEnemyProjectiles(dt);
    this.updateParticles(dt);
    this.updatePickups(dt);
    this.updateMission();
    this.checkAchievements();
    this.syncHud();
  }

  updateBullets(dt) {
    for (const bullet of this.state.bullets) {
      bullet.x += bullet.vx * dt; bullet.y += bullet.vy * dt; bullet.life -= dt;
      for (const enemy of this.state.enemies) {
        if (enemy.dead || bullet.dead) continue;
        if (Math.hypot(enemy.x - bullet.x, enemy.y - bullet.y) <= enemy.size + bullet.radius) this.hitEnemy(enemy, bullet);
      }
    }
    this.state.bullets = this.state.bullets.filter((b) => !b.dead && b.life > 0 && b.y > -80 && b.x > -80 && b.x < WIDTH + 80);
  }

  hitEnemy(enemy, bullet, chainDepth = 0) {
    const crit = chance(bullet.crit);
    let damage = bullet.damage * (crit ? 2 : 1);
    if (enemy.armor > 0) {
      const absorbed = Math.min(enemy.armor, damage * .55);
      enemy.armor -= absorbed;
      damage -= absorbed;
    }
    enemy.hp -= damage;
    enemy.y -= bullet.knockback * .12;
    if (bullet.status === 'burn') enemy.status.burn = Math.max(enemy.status.burn || 0, 3.5);
    if (bullet.status === 'freeze') enemy.status.freeze = Math.max(enemy.status.freeze || 0, 2.4 * this.bonuses().freeze);
    if (bullet.status === 'shock') enemy.status.shock = Math.max(enemy.status.shock || 0, 1.2);
    this.spawnParticles(bullet.x, bullet.y, crit ? '#fff7a8' : enemy.color, crit ? 9 : 4, crit ? 230 : 130);
    this.audio.hit(crit ? 'crit' : 'normal');
    this.addMastery(bullet.weapon, damage * .025);

    if (bullet.explosive) {
      this.state.shake = Math.max(this.state.shake, 11);
      for (const other of this.state.enemies) {
        if (other === enemy || other.dead) continue;
        const d = Math.hypot(other.x - enemy.x, other.y - enemy.y);
        if (d < bullet.explosive) other.hp -= bullet.damage * (1 - d / bullet.explosive) * .75;
      }
      this.spawnParticles(enemy.x, enemy.y, '#ff9d45', 22, 310);
    }

    if (bullet.chain && chainDepth < bullet.chain) {
      const next = this.state.enemies
        .filter((other) => other !== enemy && !other.dead && Math.hypot(other.x - enemy.x, other.y - enemy.y) < 190)
        .sort((a, b) => Math.hypot(a.x - enemy.x, a.y - enemy.y) - Math.hypot(b.x - enemy.x, b.y - enemy.y))[0];
      if (next) {
        this.state.particles.push({ x: enemy.x, y: enemy.y, tx: next.x, ty: next.y, life: .12, maxLife: .12, color: '#9d7bff', lightning: true });
        this.hitEnemy(next, { ...bullet, damage: bullet.damage * .65, chain: bullet.chain - 1, explosive: 0 }, chainDepth + 1);
      }
    }

    if (enemy.hp <= 0) this.killEnemy(enemy, bullet);
    if (bullet.pierce > 0) bullet.pierce--; else bullet.dead = true;
  }

  killEnemy(enemy, bullet) {
    if (enemy.dead) return;
    enemy.dead = true;
    this.audio.hit('kill');
    this.state.kills++;
    if (enemy.elite || enemy.boss) this.state.eliteKills++;
    if (enemy.boss) {
      this.state.bosses++;
      this.state.boss = null;
      this.feed('BOSS DEFEATED', '#f6d365', 2400);
    }
    const reward = Math.round(enemy.reward * this.modeConfig().reward * this.bonuses().credits * (this.state.dailyModifier === 'Double Loot' ? 2 : 1));
    this.state.credits += reward;
    this.profile.lifetimeKills++;
    this.profile.lifetimeCredits += reward;
    this.gainAccountXp(enemy.boss ? 230 : enemy.elite ? 34 : 7);
    this.spawnParticles(enemy.x, enemy.y, enemy.color, enemy.boss ? 70 : 18, enemy.boss ? 500 : 260);
    if (this.state.decals.length < 120) this.state.decals.push({ x: enemy.x, y: enemy.y, r: rand(5, enemy.size * .45), alpha: rand(.12, .28) });
    const lootChance = .06 + this.bonuses().luck + this.state.runLuck + (enemy.elite ? .22 : 0) + (enemy.boss ? 1 : 0);
    if (chance(Math.min(.9, lootChance))) this.dropLoot(enemy.x, enemy.y);
  }

  updateEnemies(dt) {
    const leaderPresent = this.state.enemies.some((enemy) => !enemy.dead && enemy.type === 'leader');
    for (const enemy of this.state.enemies) {
      if (enemy.dead) continue;
      let speed = enemy.speed * (leaderPresent && enemy.type !== 'leader' ? 1.12 : 1);
      if (enemy.status.freeze > 0) { enemy.status.freeze -= dt; speed *= .36; }
      if (enemy.status.shock > 0) { enemy.status.shock -= dt; speed *= .72; }
      if (enemy.status.burn > 0) {
        enemy.status.burn -= dt;
        enemy.hp -= dt * 13;
        if (chance(dt * 7)) this.spawnParticles(enemy.x, enemy.y, '#ff6b35', 1, 90);
        if (enemy.hp <= 0) { this.killEnemy(enemy, { weapon: this.selectedWeapon }); continue; }
      }
      if (enemy.weave) enemy.x = LANES[enemy.lane] + Math.sin(this.state.time * 5 + enemy.y * .02) * 42;
      enemy.y += speed * dt;

      if (enemy.ranged) {
        enemy.attackTimer -= dt;
        if (enemy.attackTimer <= 0 && enemy.y > 80 && enemy.y < HEIGHT - 230) {
          enemy.attackTimer = rand(1.6, 2.7);
          this.state.enemyProjectiles.push({ x: enemy.x, y: enemy.y + 15, vx: (LANES[this.state.lane] - enemy.x) * .5, vy: 260, damage: enemy.damage, life: 3 });
        }
      }
      if (enemy.summon) {
        enemy.summonTimer -= dt;
        if (enemy.summonTimer <= 0) {
          enemy.summonTimer = rand(5, 8);
          this.spawnEnemy('runner', clamp(enemy.lane - 1, 0, 2));
          this.spawnEnemy('walker', clamp(enemy.lane + 1, 0, 2));
          this.feed('SCREAMER CALLED REINFORCEMENTS', '#ed64a6', 1000);
        }
      }
      if (enemy.boss) this.updateBoss(enemy);
      if (enemy.y >= HEIGHT - 90) {
        enemy.dead = true;
        this.damageSquad(Math.max(1, Math.round(enemy.damage)), enemy.explode ? 2 : 1);
        if (enemy.explode) {
          this.state.shake = 16;
          this.spawnParticles(enemy.x, HEIGHT - 90, '#fb5b5b', 35, 380);
        }
      }
    }
    this.state.enemies = this.state.enemies.filter((enemy) => !enemy.dead);
  }

  updateBoss(enemy) {
    const healthPct = enemy.hp / enemy.maxHp;
    const phase = healthPct > .66 ? 1 : healthPct > .33 ? 2 : 3;
    if (phase !== enemy.phase) {
      enemy.phase = phase;
      enemy.speed *= 1.18;
      enemy.damage += 1;
      this.state.shake = 14;
      this.feed(`BOSS PHASE ${phase}`, '#fb5b5b', 1800);
      for (let i = 0; i < phase + 1; i++) this.spawnEnemy(phase === 3 ? 'runner' : 'walker');
    }
    enemy.x = LANES[1] + Math.sin(this.state.time * (1 + phase * .3)) * 150;
    $('#bossBar').classList.remove('hidden');
    $('#bossName').textContent = enemy.name;
    $('#bossPhase').textContent = `Phase ${phase}`;
    $('#bossHealth').style.width = `${clamp(healthPct * 100, 0, 100)}%`;
  }

  updateEnemyProjectiles(dt) {
    const targetX = LANES[this.state.lane];
    for (const shot of this.state.enemyProjectiles) {
      shot.x += shot.vx * dt; shot.y += shot.vy * dt; shot.life -= dt;
      if (shot.y > HEIGHT - 115 && Math.abs(shot.x - targetX) < 70) {
        shot.dead = true; this.damageSquad(shot.damage, 1);
      }
    }
    this.state.enemyProjectiles = this.state.enemyProjectiles.filter((shot) => !shot.dead && shot.life > 0);
  }

  damageSquad(damage, multiplier = 1) {
    let amount = Math.max(1, Math.round(damage * multiplier * (1 - this.bonuses().resist)));
    if (this.state.armor > 0) {
      const absorbed = Math.min(this.state.armor, amount * 7);
      this.state.armor -= absorbed;
      amount = Math.max(0, amount - Math.ceil(absorbed / 7));
    }
    this.state.squad -= amount;
    this.audio.hurt();
    this.state.shake = Math.max(this.state.shake, 12);
    if (this.settings.damageFlashes) {
      $('#damageFlash').style.background = 'rgba(255,0,0,.22)';
      setTimeout(() => { $('#damageFlash').style.background = 'rgba(255,0,0,0)'; }, 100);
    }
    if (this.state.squad <= 0) {
      if (this.state.revives > 0) {
        this.state.revives--;
        this.state.squad = 4 + this.bonuses().recovery;
        this.state.armor += 18;
        this.feed('LAST STAND REVIVE', '#f6d365', 1800);
      } else this.finishRun(false);
    }
  }

  dropLoot(x, y) {
    const total = LOOT.reduce((sum, item) => sum + item.weight, 0);
    let roll = Math.random() * total;
    let loot = LOOT[0];
    for (const item of LOOT) { roll -= item.weight; if (roll <= 0) { loot = item; break; } }
    this.state.pickups.push({ x, y, targetY: HEIGHT - 125, loot, life: 8 });
  }

  updatePickups(dt) {
    for (const pickup of this.state.pickups) {
      pickup.life -= dt;
      pickup.y += 105 * dt;
      if (pickup.y >= pickup.targetY) { pickup.dead = true; this.applyLoot(pickup.loot); }
    }
    this.state.pickups = this.state.pickups.filter((pickup) => !pickup.dead && pickup.life > 0);
  }

  applyLoot(loot) {
    if (loot.apply.credits) this.state.credits += loot.apply.credits;
    if (loot.apply.armor) this.state.armor += loot.apply.armor;
    if (loot.apply.damage) this.state.runDamage *= 1 + loot.apply.damage;
    if (loot.apply.squad) this.state.squad += loot.apply.squad;
    if (loot.apply.ability) this.state.overdrive = Math.min(100, this.state.overdrive + loot.apply.ability);
    this.audio.loot();
    this.feed(`${loot.rarity.toUpperCase()} LOOT: ${loot.name}`, loot.color, 1700);
  }

  addMastery(weapon, amount) {
    const b = this.bonuses();
    this.profile.mastery[weapon] = (this.profile.mastery[weapon] || 0) + amount * b.mastery;
    $('#weaponMastery').textContent = `Mastery ${Math.floor(this.profile.mastery[weapon])}`;
  }

  gainAccountXp(amount) {
    this.profile.accountXp += amount;
    let needed = this.profile.accountLevel * 220;
    while (this.profile.accountXp >= needed) {
      this.profile.accountXp -= needed;
      this.profile.accountLevel++;
      this.profile.skillPoints++;
      needed = this.profile.accountLevel * 220;
      this.feed(`ACCOUNT LEVEL ${this.profile.accountLevel}`, '#f6d365', 2200);
      this.audio.mission();
      this.renderWeaponGrid();
    }
  }

  checkAchievements() {
    const checks = {
      first_blood: [this.profile.lifetimeKills >= 1, 'First Blood'],
      exterminator: [this.profile.lifetimeKills >= 500, 'Exterminator'],
      road_warrior: [this.state.distance >= 1000, 'Road Warrior'],
      boss_breaker: [this.state.bosses >= 1, 'Boss Breaker'],
      rich_run: [this.state.credits >= 1000, 'Supply Baron']
    };
    for (const [id, [earned, title]] of Object.entries(checks)) {
      if (earned && !this.profile.achievements[id]) {
        this.profile.achievements[id] = true;
        this.profile.skillPoints++;
        this.feed(`ACHIEVEMENT: ${title}`, '#f6d365', 2000);
      }
    }
  }

  finishRun(victory) {
    if (this.state.gameOver) return;
    this.state.gameOver = true;
    this.state.paused = true;
    this.audio.stopMusic();
    const distance = Math.floor(this.state.distance);
    this.profile.bestDistance = Math.max(this.profile.bestDistance, distance);
    this.profile.dailyBest = Math.max(this.profile.dailyBest, distance);
    this.gainAccountXp(Math.floor(distance * .12 + this.state.kills * 2 + this.state.bosses * 100));
    saveProfile(this.profile);
    this.overlay.innerHTML = `
      <section class="modal hero">
        <span class="eyebrow">${victory ? 'MISSION ACCOMPLISHED' : 'RUN ENDED'}</span>
        <h2>${victory ? 'Extraction secured' : 'The horde broke through'}</h2>
        <div class="hero-summary">
          <span>Distance <b>${distance}m</b></span><span>Kills <b>${this.state.kills}</b></span>
          <span>Bosses <b>${this.state.bosses}</b></span><span>Credits <b>${this.state.credits}</b></span>
        </div>
        <p>Account Level ${this.profile.accountLevel} · Skill Points ${this.profile.skillPoints}</p>
        <div class="modal-actions"><button id="runAgain" class="primary">Run Again</button><button id="returnTitle">Title Screen</button></div>
      </section>`;
    this.overlay.classList.add('active');
    $('#runAgain').onclick = () => this.startRun();
    $('#returnTitle').onclick = () => location.reload();
  }

  spawnParticles(x, y, color, count, speed) {
    const quality = this.effectiveQuality();
    const scale = quality === 'high' ? 1 : quality === 'medium' ? .65 : .35;
    count = Math.max(1, Math.round(count * scale));
    for (let i = 0; i < count; i++) {
      const angle = rand(0, Math.PI * 2);
      const velocity = rand(speed * .3, speed);
      this.state.particles.push({ x, y, vx: Math.cos(angle) * velocity, vy: Math.sin(angle) * velocity, life: rand(.18, .7), maxLife: .7, size: rand(1, 4), color });
    }
    if (this.state.particles.length > 520) this.state.particles.splice(0, this.state.particles.length - 520);
  }

  updateParticles(dt) {
    for (const p of this.state.particles) {
      p.life -= dt;
      if (!p.lightning) { p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 210 * dt; }
    }
    this.state.particles = this.state.particles.filter((p) => p.life > 0);
  }

  effectiveQuality() {
    if (this.settings.quality !== 'auto') return this.settings.quality;
    return this.adaptiveQuality;
  }

  updateFps(dt) {
    this.fpsFrames++;
    this.fpsTime += dt;
    if (this.fpsTime >= 1) {
      this.currentFps = Math.round(this.fpsFrames / this.fpsTime);
      $('#fpsStat').textContent = `${this.currentFps} FPS`;
      if (this.settings.quality === 'auto') {
        if (this.currentFps < 42) this.adaptiveQuality = 'low';
        else if (this.currentFps < 54) this.adaptiveQuality = 'medium';
        else this.adaptiveQuality = 'high';
      }
      this.fpsFrames = 0; this.fpsTime = 0;
    }
  }

  loop(time) {
    const dt = clamp((time - this.lastFrame) / 1000, 0, .05);
    this.lastFrame = time;
    this.updateFps(dt);
    this.update(dt, time);
    this.render();
    this.frameHandle = requestAnimationFrame(this.boundLoop);
  }

  render() {
    const ctx = this.ctx;
    const quality = this.effectiveQuality();
    const shake = this.settings.reducedMotion ? 0 : this.state.shake;
    this.state.shake *= .87;
    ctx.save();
    ctx.translate(rand(-shake, shake), rand(-shake, shake));
    this.drawBackground(ctx, quality);
    this.drawDecals(ctx);
    this.drawPickups(ctx);
    this.drawEnemies(ctx);
    this.drawEnemyProjectiles(ctx);
    this.drawBullets(ctx);
    this.drawSquad(ctx);
    this.drawParticles(ctx);
    ctx.restore();
    $('#weatherLayer').className = `weather-layer ${this.settings.reducedMotion ? '' : this.state.weather}`;
    if (!this.state.boss) $('#bossBar').classList.add('hidden');
  }

  drawBackground(ctx, quality) {
    const gradient = ctx.createLinearGradient(0, 0, 0, HEIGHT);
    gradient.addColorStop(0, '#06130b'); gradient.addColorStop(.55, '#13251a'); gradient.addColorStop(1, '#263729');
    ctx.fillStyle = gradient; ctx.fillRect(-30, -30, WIDTH + 60, HEIGHT + 60);
    const scroll = this.state.distance * 3 % 140;
    if (quality !== 'low') {
      ctx.fillStyle = 'rgba(4,8,5,.55)';
      for (let i = -1; i < 9; i++) {
        const y = i * 140 + scroll;
        ctx.fillRect(0, y, 120, 65); ctx.fillRect(WIDTH - 120, y + 35, 120, 80);
      }
    }
    ctx.fillStyle = '#202b22'; ctx.fillRect(145, 0, WIDTH - 290, HEIGHT);
    ctx.strokeStyle = 'rgba(224,255,228,.13)'; ctx.lineWidth = 3; ctx.setLineDash([28, 38]); ctx.lineDashOffset = scroll;
    for (let i = 1; i < 3; i++) { ctx.beginPath(); ctx.moveTo((LANES[i - 1] + LANES[i]) / 2, 0); ctx.lineTo((LANES[i - 1] + LANES[i]) / 2, HEIGHT); ctx.stroke(); }
    ctx.setLineDash([]);
    if (quality === 'high') {
      ctx.fillStyle = 'rgba(194,255,210,.025)';
      for (let i = 0; i < 40; i++) ctx.fillRect((i * 83 + this.state.wave * 17) % WIDTH, (i * 137 + scroll) % HEIGHT, 2, 2);
    }
  }

  drawDecals(ctx) {
    for (const decal of this.state.decals) {
      ctx.fillStyle = `rgba(100,0,18,${decal.alpha})`;
      ctx.beginPath(); ctx.ellipse(decal.x, decal.y, decal.r * 1.6, decal.r, 0, 0, Math.PI * 2); ctx.fill();
    }
  }

  drawEnemies(ctx) {
    for (const enemy of this.state.enemies) {
      const flash = enemy.status.shock > 0 ? '#d8c7ff' : enemy.status.freeze > 0 ? '#b9ecff' : enemy.color;
      ctx.save(); ctx.translate(enemy.x, enemy.y);
      if (enemy.elite) { ctx.shadowColor = '#f6d365'; ctx.shadowBlur = 18; }
      if (enemy.boss) { ctx.shadowColor = '#fb5b9d'; ctx.shadowBlur = 26; }
      ctx.fillStyle = flash;
      ctx.beginPath(); ctx.arc(0, 0, enemy.size, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(0,0,0,.38)'; ctx.fillRect(-enemy.size * .55, -enemy.size * .2, enemy.size * 1.1, enemy.size * .9);
      ctx.fillStyle = enemy.type === 'spitter' ? '#b7f34a' : '#ff7070';
      ctx.beginPath(); ctx.arc(-enemy.size * .3, -enemy.size * .2, Math.max(2, enemy.size * .08), 0, Math.PI * 2); ctx.arc(enemy.size * .3, -enemy.size * .2, Math.max(2, enemy.size * .08), 0, Math.PI * 2); ctx.fill();
      if (enemy.armor > 0) { ctx.strokeStyle = '#a8b3bd'; ctx.lineWidth = 4; ctx.strokeRect(-enemy.size * .72, -enemy.size * .72, enemy.size * 1.44, enemy.size * 1.44); }
      ctx.restore();
      const hpPct = clamp(enemy.hp / enemy.maxHp, 0, 1);
      if (enemy.elite || enemy.boss || hpPct < .65) {
        ctx.fillStyle = 'rgba(0,0,0,.5)'; ctx.fillRect(enemy.x - enemy.size, enemy.y - enemy.size - 12, enemy.size * 2, 5);
        ctx.fillStyle = enemy.boss ? '#fb5b5b' : '#4ade80'; ctx.fillRect(enemy.x - enemy.size, enemy.y - enemy.size - 12, enemy.size * 2 * hpPct, 5);
      }
    }
  }

  drawSquad(ctx) {
    const x = LANES[this.state.lane];
    const count = Math.min(this.state.squad, 28);
    const columns = 7;
    for (let i = 0; i < count; i++) {
      const row = Math.floor(i / columns), col = i % columns;
      const px = x + (col - (columns - 1) / 2) * 17;
      const py = HEIGHT - 75 + row * 12;
      ctx.fillStyle = i === 0 ? '#f6d365' : '#d7f9de';
      ctx.beginPath(); ctx.arc(px, py, 6, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#203a29'; ctx.fillRect(px - 5, py + 5, 10, 12);
    }
    const overPct = this.state.overdrive / 100;
    ctx.fillStyle = 'rgba(0,0,0,.65)'; ctx.fillRect(x - 90, HEIGHT - 22, 180, 8);
    ctx.fillStyle = performance.now() < this.state.overdriveUntil ? '#f6d365' : '#53c5ff'; ctx.fillRect(x - 90, HEIGHT - 22, 180 * overPct, 8);
    if (this.state.heat > 0) { ctx.fillStyle = '#ff9d45'; ctx.fillRect(x - 90, HEIGHT - 10, 180 * clamp(this.state.heat / 100, 0, 1), 4); }
  }

  drawBullets(ctx) {
    for (const bullet of this.state.bullets) {
      ctx.strokeStyle = bullet.color; ctx.lineWidth = bullet.radius * 1.8; ctx.shadowColor = bullet.color; ctx.shadowBlur = 12;
      ctx.beginPath(); ctx.moveTo(bullet.x, bullet.y); ctx.lineTo(bullet.x - bullet.vx * .025, bullet.y - bullet.vy * .025); ctx.stroke(); ctx.shadowBlur = 0;
    }
  }

  drawEnemyProjectiles(ctx) {
    for (const shot of this.state.enemyProjectiles) {
      ctx.fillStyle = '#7cff63'; ctx.shadowColor = '#7cff63'; ctx.shadowBlur = 14;
      ctx.beginPath(); ctx.arc(shot.x, shot.y, 8, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
    }
  }

  drawParticles(ctx) {
    for (const p of this.state.particles) {
      const alpha = clamp(p.life / p.maxLife, 0, 1);
      ctx.globalAlpha = alpha;
      if (p.lightning) { ctx.strokeStyle = p.color; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.tx, p.ty); ctx.stroke(); }
      else { ctx.fillStyle = p.color; ctx.fillRect(p.x, p.y, p.size, p.size); }
    }
    ctx.globalAlpha = 1;
  }

  drawPickups(ctx) {
    for (const pickup of this.state.pickups) {
      ctx.fillStyle = pickup.loot.color; ctx.shadowColor = pickup.loot.color; ctx.shadowBlur = 18;
      ctx.beginPath(); ctx.arc(pickup.x, pickup.y, 10, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
    }
  }

  feed(text, color = '#fff', duration = 1100) {
    const feed = $('#combatFeed');
    feed.textContent = text; feed.style.color = color; feed.style.opacity = '1';
    clearTimeout(this.feedTimer);
    this.feedTimer = setTimeout(() => { feed.style.opacity = '0'; }, duration);
  }

  syncHud() {
    $('#squadStat').textContent = Math.max(0, Math.floor(this.state.squad));
    $('#armorStat').textContent = Math.max(0, Math.floor(this.state.armor));
    $('#waveStat').textContent = this.state.wave;
    $('#distanceStat').textContent = `${Math.floor(this.state.distance)}m`;
    $('#creditsStat').textContent = Math.floor(this.state.credits);
    $('#levelStat').textContent = this.profile.accountLevel;
    $('#upgradePoints').textContent = `${this.state.upgradePoints} points`;
    $('#modeLabel').textContent = this.modeConfig().label;
    $('#weaponMastery').textContent = `Mastery ${Math.floor(this.profile.mastery[this.selectedWeapon] || 0)}`;
    $$('.upgrade-grid button').forEach((button) => button.disabled = !this.state.running || this.state.upgradePoints <= 0);
    const effects = [];
    if (performance.now() < this.state.overdriveUntil) effects.push('Overdrive');
    if (this.state.weather === 'rain') effects.push('Rain');
    if (this.state.dailyModifier !== 'None') effects.push(this.state.dailyModifier);
    $('#effectList').innerHTML = effects.length ? effects.map((e) => `<span>${e}</span>`).join('') : '<span>None</span>';
  }

  syncMission() {
    const mission = this.state.mission;
    if (!mission) return;
    $('#missionTitle').textContent = mission.title;
    $('#missionText').textContent = mission.text.replace('{target}', mission.target);
    $('#missionReward').textContent = `+${mission.reward}`;
    $('#missionCount').textContent = `${Math.min(mission.target, Math.floor(this.state.missionValue))} / ${mission.target}`;
    $('#missionProgress').style.width = `${clamp(this.state.missionValue / mission.target * 100, 0, 100)}%`;
  }

  refreshProfileSummary() {
    $('#bestDistance').textContent = `${Math.floor(this.profile.bestDistance)}m`;
    $('#accountLevel').textContent = this.profile.accountLevel;
    $('#skillPoints').textContent = this.profile.skillPoints;
  }

  publicSnapshot() {
    return {
      version: VERSION, mode: this.mode, running: this.state.running, paused: this.state.paused,
      gameOver: this.state.gameOver, wave: this.state.wave, distance: Math.floor(this.state.distance),
      squad: Math.floor(this.state.squad), enemies: this.state.enemies.length, weapon: this.selectedWeapon,
      mission: this.state.mission?.type, fps: this.currentFps, quality: this.effectiveQuality()
    };
  }
}

new ZombieMayhemV2();
