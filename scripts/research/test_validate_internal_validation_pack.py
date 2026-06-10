#!/usr/bin/env python3
"""Tests for the internal competitive-evidence validation pack."""

from __future__ import annotations

import tempfile
import unittest
from pathlib import Path

import validate_internal_validation_pack as validator


class InternalValidationPackTests(unittest.TestCase):
    def write_csv(self, directory: Path, name: str, content: str) -> Path:
        path = directory / name
        path.write_text(content, encoding="utf-8")
        return path

    def test_verified_task_requires_verified_evidence(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            backlog = self.write_csv(
                root,
                "backlog.csv",
                "validation_id,priority,status\nVAL-001,P0,VERIFIED\n",
            )
            execution = self.write_csv(
                root,
                "execution.csv",
                "validation_id,minimum_verified_records,acceptance_rule,"
                "execution_owner,evidence_types,decision_output\n"
                "VAL-001,1,One verified record,Sales,Quote,Pricing decision\n",
            )
            intake = self.write_csv(
                root,
                "intake.csv",
                ",".join(validator.EVIDENCE_FIELDS) + "\n",
            )

            errors = validator.validate_pack(backlog, execution, intake, None)

            self.assertTrue(
                any("VERIFIED but has 0 verified evidence records" in error for error in errors)
            )

    def test_comparable_price_record_requires_comparison_context(self) -> None:
        row = {field: "" for field in validator.PROJECT_LOG_FIELDS}
        row.update(
            {
                "record_id": "PRJ-001",
                "validation_ids": "VAL-CROSS-001",
                "record_date": "2026-06-10",
                "owner": "Sales",
                "competitor": "GEMÜ",
                "competitor_net_price": "100",
                "burkert_net_price": "120",
            }
        )

        errors = validator.validate_project_rows([row])

        self.assertTrue(any("price comparison requires" in error for error in errors))

    def test_complete_open_pack_passes_without_evidence(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            backlog = self.write_csv(
                root,
                "backlog.csv",
                "validation_id,priority,status\nVAL-001,P0,OPEN\n",
            )
            execution = self.write_csv(
                root,
                "execution.csv",
                "validation_id,minimum_verified_records,acceptance_rule,"
                "execution_owner,evidence_types,decision_output\n"
                "VAL-001,2,Two comparable quotes,Sales,Quote,Pricing decision\n",
            )
            intake = self.write_csv(
                root,
                "intake.csv",
                ",".join(validator.EVIDENCE_FIELDS) + "\n",
            )

            errors = validator.validate_pack(backlog, execution, intake, None)

            self.assertEqual([], errors)


if __name__ == "__main__":
    unittest.main()
