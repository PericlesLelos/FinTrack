# FinTrack
Web-based Application for financial tracking

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
