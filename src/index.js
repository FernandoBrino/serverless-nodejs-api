const serverless = require("serverless-http");
const express = require("express");
const { neon, neonConfig } = require("@neondatabase/serverless");
const AWS = require("aws-sdk");

const AWS_REGION = "us-east-1";
const STAGE = process.env.STAGE || 'prod';

const app = express();
const ssm = new AWS.SSM({ region: AWS_REGION });

//Parameter name inside AWS SSM
const DATABASE_URL_SSM_PARAM = `/serverless-nodejs-api/${STAGE}/database-url`;

async function dbClient() {

  // Get parameter "database url" inside ssm from amazon
  const paramStoreData = await ssm.getParameter({
    Name: DATABASE_URL_SSM_PARAM,
    WithDecryption: true
  }).promise()

  // Get database url
  const dbUrl = paramStoreData.Parameter.Value

  // for http connection
  // non-pooling
  neonConfig.fetchConnectionCache = true;
  const sql = neon(dbUrl);
  return sql;
}

app.get("/", async (req, res, next) => {
  const sql = await dbClient();
  const [results] = await sql`select now();`;

  return res.status(200).json({
    message: "Hello from root!",
    results: results.now,
  });
});

app.get("/hello", (req, res, next) => {
  return res.status(200).json({
    message: "Hello from path!",
  });
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

// server-full app
// app.listen(3000, () => {
//   console.log("running at http://localhost:3000");
// })

exports.handler = serverless(app);
