import axios from "axios";

// Helper to get token
const getToken = () => localStorage.getItem("token");

const backendClient = axios.create({
    baseURL: "http://localhost:8081/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// Interceptor to add Token
backendClient.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default backendClient;
