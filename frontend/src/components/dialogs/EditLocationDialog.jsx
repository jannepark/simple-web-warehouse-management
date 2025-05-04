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
import locationsService from '../../services/locations'
import DeleteConfirmationDialog from './DeleteConfirmationDialog'
import { useAuth } from '../../hooks/useAuth'
import PropTypes from 'prop-types'

const EditLocationDialog = ({
  open,
  onClose,
  location,
  triggerRefresh,
}) => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)
  const { token, handleLogout } = useAuth()
  const [errorMessage, setErrorMessage] = useState('')


  useEffect(() => {
    if (open && location) {
      setErrorMessage('')
      setName(location.name || '')
      setDescription(location.description || '')
    }
  }, [open, location])

  const handleUpdate = async () => {
    try {
      let trimmedName = name.trim()
      if (!trimmedName) {
        setErrorMessage('Location name is required.')
        return
      }
      await locationsService.updateLocation(token, {
        id: location.id,
        name: trimmedName,
        description,
      }, handleLogout)
      triggerRefresh()
      onClose()
    } catch (error) {
      console.error('Error updating location:', error)
    }
  }

  const handleDelete = async () => {
    try {
      await locationsService.deleteLocation(token, location.id, handleLogout)
      triggerRefresh()
      onClose()
      setDeleteConfirmationOpen(false)
    } catch (error) {
      console.error('Error deleting location:', error)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="edit-location-dialog-title">
      <DialogTitle id="edit-location-dialog-title">
        Edit or Delete Location
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Update the name or description, or delete this location entirely.
        </DialogContentText>
        <TextField
          margin="normal"
          label="Location Name"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
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
        <Button onClick={() => setDeleteConfirmationOpen(true)} color="error">
          Delete
        </Button>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleUpdate}>
          Save
        </Button>
      </DialogActions>
      <DeleteConfirmationDialog
        open={deleteConfirmationOpen}
        onClose={() => setDeleteConfirmationOpen(false)}
        onConfirm={handleDelete} // your delete handler
        title="Delete Location"
        description={`Are you sure you want to delete ${location?.name}?`}
      />
    </Dialog>
  )
}

EditLocationDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  location: PropTypes.object,
  triggerRefresh: PropTypes.func.isRequired,
}

export default EditLocationDialog