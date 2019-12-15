import axios from "axios";

//const baseUrlBackend = process.env.REACT_APP_BASE_URL_BACKEND || "https://lop-backend.herokuapp.com";
const baseUrlBackend = process.env.REACT_APP_BASE_URL_BACKEND || "http://localhost:3001";

const api = axios.create({
  baseURL: baseUrlBackend
});
api.interceptors.request.use(async config => {
  const token = sessionStorage.getItem("auth-token");
  if (token) {
    config.headers.authorization = `Bearer ${token}`;
  }
  return config;
});
export { baseUrlBackend };

export default api;
