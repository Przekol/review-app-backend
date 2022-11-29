import { connect } from "mongoose";
import { ENV } from "./env-variables";

async function main() {
  await connect(
    `mongodb://${ENV.MONGO_USERNAME}:${ENV.MONGO_PASSWORD}@${ENV.MONGO_HOST}:${ENV.MONGO_PORT}/`,
    {
      dbName: ENV.MONGO_DB_NAME,
    }
  );
}
main()
  .then(() => {
    console.log("DB is connected");
  })
  .catch((err) => {
    console.log("DB connection failed", err);
  });
