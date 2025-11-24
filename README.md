# Todo app
Web-based Application for planning

## Local Postgres Database

This repo now includes a `docker-compose.yml` that provisions a local Postgres 16 instance that can be used while developing FinTrack.

### Requirements

- Docker Desktop (or Docker Engine + docker-compose plugin)

### Usage

```bash
docker compose up -d
```

The database becomes available on `localhost:5432` with the following credentials:

- user: `fintrack`
- password: `fintrack`
- database: `fintrack`

To stop and remove the container, run:

```bash
docker compose down
```

Removing the persistent data volume as well:

```bash
docker compose down -v
```

## Database Schema

The `schema.sql` file (which also enables Postgres' `citext` extension for case-insensitive emails) defines two core tables the app needs right now:

- `users` stores the login information. Persist bcrypt/argon2 password hashes (never raw passwords) in the `password_hash` column along with the user's email and optional display name.
- `todos` stores each scheduled to-do item tied back to a user. Fields are: `id` (auto-incrementing int), `name` (text), `description` (text), `duedate` (`TIMESTAMPTZ`, e.g., `new Date("2025-11-20T18:00:00Z")`), `priority` (int), and `completed` (boolean with a default of `false`).

Apply the schema to the running Postgres container with:

```bash
psql postgresql://fintrack:fintrack@localhost:5432/fintrack -f schema.sql
```

Re-run the same command anytime you evolve the schema; the `CREATE IF NOT EXISTS` statements keep it idempotent for local development.
