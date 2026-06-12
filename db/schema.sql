create type competitor_role as enum ('OWN_COMPANY', 'COMPETITOR');
create type entity_status as enum ('ACTIVE', 'PAUSED');
create type source_type as enum ('OFFICIAL_SITE', 'PRICING', 'BLOG', 'NEWS', 'CAREERS', 'SOCIAL', 'OTHER');
create type review_status as enum ('CANDIDATE', 'APPROVED', 'REJECTED');
create type impact_level as enum ('LOW', 'MEDIUM', 'HIGH');
create type event_type as enum ('PRODUCT', 'PRICING', 'HIRING', 'NEWS', 'CONTENT', 'POSITIONING');
create type score_suggestion_status as enum ('PENDING', 'APPROVED', 'REJECTED');

create table users (
  id text primary key,
  email text unique not null,
  name text not null,
  password_hash text not null,
  role text not null default 'ADMIN'
);

create table competitors (
  id text primary key,
  name text not null,
  normalized_name text not null,
  industry text not null,
  role competitor_role not null,
  status entity_status not null default 'ACTIVE',
  differentiation text not null
);

create table dimensions (
  id text primary key,
  name text not null,
  description text not null
);

create table competitor_scores (
  competitor_id text references competitors(id),
  dimension_id text references dimensions(id),
  value numeric(4, 2) not null,
  primary key (competitor_id, dimension_id)
);

create table sources (
  id text primary key,
  competitor_id text references competitors(id),
  url text not null,
  source_type source_type not null,
  review_status review_status not null,
  discovered_at timestamptz not null,
  reviewed_at timestamptz
);

create table snapshots (
  id text primary key,
  source_id text references sources(id),
  fetched_at timestamptz not null,
  content_hash text not null,
  title text not null,
  extracted_text text not null,
  raw_metadata jsonb not null default '{}'
);

create table intel_events (
  id text primary key,
  competitor_id text references competitors(id),
  source_id text references sources(id),
  event_type event_type not null,
  summary text not null,
  evidence_url text not null,
  impact_level impact_level not null,
  related_dimensions text[] not null,
  detected_at timestamptz not null
);

create table score_suggestions (
  id text primary key,
  competitor_id text references competitors(id),
  dimension_id text references dimensions(id),
  previous_score numeric(4, 2) not null,
  suggested_score numeric(4, 2) not null,
  approved_score numeric(4, 2),
  rationale text not null,
  status score_suggestion_status not null,
  created_at timestamptz not null,
  reviewed_at timestamptz
);

create table alerts (
  id text primary key,
  title text not null,
  body text not null,
  impact_level impact_level not null,
  linked_event_id text references intel_events(id),
  created_at timestamptz not null,
  read_at timestamptz
);

create table weekly_briefs (
  id text primary key,
  week_start date not null,
  executive_summary text not null,
  key_risks jsonb not null,
  key_opportunities jsonb not null,
  approved_events jsonb not null
);

create table if not exists training_learners (
  id text primary key,
  name text not null,
  cohort text not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists training_progress (
  learner_id text references training_learners(id) on delete cascade,
  day integer not null check (day between 1 and 30),
  scheduled_date date,
  completion_status text not null check (completion_status in ('NOT_STARTED', 'IN_PROGRESS', 'SUBMITTED', 'COMPLETE')),
  output_location text,
  self_reflection text,
  coach text,
  coach_result text not null check (coach_result in ('NOT_REVIEWED', 'PASS', 'REWORK')),
  coach_feedback text,
  completed_date date,
  updated_at timestamptz not null default now(),
  primary key (learner_id, day)
);

create table if not exists training_scores (
  id text primary key,
  learner_id text references training_learners(id) on delete cascade,
  checkpoint text not null check (checkpoint in ('BASELINE', 'DAY-10', 'DAY-20', 'DAY-30', 'RETEST')),
  record_date date not null,
  product_skeleton integer not null check (product_skeleton between 0 and 20),
  parameter_evidence integer not null check (parameter_evidence between 0 and 20),
  application_judgment integer not null check (application_judgment between 0 and 30),
  competitive_strategy integer not null check (competitive_strategy between 0 and 30),
  total_score integer not null check (total_score between 0 and 100),
  fatal_error boolean not null,
  result text not null check (result in ('PASS', 'REMEDIATE', 'NOT_ASSESSED')),
  assessor text not null,
  evidence_location text not null,
  remediation_due date,
  notes text,
  created_at timestamptz not null default now()
);

create unique index if not exists training_scores_checkpoint_record_idx
  on training_scores (learner_id, checkpoint, record_date);

create table if not exists validation_task_states (
  validation_id text primary key,
  owner text,
  status text not null check (status in ('OPEN', 'IN_PROGRESS', 'VERIFIED', 'REJECTED', 'INSUFFICIENT')),
  target_date date,
  conclusion text,
  updated_by text not null,
  updated_at timestamptz not null default now()
);

create table if not exists internal_evidence_records (
  id text primary key,
  validation_id text not null,
  received_date date not null,
  collector text not null,
  company text not null,
  evidence_type text not null,
  subject_product text,
  model_or_configuration text,
  market_scope text,
  source_owner text,
  source_date date not null,
  file_location text not null,
  confidentiality text not null check (confidentiality in ('INTERNAL', 'RESTRICTED', 'PUBLIC')),
  fact_summary text not null,
  supports_or_contradicts text not null check (supports_or_contradicts in ('SUPPORTS', 'CONTRADICTS', 'CONTEXT_ONLY')),
  verification_status text not null check (verification_status in ('PENDING', 'VERIFIED', 'REJECTED', 'INSUFFICIENT')),
  verifier text,
  verified_date date,
  rejection_reason text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists internal_evidence_validation_idx
  on internal_evidence_records (validation_id, verification_status);
