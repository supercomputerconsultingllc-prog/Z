#!/usr/bin/env python3
import json
import os
import shutil
import sys
import tempfile
import urllib.request
import zipfile
from pathlib import Path

PYPI_JSON = 'https://pypi.org/pypi/pypdf/json'


def main():
    skill_dir = Path(__file__).resolve().parent.parent
    vendor_dir = skill_dir / 'vendor'
    vendor_dir.mkdir(parents=True, exist_ok=True)

    with urllib.request.urlopen(PYPI_JSON, timeout=20) as r:
        data = json.load(r)

    version = data['info']['version']
    wheel = None
    for u in data['urls']:
        fn = u.get('filename', '')
        if fn.endswith('py3-none-any.whl'):
            wheel = u['url']
            break
    if not wheel:
        print('No compatible wheel found for pypdf', file=sys.stderr)
        return 1

    with tempfile.TemporaryDirectory() as td:
        wheel_path = Path(td) / 'pypdf.whl'
        urllib.request.urlretrieve(wheel, wheel_path)
        with zipfile.ZipFile(wheel_path) as zf:
            zf.extractall(vendor_dir)

    print(f'Installed vendored pypdf {version} into {vendor_dir}')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
