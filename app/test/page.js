"use client";
// socket connection test
import { useEffect } from "react";
import { io } from "socket.io-client";

let socket;
export default function Test() {
    useEffect(() => {
        async function socketInitializer(){
            try{
                const res = await fetch('/api/sockets/connection', {
                    method: 'GET',
                });
            } catch (error) {
                console.error('Error fetching data:', error);
                return;
            }
            socket = io("/api/sockets/connection");
            socket.on("connect", () => {
                console.log("socket connected");
            });
            socket.on("disconnect", () => {
                console.log("socket disconnected");
            });
            socket.on("error", (err) => {
                console.log("socket error: ", err);
            });
        }
        // socketInitializer();

        return () => {
            socket?.disconnect();
        }
    }, []);
    return (
        <div>
            TEST
        </div>
    )
}