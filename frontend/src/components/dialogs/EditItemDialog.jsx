import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, DialogContentText } from '@mui/material';
import PropTypes from 'prop-types';
import { useState } from 'react';
import BarcodeScanningDialog from './BarcodeScanningDialog';

const EditItemDialog = ({ open, onClose, editItem, setEditItem, errorMessage, onDelete, onSave, }) => {
  const [barcodeDialogOpen, setBarcodeDialogOpen] = useState(false);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);

  const handleScanResult = (scannedBarcode) => {
    setEditItem({ ...editItem, barcode: scannedBarcode });
    setBarcodeDialogOpen(false);
  };

  const handleDeleteClick = () => {
    setDeleteConfirmationOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setDeleteConfirmationOpen(false);
    await onDelete();
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmationOpen(false);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Edit Item</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Item Name"
            fullWidth
            value={editItem.name}
            onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
            data-testid="item-name-input"
            error={!!errorMessage}
            helperText={errorMessage}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            value={editItem.description}
            onChange={(e) => setEditItem({ ...editItem, description: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Category"
            fullWidth
            value={editItem.category}
            onChange={(e) => setEditItem({ ...editItem, category: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Unit"
            fullWidth
            value={editItem.unit}
            onChange={(e) => setEditItem({ ...editItem, unit: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Barcode"
            fullWidth
            value={editItem.barcode || ''}
            onChange={(e) => setEditItem({ ...editItem, barcode: e.target.value })}
          />
          <Button onClick={() => setBarcodeDialogOpen(true)} color="primary" variant="outlined" sx={{ mt: 1 }}>
            Scan Barcode
          </Button>
        </DialogContent>
        <DialogActions>
          {/* delete on the left side */}
          <Button onClick={handleDeleteClick} color="error" variant="outlined" sx={{ mr: 'auto' }}>
            Delete
          </Button>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button onClick={onSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteConfirmationOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this item? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <BarcodeScanningDialog
        open={barcodeDialogOpen}
        onClose={() => setBarcodeDialogOpen(false)}
        onScanResult={handleScanResult}
      />
    </>
  );
};

EditItemDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  editItem: PropTypes.object.isRequired,
  setEditItem: PropTypes.func.isRequired,
  errorMessage: PropTypes.string,
  onDelete: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default EditItemDialog;