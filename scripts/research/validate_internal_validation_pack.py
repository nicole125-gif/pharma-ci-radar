#!/usr/bin/env python3
"""Validate internal competitive-evidence tasks, intake, and project records."""

from __future__ import annotations

import csv
import sys
from collections import Counter
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
RESEARCH = ROOT / "docs" / "research"
BACKLOG = RESEARCH / "2026-06-internal-validation-backlog.csv"
EXECUTION = RESEARCH / "2026-06-internal-validation-execution.csv"
EVIDENCE_INTAKE = RESEARCH / "2026-06-internal-evidence-intake.csv"
PROJECT_LOG = RESEARCH / "2026-06-competitive-project-log-template.csv"

EVIDENCE_FIELDS = [
    "evidence_record_id",
    "validation_id",
    "received_date",
    "collector",
    "company",
    "evidence_type",
    "subject_product",
    "model_or_configuration",
    "market_scope",
    "source_owner",
    "source_date",
    "file_location",
    "confidentiality",
    "fact_summary",
    "supports_or_contradicts",
    "verification_status",
    "verifier",
    "verified_date",
    "rejection_reason",
    "notes",
]

PROJECT_LOG_FIELDS = [
    "record_id",
    "validation_ids",
    "record_date",
    "owner",
    "customer_or_oem",
    "project_name",
    "application",
    "project_stage",
    "competitor",
    "competitor_series",
    "competitor_model",
    "burkert_series",
    "burkert_model",
    "medium",
    "nominal_size",
    "body_material",
    "surface_roughness",
    "diaphragm_or_seal",
    "connection",
    "pressure",
    "temperature",
    "certifications",
    "quantity",
    "competitor_origin",
    "burkert_origin",
    "competitor_quote_date",
    "burkert_quote_date",
    "competitor_net_price",
    "burkert_net_price",
    "currency",
    "trade_terms",
    "competitor_committed_lead_time",
    "burkert_committed_lead_time",
    "competitor_actual_lead_time",
    "burkert_actual_lead_time",
    "technical_difference",
    "documentation_difference",
    "service_difference",
    "customer_top_criteria",
    "result",
    "verified_win_loss_reason",
    "evidence_location",
    "internal_confidence",
    "next_action",
    "review_date",
    "notes",
]

BACKLOG_STATUSES = {"OPEN", "IN_PROGRESS", "VERIFIED", "REJECTED", "INSUFFICIENT"}
EXECUTION_STATUSES = {"READY", "IN_PROGRESS", "COMPLETE", "ON_HOLD"}
EVIDENCE_STATUSES = {"PENDING", "VERIFIED", "REJECTED", "INSUFFICIENT"}
CONFIDENTIALITY_LEVELS = {"INTERNAL", "RESTRICTED", "PUBLIC"}
SUPPORT_VALUES = {"SUPPORTS", "CONTRADICTS", "CONTEXT_ONLY"}


def read_rows(path: Path) -> tuple[list[str], list[dict[str, str]]]:
    with path.open(encoding="utf-8-sig", newline="") as handle:
        reader = csv.DictReader(handle)
        return list(reader.fieldnames or []), list(reader)


def duplicate_values(values: list[str]) -> set[str]:
    return {value for value, count in Counter(values).items() if value and count > 1}


def validate_project_rows(rows: list[dict[str, str]]) -> list[str]:
    errors: list[str] = []
    record_ids = [row.get("record_id", "") for row in rows]
    for duplicate in sorted(duplicate_values(record_ids)):
        errors.append(f"Duplicate project record_id: {duplicate}.")

    base_required = (
        "record_id",
        "validation_ids",
        "record_date",
        "owner",
        "application",
        "competitor",
    )
    price_required = (
        "competitor_model",
        "burkert_model",
        "nominal_size",
        "body_material",
        "diaphragm_or_seal",
        "connection",
        "quantity",
        "competitor_net_price",
        "burkert_net_price",
        "currency",
        "trade_terms",
        "evidence_location",
    )
    lead_time_required = (
        "competitor_committed_lead_time",
        "burkert_committed_lead_time",
        "competitor_actual_lead_time",
        "burkert_actual_lead_time",
        "evidence_location",
    )
    for index, row in enumerate(rows, start=2):
        if not any(row.values()):
            continue
        label = row.get("record_id") or f"row {index}"
        missing_base = [field for field in base_required if not row.get(field, "").strip()]
        if missing_base:
            errors.append(f"{label}: missing base fields {missing_base}.")

        has_price = bool(
            row.get("competitor_net_price", "").strip()
            or row.get("burkert_net_price", "").strip()
        )
        if has_price:
            missing = [field for field in price_required if not row.get(field, "").strip()]
            if missing:
                errors.append(f"{label}: price comparison requires {missing}.")

        has_actual_lead_time = bool(
            row.get("competitor_actual_lead_time", "").strip()
            or row.get("burkert_actual_lead_time", "").strip()
        )
        if has_actual_lead_time:
            missing = [field for field in lead_time_required if not row.get(field, "").strip()]
            if missing:
                errors.append(f"{label}: actual lead time requires {missing}.")

        if row.get("result", "").strip():
            missing = [
                field
                for field in ("verified_win_loss_reason", "evidence_location")
                if not row.get(field, "").strip()
            ]
            if missing:
                errors.append(f"{label}: win/loss conclusion requires {missing}.")
    return errors


