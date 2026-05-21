import { sql } from "@vercel/postgres";

export function getSql() {
  if (!process.env.POSTGRES_URL && !process.env.DATABASE_URL) {
    return null;
  }

  return sql;
}
