#!/usr/bin/env python3

import unittest
from pathlib import Path
from tempfile import TemporaryDirectory

from validate_burkert_catalog import cache_identifies_type, read_evidence_ids


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

    def test_combines_multiple_evidence_tables(self) -> None:
        with TemporaryDirectory() as directory:
            first = Path(directory) / "first.csv"
            second = Path(directory) / "second.csv"
            first.write_text("evidence_id\nBURKERT-CATALOG-001\n", encoding="utf-8")
            second.write_text("evidence_id\nGEMU-SERIES-650\n", encoding="utf-8")

            self.assertEqual(
                read_evidence_ids([first, second]),
                {"BURKERT-CATALOG-001", "GEMU-SERIES-650"},
            )


if __name__ == "__main__":
    unittest.main()
