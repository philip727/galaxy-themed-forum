import { Database } from './model/database'
import express from 'express';
import user from './routes/api/users';
import auth from './routes/api/auth';

const HOST = "localhost";
const USER = "root";
const PASSWORD = "secretpw";
const DB_NAME = "main";
const DB_PORT = 3306;
const EXPRESS_PORT = 3100;

const app = express();
export const db = new Database(HOST, USER, PASSWORD, DB_NAME, DB_PORT);

app.use("/api/user/", user);
app.use("/api/auth/", auth);

app.listen(EXPRESS_PORT, () => console.log(`Started server on port ${EXPRESS_PORT}`));
