#!/usr/bin/env python3
import json
import sys
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
SKILL_DIR = SCRIPT_DIR.parent
VENDOR_DIR = SKILL_DIR / 'vendor'
if VENDOR_DIR.exists():
    sys.path.insert(0, str(VENDOR_DIR))


def extract_with_pypdf(pdf_path: Path):
    try:
        from pypdf import PdfReader  # type: ignore
    except Exception:
        return None
    reader = PdfReader(str(pdf_path))
    pages = []
    for page in reader.pages:
        try:
            pages.append(page.extract_text() or "")
        except Exception:
            pages.append("")
    meta = reader.metadata or {}
    return {
        "page_count": len(reader.pages),
        "title": getattr(meta, "title", None) if not isinstance(meta, dict) else meta.get("/Title") or meta.get("title"),
        "author": getattr(meta, "author", None) if not isinstance(meta, dict) else meta.get("/Author") or meta.get("author"),
        "text": "\n\n".join(pages).strip(),
        "backend": "pypdf",
    }


def extract_with_pypdf2(pdf_path: Path):
    try:
        from PyPDF2 import PdfReader  # type: ignore
    except Exception:
        return None
    reader = PdfReader(str(pdf_path))
    pages = []
    for page in reader.pages:
        try:
            pages.append(page.extract_text() or "")
        except Exception:
            pages.append("")
    meta = reader.metadata or {}
    title = None
    author = None
    try:
        title = meta.get("/Title")
        author = meta.get("/Author")
    except Exception:
        pass
    return {
        "page_count": len(reader.pages),
        "title": title,
        "author": author,
        "text": "\n\n".join(pages).strip(),
        "backend": "PyPDF2",
    }


def main():
    if len(sys.argv) != 2:
        print(json.dumps({
            "error": "usage: extract_pdf_text.py <pdf-path>"
        }))
        return 1

    pdf_path = Path(sys.argv[1]).expanduser()
    if not pdf_path.exists() or not pdf_path.is_file():
        print(json.dumps({
            "pdf_path": str(pdf_path),
            "error": "file not found"
        }))
        return 1

    result = extract_with_pypdf(pdf_path)
    if result is None:
        result = extract_with_pypdf2(pdf_path)

    if result is None:
        print(json.dumps({
            "pdf_path": str(pdf_path),
            "error": "missing PDF extraction dependency; install `pypdf` or `PyPDF2`"
        }))
        return 2

    result["pdf_path"] = str(pdf_path)
    print(json.dumps(result, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
