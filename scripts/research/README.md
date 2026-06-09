# Product Catalog Research Scripts

These scripts create and validate the official-site Bürkert Type catalog,
the GEMÜ current-series catalog, and the Fujikin catalogue-level series map.

## Source Boundary

- Global master: `website_com_en_Type_GoogleSitemap.xml`
- China visibility: `website_cn_cn_Type_GoogleSitemap.xml`
- Product facts: official `/en/type/{type_id}` and `/cn/type/{type_id}` pages
- Default request interval: 10 seconds per host, matching each site's `robots.txt`
- Cache: `.config/burkert-catalog-cache/` (ignored by Git)

The scripts do not enumerate Article Numbers and do not infer stock, origin, price, or lead time.

For GEMÜ, the English sitemap is the current-series discovery source. Product
facts come from official leaf product pages, with cached pages stored in
`.config/gemu-series-cache/` (ignored by Git).

For Fujikin, the official English download index is the series-level source.
It is intentionally used instead of expanding hundreds of Product Numbers.
The cached source is stored in `.config/fujikin-series-cache/`.

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

Collect or resume the GEMÜ catalog:

```bash
python3 scripts/research/collect_gemu_series.py
```

Rebuild GEMÜ outputs from cache, or force a refresh:

```bash
python3 scripts/research/collect_gemu_series.py --build-only
python3 scripts/research/collect_gemu_series.py --refresh
```

Generate and validate the GEMÜ handbook and mapping:

```bash
python3 scripts/research/generate_gemu_handbook.py
python3 scripts/research/validate_gemu_series.py
```

Collect or rebuild the Fujikin catalogue:

```bash
python3 scripts/research/collect_fujikin_series.py
python3 scripts/research/collect_fujikin_series.py --build-only
python3 scripts/research/collect_fujikin_series.py --refresh
```

Generate and validate the Fujikin handbook and mapping:

```bash
python3 scripts/research/generate_fujikin_handbook.py
python3 scripts/research/validate_fujikin_catalog_links.py
python3 scripts/research/validate_fujikin_series.py
```

## Outputs

- `docs/research/burkert-type-catalog.csv`
- `docs/research/burkert-type-specifications.csv`
- `docs/research/burkert-catalog-coverage.json`
- `docs/research/burkert-datasheet-link-validation.csv`
- `docs/research/burkert-catalog-review.csv`
- `docs/research/burkert-full-product-handbook.md`
- `docs/research/gemu-series-catalog.csv`
- `docs/research/gemu-series-specifications.csv`
- `docs/research/gemu-series-evidence.csv`
- `docs/research/gemu-series-coverage.json`
- `docs/research/gemu-burkert-series-map.csv`
- `docs/research/gemu-pharma-series-handbook.md`
- `docs/research/fujikin-series-catalog.csv`
- `docs/research/fujikin-series-specifications.csv`
- `docs/research/fujikin-series-evidence.csv`
- `docs/research/fujikin-series-coverage.json`
- `docs/research/fujikin-catalog-link-validation.csv`
- `docs/research/fujikin-burkert-series-map.csv`
- `docs/research/fujikin-product-series-handbook.md`

The competitor-series map is curated separately in
`docs/research/burkert-competitor-series-map.csv`.
