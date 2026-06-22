import {
  createClient,
  createPool,
  type QueryResultRow
} from "@vercel/postgres";
import type { AppState } from "./repository";

type Primitive = string | number | boolean | undefined | null;
type Sql = <Row extends QueryResultRow = QueryResultRow>(
  strings: TemplateStringsArray,
  ...values: Primitive[]
) => Promise<{ rows: Row[] }>;

interface AppStateRow extends QueryResultRow {
  state: AppState;
}

interface DatabaseEnv {
  POSTGRES_URL?: string;
  DATABASE_URL?: string;
}

interface AppStateStore {
  available: true;
  loadState(): Promise<AppState | null>;
  saveState(state: AppState): Promise<void>;
}

export interface UnavailableAppStateStore {
  available: false;
  reason: "DATABASE_NOT_CONFIGURED" | "DATABASE_ERROR";
}

export type AppStateStoreResult = AppStateStore | UnavailableAppStateStore;

const APP_STATE_ID = "default";
let storeCache: Promise<AppStateStoreResult> | undefined;

function selectDatabaseUrl(env: DatabaseEnv) {
  return env.POSTGRES_URL || env.DATABASE_URL || null;
}

function classifyDatabaseConnection(connectionString: string): "POOL" | "CLIENT" {
  const hostname = new URL(connectionString).hostname;
  return hostname !== "localhost" && hostname.includes("-pooler.")
    ? "POOL"
    : "CLIENT";
}

async function createSql(connectionString: string): Promise<Sql> {
  if (classifyDatabaseConnection(connectionString) === "POOL") {
    const pool = createPool({ connectionString });
    return pool.sql.bind(pool) as Sql;
  }

  const client = createClient({ connectionString });
  await client.connect();
  return client.sql.bind(client) as Sql;
}

function createStore(sql: Sql): AppStateStore {
  async function ensureSchema() {
    await sql`
      create table if not exists ci_app_state (
        id text primary key,
        state jsonb not null,
        updated_at timestamptz not null default now()
      )
    `;
  }

  return {
    available: true,

    async loadState() {
      await ensureSchema();
      const result = await sql<AppStateRow>`
        select state
        from ci_app_state
        where id = ${APP_STATE_ID}
      `;
      return result.rows[0]?.state ?? null;
    },

    async saveState(state) {
      await ensureSchema();
      await sql`
        insert into ci_app_state (id, state, updated_at)
        values (${APP_STATE_ID}, ${JSON.stringify(state)}::jsonb, now())
        on conflict (id) do update set
          state = excluded.state,
          updated_at = now()
      `;
    }
  };
}

async function initializeStore(env: DatabaseEnv): Promise<AppStateStoreResult> {
  const connectionString = selectDatabaseUrl(env);
  if (!connectionString) {
    return { available: false, reason: "DATABASE_NOT_CONFIGURED" };
  }

  try {
    const sql = await createSql(connectionString);
    await sql`select 1`;
    return createStore(sql);
  } catch {
    return { available: false, reason: "DATABASE_ERROR" };
  }
}

export async function getAppStateStore(
  env: DatabaseEnv = {
    POSTGRES_URL: process.env.POSTGRES_URL,
    DATABASE_URL: process.env.DATABASE_URL
  }
) {
  storeCache ??= initializeStore(env);
  return storeCache;
}
