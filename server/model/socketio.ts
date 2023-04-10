import http from 'http'
import { ORIGIN_URL } from '../config';
import { verifyJWTToken } from '../scripts/auth';
import handlePromise from '../scripts/promiseHandler';
const socketIo = require('socket.io')
import jwtDecode from 'jwt-decode'
import { IJWTPayload } from '../types/auth';
import { getUserRole } from '../scripts/users';

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

    async #attemptToPushUser(userDetails: IJWTPayload, socket: any) {
        const userExists = this.#tempUsers.find(x => x.uid == userDetails.uid);
        if (userExists) {
            return;
        }
        this.#tempUsers.push({ uid: userDetails.uid, socketId: socket.id});

        let [err, data] = await handlePromise<object | string>(getUserRole(userDetails.uid));

        if (err) {
            console.log(`${err} // when connecting client from: ${socket.handshake.address}`);
            return;
        }

        // @ts-ignore
        this.onlineUsers.push({ name: userDetails.username, uid: userDetails.uid, role: data.role })
    }

    #removeUser(socket: any) {
        const tempUserFromSocket = this.#tempUsers.find(x => x.socketId == socket.id);        
        if (!tempUserFromSocket) {
            return;
        }

        let tempUserIndex = this.#tempUsers.indexOf(tempUserFromSocket);
        if (tempUserIndex <= -1) {
            return;
        }

        let userFromUid = this.onlineUsers.find(x => x.uid = tempUserFromSocket.uid);
        if (!userFromUid) {
            return;
        }
        
        let userIndex = this.onlineUsers.indexOf(userFromUid);
        if (userIndex <= -1) {
            return;
        }

        this.#tempUsers.splice(tempUserIndex, 1);
        this.onlineUsers.splice(userIndex, 1);
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

                await this.#attemptToPushUser(userDetails, socket);
            })

            socket.on("disconnect", () => {
                this.#removeUser(socket);
            })
        })
    }
}
