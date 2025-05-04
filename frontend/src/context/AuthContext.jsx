import { createContext, useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import PropTypes from 'prop-types'
import { logout } from '../services/user'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const handleLogout = useCallback(() => {
    logout(token)
    window.localStorage.removeItem('loggedIndUserToken')
    setToken(null)
    navigate('/login')
  }, [navigate, token])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedIndUserToken')
    if (loggedUserJSON) {
      const retrievedToken = JSON.parse(loggedUserJSON)
      setToken(retrievedToken)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token)
      if (decodedToken.exp * 1000 < Date.now()) {
        handleLogout()
      }
    }
  }, [token, handleLogout])

  return (
    <AuthContext.Provider value={{ token, setToken, handleLogout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export { AuthContext }