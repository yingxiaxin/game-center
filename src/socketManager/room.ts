export default class Room {
    name: any;
    server: any;
    gameCore: any;
    allSockets: any[];
    roomlimit: number;

    constructor(server, name) {
        this.name = name;
        this.server = server;
        this.gameCore = null;
        this.allSockets = [];
        this.roomlimit = 2;
    }

    get players() {
        return this.allSockets.length;
    }

    inRoom(socket) {
        if (this.allSockets.length <= this.roomlimit) {
            this.allSockets.push(socket);
            console.log(`有新玩家加入房间, socketid: ${socket.id}`);
        }
    }

    leaveRoom(socket) {
        console.log(`玩家离开房间, socketid: ${socket.id}`);
    }
}