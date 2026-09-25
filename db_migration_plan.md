# Safe Database Migration Implementation

This document outlines the idempotent database migration system implemented in this project. This approach ensures that adding new fields, tables, or dropping obsolete columns won't crash your deployment if the changes already exist or were already applied.

---

## 🛠️ How It Works

1. **Migration Files**: Stored in the root `migrations/` folder (e.g. `0001_add_ingrediente_rate.sql`, `0002_update_orders.sql`).
2. **Migration Runner**: Located at `scripts/run-migrations.mjs`.
3. **Tracking Table**: Maintains an internal table `_custom_migrations` to record applied migration files and execution timestamps.
4. **Idempotency & Safe Error Handling**:
   When running migrations against MySQL / MariaDB, the runner executes statements individually. If a statement encounters:
   - `ER_DUP_FIELDNAME` (1060) — Duplicate column name
   - `ER_TABLE_EXISTS_ERROR` (1050) — Table already exists
   - `ER_DUP_KEYNAME` (1061) — Duplicate key / index name
   - `ER_CANT_DROP_FIELD_OR_KEY` (1091) — Column or key already dropped
   - `ER_DUP_ENTRY` (1062) — Duplicate entry
   
   The runner logs a safe warning (`⚠️ [SKIPPED SAFE]`) instead of crashing, records the migration, and continues seamlessly. Fatal syntax or constraint errors will abort the process with an error code.

---

## 🚀 How to Use

### 1. Add a New Migration File
Create a `.sql` file inside `migrations/` with a sequential prefix:
```sql
-- migrations/0002_add_new_columns.sql
ALTER TABLE `raw_materials` ADD COLUMN `new_field` VARCHAR(255) NULL;
```

### 2. Run Migrations
Run the migration script using npm:
```bash
npm run db:migrate
```

### 3. Force Re-run (Optional)
If you want to re-run all migration files regardless of `_custom_migrations` history:
```bash
node scripts/run-migrations.mjs --force
```

### 4. Updating Prisma Schema
When you update the database using custom migrations, keep Prisma in sync with:
```bash
npx prisma generate
```
