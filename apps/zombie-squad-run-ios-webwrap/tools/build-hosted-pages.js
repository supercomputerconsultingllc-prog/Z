const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const supportSource = path.resolve(root, '../zombie-squad-run/release/SUPPORT.md');
const privacySource = path.resolve(root, '../zombie-squad-run/release/PRIVACY.md');
const outDir = path.join(root, 'release/hosted-pages');

function read(file) {
  return fs.readFileSync(file, 'utf8').trim();
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function markdownToHtml(md) {
  const lines = md.split(/\r?\n/);
  const html = [];
  let inList = false;
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      if (inList) {
        html.push('</ul>');
        inList = false;
      }
      continue;
    }
    if (line.startsWith('# ')) {
      if (inList) { html.push('</ul>'); inList = false; }
      html.push(`<h1>${escapeHtml(line.slice(2))}</h1>`);
      continue;
    }
    if (line.startsWith('## ')) {
      if (inList) { html.push('</ul>'); inList = false; }
      html.push(`<h2>${escapeHtml(line.slice(3))}</h2>`);
      continue;
    }
    if (line.startsWith('- ')) {
      if (!inList) {
        html.push('<ul>');
        inList = true;
      }
      html.push(`<li>${escapeHtml(line.slice(2))}</li>`);
      continue;
    }
    html.push(`<p>${escapeHtml(line)}</p>`);
  }
  if (inList) html.push('</ul>');
  return html.join('\n');
}

function page(title, body) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <style>
    :root { color-scheme: dark; }
    body { margin: 0; font-family: system-ui, sans-serif; background: #0b1220; color: #e5e7eb; }
    main { max-width: 860px; margin: 0 auto; padding: 40px 20px 80px; }
    h1, h2 { line-height: 1.1; }
    h1 { font-size: 2.2rem; }
    h2 { margin-top: 2rem; }
    p, li { color: #cbd5e1; line-height: 1.6; }
    .brand { display: inline-block; margin-bottom: 18px; padding: 6px 12px; border-radius: 999px; background: rgba(34, 197, 94, 0.14); color: #86efac; font-weight: 700; }
    .card { background: rgba(15, 23, 42, 0.9); border: 1px solid rgba(148, 163, 184, 0.18); border-radius: 20px; padding: 28px; }
    a { color: #7dd3fc; }
  </style>
</head>
<body>
  <main>
    <div class="brand">Zombie Squad Run</div>
    <section class="card">
${body}
    </section>
  </main>
</body>
</html>`;
}

fs.mkdirSync(path.join(outDir, 'support'), { recursive: true });
fs.mkdirSync(path.join(outDir, 'privacy'), { recursive: true });
fs.writeFileSync(path.join(outDir, 'support', 'index.html'), page('Zombie Squad Run Support', markdownToHtml(read(supportSource))));
fs.writeFileSync(path.join(outDir, 'privacy', 'index.html'), page('Zombie Squad Run Privacy Policy', markdownToHtml(read(privacySource))));
console.log(`Wrote hosted pages to ${outDir}`);
