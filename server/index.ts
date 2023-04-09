import { Database } from './model/database'
import express from 'express';
import user from './routes/api/users';
import auth from './routes/api/auth';
import posts from './routes/api/posts';
import categories from './routes/api/categories';
import http from 'http'
import { ORIGIN_URL } from './config';
const socketIo = require('socket.io')

const HOST = "localhost";
const USER = "root";
const PASSWORD = "secretpw";
const DB_NAME = "main";
const DB_PORT = 3306;
const EXPRESS_PORT = 3100;

const app = express();
export const db = new Database(HOST, USER, PASSWORD, DB_NAME, DB_PORT);

const server = http.createServer(app);

const io = socketIo(server, {
    cors: {
        origin: ORIGIN_URL,
    }
});

app.use("/api/user/", user);
app.use("/api/auth/", auth);
app.use("/api/posts/", posts);
app.use("/api/categories/", categories);

const onlineUsers: number[] = [];
io.on("connection", (socket: any) => {
    console.log("hi");

    socket.on("disconnect", () => {
        console.log("bye");
    })
})

server.listen(EXPRESS_PORT, () => console.log(`Started server on port ${EXPRESS_PORT}`));

