#!/usr/bin/env python3
"""Validate the 30-day product knowledge curriculum and score records."""

from __future__ import annotations

import csv
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
RESEARCH = ROOT / "docs" / "research"
CURRICULUM = RESEARCH / "2026-06-product-knowledge-30-day-curriculum.csv"
SCORECARD = RESEARCH / "2026-06-product-knowledge-training-scorecard.csv"
PROGRESS = RESEARCH / "2026-06-product-knowledge-training-progress.csv"

CURRICULUM_FIELDS = [
    "day",
    "week",
    "module",
    "learning_objective",
    "primary_material",
    "exercise",
    "required_output",
    "coach_review",
    "pass_criteria",
]

SCORECARD_FIELDS = [
    "learner_id",
    "cohort",
    "record_date",
    "checkpoint",
    "product_skeleton",
    "parameter_evidence",
    "application_judgment",
    "competitive_strategy",
    "total_score",
    "fatal_error",
    "result",
    "assessor",
    "evidence_location",
    "remediation_due",
    "notes",
]

PROGRESS_FIELDS = [
    "learner_id",
    "cohort",
    "day",
    "scheduled_date",
    "completion_status",
    "output_location",
    "self_reflection",
    "coach",
    "coach_result",
    "coach_feedback",
    "completed_date",
]

CHECKPOINTS = {"BASELINE", "DAY-10", "DAY-20", "DAY-30", "RETEST"}
RESULTS = {"PASS", "REMEDIATE", "NOT_ASSESSED"}
COMPLETION_STATUSES = {"NOT_STARTED", "IN_PROGRESS", "SUBMITTED", "COMPLETE"}
COACH_RESULTS = {"NOT_REVIEWED", "PASS", "REWORK"}


def read_rows(path: Path) -> tuple[list[str], list[dict[str, str]]]:
    with path.open(encoding="utf-8-sig", newline="") as handle:
        reader = csv.DictReader(handle)
        return list(reader.fieldnames or []), list(reader)


def validate_score_rows(rows: list[dict[str, str]]) -> list[str]:
    errors: list[str] = []
    limits = {
        "product_skeleton": 20,
        "parameter_evidence": 20,
        "application_judgment": 30,
        "competitive_strategy": 30,
    }
    for index, row in enumerate(rows, start=2):
        if not any(row.values()):
            continue
        label = f"{row.get('learner_id') or 'score row'}:{row.get('checkpoint') or index}"
        required = (
            "learner_id",
            "cohort",
            "record_date",
            "checkpoint",
            "fatal_error",
            "result",
            "assessor",
            "evidence_location",
        )
        missing = [field for field in required if not row.get(field, "").strip()]
        if missing:
            errors.append(f"{label}: missing fields {missing}.")
        if row.get("checkpoint") not in CHECKPOINTS:
            errors.append(f"{label}: invalid checkpoint.")
        if row.get("result") not in RESULTS:
            errors.append(f"{label}: invalid result.")
        if row.get("fatal_error") not in {"YES", "NO"}:
            errors.append(f"{label}: fatal_error must be YES or NO.")

        scores: dict[str, int] = {}
        for field, maximum in limits.items():
            try:
                value = int(row.get(field, ""))
                if not 0 <= value <= maximum:
                    raise ValueError
                scores[field] = value
            except ValueError:
                errors.append(f"{label}: {field} must be 0-{maximum}.")
        try:
            total = int(row.get("total_score", ""))
            if not 0 <= total <= 100:
                raise ValueError
        except ValueError:
            errors.append(f"{label}: total_score must be 0-100.")
            total = -1
        if len(scores) == len(limits) and total != sum(scores.values()):
            errors.append(f"{label}: total_score must equal component sum.")
        if row.get("fatal_error") == "YES" and row.get("result") == "PASS":
            errors.append(f"{label}: fatal_error=YES cannot PASS.")
        module_minimums = {
            "product_skeleton": 14,
            "parameter_evidence": 14,
            "application_judgment": 21,
            "competitive_strategy": 21,
        }
        if row.get("result") == "PASS":
            checkpoint = row.get("checkpoint")
            if checkpoint == "DAY-10" and total < 60:
                errors.append(f"{label}: DAY-10 PASS requires total_score >= 60.")
            elif checkpoint == "DAY-20":
                if total < 70:
                    errors.append(f"{label}: DAY-20 PASS requires total_score >= 70.")
                if scores.get("application_judgment", -1) < 21:
                    errors.append(
                        f"{label}: DAY-20 PASS requires application_judgment >= 21."
                    )
            elif checkpoint in {"DAY-30", "RETEST"}:
                if total < 75:
                    errors.append(f"{label}: final PASS requires total_score >= 75.")
                below = [
                    field
                    for field, minimum in module_minimums.items()
                    if scores.get(field, -1) < minimum
                ]
                if below:
                    errors.append(
                        f"{label}: final PASS requires module minimums; below={below}."
                    )
            elif checkpoint == "BASELINE":
                errors.append(f"{label}: BASELINE cannot use result=PASS.")
        if row.get("result") == "REMEDIATE" and not row.get(
            "remediation_due", ""
        ).strip():
            errors.append(f"{label}: REMEDIATE requires remediation_due.")
    return errors


