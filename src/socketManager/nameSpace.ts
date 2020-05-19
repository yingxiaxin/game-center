import { removeArrayItem } from '../utils';
import Room from './room';

export default class NameSpace {
    nsp: any;
    nspName: any;
    allRoom: any[];
    waiting: any[];
    allSockets: any[];
    index: number;
    socketStatusMap: Map<any, any>;
    allsockets: any;

    constructor(nsp, pathname) {
        this.nsp = nsp;                         // 当前命名空间实例
        this.nspName = pathname;                // 命名空间的名称
        this.allRoom = [];                      // 所有的房间
        this.waiting = [];
        this.allSockets = [];                   // 当前命名空间内连接的所有socket
        this.index = 1;                         // 递增的房间名序号
        this.socketStatusMap = new Map();       // 记录socket状态的map,可能在等待, 也可能在房间中
        this.listen();
    }

    get rooms() {
        return this.allRoom.length;
    }

    listen() {
        this.nsp.on('connect', (socket) => {
            console.log(`客户端${socket.id}进入了空间${this.nspName}`);
            this.onConnectSocket(socket);

            socket.on('disconnect', (reason) => {
                console.log(`断开, socket-id: ${socket.id}, 原因: ${reason.toString()}`);
                this.onDisconnectSocket(socket);
            });
        });
    }

    onConnectSocket(socket) {
        // 加入总的socket数组
        this.allSockets.push(socket);
        // 加入等待队列
        this.putSocketInWaiting(socket);

        // 检测房间空余度
        this.checkRoom();
    }

    onDisconnectSocket(socket) {
        // 从总的socket数组中移除
        this.allSockets = removeArrayItem(this.allSockets, val => val === socket);
        // 从等待队列或房间中移除
        this.removeSocket(socket);
    }

    putSocketInWaiting(socket) {
        // 将socket加入等待队列
        this.waiting.push(socket);
        this.socketStatusMap.set(socket.id, 'waiting');
        return socket;
    }

    removeSocket(socket) {
        const status = this.socketStatusMap.get(socket.id);
        if (status === 'waiting') {
            this.waiting = removeArrayItem(this.waiting, val => val === socket);
        } else {
            status.leaveRoom(socket);
        }
        this.socketStatusMap.delete(socket);
    }

    checkRoom() {
        // 判断是否有房间未满员, 有的话将等待队列中的第一个socket加入房间
        for (let i = 0; i < this.allRoom.length; i++) {
            const room = this.allRoom[i];
            if (room.players < room.roomlimit) {
                this.putSocketInRoom(this.waiting[0], room);
                return;
            }
        }

        // 否则的话, 如果等待队列超过2人, 则新创建一个房间, 将队列的前两位加入房间
        if (this.waiting.length >= 2) {
            const room = new Room(this.nsp, `room${this.index}`);
            this.allRoom.push(room);
            this.index++;
            // 因为putSocketInRoom操作后,会将socket从数组中移除, 所以原来的下标1位置的socket, 到了下标0的位置
            this.putSocketInRoom(this.waiting[0], room);
            this.putSocketInRoom(this.waiting[0], room);
        }
    }

    /**
     * 将socket加入房间
     * @param {*} socket 
     * @param {*} room 
     */
    putSocketInRoom(socket, room) {
        this.waiting = removeArrayItem(this.waiting, val => val === socket);
        this.socketStatusMap.set(socket.id, room);
        room.inRoom(socket);
        return socket;
    }

}