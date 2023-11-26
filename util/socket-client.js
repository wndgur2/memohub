import { io } from 'socket.io-client';
var socket = io('https://port-0-server-for-tableorder-7lk2blopce1o7.sel5.cloudtype.app/');
// var socket = io('http://localhost:8090/');


export default socket;