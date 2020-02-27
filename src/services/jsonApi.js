import axios from "axios";

const jsonApi = axios.create({
  baseURL: "https://exec.lop.ect.ufrn.br"
});

export default jsonApi
