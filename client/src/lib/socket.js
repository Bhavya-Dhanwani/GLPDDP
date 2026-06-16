import { io } from "socket.io-client";

const apiBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000/api";
const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || apiBaseUrl.replace(/\/api\/?$/, "");

let socket;

export const getSocket = () => {
    if (!socket) {
        socket = io(socketUrl, {
            autoConnect: false,
            withCredentials: true,
            transports: ["websocket", "polling"],
        });
    }

    return socket;
};

export default getSocket;
