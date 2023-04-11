import { Database } from './model/database'
import { SocketIOServer } from './model/socketio'
import express from 'express';
import user from './routes/api/users';
import auth from './routes/api/auth';
import posts from './routes/api/posts';
import categories from './routes/api/categories';
import account from './routes/api/account';
import http from 'http'

const HOST = "localhost";
const USER = "root";
const PASSWORD = "secretpw";
const DB_NAME = "main";
const DB_PORT = 3306;
const SERVER_PORT = 3100;

const app = express();
const server = http.createServer(app);
export const db = new Database(HOST, USER, PASSWORD, DB_NAME, DB_PORT);
export const socketIOServer = new SocketIOServer(server);

app.use("/public", express.static(__dirname + "/public"));
app.use("/api/user/", user);
app.use("/api/auth/", auth);
app.use("/api/posts/", posts);
app.use("/api/categories/", categories);
app.use("/api/account/", account);

server.listen(SERVER_PORT, () => console.log(`Started server on port ${SERVER_PORT}`));
