import * as express from "express";
import { Application } from "express";
import { ENV } from "./config/env-variables";

const app: Application = express();

app.listen(ENV.PORT, ENV.HOST, () => {
  console.log(`Listening on http://${ENV.HOST}:${ENV.PORT}`);
});
