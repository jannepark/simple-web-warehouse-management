import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Button,
} from '@mui/material'
import warehousesService from '../../services/warehouses'
import { useAuth } from '../../hooks/useAuth'
import PropTypes from 'prop-types'

const EditWarehouseDialog = ({
  open,
  onClose,
  warehouse,
  triggerRefresh,
}) => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const { token, handleLogout } = useAuth()
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (open && warehouse) {
      setErrorMessage('')
      setName(warehouse.name || '')
      setDescription(warehouse.description || '')
    }
  }, [open, warehouse])

  const handleSave = async () => {
    try {
      if (!name.trim()) {
        setErrorMessage('Warehouse name is required.')
        return
      } else {
        await warehousesService.updateWarehouse(token, {
          id: warehouse.id,
          name,
          description,
        }, handleLogout)
        triggerRefresh()
        setErrorMessage('')
        onClose()
      }
    } catch (error) {
      console.error('Error updating warehouse:', error)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="edit-warehouse-dialog-title">
      <DialogTitle id="edit-warehouse-dialog-title">Edit Warehouse</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Change the warehouse name and description.
        </DialogContentText>
        <TextField
          margin="normal"
          label="Warehouse Name"
          fullWidth
          value={name}
          onChange={(e) => {
            if (e.target.value.trim()) {
              setErrorMessage('')
            }
            if (e.target.value.trim() === '') {
              setErrorMessage('Warehouse name is required.')
            }
            setName(e.target.value)
          }}
          sx={{ mt: 2 }}
          error={!!errorMessage}
          helperText={errorMessage}
        />
        <TextField
          margin="normal"
          label="Description"
          fullWidth
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          multiline
          rows={3}
          sx={{ mt: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}

EditWarehouseDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  warehouse: PropTypes.object,
  triggerRefresh: PropTypes.func.isRequired,
}

export default EditWarehouseDialog