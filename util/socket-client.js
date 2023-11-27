import { io } from 'socket.io-client';
import config from './config';
var socket = io(config.socketServer);
// var socket = io('http://localhost:8090/');


export default socket;