#!/usr/bin/env python3
import json
import re
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
SKILL_DIR = Path(__file__).resolve().parent.parent
EXTRACT = SKILL_DIR / 'scripts' / 'extract_pdf_text.py'
INBOX = ROOT / 'inbox'
REPORTS = ROOT / 'reports'


def clean_lines(text: str):
    lines = [re.sub(r'\s+', ' ', ln).strip() for ln in text.splitlines()]
    lines = [ln for ln in lines if ln]
    deduped = []
    seen = set()
    for ln in lines:
        key = ln.lower()
        if key in seen:
            continue
        seen.add(key)
        deduped.append(ln)
    return deduped


def first_sentences(text: str, limit=6):
    chunks = re.split(r'(?<=[.!?])\s+', re.sub(r'\s+', ' ', text).strip())
    out = []
    for c in chunks:
        c = c.strip()
        if len(c) < 25:
            continue
        out.append(c)
        if len(out) >= limit:
            break
    return out


def find_important_details(lines):
    pats = [r'\b\d{4}-\d{2}-\d{2}\b', r'\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\b', r'\$\d[\d,]*(?:\.\d+)?', r'\b\d+(?:\.\d+)?%\b']
    details = []
    for ln in lines:
        if any(re.search(p, ln, re.I) for p in pats):
            details.append(ln)
        if len(details) >= 8:
            break
    return details


def bulletize(items, fallback):
    return items if items else [fallback]


def summarize_pdf(pdf_path: Path):
    proc = subprocess.run([sys.executable, str(EXTRACT), str(pdf_path)], capture_output=True, text=True)
    try:
        data = json.loads(proc.stdout or '{}')
    except Exception:
        data = {'error': 'invalid extractor output'}

    if proc.returncode != 0:
        return False, data

    text = data.get('text', '') or ''
    lines = clean_lines(text)
    title = data.get('title') or pdf_path.stem
    executive = first_sentences(text, limit=5)
    key_points = bulletize(lines[:6], 'No extractable key points found.')
    details = bulletize(find_important_details(lines), 'No specific dates, amounts, or metrics detected.')

    md = []
    md.append(f'# {title}')
    md.append('')
    md.append(f'- Source file: `{pdf_path.relative_to(ROOT)}`')
    md.append(f'- Generated: {datetime.now(timezone.utc).isoformat()}')
    md.append(f'- Pages: {data.get("page_count", "unknown")}')
    if data.get('author'):
        md.append(f'- Author: {data["author"]}')
    md.append('')
    md.append('## Executive summary')
    md.append('')
    if executive:
        md.append(' '.join(executive))
    else:
        md.append('The PDF text was extracted, but a strong narrative summary could not be inferred automatically from the content.')
    md.append('')
    md.append('## Key points')
    md.append('')
    for item in key_points[:8]:
        md.append(f'- {item}')
    md.append('')
    md.append('## Action items')
    md.append('')
    action_lines = [ln for ln in lines if re.search(r'\b(action|next step|todo|due|deadline|required|must|follow up)\b', ln, re.I)]
    for item in bulletize(action_lines[:6], 'None identified'):
        md.append(f'- {item}')
    md.append('')
    md.append('## Important details')
    md.append('')
    for item in details[:8]:
        md.append(f'- {item}')
    md.append('')

    REPORTS.mkdir(parents=True, exist_ok=True)
    out_path = REPORTS / f'{pdf_path.stem}.md'
    out_path.write_text('\n'.join(md), encoding='utf-8')
    return True, {'pdf_path': str(pdf_path), 'report_path': str(out_path)}


def main():
    pdfs = sorted([p for p in INBOX.rglob('*') if p.is_file() and p.suffix.lower() == '.pdf'])
    if not pdfs:
        print(json.dumps({'ok': True, 'processed': 0, 'reports': [], 'message': 'no PDFs found in inbox'}))
        return 0

    reports = []
    errors = []
    for pdf in pdfs:
        ok, payload = summarize_pdf(pdf)
        if ok:
            reports.append(payload)
        else:
            errors.append(payload)

    print(json.dumps({'ok': len(errors) == 0, 'processed': len(pdfs), 'reports': reports, 'errors': errors}, ensure_ascii=False))
    return 0 if not errors else 1


if __name__ == '__main__':
    raise SystemExit(main())
