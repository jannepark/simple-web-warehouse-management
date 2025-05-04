import axios from 'axios'
import handleApiError from '../utils/apiErrorHandler'

const baseUrl = '/api/warehouses'

const getAll = async (token, handleLogout) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  }
  try {
    const response = await axios.get(baseUrl, config)
    return response.data
  } catch (error) {
    if (error.response && error.response.status === 404 && error.response.data.error === 'no warehouses found for user') {
      return []
    }
    handleApiError(error, handleLogout)

  }
}

const createWarehouse = async (token, warehouse, handleLogout) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  }
  try {
    const response = await axios.post(baseUrl, warehouse, config)
    return response.data
  } catch (error) {
    handleApiError(error, handleLogout)

  }
}

const deleteWarehouse = async (token, id, handleLogout) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  }
  try {
    await axios.delete(`${baseUrl}/${id}`, config)
  } catch (error) {
    handleApiError(error, handleLogout)
  }
}

const updateWarehouse = async (token, warehouse, handleLogout) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  }
  try {
    await axios.put(`${baseUrl}/${warehouse.id}`, warehouse, config)
  } catch (error) {
    handleApiError(error, handleLogout)
  }
}

export default { getAll, createWarehouse, deleteWarehouse, updateWarehouse }
