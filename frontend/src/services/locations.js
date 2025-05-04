import axios from 'axios'
import handleApiError from '../utils/apiErrorHandler'

const baseUrl = '/api/locations'

const getAll = async (token, handleLogout) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  }
  try {
    const response = await axios.get(baseUrl, config)
    return response.data
  } catch (error) {
    handleApiError(error, handleLogout)
  }
}

const createLocation = async (token, location, handleLogout) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  }
  try {
    const response = await axios.post(baseUrl, location, config)
    return response.data
  } catch (error) {
    handleApiError(error, handleLogout, handleLogout)
  }
}

const deleteLocation = async (token, id, handleLogout) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  }
  try {
    await axios.delete(`${baseUrl}/${id}`, config)
  } catch (error) {
    handleApiError(error, handleLogout)
  }
}

const updateLocation = async (token, location, handleLogout) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  }
  try {
    await axios.put(`${baseUrl}/${location.id}`, location, config)
  } catch (error) {
    handleApiError(error, handleLogout)
  }
}

export default { getAll, createLocation, deleteLocation, updateLocation }