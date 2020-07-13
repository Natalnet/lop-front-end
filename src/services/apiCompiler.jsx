import axios from 'axios'

//const base_url = process.env.REACT_APP_BASE_URL_COMPILER || 'https://api-run-code.herokuapp.com'
const base_url = process.env.REACT_APP_BASE_URL_COMPILER || 'https://exec.lop.ect.ufrn.br'
//const base_url = process.env.REACT_APP_BASE_URL_COMPILER || 'http://localhost:443'
//const base_url = process.env.REACT_APP_BASE_URL_COMPILER || 'http://ec2-18-188-221-21.us-east-2.compute.amazonaws.com'

const apiCompiler = axios.create({
	baseURL: base_url
})

export default apiCompiler
