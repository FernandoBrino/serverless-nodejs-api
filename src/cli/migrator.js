const secrets = require("../lib/secrets");
require("dotenv").config();

async function performMigration() {
  const dbUrl = await secrets.getDatabaseUrl();
  console.log(dbUrl);
}

if (require.main === module) {
  console.log("run this!");
  console.log(process.env.AWS_ACCESS_KEY_ID);
  performMigration()
    .then((val) => {
        process.exit(0)
    })
    .catch((err) => {
      console.log(err);
      process.exit(1)
    });
}
