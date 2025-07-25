import axios from 'axios';

let baseURL;
if (import.meta.env.VITE_APP_NODE_ENV === 'ngrok') {
  baseURL = `${import.meta.env.VITE_APP_NGROK_API_PORT}/api`;
} else if (import.meta.env.VITE_APP_NODE_ENV === 'development') {
  baseURL = `${import.meta.env.VITE_APP_API_PORT_URL}/api`;
} else {
  baseURL = 'https://localhost:8080/api';
}

const instance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  withCredentials: true,
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
