# Vercel PostgreSQL Deployment Notes

## Goal

The production site needs a PostgreSQL connection so two workflow areas persist across Vercel serverless requests:

- Radar workflow state: source review, monitor snapshots, events, alerts, score suggestions, sales intel, and weekly briefs.
- Knowledge execution state: learners, training progress, assessment scores, validation task state, and internal evidence records.

## Required Environment

Configure one of these variables in the Vercel project for Production and Preview:

```text
POSTGRES_URL
DATABASE_URL
```

`POSTGRES_URL` is preferred when both are present. The app accepts pooled Neon/Vercel Postgres-style URLs and direct PostgreSQL URLs.

## Runtime Tables

The app creates tables lazily when the first request needs them.

- `ci_app_state`: JSONB state for the main CI radar workflow.
- `training_learners`
- `training_progress`
- `training_scores`
- `validation_task_states`
- `internal_evidence_records`

## Verification

After deployment and environment configuration:

```bash
curl https://knowledge-center-omega.vercel.app/api/system/status
```

Expected ready shape:

```json
{
  "appState": {
    "available": true
  },
  "knowledgeExecution": {
    "available": true
  }
}
```

Then verify the monitor loop:

```bash
curl -X POST \
  https://knowledge-center-omega.vercel.app/api/sources/source-gemu-official/review \
  -H 'content-type: application/json' \
  -d '{"reviewStatus":"APPROVED"}'

curl -X POST https://knowledge-center-omega.vercel.app/api/jobs/monitor
```

The monitor response should report at least one scanned source after approval.

## Current Deployment Note

As of 2026-06-22, local Vercel CLI deployment is blocked before deployment starts:

```text
request to https://vercel.com/.well-known/openid-configuration failed
```

The code is pushed to `codex/knowledge-center-implementation`; production is still on the previous deployment until the CLI authentication path or Vercel dashboard deployment is available.
