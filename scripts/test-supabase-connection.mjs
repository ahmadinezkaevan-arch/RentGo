// One-off smoke test: connect to Supabase (DIRECT_URL) and create a test table.
import "dotenv/config";
import pg from "pg";

const url = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
if (!url) {
  console.error("DIRECT_URL/DATABASE_URL not found in .env");
  process.exit(1);
}

const client = new pg.Client({ connectionString: url, ssl: { rejectUnauthorized: false } });

try {
  await client.connect();
  const ver = await client.query("select version()");
  console.log("CONNECT OK:", ver.rows[0].version.slice(0, 60));

  await client.query(`
    create table if not exists _hermes_smoke_test (
      id serial primary key,
      note text not null,
      created_at timestamptz not null default now()
    )
  `);
  console.log("TABLE CREATED: _hermes_smoke_test");

  const ins = await client.query(
    "insert into _hermes_smoke_test (note) values ($1) returning id, note, created_at",
    ["koneksi supabase ok dari project rent-go"]
  );
  console.log("ROW INSERTED:", JSON.stringify(ins.rows[0]));

  const read = await client.query("select count(*)::int as n from _hermes_smoke_test");
  console.log("READBACK COUNT:", read.rows[0].n);
} catch (err) {
  console.error("FAILED:", err.message);
  process.exitCode = 1;
} finally {
  await client.end().catch(() => {});
}
