import { Database } from './model/database'
import express from 'express';

const user = require("./routes/api/users");

const HOST = "localhost";
const USER = "root";
const PASSWORD = "secretpw";
const DB_NAME = "main";
const DB_PORT = 3306;
const EXPRESS_PORT = 3000;

const app = express();
export const db = new Database(HOST, USER, PASSWORD, DB_NAME, DB_PORT);

app.use("/api/user/", user);

app.listen(EXPRESS_PORT, () => console.log(`Started server on port ${EXPRESS_PORT}`));
