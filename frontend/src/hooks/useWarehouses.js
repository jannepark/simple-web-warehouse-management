import { useState, useEffect, useCallback } from 'react'
import warehousesService from '../services/warehouses'
import handleApiError from '../utils/apiErrorHandler'

const useWarehouses = (token, handleLogout) => {
  const [warehouses, setWarehouses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [refresh, setRefresh] = useState(false)

  const fetchWarehouses = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await warehousesService.getAll(token, handleLogout)
      if (data && data.length > 0) {
        data.sort((a, b) => a.name.localeCompare(b.name))
        data.forEach((warehouse) => {
          if (warehouse.locations) {
            warehouse.locations.sort((a, b) => a.name.localeCompare(b.name))
          }
        })
        setWarehouses(data)
      } else if (data && data.length === 0) {
        setWarehouses([])
        setError('No warehouses found, create one to get started')
      }
    } catch (err) {
      console.error('Error fetching warehouses:', err)
      handleApiError(err, handleLogout)
    } finally {
      setLoading(false)
      setRefresh(false)
    }
  }, [token, handleLogout])

  useEffect(() => {
    if (token) {
      fetchWarehouses()
    } else {
      setWarehouses([])
      setLoading(false)
    }
  }, [token, refresh, fetchWarehouses])

  const triggerRefresh = () => setRefresh(true)

  return {
    warehouses,
    loading,
    error,
    setError,
    triggerRefresh,
  }
}

export default useWarehouses