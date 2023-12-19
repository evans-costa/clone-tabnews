import database from "infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();

  const databaseVersion = await database.query("SHOW server_version;");

  const databaseMaxConnections = await database.query("SHOW max_connections;");

  const databaseName = process.env.POSTGRES_DB;
  const databaseOpenedConnections = await database.query({
    text: "SELECT COUNT(*)::INTEGER AS opened_connections FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  });

  const results = {
    max_connections: parseInt(databaseMaxConnections.rows[0].max_connections),
    opened_connections: databaseOpenedConnections.rows[0].opened_connections,
    version: databaseVersion.rows[0].server_version,
  };

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        max_connections: results.max_connections,
        opened_connections: results.opened_connections,
        version: results.version,
      },
    },
  });
}

export default status;
