import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import inventoryService from '../../services/inventory'
import {
  Box,
  CircularProgress,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Tooltip,
  Container,
} from '@mui/material'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import CreateInventoryDialog from '../dialogs/CreateInventoryDialog'
import UpdateQuantityDialog from '../dialogs/UpdateQuantityDialog'
import EditItemDialog from '../dialogs/EditItemDialog'
import InventoryMoreOptionsDialog from '../dialogs/InventoryMoreOptionsDialog'
import { useAuth } from '../../hooks/useAuth'
import { useInventoryActions } from '../../hooks/useInventoryActions';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const LocationList = () => {
  const { token, handleLogout } = useAuth()
  const { locationId } = useParams()
  const [inventoryItems, setInventoryItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [setError] = useState('')
  const [ItemDialogOpen, setItemDialogOpen] = useState(false)
  const [selectedInventoryForOptions, setSelectedInventoryForOptions] = useState(null)
  const [moreOptionsDialogOpen, setMoreOptionsDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editItem, setEditItem] = useState({ name: '', description: '', quantity: 0, category: '', unit: '' })
  const [quantityUpdateDialogOpen, setQuantityUpdateDialogOpen] = useState(false)
  const [quantity, setQuantity] = useState(0)
  const [selectedInventoryForQuantityUpdate, setSelectedInventoryForQuantityUpdate] = useState(null)
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' })

  const [errorMessage] = useState('')
  const { fetchInventoryItems, handleEditSave, handleDelete } = useInventoryActions(token, handleLogout);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const refreshInventory = useCallback(async () => {
    try {
      const items = await fetchInventoryItems(locationId);
      if (items && items.length > 0 && !items[0].message) {
        items.sort((a, b) => a.item.name.localeCompare(b.item.name));
      }
      setInventoryItems(items);
    } catch (err) {
      console.error('Error refreshing inventory:', err);
    } finally {
      setLoading(false);
    }
  }, [fetchInventoryItems, locationId]);

  useEffect(() => {
    refreshInventory();
  }, [refreshInventory]);


  const handleAddItemClick = () => {
    setItemDialogOpen(true)
  }

  const handleItemDialogClose = () => {
    setItemDialogOpen(false)
  }

  const handleMoreOptionsOpen = (inventory) => {
    setSelectedInventoryForOptions(inventory)
    setMoreOptionsDialogOpen(true)
  }

  const handleMoreOptionsClose = () => {
    setMoreOptionsDialogOpen(false)
    setSelectedInventoryForOptions(null)
  }

  const handleEditOpen = (item) => {
    if (item) {
      setEditItem({
        id: item.item.id,
        name: item.item.name,
        description: item.item.description,
        category: item.item.category,
        unit: item.item.unit,
        barcode: item.item.barcode,
      })
      setEditDialogOpen(true)
      setMoreOptionsDialogOpen(false)
    }
  }

  const handleEditClose = () => {
    setEditDialogOpen(false)
  }

  const handleQuantityUpdateOpen = (inventory) => {
    setSelectedInventoryForQuantityUpdate(inventory)
    setQuantity(inventory.quantity)
    setQuantityUpdateDialogOpen(true)
  }

  const handleQuantityUpdateClose = () => {
    setQuantityUpdateDialogOpen(false)
    setSelectedInventoryForQuantityUpdate(null)
  }

  const handleQuantityUpdateSave = async () => {
    try {
      setLoading(true)
      await inventoryService.updateInventory(token, {
        locationId: selectedInventoryForQuantityUpdate.locationId,
        quantity,
        inventoryId: selectedInventoryForQuantityUpdate.id,
      }, handleLogout)
      setQuantityUpdateDialogOpen(false)
      const items = await inventoryService.getInventoryByLocation(token, locationId, handleLogout)
      setInventoryItems(items)
    } catch (err) {
      console.error(err)
      setError('Could not update quantity. Please try again.')
    }
    finally {
      setLoading(false)
    }
  }

  const handleSort = (key) => {
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
    const sortedItems = [...inventoryItems].sort((a, b) => {
      if (key === 'quantity') {
        return direction === 'asc'
          ? a[key] - b[key]
          : b[key] - a[key]
      } else {
        if (a.item[key] < b.item[key]) {
          return direction === 'asc' ? -1 : 1
        }
        if (a.item[key] > b.item[key]) {
          return direction === 'asc' ? 1 : -1
        }
        return 0
      }
    })
    setInventoryItems(sortedItems)
  }

  if (loading) {
    return <CircularProgress />
  }

  return (
    <Container sx={{ maxWidth: 'sm', pl: 0, pr: 0 }}>
      <Box >
        <Typography variant="overline" gutterBottom>
          {inventoryItems && inventoryItems.length > 0
            ? `Inventories in: ${inventoryItems[0].locationName ? inventoryItems[0].locationName : inventoryItems[0]?.location?.name}`
            : 'No inventories'}
        </Typography>
        <TableContainer component={Paper} sx={{ mb: 2, pl: "3px", pr: "3px" }}>
          <Table size="small" aria-label="inventory table">
            <TableHead>
              <TableRow>
                <TableCell padding="none" >
                  <Typography variant="body1"
                    color="primary"
                    sx={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => handleSort('name')}>Name</Typography>
                  {/* Name */}
                </TableCell>
                <TableCell padding="none" >
                  <Typography variant="body1"
                    color="primary"
                    sx={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => handleSort('quantity')}>Qty</Typography>
                  {/* Qty */}
                </TableCell>
                {!isSmallScreen && (
                  <TableCell padding="none">
                    <Typography variant="body1"
                      color="primary"
                      sx={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => handleSort('category')}>Category</Typography>
                  </TableCell>
                )}
                <TableCell padding="none" >
                  <Typography variant="body1"
                    color="primary"
                    sx={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => handleSort('unit')}>Unit</Typography>
                </TableCell>
                <TableCell align="right">Edit</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {inventoryItems && inventoryItems[0].id ? (
                inventoryItems.map((item) => (
                  <Tooltip key={item.id} title={item.item.description || 'No description available'}>
                    <TableRow key={item.id}>
                      <TableCell padding="none" >
                        <Typography sx={{}}>
                          {item.item.name?.length > 15
                            ? item.item.name.slice(0, 15) + '...'
                            : item.item.name}
                        </Typography>
                      </TableCell>
                      <TableCell padding="none">
                        <Typography
                          variant="body1"
                          color="primary"
                          sx={{ cursor: 'pointer', textDecoration: 'underline' }}
                          onClick={() => handleQuantityUpdateOpen(item)}
                        >
                          {item.quantity}
                        </Typography>
                      </TableCell>
                      {!isSmallScreen && (
                        <TableCell padding="none">{item.item.category}</TableCell>
                      )}
                      <TableCell padding="none">{item.item.unit}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          aria-label="more options"
                          onClick={() => handleMoreOptionsOpen(item)}
                          size="small"
                          data-testid="item-more-options-button"
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  </Tooltip>
                ))) : (
                <TableRow>
                  <TableCell align="center" colSpan={isSmallScreen ? 4 : 5}>
                    No inventory items available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <IconButton
          aria-label="add new item"
          onClick={handleAddItemClick}
          sx={{ fontSize: 60 }}
        >
          <AddCircleOutlineIcon fontSize="inherit" />
        </IconButton>

        <CreateInventoryDialog
          open={ItemDialogOpen}
          onClose={handleItemDialogClose}
          locationId={locationId}
          refreshInventory={refreshInventory}
        />

        <InventoryMoreOptionsDialog
          open={moreOptionsDialogOpen}
          onClose={handleMoreOptionsClose}
          selectedInventory={selectedInventoryForOptions}
          onEdit={handleEditOpen}
          // onDelete={handleDelete}
          onDelete={(inventoryId) => handleDelete(inventoryId, refreshInventory)}
        />

        <EditItemDialog
          open={editDialogOpen}
          onClose={handleEditClose}
          editItem={editItem}
          setEditItem={setEditItem}
          errorMessage={errorMessage}
          onSave={() => handleEditSave(editItem, refreshInventory, handleEditClose)}
        />

        <UpdateQuantityDialog
          open={quantityUpdateDialogOpen}
          onClose={handleQuantityUpdateClose}
          quantity={quantity}
          setQuantity={setQuantity}
          onSave={handleQuantityUpdateSave}
        />
      </Box>
    </Container >
  )
}

export default LocationList