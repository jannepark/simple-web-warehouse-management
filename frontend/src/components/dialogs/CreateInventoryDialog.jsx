import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  DialogContentText,
  TextField,
} from '@mui/material';
import inventoryService from '../../services/inventory';
import { useAuth } from '../../hooks/useAuth';
import BarcodeScanningDialog from './BarcodeScanningDialog';

const CreateInventoryDialog = ({ open, onClose, locationId, refreshInventory }) => {
  const { token, handleLogout } = useAuth();
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [isScanDialogOpen, setIsScanDialogOpen] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const allItems = await inventoryService.getAll(token, handleLogout);
        if (!allItems) {
          return;
        }
        setItems(allItems);
      } catch (err) {
        console.error('Error fetching items', err);
      }
    };

    if (open) fetchItems();
  }, [open, token, handleLogout]);

  const handleItemChange = (event) => {
    setSelectedItem(event.target.value);
    setErrorMessage('');
  };

  const handleCreate = async () => {
    setErrorMessage('');
    if (!selectedItem) {
      setErrorMessage('Item is required.');
      return;
    }
    try {
      const response = await inventoryService.createInventory(
        token,
        { itemId: selectedItem, locationId, quantity },
        handleLogout
      );
      if (response === 'Inventory with this item and location already exists') {
        setErrorMessage(response);
        return;
      }
      await refreshInventory(locationId);
      onClose();
    } catch (err) {
      setErrorMessage(err.response?.data?.error || 'An error occurred.');
    }
  };

  const startBarcodeScanning = () => {
    setIsScanDialogOpen(true);
  };

  const handleScanResult = (scannedBarcode) => {
    const foundItem = items.find((item) => item.barcode === scannedBarcode);
    if (foundItem) {
      setSelectedItem(foundItem.item.id);
      setErrorMessage('');
    } else {
      setErrorMessage('No item found with the scanned barcode.');
    }
    setIsScanDialogOpen(false);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {
            margin: '8px',
            width: 'calc(100% - 16px)',
          },
        }}
      >
        <DialogTitle>Create inventory</DialogTitle>
        <DialogContent>
          <Button onClick={startBarcodeScanning} color="primary">
            Find by Barcode
          </Button>
          <FormControl fullWidth margin="dense" error={!!errorMessage}>
            <InputLabel required >Select Existing Item</InputLabel>
            <Select
              label="Select Existing Item"
              value={selectedItem}
              onChange={handleItemChange}
            >
              {items.length === 0 ? (
                <MenuItem value="" disabled>
                  No items found
                </MenuItem>
              ) : (
                items.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>
          <TextField
            required
            margin="dense"
            label="Quantity"
            type="number"
            fullWidth
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            error={!!errorMessage && quantity <= 0}
          />

          {errorMessage && (
            <DialogContentText sx={{ color: 'red', mt: 2 }}>
              {errorMessage}
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCreate} color="primary">
            Add to Inventory
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

CreateInventoryDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  locationId: PropTypes.string.isRequired,
  refreshInventory: PropTypes.func.isRequired,
};

export default CreateInventoryDialog;