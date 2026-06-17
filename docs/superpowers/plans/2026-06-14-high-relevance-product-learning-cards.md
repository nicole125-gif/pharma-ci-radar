# High-Relevance Product Learning Cards Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce evidence-backed deep learning cards for all 136 `pharma_relevance=HIGH` Bürkert, GEMÜ, Fujikin, and ESG product records and expose them in the product knowledge center.

**Architecture:** Existing product catalogs, specification tables, and competitor maps remain immutable source masters. A deterministic Python generator joins those sources into one card CSV and four Chinese handbook files; a separate validator enforces exact coverage, provenance, boundaries, and schema. The Next.js knowledge catalog reads the generated cards and displays a focused product detail view without inventing missing facts.

**Tech Stack:** Python 3 standard library, CSV/Markdown, Next.js 15, TypeScript, Vitest.

---

## File Structure

Create:

```text
scripts/research/generate_high_relevance_learning_cards.py
scripts/research/validate_high_relevance_learning_cards.py
scripts/research/test_generate_high_relevance_learning_cards.py
docs/research/2026-06-high-relevance-product-learning-cards.csv
docs/research/2026-06-burkert-high-product-learning-cards.md
docs/research/2026-06-gemu-high-product-learning-cards.md
docs/research/2026-06-fujikin-high-product-learning-cards.md
docs/research/2026-06-esg-high-product-learning-cards.md
```

Modify:

```text
docs/research/README.md
src/lib/knowledge/types.ts
src/lib/knowledge/catalog.ts
src/lib/knowledge/search.ts
src/lib/knowledge/__tests__/catalog.test.ts
src/lib/knowledge/__tests__/search.test.ts
src/components/knowledge/product-search.tsx
```

Do not modify:

```text
docs/research/*-catalog.csv
docs/research/*-specifications.csv
docs/research/*-series-map.csv
src/app/competitors/[id]/page.tsx
src/app/sources/page.tsx
```

## Card Contract

Each card row uses:

```text
card_id
company
product_id
name
secondary_name
category
subcategory
product_role
operating_principle
customer_jobs
pharma_applications
key_specifications
selection_questions
exclusion_conditions
adjacent_or_related_products
competitor_overlap
comparison_dimensions
evidence_grade
fact_boundary
source_urls
evidence_ids
knowledge_gaps
memory_hook
quiz_question
review_status
source_accessed_date
generated_date
```

Rules:

- Exactly 136 rows: Bürkert 73, GEMÜ 50, Fujikin 9, ESG 4.
- Only source values marked `HIGH` are included.
- Exact specifications come only from specification CSV rows.
- Missing values use `未公开，需查当前数据表或项目文件`, never inferred ranges.
- ESG `CLAIM` specifications remain labelled as claims in `fact_boundary`.
- China price, stock, origin, lead time, installed base, and service performance remain gaps unless the source master explicitly proves them.
- `review_status` starts as `GENERATED_REVIEWED_BY_RULES`; it does not claim engineering sign-off.

## Task 1: Generator and Contract Tests

**Files:**
- Create generator and unit test files listed above.

- [ ] Write tests asserting exact company counts, unique `card_id`, required fields, source URLs, and no placeholder tokens.
- [ ] Implement source-specific adapters for the four catalog/specification schemas.
- [ ] Join competitor mappings by explicit product identifiers only.
- [ ] Generate compact specification summaries without changing source wording.
- [ ] Generate selection and exclusion guidance from category rule tables.
- [ ] Run:

```bash
python3 -m unittest scripts.research.test_generate_high_relevance_learning_cards
```

Expected: all tests pass.

## Task 2: Generate the 136-Card Master and Handbooks

**Files:**
- Generate the CSV and four Markdown handbooks.

- [ ] Run:

```bash
python3 scripts/research/generate_high_relevance_learning_cards.py
```

- [ ] Confirm company counts are `73/50/9/4`.
- [ ] Confirm each Markdown handbook includes a company overview, usage boundary, index, and one section per card.
- [ ] Confirm every card includes facts, selection questions, exclusion conditions, competitor overlap, gaps, memory hook, and quiz question.

## Task 3: Independent Validation

**Files:**
- Create `validate_high_relevance_learning_cards.py`.

- [ ] Validate headers, exact source-to-card ID sets, uniqueness, URL shape, evidence grades, and handbook coverage.
- [ ] Reject `TBD`, `TODO`, invented price/lead-time claims, empty selection questions, and empty boundaries.
- [ ] Run:

```bash
python3 scripts/research/validate_high_relevance_learning_cards.py
```

Expected: JSON with `card_rows: 136` and `status: PASS`.

## Task 4: Knowledge Center Integration

**Files:**
- Modify the knowledge types, catalog, search tests, and product search component.

- [ ] Add `ProductLearningCard` and `learningCards` to the catalog.
- [ ] Join a card to product search results by company/product ID.
- [ ] Render a collapsible “深度学习卡” section showing specifications, selection questions, exclusions, overlap, gaps, memory hook, and quiz.
- [ ] Keep raw source boundaries visible and do not hide missing facts.
- [ ] Run:

```bash
npx vitest run src/lib/knowledge src/components/knowledge
npx tsc --noEmit
```

Expected: all tests pass.

## Task 5: Final Verification and Delivery

- [ ] Run all research validators and `npm test`.
- [ ] Build without PostgreSQL.
- [ ] Browser-check Type 2103, GEMÜ 650, Fujikin BNW, and ESG A00 on desktop and mobile.
- [ ] Confirm no page-level overflow and no console errors.
- [ ] Commit only plan, generated research files, scripts, and knowledge-center integration.
- [ ] Push `codex/high-product-learning-cards` and open a draft PR targeting `codex/knowledge-center-implementation`.
