Run the research validation suite.

Commands:

```bash
python3 scripts/research/validate_burkert_catalog.py
python3 scripts/research/validate_application_selection_matrix.py
npm test
```

If anything fails:

- identify the exact file and line or record where possible
- explain whether the issue is data, schema, evidence traceability, or application test drift
- propose the smallest safe fix
- do not change unrelated files

If everything passes, report:

- Bürkert catalog status
- application selection matrix status
- application test status
- current git status
