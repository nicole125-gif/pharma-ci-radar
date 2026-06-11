#!/usr/bin/env python3
"""Tests for the 30-day product knowledge training validator."""

from __future__ import annotations

import tempfile
import unittest
from pathlib import Path

import validate_product_training_program as validator


class ProductTrainingProgramTests(unittest.TestCase):
    def write(self, directory: Path, name: str, content: str) -> Path:
        path = directory / name
        path.write_text(content, encoding="utf-8")
        return path

    def test_curriculum_requires_all_30_days(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            curriculum = self.write(
                root,
                "curriculum.csv",
                ",".join(validator.CURRICULUM_FIELDS)
                + "\n1,1,基础,目标,资料,练习,输出,教练,标准\n",
            )
            self.write(root, "资料", "")
            scorecard = self.write(
                root,
                "scorecard.csv",
                ",".join(validator.SCORECARD_FIELDS) + "\n",
            )
            progress = self.write(
                root,
                "progress.csv",
                ",".join(validator.PROGRESS_FIELDS) + "\n",
            )

            errors = validator.validate_program(curriculum, scorecard, progress)

            self.assertTrue(any("exactly days 1 through 30" in error for error in errors))

    def test_fatal_error_cannot_pass(self) -> None:
        row = {field: "" for field in validator.SCORECARD_FIELDS}
        row.update(
            {
                "learner_id": "L-001",
                "cohort": "2026-Q3",
                "record_date": "2026-06-11",
                "checkpoint": "DAY-30",
                "product_skeleton": "20",
                "parameter_evidence": "20",
                "application_judgment": "30",
                "competitive_strategy": "30",
                "total_score": "100",
                "fatal_error": "YES",
                "result": "PASS",
                "assessor": "Coach",
                "evidence_location": "internal://assessment/L-001",
            }
        )

        errors = validator.validate_score_rows([row])

        self.assertTrue(any("fatal_error=YES cannot PASS" in error for error in errors))

    def test_score_total_must_match_components(self) -> None:
        row = {field: "" for field in validator.SCORECARD_FIELDS}
        row.update(
            {
                "learner_id": "L-002",
                "cohort": "2026-Q3",
                "record_date": "2026-06-11",
                "checkpoint": "DAY-30",
                "product_skeleton": "18",
                "parameter_evidence": "18",
                "application_judgment": "25",
                "competitive_strategy": "25",
                "total_score": "90",
                "fatal_error": "NO",
                "result": "PASS",
                "assessor": "Coach",
                "evidence_location": "internal://assessment/L-002",
            }
        )

        errors = validator.validate_score_rows([row])

        self.assertTrue(any("total_score must equal component sum" in error for error in errors))

    def test_completed_day_requires_coach_pass_and_output(self) -> None:
        row = {field: "" for field in validator.PROGRESS_FIELDS}
        row.update(
            {
                "learner_id": "L-003",
                "cohort": "2026-Q3",
                "day": "1",
                "scheduled_date": "2026-06-11",
                "completion_status": "COMPLETE",
                "coach_result": "NOT_REVIEWED",
            }
        )

        errors = validator.validate_progress_rows([row])

        self.assertTrue(any("COMPLETE requires" in error for error in errors))

    def test_day_10_can_pass_at_60(self) -> None:
        row = {field: "" for field in validator.SCORECARD_FIELDS}
        row.update(
            {
                "learner_id": "L-004",
                "cohort": "2026-Q3",
                "record_date": "2026-06-11",
                "checkpoint": "DAY-10",
                "product_skeleton": "14",
                "parameter_evidence": "14",
                "application_judgment": "16",
                "competitive_strategy": "16",
                "total_score": "60",
                "fatal_error": "NO",
                "result": "PASS",
                "assessor": "Coach",
                "evidence_location": "internal://assessment/L-004",
            }
        )

        errors = validator.validate_score_rows([row])

        self.assertEqual([], errors)


if __name__ == "__main__":
    unittest.main()
