import * as express from 'express';
import { Application, json } from 'express';
import * as morgan from 'morgan';
import './config/db';
import { ENV } from './config';
import { userRouter } from './controllers/user.controller';
import { errorHandler } from './middlewares';

const app: Application = express();
app.use(json());
app.use(morgan('dev'));
app.use('/api/user', userRouter);

app.use(errorHandler);

app.listen(ENV.PORT, ENV.HOST, () => {
  console.log(`Listening on http://${ENV.HOST}:${ENV.PORT}`);
});
