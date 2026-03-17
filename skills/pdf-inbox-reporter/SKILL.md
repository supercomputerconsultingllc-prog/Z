---
name: pdf-inbox-reporter
description: Summarize PDF documents from the workspace inbox and save Markdown reports in the workspace reports folder. Use when asked to review, summarize, catalog, or process one or more PDFs in `workspace/inbox`, especially when the desired output is a `.md` file in `workspace/reports` for each PDF.
---

# PDF Inbox Reporter

Summarize PDFs from `workspace/inbox` into Markdown files in `workspace/reports`.

## Workflow

1. Find PDF files under `workspace/inbox`.
2. Run `scripts/extract_pdf_text.py` on each PDF to collect metadata and extracted text.
3. If extraction succeeds, write one Markdown summary per PDF into `workspace/reports`.
4. If extraction fails because PDF tooling is unavailable, tell the user exactly what is missing instead of pretending the summary was completed.

## Expected output

Create one Markdown file per PDF using the source filename:

- Source: `workspace/inbox/Quarterly Plan.pdf`
- Output: `workspace/reports/Quarterly Plan.md`

Use this structure:

```markdown
# <document title or filename>

- Source file: `workspace/inbox/...pdf`
- Generated: <ISO timestamp>
- Pages: <page count if known>

## Executive summary

A concise 1-3 paragraph summary of the document.

## Key points

- Bullet 1
- Bullet 2
- Bullet 3

## Action items

- Action item or `None identified`

## Important details

- Dates, names, decisions, deliverables, or metrics worth preserving.
```

## Extraction script

Use `scripts/extract_pdf_text.py` first.

Example:

```bash
python3 skills/pdf-inbox-reporter/scripts/extract_pdf_text.py workspace/inbox/file.pdf
```

The script prints JSON with:

- `pdf_path`
- `page_count`
- `title`
- `author`
- `text`
- `error` if extraction failed

## Requirements and fallback

The extraction script supports these backends, in order:

1. `pypdf`
2. `PyPDF2`

If neither library is installed, stop and report that PDF extraction support is missing. Do not invent summaries from filenames alone.

## Writing guidance

- Prefer concise summaries over page-by-page paraphrase.
- Preserve uncertainty: if the PDF is scanned or extraction is poor, say so.
- If text is very long, summarize the most important themes, decisions, dates, and action items.
- If the PDF appears to be a form, invoice, paper, or slide deck, adapt the summary to that document type.
- Keep reports useful for later search and skimming.
