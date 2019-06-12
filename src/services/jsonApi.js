import axios from "axios";

const jsonApi = axios.create({
  baseURL: "http://localhost:3002"
});

export default jsonApi