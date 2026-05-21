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
