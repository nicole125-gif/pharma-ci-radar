#!/usr/bin/env python3

import unittest

from lxml import html

from collect_fujikin_series import classify_pharma, parse_catalogue, record_id


class FujikinCatalogueTest(unittest.TestCase):
    def test_record_id_distinguishes_category_context(self) -> None:
        first = record_id("Manual Valves", "1-5. Diaphragm Valves", "BNWC", "BNW")
        second = record_id("Automatic Valves", "2-6. Diaphragm Valves", "BNWC", "BNW")
        self.assertNotEqual(first, second)

    def test_fcs_is_adjacent_not_proven_pharma(self) -> None:
        relevance, basis, _ = classify_pharma(
            "Mass Flow Controller FCS Thermal Series",
            "Mass Flow Controller",
            "FCST1000 FCST2000",
            "Systems",
        )
        self.assertEqual(relevance, "MEDIUM")
        self.assertIn("no blanket sterile claim", basis)

    def test_diaphragm_catalogue_is_high(self) -> None:
        relevance, _, _ = classify_pharma(
            "BNW SERIES WEIR DIAPHRAGM VALVES",
            "Weir Diaphragm Valves",
            "BNWM BNWC",
            "Manual Valves",
        )
        self.assertEqual(relevance, "HIGH")

    def test_semiconductor_metal_diaphragm_is_not_pharma_high(self) -> None:
        relevance, _, _ = classify_pharma(
            'FINE series PURE High Flow Valve series "Kiwami"',
            "Metal Diaphragm Valves",
            "FUBD",
            "Manual Valves",
        )
        self.assertEqual(relevance, "LOW")

    def test_parses_a_catalogue_row(self) -> None:
        source = b"""
        <html><body>
          <div><table><tr><th>Legend</th></tr></table></div>
          <div>
            <h3>1-5. Diaphragm Valves</h3>
            <table>
              <tr><th>Catalogues</th><th>Model</th><th>Size</th><th>Cleanliness</th><th>Flow</th><th>Material</th></tr>
              <tr><th>Weir Diaphragm Valves</th></tr>
              <tr>
                <td>BNW SERIES WEIR DIAPHRAGM VALVES <a href="/bnw.pdf">English</a></td>
                <td>BNWM BNWC</td><td>50A</td><td>Class 1</td><td>Medium</td><td>S</td>
              </tr>
            </table>
          </div>
        </body></html>
        """
        rows = parse_catalogue(html.tostring(html.fromstring(source)), "2026-06-09")
        self.assertEqual(len(rows), 1)
        self.assertEqual(rows[0]["model_numbers"], "BNWM BNWC")
        self.assertEqual(rows[0]["pharma_relevance"], "HIGH")


if __name__ == "__main__":
    unittest.main()
