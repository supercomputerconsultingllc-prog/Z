export class AudioDirector {
  constructor(settings) {
    this.settings = settings;
    this.ctx = null;
    this.musicTimer = null;
    this.musicStep = 0;
    this.active = new Set();
  }

  ensure() {
    if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (this.ctx.state === 'suspended') this.ctx.resume().catch(() => {});
    return this.ctx;
  }

  volume(channel = 'effects') {
    const master = this.settings.masterVolume / 100;
    const local = this.settings[channel === 'music' ? 'musicVolume' : 'effectsVolume'] / 100;
    return Math.max(0, Math.min(1, master * local));
  }

  tone(freq = 220, duration = .08, type = 'square', gain = .2, slide = 0) {
    if (this.volume('effects') <= 0) return;
    const ctx = this.ensure();
    const osc = ctx.createOscillator();
    const amp = ctx.createGain();
    const now = ctx.currentTime;
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(20, freq + slide), now + duration);
    amp.gain.setValueAtTime(Math.max(.0001, gain * this.volume('effects')), now);
    amp.gain.exponentialRampToValueAtTime(.0001, now + duration);
    osc.connect(amp).connect(ctx.destination);
    osc.start(now); osc.stop(now + duration);
    this.active.add(osc);
    osc.onended = () => this.active.delete(osc);
  }

  shot(weapon) {
    const map = {
      rifle: [165, .045, 'square', .11, -45], shotgun: [105, .11, 'sawtooth', .18, -65],
      sniper: [240, .16, 'square', .2, -150], minigun: [190, .035, 'square', .07, -20],
      flame: [75, .07, 'sawtooth', .07, 20], tesla: [720, .12, 'sine', .12, -350],
      freeze: [520, .11, 'triangle', .1, 180], grenade: [92, .16, 'sawtooth', .18, -50]
    };
    this.tone(...(map[weapon] || map.rifle));
  }

  hit(kind = 'normal') {
    if (kind === 'crit') this.tone(520, .055, 'square', .11, 240);
    else if (kind === 'kill') this.tone(95, .08, 'sawtooth', .08, -30);
    else this.tone(245, .025, 'square', .045, -35);
  }

  loot() { this.tone(660, .09, 'sine', .1, 220); setTimeout(() => this.tone(880, .12, 'sine', .08, 160), 75); }
  hurt() { this.tone(72, .18, 'sawtooth', .16, -28); }
  boss() { this.tone(55, .55, 'sawtooth', .18, 45); }
  mission() { [440, 660, 880].forEach((f, i) => setTimeout(() => this.tone(f, .12, 'triangle', .1, 80), i * 90)); }

  startMusic() {
    if (this.musicTimer || this.volume('music') <= 0) return;
    const sequence = [55, 55, 65.4, 55, 73.4, 65.4, 49, 55];
    this.musicTimer = setInterval(() => {
      if (this.volume('music') <= 0) return;
      const ctx = this.ensure();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const now = ctx.currentTime;
      osc.type = 'triangle';
      osc.frequency.value = sequence[this.musicStep++ % sequence.length];
      gain.gain.setValueAtTime(.06 * this.volume('music'), now);
      gain.gain.exponentialRampToValueAtTime(.0001, now + .42);
      osc.connect(gain).connect(ctx.destination);
      osc.start(); osc.stop(now + .45);
    }, 430);
  }

  stopMusic() {
    clearInterval(this.musicTimer);
    this.musicTimer = null;
  }

  updateSettings(settings) {
    this.settings = settings;
    if (this.volume('music') <= 0) this.stopMusic();
  }

  dispose() {
    this.stopMusic();
    for (const node of this.active) { try { node.stop(); } catch {} }
    this.active.clear();
  }
}
