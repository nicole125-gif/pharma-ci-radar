Review the competitive intelligence knowledge base.

Focus on:

- source traceability
- stale counts or outdated README claims
- unsupported competitive conclusions
- CSV and schema consistency
- validation gaps
- training and internal evidence closure status
- next recommended action

Start from `CLAUDE.md` and `docs/research/README.md`.

Use `rg`, `python3`, and existing validation scripts instead of loading every CSV blindly.

If files changed or you find a data-quality risk, run:

```bash
python3 scripts/research/validate_burkert_catalog.py
python3 scripts/research/validate_application_selection_matrix.py
npm test
```

Report findings first, ordered by severity, with file references and line numbers.
