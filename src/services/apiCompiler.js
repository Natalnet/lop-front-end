import axios from 'axios';

const base_url = process.env.REACT_APP_BASE_URL_COMPILER || "http://localhost:3003"
const apiCompiler = axios.create({
	baseURL: base_url
})

export default apiCompiler;
