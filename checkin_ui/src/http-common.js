import axios from "axios";

const instance = axios.create({
    baseURL: `${import.meta.env.VITE_APP_API_PORT_URL}/api`,
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: true
});

export default instance;
