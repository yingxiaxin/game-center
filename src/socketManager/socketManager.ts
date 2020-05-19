import NameSpace from './nameSpace';
import { removeArrayItem } from '../utils';

export default class SocketManager {
    io: any;
    nameSpaceList: {};
    allsockets: any[];
    
    static instance = null;
    static getInstance(io) {
        if (!this.instance) {
            return new SocketManager(io);
        } else {
            return this.instance;
        }
    }

    constructor(io) {
        this.io = io;
        this.nameSpaceList = {};
        this.allsockets = [];
        this.listen();
    }

    openNameSpace(pathname) {
        const nsp = this.io.of(pathname);
        const namespace = new NameSpace(nsp, pathname);
        this.nameSpaceList[pathname] = namespace;
    }

    globalBroadcast(msg) {
        this.io.emit(msg);
    }

    listen() {
        this.io.on('connect', (socket) => {
            console.log(`连接, socket-id: ${socket.id}`);
            this.allsockets.push(socket);
            socket.emit('news', 'the server said welcome!');

            // let x = 0, y = 0;
            // const sid = setInterval(() => {
            //     socket.emit('news', {x, y});
            //     x += 2;
            //     y += 2;
            //     console.log('sending message');
            // }, 16);

            socket.on('disconnect', (reason) => {
                console.log(`断开, socket-id: ${socket.id}, 原因: ${reason.toString()}`);
                this.allsockets = removeArrayItem(this.allsockets, val => val === socket);

                // clearInterval(sid);
            });
        });
    }
}