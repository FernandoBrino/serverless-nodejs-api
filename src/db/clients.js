const { neon, neonConfig } = require("@neondatabase/serverless");
const secrets = require('../lib/secrets')

async function getDbClient() {
    const dburl = await secrets.getDatabaseUrl()
  // for http connection
  // non-pooling
  neonConfig.fetchConnectionCache = true;
  const sql = neon(dburl);
  return sql;
}

module.exports.getDbClient = getDbClient