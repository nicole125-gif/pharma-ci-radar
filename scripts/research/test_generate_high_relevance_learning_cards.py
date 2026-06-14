import csv
import tempfile
import unittest
from collections import Counter
from pathlib import Path

from scripts.research.generate_high_relevance_learning_cards import (
    CARD_FIELDS,
    EXPECTED_COUNTS,
    generate_learning_cards,
)


ROOT = Path(__file__).resolve().parents[2]


class GenerateHighRelevanceLearningCardsTest(unittest.TestCase):
    def test_generates_exact_high_relevance_coverage(self):
        with tempfile.TemporaryDirectory() as temporary_directory:
            output_directory = Path(temporary_directory)
            cards = generate_learning_cards(
                research_directory=ROOT / "docs" / "research",
                output_directory=output_directory,
            )

            self.assertEqual(len(cards), sum(EXPECTED_COUNTS.values()))
            self.assertEqual(Counter(card["company"] for card in cards), EXPECTED_COUNTS)
            self.assertEqual(len({card["card_id"] for card in cards}), len(cards))
            self.assertTrue(all(card["review_status"] == "GENERATED_REVIEWED_BY_RULES" for card in cards))

            with (output_directory / "2026-06-high-relevance-product-learning-cards.csv").open(
                encoding="utf-8-sig", newline=""
            ) as handle:
                reader = csv.DictReader(handle)
                self.assertEqual(reader.fieldnames, CARD_FIELDS)
                generated_rows = list(reader)
            self.assertEqual(len(generated_rows), 136)

    def test_preserves_sources_and_explicit_boundaries(self):
        with tempfile.TemporaryDirectory() as temporary_directory:
            cards = generate_learning_cards(
                research_directory=ROOT / "docs" / "research",
                output_directory=Path(temporary_directory),
            )

            type_2103 = next(
                card
                for card in cards
                if card["company"] == "Bürkert" and card["product_id"] == "2103"
            )
            self.assertIn("https://www.burkert.com/en/type/2103", type_2103["source_urls"])
            self.assertIn("中国公开可见性", type_2103["fact_boundary"])
            self.assertNotIn("TBD", type_2103["key_specifications"])

            esg_a00 = next(
                card
                for card in cards
                if card["company"] == "ESG 精锐" and card["product_id"] == "A00"
            )
            self.assertIn("CLAIM", esg_a00["fact_boundary"])
            self.assertIn("价格", esg_a00["knowledge_gaps"])
            self.assertIn("交期", esg_a00["knowledge_gaps"])

            esg_t_valve = next(
                card
                for card in cards
                if card["company"] == "ESG 精锐" and card["product_id"] == "T-VALVE"
            )
            self.assertIn("DN与目标Cv/Kv", esg_t_valve["selection_questions"])
            self.assertNotIn("量程与正常工作点", esg_t_valve["selection_questions"])

            burkert_flowave = next(
                card
                for card in cards
                if card["company"] == "Bürkert" and card["product_id"] == "8056"
            )
            self.assertIn("量程与正常工作点", burkert_flowave["selection_questions"])

            burkert_ph = next(
                card
                for card in cards
                if card["company"] == "Bürkert" and card["product_id"] == "8201"
            )
            self.assertIn("校准和验证要求", burkert_ph["selection_questions"])

    def test_writes_one_handbook_section_per_card(self):
        with tempfile.TemporaryDirectory() as temporary_directory:
            output_directory = Path(temporary_directory)
            cards = generate_learning_cards(
                research_directory=ROOT / "docs" / "research",
                output_directory=output_directory,
            )

            filenames = {
                "Bürkert": "2026-06-burkert-high-product-learning-cards.md",
                "GEMÜ": "2026-06-gemu-high-product-learning-cards.md",
                "Fujikin": "2026-06-fujikin-high-product-learning-cards.md",
                "ESG 精锐": "2026-06-esg-high-product-learning-cards.md",
            }
            for company, filename in filenames.items():
                content = (output_directory / filename).read_text(encoding="utf-8")
                company_cards = [card for card in cards if card["company"] == company]
                self.assertEqual(content.count("\n## "), len(company_cards) + 2)
                for card in company_cards:
                    self.assertIn(f"`{card['product_id']}`", content)


if __name__ == "__main__":
    unittest.main()
