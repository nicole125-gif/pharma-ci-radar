#!/usr/bin/env python3

import unittest

from validate_burkert_catalog import cache_identifies_type


class CacheIdentifiesTypeTest(unittest.TestCase):
    def test_accepts_supported_official_page_markers(self) -> None:
        markers = [
            "<title>Type 2035 - Diaphragm valve</title>",
            "<h1>Type 8746 - Mass flow controller</h1>",
            '{"name": "Type 8820 - Modular solenoid valve manifolds"}',
        ]

        for source in markers:
            with self.subTest(source=source):
                self.assertTrue(cache_identifies_type(source, source.split("Type ", 1)[1].split()[0]))

    def test_rejects_a_different_type(self) -> None:
        self.assertFalse(cache_identifies_type("<h1>Type 8746 - Mass flow controller</h1>", "8820"))


if __name__ == "__main__":
    unittest.main()
