import { LOGIN_TOKEN_NAME, SERVER_URL } from './config';
import socketIOClient from 'socket.io-client'
import store, { RootState } from '../store'

let socket: any = null;

const checkOnlineStatus = (user: any) => {
    if (user.value.uid < 0 || user.value.username.length == 0 || !localStorage[LOGIN_TOKEN_NAME]) {
        socket.emit('offline');
        return;
    }

    socket.emit('online', localStorage[LOGIN_TOKEN_NAME]);
}

const select = (state: RootState) => {
    return state.user;
}

const listener = () => {
    let user = select(store.getState());
    checkOnlineStatus(user)
}

export default async function() {
    if (!socket) {
        socket = socketIOClient(SERVER_URL, { reconnectionAttempts: 5 });
    }

    store.subscribe(listener)
}

