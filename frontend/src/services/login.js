import axios from 'axios'

const baseUrl = '/api/users/login'

const login = async (credentials) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  }
  const response = await axios.post(baseUrl, credentials, config)
  return response.data
}


export default { login }