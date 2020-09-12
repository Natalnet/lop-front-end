import axios from "axios";

//const baseUrlBackend =process.env.REACT_APP_BASE_URL_BACKEND || "https://lop-backend.herokuapp.com";
//const baseUrlBackend = process.env.REACT_APP_BASE_URL_BACKEND || "http://localhost:3001";
const baseUrlBackend = process.env.REACT_APP_BASE_URL_BACKEND || "https://api.lop.natalnet.br:3001";

const api = axios.create({
  baseURL: baseUrlBackend,
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("auth-token");
  const profile = sessionStorage.getItem("user.profile");
  if (token) {
    config.headers.authorization = `Bearer ${token}`;
  }
  if (profile) {
    config.headers.profile = profile;
  }
  return config;
});
export { baseUrlBackend };

export default api;

