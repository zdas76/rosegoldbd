import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import mariadb from 'mariadb';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const migrationsDir = path.join(projectRoot, 'migrations');

// Helper to determine DB connection configuration
function getDbConfig() {
  if (process.env.DATABASE_URL) {
    try {
      const url = new URL(process.env.DATABASE_URL.replace(/^mysql:/, 'mariadb:'));
      return {
        host: url.hostname || 'localhost',
        port: Number(url.port) || 3306,
        user: decodeURIComponent(url.username || 'root'),
        password: decodeURIComponent(url.password || ''),
        database: url.pathname.replace(/^\//, ''),
        connectionLimit: 5,
        multipleStatements: true,
      };
    } catch {
      // Fallback if URL parsing fails
    }
  }

  return {
    host: process.env.DATABASE_HOST || 'localhost',
    port: Number(process.env.DATABASE_PORT) || 3306,
    user: process.env.DATABASE_USER || 'root',
    password: process.env.DATABASE_PASSWORD || '',
    database: process.env.DATABASE_NAME || 'roseGold',
    connectionLimit: 5,
    multipleStatements: true,
  };
}

// Split SQL file content into individual executable statements
function splitSqlStatements(content) {
  // Remove single line comments (-- ...)
  const cleanSql = content
    .replace(/--.*$/gm, '')
    // Remove multi-line comments (/* ... */)
    .replace(/\/\*[\s\S]*?\*\//g, '');

  return cleanSql
    .split(';')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

// Check if error is safe to ignore (already exists or already dropped)
function isIdempotentError(err) {
  const errno = err.errno;
  const code = err.code;
  const message = (err.message || '').toLowerCase();

  // Known MySQL / MariaDB error codes:
  // 1050: ER_TABLE_EXISTS_ERROR
  // 1060: ER_DUP_FIELDNAME (Duplicate column name)
  // 1061: ER_DUP_KEYNAME (Duplicate key name / index)
  // 1062: ER_DUP_ENTRY (Duplicate entry)
  // 1091: ER_CANT_DROP_FIELD_OR_KEY (Can't DROP; check that column/key exists)
  const safeErrnos = [1050, 1060, 1061, 1062, 1091];
  if (safeErrnos.includes(errno)) {
    return true;
  }

  const safeCodes = [
    'ER_TABLE_EXISTS_ERROR',
    'ER_DUP_FIELDNAME',
    'ER_DUP_KEYNAME',
    'ER_DUP_ENTRY',
    'ER_CANT_DROP_FIELD_OR_KEY',
  ];
  if (safeCodes.includes(code)) {
    return true;
  }

  // Textual fallbacks
  if (
    message.includes('already exists') ||
    message.includes('duplicate column') ||
    message.includes('duplicate key') ||
    message.includes("can't drop") ||
    message.includes('check that column/key exists')
  ) {
    return true;
  }

  return false;
}

async function runMigrations() {
  console.log('🚀 Starting database migration runner...\n');

  if (!fs.existsSync(migrationsDir)) {
    fs.mkdirSync(migrationsDir, { recursive: true });
    console.log(`📁 Created migrations folder at: ${migrationsDir}`);
  }

  const config = getDbConfig();
  console.log(`🔌 Connecting to database '${config.database}' on ${config.host}:${config.port}...`);

  let pool;
  let conn;

  try {
    pool = mariadb.createPool(config);
    conn = await pool.getConnection();
    console.log('✅ Connected successfully!\n');

    // Ensure tracking table exists
    await conn.query(`
      CREATE TABLE IF NOT EXISTS _custom_migrations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Fetch previously executed migrations
    const executedRows = await conn.query('SELECT name FROM _custom_migrations;');
    const executedSet = new Set(executedRows.map((r) => r.name));

    // Read and sort SQL files from migrations directory
    const allFiles = fs
      .readdirSync(migrationsDir)
      .filter((file) => file.endsWith('.sql'))
      .sort();

    if (allFiles.length === 0) {
      console.log('ℹ️  No SQL migration files found in migrations/ directory.');
      console.log('👉 Create files like: migrations/0001_initial.sql\n');
      return;
    }

    const forceRun = process.argv.includes('--force');
    let executedCount = 0;
    let skippedCount = 0;

    for (const file of allFiles) {
      if (executedSet.has(file) && !forceRun) {
        console.log(`⏩ [ALREADY APPLIED] ${file}`);
        skippedCount++;
        continue;
      }

      console.log(`\n⏳ Running migration: ${file}...`);
      const filePath = path.join(migrationsDir, file);
      const sqlContent = fs.readFileSync(filePath, 'utf-8');
      const statements = splitSqlStatements(sqlContent);

      for (let i = 0; i < statements.length; i++) {
        const stmt = statements[i];
        try {
          await conn.query(stmt);
        } catch (err) {
          if (isIdempotentError(err)) {
            console.warn(`   ⚠️  [SKIPPED SAFE] Statement #${i + 1}: ${err.message}`);
          } else {
            console.error(`   ❌ [FATAL ERROR] Statement #${i + 1} failed: ${err.message}`);
            console.error(`   Query: ${stmt}`);
            throw err;
          }
        }
      }

      // Record migration as executed
      await conn.query(
        `INSERT INTO _custom_migrations (name) VALUES (?)
         ON DUPLICATE KEY UPDATE executed_at = CURRENT_TIMESTAMP;`,
        [file]
      );

      console.log(`✅ [SUCCESS] Completed: ${file}`);
      executedCount++;
    }

    console.log('\n========================================');
    console.log(`🎉 Migration summary:`);
    console.log(`   - Total files found: ${allFiles.length}`);
    console.log(`   - Newly executed:    ${executedCount}`);
    console.log(`   - Already applied:   ${skippedCount}`);
    console.log('========================================\n');
  } catch (error) {
    console.error('\n❌ Migration process aborted due to an error.');
    process.exit(1);
  } finally {
    if (conn) conn.release();
    if (pool) await pool.end();
  }
}

runMigrations();
