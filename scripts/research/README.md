# Bürkert Product Catalog Research Scripts

These scripts create and validate the official-site Bürkert Type catalog.

## Source Boundary

- Global master: `website_com_en_Type_GoogleSitemap.xml`
- China visibility: `website_cn_cn_Type_GoogleSitemap.xml`
- Product facts: official `/en/type/{type_id}` and `/cn/type/{type_id}` pages
- Default request interval: 10 seconds per host, matching each site's `robots.txt`
- Cache: `.config/burkert-catalog-cache/` (ignored by Git)

The scripts do not enumerate Article Numbers and do not infer stock, origin, price, or lead time.

## Commands

Smoke test:

```bash
python3 scripts/research/collect_burkert_catalog.py --limit 3
```

Resume an interrupted run and fetch only missing pages:

```bash
python3 scripts/research/collect_burkert_catalog.py
```

Full refresh:

```bash
python3 scripts/research/collect_burkert_catalog.py --refresh
```

Rebuild outputs from the existing cache:

```bash
python3 scripts/research/collect_burkert_catalog.py --build-only
```

Generate the Chinese handbook:

```bash
python3 scripts/research/generate_burkert_handbook.py
```

Validate all discovered English and Chinese data-sheet links:

```bash
python3 scripts/research/validate_burkert_datasheet_links.py
```

Record the completed 100% pharma-HIGH and stratified non-HIGH review:

```bash
python3 scripts/research/generate_burkert_review_audit.py
```

Validate:

```bash
python3 scripts/research/validate_burkert_catalog.py
```

## Outputs

- `docs/research/burkert-type-catalog.csv`
- `docs/research/burkert-type-specifications.csv`
- `docs/research/burkert-catalog-coverage.json`
- `docs/research/burkert-datasheet-link-validation.csv`
- `docs/research/burkert-catalog-review.csv`
- `docs/research/burkert-full-product-handbook.md`

The competitor-series map is curated separately in
`docs/research/burkert-competitor-series-map.csv`.
