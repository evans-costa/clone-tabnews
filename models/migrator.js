import migrationRunner from "node-pg-migrate";
import database from "infra/database";
import { resolve } from "node:path";

async function runnningMigrations({ dryRun }) {
  const dbClient = await database.getNewClient();
  try {
    return await migrationRunner({
      dbClient: dbClient,
      databaseUrl: process.env.DATABASE_URL,
      dryRun: dryRun,
      dir: resolve("infra", "migrations"),
      direction: "up",
      verbose: true,
      migrationsTable: "pgmigrations",
      noLock: true,
    });
  } finally {
    await dbClient?.end();
  }
}

const migrator = {
  listPendingMigrations: () => runnningMigrations({ dryRun: true }),
  runPendingMigrations: () => runnningMigrations({ dryRun: false }),
};

export default migrator;
