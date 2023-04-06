import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import { Config } from '../config';
import connectDB from "./database/postgresql";
import v1Router from './routes/v1/index';

connectDB();

const app = express();
app.use(bodyParser.json());

declare module 'express-session' {
  export interface SessionData {
    uid: string;
  }
}
app.use(session({
  secret: Config.app.SESSION_SECRET,
  saveUninitialized: false,
  resave: true
}));

app.use('/api/v1', v1Router);

app.listen(Config.app.PORT, () => {
  console.log(`Server is listening on port ${Config.app.PORT}`);
});