import { useEffect, useState, useCallback } from 'react';
import {
  Container,
  List,
  ListItem,
  ListItemText,
  Collapse,
  Typography,
  Stack,
  ListItemButton,
  TextField,
  Button,
  Card,
  CardContent,
  CardActions,
  Skeleton,
  Pagination,
} from '@mui/material';
import CategoryIcon from '@mui/icons-material/Category';
import ScaleIcon from '@mui/icons-material/Scale';
import { LocationOn, QrCode } from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import inventoryService from '../../services/inventory';
import { useNavigate } from 'react-router-dom';
import BarcodeScanningDialog from '../dialogs/BarcodeScanningDialog';
import { useInventoryActions } from '../../hooks/useInventoryActions';
import EditItemDialog from '../dialogs/EditItemDialog';
import WarehouseIcon from '@mui/icons-material/Warehouse';

export default function Items() {
  const { token, handleLogout } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [barcodeDialogOpen, setBarcodeDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();
  const { handleEditSave } = useInventoryActions(token, handleLogout);
  const [editItem, setEditItem] = useState({ name: '', description: '', category: '', unit: '', barcode: '' });
  const [editDialogOpen, setEditDialogOpen] = useState(false);


  const refreshItems = useCallback(async () => {
    setLoading(true);
    try {
      const allItemsData = await inventoryService.getAll(token, handleLogout);
      if (!allItemsData) {
        setError('No data received from server');
        setItems([]);
        return;
      }
      setItems(allItemsData);
      setError('');
    } catch (err) {
      setError('Error fetching items');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token, handleLogout]);

  useEffect(() => {
    refreshItems().catch((err) => console.error('Error fetching items:', err));
  }, [refreshItems]);

  useEffect(() => {
    const handler = () => {
      refreshItems();
    };
    window.addEventListener('item-created', handler);
    return () => window.removeEventListener('item-created', handler);
  }, []);

  const handleEditOpen = (item) => {
    setEditItem({
      id: item.id,
      name: item.name,
      description: item.description,
      category: item.category,
      unit: item.unit,
      barcode: item.barcode,
    });
    setEditDialogOpen(true);
  };

  const handleEditClose = () => {
    setEditDialogOpen(false);
  };

  const handleBarcodeScanResult = (scannedBarcode) => {
    setSearchQuery(scannedBarcode);
    setBarcodeDialogOpen(false);
  };

  const handleDelete = async (itemId, refresh) => {
    try {
      await inventoryService.deleteItem(token, itemId, handleLogout);
      handleEditClose();
      await refresh();
      setError('');
    } catch (err) {
      setError('Error deleting item');
      console.error(err);
    }
  };


  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.barcode && item.barcode.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const paginatedItems = filteredItems.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  if (loading) {
    return (
      <Container>
        {[...Array(5)].map((_, index) => (
          <Skeleton key={index} variant="rectangular" height={80} sx={{ mb: 2 }} />
        ))}
      </Container>
    );
  }

  return (
    <Container sx={{ maxWidth: 'sm', pl: 0, pr: 0 }}>
      <Stack spacing={1} alignItems="center">
        <TextField
          label="Search Items"
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button
          variant="outlined"
          color="primary"
          size="small"
          onClick={() => setBarcodeDialogOpen(true)}
        >
          Find by Barcode
        </Button>
      </Stack>
      {filteredItems.length === 0 ? (
        <Container>
          <Typography variant="h6" align="center" color="textSecondary">
            No items found. Try adjusting your search.
          </Typography>
        </Container>
      ) : (
        paginatedItems.map((item) => (
          <Card
            key={item.id}
            sx={{
              mt: 1,
              mb: 1,
              border: '1px solid #ccc',
              borderRadius: 1,
            }}
          >
            <CardContent sx={{ p: 1 }}>
              <Stack
                direction="row"
                spacing={0.5}
                alignItems="center"
                justifyContent="space-between"
                flexWrap="wrap"
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  {item.name}
                </Typography>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <CategoryIcon fontSize="small" />
                  <Typography variant="body2">
                    {item.category || 'N/A'}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <ScaleIcon fontSize="small" />
                  <Typography variant="body2">
                    {item.unit || 'N/A'}
                  </Typography>
                </Stack>
              </Stack>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <QrCode fontSize="small" />
                <Typography variant="body2" color="textSecondary">
                  {item.barcode || 'N/A'}
                </Typography>
              </Stack>
            </CardContent>
            <Collapse in timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {item.inventories.map((inv, idx) => (
                  <ListItem
                    key={idx}
                    sx={{
                      pl: 2,
                      py: 0.5,
                    }}
                    onClick={() => navigate(`/locations/${inv.location.id}`)}
                  >
                    <ListItemButton sx={{ padding: 0.5 }}>
                      <ListItemText
                        primary={
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant="body2">
                              <LocationOn sx={{ mr: 0.2, fontSize: 16 }} />
                              {`${inv.location.name}`}
                            </Typography>
                            <Typography variant="body2">
                              <WarehouseIcon sx={{ mr: 0.2, fontSize: 16 }} />
                              {`${inv.location.warehouse.name}`}
                            </Typography>
                          </Stack>
                        }
                        secondary={
                          <Typography variant="caption" color="textSecondary">
                            Quantity: {inv.quantity}
                          </Typography>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Collapse>
            <CardActions sx={{ padding: 0.5 }}>
              <Button size="small" onClick={() => handleEditOpen(item)}>
                Edit item
              </Button>
            </CardActions>
          </Card>
        ))
      )}
      <Pagination
        count={Math.ceil(filteredItems.length / itemsPerPage)}
        page={page}
        onChange={(e, value) => setPage(value)}
        size="small"
        sx={{ mt: 1 }}
      />
      <BarcodeScanningDialog
        open={barcodeDialogOpen}
        onClose={() => setBarcodeDialogOpen(false)}
        onScanResult={handleBarcodeScanResult}
      />
      <EditItemDialog
        open={editDialogOpen}
        onClose={handleEditClose}
        editItem={editItem}
        setEditItem={setEditItem}
        errorMessage={error}
        onDelete={async () => { await handleDelete(editItem.id, refreshItems); }}
        onSave={async () => {
          await handleEditSave(editItem, refreshItems, handleEditClose);
        }}
      />
    </Container>
  );
}