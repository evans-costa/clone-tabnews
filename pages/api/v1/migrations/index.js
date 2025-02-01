import { createRouter } from "next-connect";
import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import database from "infra/database";
import controller from "infra/controller";

const router = createRouter();

router.get(getHandler);
router.post(postHandler);

export default router.handler(controller.errorHandlers);

async function getDatabaseMigrations({ dryRun = true }) {
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
    await dbClient.end();
  }
}

async function getHandler(request, response) {
  const pendingMigrations = await getDatabaseMigrations({});
  return response.status(200).json(pendingMigrations);
}

async function postHandler(request, response) {
  const migratedMigrations = await getDatabaseMigrations({ dryRun: false });

  if (migratedMigrations.length > 0) {
    return response.status(201).json(migratedMigrations);
  }

  return response.status(200).json(migratedMigrations);
}
