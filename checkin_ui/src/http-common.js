import axios from "axios";

const instance = axios.create({
    baseURL: `${import.meta.env.VITE_APP_API_PORT}/api`,
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: true
});

/*instance.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response) {
            switch (err.response.status) {
                case 401:
                    window.location.href = '/';
                    break;
                case 403:
                    window.location.href = '/403';
                    break;
                case 404:
                    window.location.href = '/404';
                    break;
                default:
                    return Promise.reject(err);
            }
        }
        return Promise.reject(err);
    }
);*/

export default instance;
