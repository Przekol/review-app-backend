import * as express from "express";
import { Application, json } from "express";
import "./config/db";
import { ENV } from "./config/env-variables";
import { userRouter } from "./routes/user";

const app: Application = express();
app.use(json());
app.use("/user", userRouter);

app.listen(ENV.PORT, ENV.HOST, () => {
  console.log(`Listening on http://${ENV.HOST}:${ENV.PORT}`);
});
