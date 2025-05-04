import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import { useAuth } from '../../hooks/useAuth'
import CreateItemDialog from '../dialogs/CreateItemDialog'
import { useLocation } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';

const ButtonAppBar = () => {
  const navigate = useNavigate()
  const navigationLocation = useLocation();
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [isCreateItemDialogOpen, setIsCreateItemDialogOpen] = React.useState(false);
  const { token, handleLogout } = useAuth()

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLoginClick = () => {
    navigate('/login')
  }

  const handleEditUserClick = () => {
    navigate('/edituser')
    handleMenuClose()
  }

  const handleItemsClick = () => {
    navigate('/items');
    handleMenuClose();
  };

  const handleHomeClick = () => {
    navigate('/')
  }

  const handleLogoutClick = () => {
    handleLogout()
  }

  const handleCreateItemClick = () => {
    setIsCreateItemDialogOpen(true);
    handleMenuClose();
  };

  const handleCloseCreateItemDialog = () => {
    setIsCreateItemDialogOpen(false);
  };

  const getPageTitle = () => {
    switch (true) {
      case navigationLocation.pathname === '/':
        return 'Warehouses';
      case navigationLocation.pathname === '/login':
        return 'Login';
      case navigationLocation.pathname === '/signup':
        return 'Sign Up';
      case navigationLocation.pathname === '/edituser':
        return 'Edit User';
      case navigationLocation.pathname === '/items':
        return 'Item Search';
      case navigationLocation.pathname.startsWith('/locations/'):
        return `Location`;
      default:
        return 'Unknown Page';
    }
  };

  return (
    <>
      <Box sx={{ flexGrow: 1, mb: 10 }}>
        <AppBar position="fixed">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 0 }}
              onClick={handleMenuClick}
            >

              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              {token ? (
                <>
                  <MenuItem onClick={handleHomeClick}>Warehouses</MenuItem>
                  <MenuItem onClick={handleItemsClick}>Items</MenuItem>
                  <MenuItem onClick={handleCreateItemClick}>Create Item</MenuItem>
                  <MenuItem onClick={handleEditUserClick}>Edit User</MenuItem>
                  <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
                </>
              ) : <Button color="inherit" onClick={handleLoginClick}>
                Login
              </Button>}

            </Menu>
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, textAlign: 'center' }}
            >
              {getPageTitle()}
            </Typography>
            {token ? (
              <HomeIcon
                sx={{ color: 'white', cursor: 'pointer', pr: '12px' }}
                onClick={handleHomeClick}
              />
            ) : <HomeIcon sx={{ visibility: 'hidden', pr: '12px' }}></HomeIcon>}
          </Toolbar>
        </AppBar>
      </Box>
      <CreateItemDialog
        open={isCreateItemDialogOpen}
        onClose={handleCloseCreateItemDialog}
      />
    </>
  )
}
export default ButtonAppBar
