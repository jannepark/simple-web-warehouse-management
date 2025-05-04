import { useState } from 'react'
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from '@mui/material'
import PropTypes from 'prop-types'

const CreateWarehouseDialog = ({ open, onClose, onCreate }) => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [errorMessage, setErrorMessage] = useState('');

  const handleCreate = () => {
    const trimmedName = name.trim();
    if (!trimmedName.trim()) {
      setErrorMessage('Warehouse name is required.');
      return;
    } else {
      onCreate({ name: trimmedName, description })
      setName('')
      setDescription('')
      setErrorMessage('')
      onClose()
    }
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create New Warehouse</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Warehouse Name"
          type="text"
          fullWidth
          value={name}
          onChange={(e) => {
            if (e.target.value.trim()) {
              setErrorMessage('');
            }
            setName(e.target.value)
          }}
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

CreateWarehouseDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
}

export default CreateWarehouseDialog