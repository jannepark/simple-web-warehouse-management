import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import PropTypes from 'prop-types'
import { CircularProgress } from '@mui/material'

const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAuth()

  if (loading) {
    return <CircularProgress />
  }

  if (!token) {
    return <Navigate to="/login" />
  }

  return children
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
}

export default ProtectedRoute