# Pharma CI Radar Knowledge Center

## Role

Assist with a competitive intelligence knowledge base for Bürkert, GEMÜ, Fujikin, and ESG 精锐 in China pharma and biotech markets.

## Source Of Truth

Use these files first:

- `docs/research/README.md`
- `docs/research/2026-06-four-company-competitive-research.md`
- `docs/research/burkert-type-catalog.csv`
- `docs/research/burkert-type-specifications.csv`
- `docs/research/burkert-competitor-series-map.csv`
- `docs/research/2026-06-four-company-evidence.csv`
- `docs/research/2026-06-pharma-application-selection-matrix.csv`
- `docs/research/2026-06-internal-validation-execution.csv`
- `docs/research/2026-06-internal-evidence-intake.csv`

## Research Rules

- Do not invent prices, lead times, market share, customer names, or certification status.
- Every important competitive conclusion must cite an `evidence_id`.
- Treat global product availability separately from China availability.
- Treat China public page visibility separately from China stock, origin, lead time, or formal sellability.
- Mark weak or incomplete items as `INTERNAL_VALIDATION`, `GAP`, `CLAIM`, or `INFERENCE`.
- Do not upgrade public marketing claims into independent facts.
- Compare technical parameters only when medium, size, pressure, temperature, connection, and product role are comparable.
- Keep threat level and evidence maturity separate.

## Current Mainline

1. Bürkert full Type catalog and specifications.
2. GEMÜ, Fujikin, and ESG series-level competitor mapping.
3. Pharma application selection and exclusion logic.
4. Evidence traceability and internal validation closure.
5. Product-manager training, battlecards, and knowledge maintenance.

## Validation Commands

Run these before claiming the research knowledge base is clean:

```bash
python3 scripts/research/validate_burkert_catalog.py
python3 scripts/research/validate_application_selection_matrix.py
npm test
```

## Editing Boundaries

- Prefer small, traceable changes to research files and validation scripts.
- Do not modify application code unless the user explicitly asks for product UI or API changes.
- Do not write confidential raw project files into Git. Store only indexed summaries and controlled file locations.
- Keep CSV files parseable by standard CSV readers.