def validate_pack(
    backlog_path: Path = BACKLOG,
    execution_path: Path = EXECUTION,
    intake_path: Path = EVIDENCE_INTAKE,
    project_path: Path | None = PROJECT_LOG,
) -> list[str]:
    errors: list[str] = []
    _, backlog = read_rows(backlog_path)
    _, execution = read_rows(execution_path)
    intake_fields, evidence = read_rows(intake_path)

    backlog_ids = [row.get("validation_id", "") for row in backlog]
    execution_ids = [row.get("validation_id", "") for row in execution]
    if set(backlog_ids) != set(execution_ids):
        errors.append(
            "Execution task IDs must exactly match backlog IDs; "
            f"missing={sorted(set(backlog_ids) - set(execution_ids))}, "
            f"extra={sorted(set(execution_ids) - set(backlog_ids))}."
        )
    for duplicate in sorted(duplicate_values(backlog_ids)):
        errors.append(f"Duplicate backlog validation_id: {duplicate}.")
    for duplicate in sorted(duplicate_values(execution_ids)):
        errors.append(f"Duplicate execution validation_id: {duplicate}.")

    for row in backlog:
        validation_id = row.get("validation_id") or "backlog row"
        if row.get("priority") not in {"P0", "P1", "P2"}:
            errors.append(f"{validation_id}: invalid priority {row.get('priority')!r}.")
        if row.get("status") not in BACKLOG_STATUSES:
            errors.append(f"{validation_id}: invalid backlog status {row.get('status')!r}.")

    execution_required = (
        "validation_id",
        "minimum_verified_records",
        "acceptance_rule",
        "execution_owner",
        "evidence_types",
        "decision_output",
    )
    minimums: dict[str, int] = {}
    for row in execution:
        validation_id = row.get("validation_id") or "execution row"
        missing = [field for field in execution_required if not row.get(field, "").strip()]
        if missing:
            errors.append(f"{validation_id}: missing execution fields {missing}.")
        try:
            minimum = int(row.get("minimum_verified_records", ""))
            if minimum < 1:
                raise ValueError
            minimums[validation_id] = minimum
        except ValueError:
            errors.append(f"{validation_id}: minimum_verified_records must be >= 1.")
        if row.get("status") and row["status"] not in EXECUTION_STATUSES:
            errors.append(f"{validation_id}: invalid execution status {row['status']!r}.")

    if intake_fields != EVIDENCE_FIELDS:
        errors.append("Evidence intake header does not match the required schema.")

    verified_counts: Counter[str] = Counter()
    evidence_ids = [row.get("evidence_record_id", "") for row in evidence]
    for duplicate in sorted(duplicate_values(evidence_ids)):
        errors.append(f"Duplicate evidence_record_id: {duplicate}.")
    evidence_required = (
        "evidence_record_id",
        "validation_id",
        "received_date",
        "collector",
        "company",
        "evidence_type",
        "source_date",
        "file_location",
        "confidentiality",
        "fact_summary",
        "supports_or_contradicts",
        "verification_status",
    )
    for index, row in enumerate(evidence, start=2):
        if not any(row.values()):
            continue
        label = row.get("evidence_record_id") or f"evidence row {index}"
        missing = [field for field in evidence_required if not row.get(field, "").strip()]
        if missing:
            errors.append(f"{label}: missing evidence fields {missing}.")
        validation_id = row.get("validation_id", "")
        if validation_id not in set(backlog_ids):
            errors.append(f"{label}: unknown validation_id {validation_id!r}.")
        if row.get("confidentiality") not in CONFIDENTIALITY_LEVELS:
            errors.append(f"{label}: invalid confidentiality.")
        if row.get("supports_or_contradicts") not in SUPPORT_VALUES:
            errors.append(f"{label}: invalid supports_or_contradicts.")
        status = row.get("verification_status")
        if status not in EVIDENCE_STATUSES:
            errors.append(f"{label}: invalid verification_status {status!r}.")
        if status == "VERIFIED":
            verified_counts[validation_id] += 1
            missing_verification = [
                field
                for field in ("verifier", "verified_date")
                if not row.get(field, "").strip()
            ]
            if missing_verification:
                errors.append(f"{label}: VERIFIED evidence requires {missing_verification}.")
        if status in {"REJECTED", "INSUFFICIENT"} and not row.get(
            "rejection_reason", ""
        ).strip():
            errors.append(f"{label}: {status} evidence requires rejection_reason.")

    for row in backlog:
        validation_id = row.get("validation_id", "")
        if row.get("status") == "VERIFIED":
            actual = verified_counts[validation_id]
            required = minimums.get(validation_id, 1)
            if actual < required:
                errors.append(
                    f"{validation_id}: VERIFIED but has {actual} verified evidence records; "
                    f"minimum is {required}."
                )

    if project_path is not None:
        project_fields, project_rows = read_rows(project_path)
        if project_fields != PROJECT_LOG_FIELDS:
            errors.append("Competitive project log header does not match the required schema.")
        valid_backlog_ids = set(backlog_ids)
        for index, row in enumerate(project_rows, start=2):
            if not any(row.values()):
                continue
            references = set(filter(None, row.get("validation_ids", "").split("|")))
            unknown = references - valid_backlog_ids
            if unknown:
                label = row.get("record_id") or f"project row {index}"
                errors.append(f"{label}: unknown validation_ids {sorted(unknown)}.")
        errors.extend(validate_project_rows(project_rows))
    return errors


def main() -> None:
    errors = validate_pack()
    if errors:
        print("\n".join(errors), file=sys.stderr)
        raise SystemExit(1)
    _, backlog = read_rows(BACKLOG)
    _, execution = read_rows(EXECUTION)
    _, evidence = read_rows(EVIDENCE_INTAKE)
    _, projects = read_rows(PROJECT_LOG)
    print(
        {
            "backlog_tasks": len(backlog),
            "execution_tasks": len(execution),
            "evidence_records": len(evidence),
            "project_records": len(projects),
            "status": "PASS",
        }
    )


if __name__ == "__main__":
    main()
