import { useState } from 'react'
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  IconButton,
  Box,
  Container,
  Stack,
  ListItemButton,
  CircularProgress,
} from '@mui/material'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { useNavigate } from 'react-router-dom'
import warehousesService from '../../services/warehouses'
import locationsService from '../../services/locations'
import CreateWarehouseDialog from '../dialogs/CreateWarehouseDialog'
import CreateLocationDialog from '../dialogs/CreateLocationDialog'
import useWarehouses from '../../hooks/useWarehouses'
import EditLocationDialog from '../dialogs/EditLocationDialog'
import EditWarehouseDialog from '../dialogs/EditWarehouseDialog'
import WarehouseMoreOptionsDialog from '../dialogs/WarehouseMoreOptionsDialog'
import { useAuth } from '../../hooks/useAuth'

function WarehouseList() {
  const navigate = useNavigate()
  const { token, handleLogout } = useAuth()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [locationDialogOpen, setLocationDialogOpen] = useState(false)
  const [selectedWarehouseId, setSelectedWarehouseId] = useState(null)
  const [moreOptionsDialogOpen, setMoreOptionsDialogOpen] = useState(false)
  const [selectedWarehouseForOptions, setSelectedWarehouseForOptions] = useState(null)
  const { warehouses, error, triggerRefresh, loading } = useWarehouses(token, handleLogout)
  const [editLocationDialogOpen, setEditLocationDialogOpen] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [editWarehouseDialogOpen, setEditWarehouseDialogOpen] = useState(false)
  const [selectedWarehouseToEdit, setSelectedWarehouseToEdit] = useState(null)

  const handleDialogOpen = () => setDialogOpen(true)
  const handleDialogClose = () => setDialogOpen(false)
  const handleLocationEditDialogOpen = (locationId) => {
    let locationToBeEdited = null
    for (const wa of warehouses) {
      const found = wa.locations?.find((l) => l.id === locationId)
      if (found) {
        locationToBeEdited = found
        break
      }
    }
    setSelectedLocation(locationToBeEdited)
    setEditLocationDialogOpen(true)
  }
  const handleLocationEditDialogClose = () => {
    setEditLocationDialogOpen(false)
    setSelectedLocation(null)
  }
  const handleLocationDialogOpen = (warehouseId) => {
    setSelectedWarehouseId(warehouseId)
    setLocationDialogOpen(true)
  }
  const handleLocationDialogClose = () => setLocationDialogOpen(false)
  const handleMoreOptionsOpen = (warehouseId) => {
    setSelectedWarehouseForOptions(warehouseId)
    setMoreOptionsDialogOpen(true)
  }
  const handleMoreOptionsClose = () => {
    setMoreOptionsDialogOpen(false)
    setSelectedWarehouseForOptions(null)
  }

  const handleLocationClick = (locationId) => {
    navigate(`/locations/${locationId}`)
  }

  const handleCreateWarehouse = async (warehouse) => {
    try {
      await warehousesService.createWarehouse(token, warehouse, handleLogout)
      triggerRefresh()
      setDialogOpen(false)
    } catch (err) {
      console.error('Error creating warehouse:', err)
    }
  }

  const handleCreateLocation = async (location) => {
    try {
      await locationsService.createLocation(token, location, handleLogout)
      triggerRefresh()
      setLocationDialogOpen(false)
    } catch (err) {
      console.error('Error creating location:', err)
    }
  }

  const handleDeleteWarehouse = async (id) => {
    try {
      await warehousesService.deleteWarehouse(token, id, handleLogout)
      triggerRefresh()
    } catch (error) {
      console.error('Error deleting warehouse:', error)
    }
  }

  const handleEditWarehouseOpen = (warehouseAccess) => {
    setSelectedWarehouseToEdit(warehouseAccess)
    setEditWarehouseDialogOpen(true)
  }

  const handleEditWarehouseClose = () => {
    setEditWarehouseDialogOpen(false)
    setSelectedWarehouseToEdit(null)
  }

  if (loading) {
    return <CircularProgress />
  }

  return (
    <Container sx={{ maxWidth: 'sm', pl: 0, pr: 0 }}>
      <Stack spacing={2} alignItems="center" width="100%">
        {error ? (
          <Card sx={{ width: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {error}
              </Typography>
            </CardContent>
          </Card>
        ) : (
          warehouses.map((warehouseAccess) => (
            <Card key={warehouseAccess.id} sx={{ width: '100%', pl: 0, pr: 0 }}>
              <CardContent sx={{ pl: '0.5em', pr: 0 }}>
                <Typography variant="h5" sx={{ wordBreak: 'break-word' }}>
                  {warehouseAccess.name}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  gutterBottom
                  sx={{ wordBreak: 'break-word' }}
                >
                  {warehouseAccess.description}
                </Typography>
                {warehouseAccess.locations?.length > 0 && (
                  <>
                    <Typography variant="h6">Locations:</Typography>
                    <List>
                      {warehouseAccess.locations.map((location) => (
                        <ListItem key={location.id} disablePadding>
                          <ListItemButton
                            sx={{ pl: '0.5em', pr: 0 }}
                            onClick={() => handleLocationClick(location.id)}
                          >
                            <ListItemIcon>
                              <LocationOnIcon />
                            </ListItemIcon>
                            <ListItemText
                              primary={location.name}
                              secondary={location.description}
                              primaryTypographyProps={{
                                sx: { wordBreak: 'break-word' },
                              }}
                              secondaryTypographyProps={{
                                sx: { wordBreak: 'break-word' },
                              }}
                            />
                          </ListItemButton>
                          <Button sx={{ paddingLeft: '5px', paddingRight: '5px' }} startIcon={<MoreVertIcon />} onClick={() => handleLocationEditDialogOpen(location.id)} ></Button>
                        </ListItem>
                      ))}
                    </List>
                  </>
                )}
              </CardContent>
              <Box display="flex" justifyContent="space-between" p={1}>
                <Button
                  variant="contained"
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={() => handleLocationDialogOpen(warehouseAccess.id)}
                >
                  Add Location
                </Button>
                <IconButton
                  aria-label="more options"
                  onClick={() => handleMoreOptionsOpen(warehouseAccess.id)}
                >
                  <MoreVertIcon />
                </IconButton>
              </Box>
            </Card>
          ))
        )}
        <Card sx={{ width: '100%' }}>
          <Box display="flex" justifyContent="center" p={2}>
            <IconButton
              aria-label="add new warehouse"
              onClick={handleDialogOpen}
              sx={{ fontSize: 60 }}
            >
              <AddCircleOutlineIcon fontSize="inherit" />
            </IconButton>
          </Box>
        </Card>
      </Stack>

      <CreateWarehouseDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onCreate={handleCreateWarehouse}
      />

      {selectedWarehouseId && (
        <CreateLocationDialog
          open={locationDialogOpen}
          onClose={handleLocationDialogClose}
          onCreate={handleCreateLocation}
          warehouseId={selectedWarehouseId}
        />
      )}

      <WarehouseMoreOptionsDialog
        open={moreOptionsDialogOpen}
        onClose={handleMoreOptionsClose}
        onEdit={() => {
          const found = warehouses.find((w) => w.id === selectedWarehouseForOptions);
          handleEditWarehouseOpen(found);
          handleMoreOptionsClose();
        }}
        onDelete={() => {
          handleDeleteWarehouse(selectedWarehouseForOptions);
          handleMoreOptionsClose();
        }}
      />

      <EditWarehouseDialog
        open={editWarehouseDialogOpen}
        onClose={handleEditWarehouseClose}
        warehouse={selectedWarehouseToEdit}
        token={token}
        triggerRefresh={triggerRefresh}
      />

      <EditLocationDialog
        open={editLocationDialogOpen}
        onClose={handleLocationEditDialogClose}
        token={token}
        triggerRefresh={triggerRefresh}
        location={selectedLocation}
      />
    </Container>
  )
}

export default WarehouseList