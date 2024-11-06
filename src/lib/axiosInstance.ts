import axios, {
	AxiosInstance,
	InternalAxiosRequestConfig,
	AxiosError,
} from "axios";

const axiosInstance: AxiosInstance = axios.create({
	baseURL: "https://backend-kruearth.onrender.com/api",
	timeout: 10000,
	headers: {
		"Content-Type": "application/json",
	},
});

axiosInstance.interceptors.request.use(
	(config: InternalAxiosRequestConfig) => {
		const token = localStorage.getItem("token");
		if (token && config.headers) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error: AxiosError) => {
		return Promise.reject(error);
	}
);

export default axiosInstance;
