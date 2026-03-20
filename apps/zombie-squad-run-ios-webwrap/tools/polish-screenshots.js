const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const ffmpeg = 'ffmpeg';
const shotsDir = path.join(root, 'release/store-assets/assets/screenshots/iphone');
const polishedDir = path.join(shotsDir, 'polished');
fs.mkdirSync(polishedDir, { recursive: true });

const shots = [
  { file: '01-title-screen.png', title: 'Build Your Squad', subtitle: 'Recruit survivors and start every run stronger.' },
  { file: '02-mid-run-action.png', title: 'Shoot The Right Lane', subtitle: 'Tap fast, clear threats, and stack your numbers.' },
  { file: '03-wall-encounter.png', title: 'Break Walls Before Impact', subtitle: 'Crush barriers or lose squad members on contact.' },
  { file: '04-upgrade-shop.png', title: 'Upgrade Firepower And Revives', subtitle: 'Spend coins on bigger guns and survival insurance.' },
  { file: '05-revive-or-high-wave.png', title: 'Push To Higher Waves', subtitle: 'Revive, recover, and chase your best distance.' }
];

for (const shot of shots) {
  const input = path.join(shotsDir, shot.file);
  const output = path.join(polishedDir, shot.file);
  if (!fs.existsSync(input)) throw new Error(`Missing screenshot: ${input}`);

  const filter = [
    "drawbox=x=0:y=0:w=iw:h=340:color=black@0.42:t=fill",
    "drawbox=x=58:y=70:w=320:h=12:color=0x22c55e@1:t=fill",
    `drawtext=fontcolor=white:fontsize=110:x=58:y=108:text='${shot.title.replace(/:/g, '\\:').replace(/'/g, "\\'")}'`,
    `drawtext=fontcolor=0xcbd5e1:fontsize=52:x=58:y=240:text='${shot.subtitle.replace(/:/g, '\\:').replace(/'/g, "\\'")}'`,
    "drawbox=x=0:y=2470:w=iw:h=326:color=0x0b1220@0.68:t=fill",
    "drawtext=fontcolor=0x86efac:fontsize=64:x=58:y=2518:text='Zombie Squad Run'",
    "drawtext=fontcolor=white:fontsize=46:x=58:y=2604:text='Fast lane shooter. Squad upgrades. Brutal walls.'"
  ].join(',');

  execFileSync(ffmpeg, ['-y', '-i', input, '-vf', filter, '-frames:v', '1', '-update', '1', output], { stdio: 'inherit' });
}

console.log(`Polished screenshots written to ${polishedDir}`);
