#!/usr/bin/env python3

import unittest

from collect_gemu_series import classify_pharma, is_product_series_url


class ProductSeriesUrlTest(unittest.TestCase):
    def test_accepts_leaf_product_pages(self) -> None:
        self.assertTrue(
            is_product_series_url(
                "https://www.gemu-group.com/en/products/"
                "valve-technology/diaphragm-valves/650"
            )
        )

    def test_rejects_category_pages(self) -> None:
        self.assertFalse(
            is_product_series_url(
                "https://www.gemu-group.com/en/products/"
                "valve-technology/diaphragm-valves"
            )
        )

    def test_does_not_find_sip_inside_display(self) -> None:
        relevance, applications = classify_pharma(
            "Measurement And Control Technology",
            "Flow Meters",
            "Industrial flow meter",
            "Local display for water service.",
            "",
            {},
        )
        self.assertEqual(relevance, "MEDIUM")
        self.assertNotIn("CIP/SIP", applications)

    def test_explicit_pharmaceutical_positioning_is_high(self) -> None:
        relevance, _ = classify_pharma(
            "Valve Technology",
            "Diaphragm Valves",
            "Electromotive diaphragm valve",
            "Ideal for pharmaceutical and biotechnology applications.",
            "",
            {},
        )
        self.assertEqual(relevance, "HIGH")


if __name__ == "__main__":
    unittest.main()
