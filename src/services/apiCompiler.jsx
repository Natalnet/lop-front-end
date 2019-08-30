import axios from 'axios'

//const base_url = process.env.REACT_APP_BASE_URL || 'http://localhost:3002'
const base_url = process.env.REACT_APP_BASE_URL || 'https://api-run-code.herokuapp.com'

const apiCompiler = axios.create({
	baseURL: base_url
})
export default apiCompiler
