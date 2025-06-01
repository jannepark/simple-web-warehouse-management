import axios from 'axios'
import handleApiError from '../utils/apiErrorHandler'

const baseUrl = '/api/inventories'

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

const getInventoryByLocation = async (token, locationId, handleLogout) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  }
  try {
    const response = await axios.get(`${baseUrl}/${locationId}`, config)
    return response.data
  }
  catch (error) {
    handleApiError(error, handleLogout)
  }
}


const createInventory = async (token, inventory, handleLogout) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  }
  try {
    console.log('new inventory', inventory)
    const response = await axios.post(baseUrl, inventory, config)
    return response.data
  } catch (error) {
    if (error.response.data.error === 'Inventory with this item and location already exists') {
      return error.response.data.error
    }
    handleApiError(error, handleLogout)
  }
}

const updateInventory = async (token, inventory, handleLogout) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  }
  try {
    const response = await axios.put(`${baseUrl}/${inventory.inventoryId}`, inventory, config)
    return response.data
  } catch (error) {
    handleApiError(error, handleLogout)
  }
}

const deleteInventory = async (token, inventoryId, handleLogout) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  }
  try {
    await axios.delete(`${baseUrl}/${inventoryId}`, config)
  } catch (error) {
    handleApiError(error, handleLogout)
  }
}

const updateItem = async (token, item, handleLogout) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  }
  try {
    console.log('item', item)
    const response = await axios.put(`${baseUrl}/item/${item.id}`, item, config)
    return response.data
  } catch (error) {
    handleApiError(error, handleLogout)
  }
}

const createItem = async (token, item, handleLogout) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  }
  try {
    const response = await axios.post(`${baseUrl}/item`, item, config)
    return response.data
  } catch (error) {
    handleApiError(error, handleLogout)
  }
}

const deleteItem = async (token, itemId, handleLogout) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  }
  try {
    await axios.delete(`${baseUrl}/item/${itemId}`, config)
  } catch (error) {
    handleApiError(error, handleLogout)
  }
}

export default { getAll, getInventoryByLocation, createInventory, updateInventory, deleteInventory, updateItem, createItem, deleteItem }