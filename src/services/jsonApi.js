import axios from "axios";

const jsonApi = axios.create({
  baseURL: "https://exec.lop.natalnet.br"
});

export default jsonApi
