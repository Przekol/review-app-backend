import * as express from "express";
import { Application, json, NextFunction, Request, Response } from "express";
import "./config/db";
import { ENV } from "./config/env-variables";
import { userRouter } from "./controllers/user.controller";

const app: Application = express();
app.use(json());
app.use("/api/user", userRouter);

app.listen(ENV.PORT, ENV.HOST, () => {
  console.log(`Listening on http://${ENV.HOST}:${ENV.PORT}`);
});
