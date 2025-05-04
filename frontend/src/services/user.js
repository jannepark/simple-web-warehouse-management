import axios from 'axios'
import handleApiError from '../utils/apiErrorHandler'

const baseUrl = '/api/users'

export const logout = async (token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  }
  try {
    await axios.delete(`${baseUrl}/logout`, config)
  } catch (error) {
    handleApiError(error)
  }
}

export const editUser = async (currentPassword, user, token, handleLogout) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  }
  try {
    const response = await axios.put(`${baseUrl}`,  { currentPassword, user }, config)
    return response.data
  } catch (error) {
    if (error.response.status === 400 && error.response.data.error[0] === 'username must be unique') {
      return error.response.data.error}
    handleApiError(error, handleLogout)
  }
}  

export const changeUserPassword = async (currentPassword, newPassword, token, handleLogout) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  }
  try {
    const response = await axios.put(`${baseUrl}/password`, { currentPassword, newPassword  }, config)
    return response.data
  } catch (error) {
    handleApiError(error, handleLogout)
  }
}

export const getUser = async (token, handleLogout) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  }
  try {
    const response = await axios.get(`${baseUrl}/user`, config)
    return response.data
  } catch (error) {
    handleApiError(error, handleLogout)
  }
}

export const createUser = async (newUser) => {
  try {
    const response = await axios.post(`${baseUrl}`, newUser)
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

