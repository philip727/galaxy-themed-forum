import http from 'http'
import { ORIGIN_URL } from '../config';
import { verifyJWTToken } from '../scripts/auth';
import handlePromise from '../scripts/promiseHandler';
const socketIo = require('socket.io')
import jwtDecode from 'jwt-decode'
import { IJWTPayload } from '../types/auth';
import { QueryError } from '../types/errors';
import { findUser } from '../scripts/users';

export class SocketIOServer {
    #server: http.Server;
    io: any;
    onlineUsers: { 
        name: string,
        uid: number,
        role: string,
    }[] = [];
    #tempUsers: {uid: number, socketId: string}[] = [];
    constructor(server: http.Server) {
        this.#server = server;

        this.#init();
        this.#connection();
    }

    #init() {
        this.io = socketIo(this.#server, {
            cors: {
                origin: ORIGIN_URL,
            }
        });
    }

    clearOnlineUsers() {
        this.onlineUsers = [];
    }


    async pushUserOnline(userDetails: IJWTPayload, socket: any) {
        const tempUserFromUID = this.#tempUsers.find(x => x.uid == userDetails.uid);
        if (tempUserFromUID) {
            return;
        }
        this.#tempUsers.push({ uid: userDetails.uid, socketId: socket.id });

        const onlineUserFromUID = this.onlineUsers.find(x => x.uid == userDetails.uid);
        if (onlineUserFromUID) {
            return;
        }

        const [err, data] = await handlePromise<any | QueryError>(findUser(["role"], `uid = ${userDetails.uid}`));

        if (err) {
            console.log(`${err} // when connecting client from: ${socket.handshake.address}`);
            return;
        }

        // @ts-ignore
        this.onlineUsers.push({ name: userDetails.username, uid: userDetails.uid, role: data.role })
    }

    removeUser(socket: any) {
        const tempUserFromSocket = this.#tempUsers.find(x => x.socketId == socket.id);
        if (!tempUserFromSocket) {
            return;
        }


        const tempUserIndex = this.#tempUsers.indexOf(tempUserFromSocket);
        if (tempUserIndex <= -1) {
            return;
        }

        this.#tempUsers.splice(tempUserIndex, 1);
        
        const userFromOnline = this.onlineUsers.find(x => x.uid == tempUserFromSocket.uid);
        if (!userFromOnline) {
            return;
        }

        const userOnlineIndex = this.onlineUsers.indexOf(userFromOnline);
        if (userOnlineIndex <= -1) {
            return;
        }


        this.onlineUsers.splice(userOnlineIndex, 1);
    }

    #connection() {
        this.io.on("connection", (socket: any) => {
            socket.on('online', async (jwt: string) => {
                const [err] = await handlePromise<string>(verifyJWTToken(jwt));
                if (err) {
                    console.log(`${err} // when connecting client from: ${socket.handshake.address}`);
                    return;
                }

                const userDetails = jwtDecode(jwt) as IJWTPayload;

                this.pushUserOnline(userDetails, socket);
            })

            socket.on('offline', () => {
                this.removeUser(socket);
            })

            socket.on("disconnect", () => {
                this.removeUser(socket);
            })
        })
    }
}
