import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogActions,
  DialogTitle,
  TextField,
  Button,
  DialogContentText,
  Box
} from '@mui/material';
import inventoryService from '../../services/inventory';
import { useAuth } from '../../hooks/useAuth';
import BarcodeScanningDialog from './BarcodeScanningDialog';

const CreateItemDialog = ({ open, onClose }) => {
  const { token, handleLogout } = useAuth();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [unit, setUnit] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [barcode, setBarcode] = useState('');
  const [isScanDialogOpen, setIsScanDialogOpen] = useState(false);

  const handleCreate = async () => {
    setErrorMessage('');
    let response;
    try {
      if (!name) {
        setErrorMessage('Item name is required.');
        return;
      }
      response = await inventoryService.createItem(token, { name, description, category, unit, barcode }, handleLogout);
      console.log(response)
      window.dispatchEvent(new Event('item-created'));
      setErrorMessage('');
      onClose();
    } catch (err) {
      setErrorMessage(err.response.data.error);
    }
  };


  const startBarcodeScanning = () => {
    setIsScanDialogOpen(true);
  };

  const handleScanResult = (scannedBarcode) => {
    console.log('barcode scanned:', scannedBarcode);
    setBarcode(scannedBarcode);
    setIsScanDialogOpen(false);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} PaperProps={{
        sx: {
          margin: '8px',
          width: 'calc(100% - 16px)',
        },
      }}>
        <DialogTitle>Create New Item</DialogTitle>
        <>
          <Box sx={{ padding: 1 }}>
            <TextField
              autoFocus
              margin="dense"
              label="Item Name *"
              type="text"
              fullWidth
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                if (e.target.value) {
                  setErrorMessage('');
                }
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
            <TextField
              margin="dense"
              label="Category"
              type="text"
              fullWidth
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
            <TextField
              margin="dense"
              label="Unit"
              type="text"
              fullWidth
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
            />
            <Button onClick={startBarcodeScanning} color="primary">
              Scan Barcode
            </Button>
            <TextField
              margin="dense"
              label="Scanned Barcode"
              type="text"
              fullWidth
              value={barcode}
              disabled
            />
          </Box>
        </>
        {errorMessage && (
          <DialogContentText sx={{ color: 'red' }}>
            {errorMessage}
          </DialogContentText>
        )}
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCreate} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>

      <BarcodeScanningDialog
        open={isScanDialogOpen}
        onClose={() => setIsScanDialogOpen(false)}
        onScanResult={handleScanResult}
      />
    </>
  );
};

CreateItemDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default CreateItemDialog;