import { Database } from './model/database'
import express from 'express';
import user from './routes/api/users';
import auth from './routes/api/auth';
import posts from './routes/api/posts';
import categories from './routes/api/categories';

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
app.use("/api/posts/", posts);
app.use("/api/categories/", categories);

app.listen(EXPRESS_PORT, () => console.log(`Started server on port ${EXPRESS_PORT}`));
