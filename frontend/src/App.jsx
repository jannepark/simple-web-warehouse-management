import { Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ButtonAppBar from './components/layout/ButtonAppBar'
import EditUser from './components/pages/EditUser'
import Items from './components/pages/Items'
import LocationList from './components/pages/LocationList'
import Login from './components/pages/Login'
import ProtectedRoute from './components/routes/ProtectedRoute'
import SignUp from './components/pages/SignUp'
import WarehouseList from './components/pages/WarehouseList'

import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

import { Box } from '@mui/material'

function App() {

  return (
    <AuthProvider>
      <ButtonAppBar />
      <Box sx={{ mt: 8 }}>
        <Routes>
          <Route path="/"
            element={
              <ProtectedRoute>
                <WarehouseList
                />
              </ProtectedRoute>
            }
          />
          <Route path="/login"
            element={
              <Login />
            }
          />
          <Route path="/signup"
            element={<SignUp />}
          />
          <Route path="/locations/:locationId"
            element={
              <ProtectedRoute>
                <LocationList />
              </ProtectedRoute>
            }
          />
          <Route path="/edituser"
            element={
              <ProtectedRoute>
                <EditUser />
              </ProtectedRoute>
            }
          />
          <Route path="/items"
            element={
              <ProtectedRoute>
                <Items />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Box>
    </AuthProvider>
  )
}

export default App


