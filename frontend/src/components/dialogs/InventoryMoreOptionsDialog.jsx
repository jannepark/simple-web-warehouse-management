import { Dialog, DialogTitle, DialogContent, DialogContentText, Typography, Button } from '@mui/material';
import PropTypes from 'prop-types';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import { useState } from 'react';

const InventoryMoreOptionsDialog = ({ open, onClose, selectedInventory, onEdit, onDelete }) => {
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);

  const handleDeleteConfirmationOpen = () => {
    setDeleteConfirmationOpen(true);
  };

  const handleDeleteConfirmationClose = () => {
    setDeleteConfirmationOpen(false);
  };

  const handleDelete = () => {
    if (selectedInventory?.id) {
      onDelete(selectedInventory.id);
    } else {
      console.error('Selected inventory is undefined');
    }
    setDeleteConfirmationOpen(false);
    onClose();
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>
          Item: <strong>{selectedInventory?.item?.name}</strong>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>Description:</DialogContentText>
          <Typography variant="body2" sx={{ mb: 2 }}>
            {selectedInventory?.item?.description}
          </Typography>
          <DialogContentText>Category:</DialogContentText>
          <Typography variant="body2" sx={{ mb: 2 }}>
            {selectedInventory?.item?.category}
          </Typography>
          <DialogContentText>Unit:</DialogContentText>
          <Typography variant="body2" sx={{ mb: 2 }}>
            {selectedInventory?.item?.unit}
          </Typography>
          <DialogContentText>Quantity:</DialogContentText>
          <Typography variant="body2" sx={{ mb: 2 }}>
            {selectedInventory?.quantity}
          </Typography>
          <DialogContentText>Barcode:</DialogContentText>
          <Typography variant="body2" sx={{ mb: 2 }}>
            {selectedInventory?.item.barcode}
          </Typography>
          <Button data-testid="item-edit-button" onClick={() => onEdit(selectedInventory)}>
            Edit Item
          </Button>
          <Button onClick={handleDeleteConfirmationOpen} color="error">
            Delete
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </DialogContent>
      </Dialog>

      <DeleteConfirmationDialog
        open={deleteConfirmationOpen}
        onClose={handleDeleteConfirmationClose}
        onConfirm={handleDelete}
      />
    </>
  );
};

InventoryMoreOptionsDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  selectedInventory: PropTypes.object,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default InventoryMoreOptionsDialog;