import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import PropTypes from 'prop-types';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import { useState } from 'react';

const WarehouseMoreOptionsDialog = ({ open, onClose, onEdit, onDelete }) => {
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);

  const handleDeleteConfirmationOpen = () => {
    setDeleteConfirmationOpen(true);
  };

  const handleDeleteConfirmationClose = () => {
    setDeleteConfirmationOpen(false);
  };

  const handleConfirmDelete = () => {
    onDelete();
    setDeleteConfirmationOpen(false);
    onClose();
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Warehouse Options</DialogTitle>
        <DialogContent>
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDeleteConfirmationOpen}
          >
            Delete Warehouse
          </Button>
          <Button
            variant="contained"
            sx={{ ml: 2 }}
            onClick={onEdit}
          >
            Edit Warehouse
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>

      <DeleteConfirmationDialog
        open={deleteConfirmationOpen}
        onClose={handleDeleteConfirmationClose}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        description="Are you sure you want to delete this warehouse?"
      />
    </>
  );
};

WarehouseMoreOptionsDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default WarehouseMoreOptionsDialog;