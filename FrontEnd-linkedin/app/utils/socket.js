import {io} from "socket.io-client";
const url = process.env.EXPO_PUBLIC_BACKEND_URL;
const socket = io(`${url}`);
export default socket;