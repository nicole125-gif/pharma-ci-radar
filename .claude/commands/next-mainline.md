Continue the Pharma CI Radar mainline.

Priority order:

1. Fix stale documentation, counters, and metadata.
2. Close competitor series mapping gaps.
3. Strengthen evidence traceability.
4. Improve internal validation intake and closure.
5. Improve training outputs and battlecards.
6. Suggest UI or feature changes only when the user explicitly asks.

Current mainline assets:

- `docs/research/burkert-type-catalog.csv`
- `docs/research/burkert-type-specifications.csv`
- `docs/research/burkert-competitor-series-map.csv`
- `docs/research/2026-06-four-company-evidence.csv`
- `docs/research/2026-06-pharma-application-selection-matrix.csv`
- `docs/research/2026-06-internal-validation-execution.csv`

Rules:

- Keep conclusions evidence-backed.
- Preserve `evidence_id` traceability.
- Do not infer China stock, origin, lead time, or pricing from public product pages.
- Keep public evidence and internal validation separate.

After changes, run the relevant validation commands and summarize what changed.
