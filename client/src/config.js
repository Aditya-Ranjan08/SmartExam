import axios from "axios";

export const server_url = import.meta.env.VITE_SERVER_URL?.trim()
    || "https://smartexam-backend-ypxk.onrender.com";

axios.defaults.withCredentials = true;
