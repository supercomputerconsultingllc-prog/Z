#!/usr/bin/env python3
import argparse
import json
from pathlib import Path

IMAGE_EXTS = {'.png', '.jpg', '.jpeg', '.gif', '.webp'}
DEFAULT_BROWSER_DIR = Path('~/.openclaw/media/browser').expanduser()


def newest_image(root: Path):
    if not root.exists():
        return None
    files = [p for p in root.rglob('*') if p.is_file() and p.suffix.lower() in IMAGE_EXTS]
    if not files:
        return None
    return max(files, key=lambda p: p.stat().st_mtime)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('path', nargs='?', help='Directory to search for images')
    parser.add_argument('--browser-latest', action='store_true', help='Use ~/.openclaw/media/browser')
    args = parser.parse_args()

    root = DEFAULT_BROWSER_DIR if args.browser_latest else Path(args.path).expanduser() if args.path else None
    if root is None:
        print(json.dumps({'error': 'provide a path or --browser-latest'}))
        return 1

    img = newest_image(root)
    if img is None:
        print(json.dumps({'root': str(root), 'error': 'no image found'}))
        return 1

    print(json.dumps({'root': str(root), 'image_path': str(img), 'name': img.name}))
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
