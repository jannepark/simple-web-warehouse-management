import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button } from '@mui/material';
import PropTypes from 'prop-types';

const UpdateQuantityDialog = ({ open, onClose, quantity, setQuantity, onSave }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Update Quantity</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Update the quantity of the selected item
        </DialogContentText>
        <TextField
          margin="dense"
          label="Quantity"
          type="number"
          fullWidth
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={onSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

UpdateQuantityDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  quantity: PropTypes.number.isRequired,
  setQuantity: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default UpdateQuantityDialog;