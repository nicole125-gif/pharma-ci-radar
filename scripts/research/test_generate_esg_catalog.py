#!/usr/bin/env python3

import unittest

from generate_esg_catalog import CLAIMS, ROWS


class EsgCatalogTest(unittest.TestCase):
    def test_series_ids_are_unique(self) -> None:
        ids = [row["series_id"] for row in ROWS]
        self.assertEqual(len(ids), len(set(ids)))

    def test_certification_statements_are_claims(self) -> None:
        compliance = [
            claim for claim in CLAIMS if "Compliance claim" == claim["spec_key"]
        ]
        self.assertGreaterEqual(len(compliance), 2)

    def test_high_pharma_rows_have_explicit_sanitary_basis(self) -> None:
        high_rows = [row for row in ROWS if row["pharma_relevance"] == "HIGH"]
        self.assertTrue(high_rows)
        self.assertTrue(
            all(
                row["category"] == "Sanitary valves"
                for row in high_rows
            )
        )

    def test_no_row_claims_grade_a_evidence(self) -> None:
        self.assertFalse(any(row["evidence_grade"] == "A" for row in ROWS))


if __name__ == "__main__":
    unittest.main()
