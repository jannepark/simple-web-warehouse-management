import { useState } from 'react'
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from '@mui/material'
import PropTypes from 'prop-types'

const CreateLocationDialog = ({ open, onClose, onCreate, warehouseId }) => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [errorMessage, setErrorMessage] = useState('');

  const handleCreate = () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setErrorMessage('Location name is required.');
      return;
    } else {
      onCreate({ name: trimmedName, description, warehouseId })
      setName('')
      setDescription('')
      onClose()
    }
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create New Location</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Location Name"
          type="text"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={!!errorMessage}
          helperText={errorMessage}
        />
        <TextField
          margin="dense"
          label="Description"
          type="text"
          fullWidth
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleCreate} color="primary">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  )
}

CreateLocationDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
  warehouseId: PropTypes.number.isRequired,
}

export default CreateLocationDialog