def validate_progress_rows(rows: list[dict[str, str]]) -> list[str]:
    errors: list[str] = []
    seen: set[tuple[str, str, str]] = set()
    for index, row in enumerate(rows, start=2):
        if not any(row.values()):
            continue
        label = f"{row.get('learner_id') or 'progress row'}:day-{row.get('day') or index}"
        required = (
            "learner_id",
            "cohort",
            "day",
            "scheduled_date",
            "completion_status",
            "coach_result",
        )
        missing = [field for field in required if not row.get(field, "").strip()]
        if missing:
            errors.append(f"{label}: missing fields {missing}.")
        try:
            day = int(row.get("day", ""))
            if not 1 <= day <= 30:
                raise ValueError
        except ValueError:
            errors.append(f"{label}: day must be 1-30.")
        key = (row.get("learner_id", ""), row.get("cohort", ""), row.get("day", ""))
        if key in seen:
            errors.append(f"{label}: duplicate learner/cohort/day.")
        seen.add(key)
        if row.get("completion_status") not in COMPLETION_STATUSES:
            errors.append(f"{label}: invalid completion_status.")
        if row.get("coach_result") not in COACH_RESULTS:
            errors.append(f"{label}: invalid coach_result.")
        if row.get("completion_status") == "COMPLETE":
            complete_required = ("output_location", "coach", "completed_date")
            missing_complete = [
                field for field in complete_required if not row.get(field, "").strip()
            ]
            if missing_complete:
                errors.append(f"{label}: COMPLETE requires {missing_complete}.")
            if row.get("coach_result") != "PASS":
                errors.append(f"{label}: COMPLETE requires coach_result=PASS.")
    return errors


def validate_program(
    curriculum_path: Path = CURRICULUM,
    scorecard_path: Path = SCORECARD,
    progress_path: Path = PROGRESS,
) -> list[str]:
    errors: list[str] = []
    curriculum_fields, curriculum = read_rows(curriculum_path)
    scorecard_fields, scores = read_rows(scorecard_path)
    progress_fields, progress = read_rows(progress_path)

    if curriculum_fields != CURRICULUM_FIELDS:
        errors.append("Curriculum header does not match required schema.")
    if scorecard_fields != SCORECARD_FIELDS:
        errors.append("Scorecard header does not match required schema.")
    if progress_fields != PROGRESS_FIELDS:
        errors.append("Progress header does not match required schema.")

    try:
        days = [int(row.get("day", "")) for row in curriculum]
    except ValueError:
        days = []
        errors.append("Curriculum day values must be integers.")
    if sorted(days) != list(range(1, 31)):
        errors.append("Curriculum must contain exactly days 1 through 30.")

    required = tuple(field for field in CURRICULUM_FIELDS if field not in {"day", "week"})
    for row in curriculum:
        label = f"day {row.get('day') or '?'}"
        missing = [field for field in required if not row.get(field, "").strip()]
        if missing:
            errors.append(f"{label}: missing fields {missing}.")
        try:
            day = int(row.get("day", ""))
            week = int(row.get("week", ""))
            expected_week = min(4, (day - 1) // 7 + 1)
            if week != expected_week:
                errors.append(f"{label}: expected week {expected_week}, got {week}.")
        except ValueError:
            pass
        material = row.get("primary_material", "").strip()
        if material and not (curriculum_path.parent / material).exists():
            errors.append(f"{label}: primary_material not found: {material}.")

    errors.extend(validate_score_rows(scores))
    errors.extend(validate_progress_rows(progress))
    return errors


def main() -> None:
    errors = validate_program()
    if errors:
        print("\n".join(errors), file=sys.stderr)
        raise SystemExit(1)
    _, curriculum = read_rows(CURRICULUM)
    _, scores = read_rows(SCORECARD)
    _, progress = read_rows(PROGRESS)
    print(
        {
            "curriculum_days": len(curriculum),
            "score_records": len(scores),
            "progress_records": len(progress),
            "status": "PASS",
        }
    )


if __name__ == "__main__":
    main()
