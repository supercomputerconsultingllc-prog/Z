#!/usr/bin/env python3
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

import next_improvement_prompt as nip


class NextImprovementPromptTests(unittest.TestCase):
    def test_filters_cache_directories_as_noise(self):
        self.assertTrue(nip.is_noise_status_line('?? scripts/__pycache__/'))
        self.assertTrue(nip.is_noise_status_line('?? .pytest_cache/'))
        self.assertTrue(nip.is_noise_status_line('?? pkg/.mypy_cache/data.json'))

    def test_keeps_real_workspace_files_visible(self):
        self.assertFalse(nip.is_noise_status_line('?? scripts/new_helper.py'))
        self.assertFalse(nip.is_noise_status_line(' M mail/campaign_pipeline.md'))


if __name__ == '__main__':
    unittest.main()
