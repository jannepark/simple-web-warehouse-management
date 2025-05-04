import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import loginService from '../../services/login'
import { Box, Button, TextField, Container, Alert } from '@mui/material'
import { useAuth } from '../../hooks/useAuth'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { setToken } = useAuth()
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState('')

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const returnedUserWithToken = await loginService.login({ username, password })
      window.localStorage.setItem('loggedIndUserToken', JSON.stringify(returnedUserWithToken.token))
      setToken(returnedUserWithToken.token)
      setUsername('')
      setPassword('')
      navigate('/')
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setErrorMessage('Wrong credentials')
        console.log('wrong credentials')
      }
      else {
        setErrorMessage('Error logging in')
        console.error('Error logging in:', error)
      }
    }
  }
  return (
    <Container maxWidth="sm">
      <Box
        component="form"
        onSubmit={handleLogin}
        sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        {errorMessage && (
          <Alert severity="error">{errorMessage}</Alert>
        )}
        <TextField
          margin="normal"
          required
          fullWidth
          id="username"
          label="Username"
          name="username"
          autoComplete="username"
          autoFocus
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Login
        </Button>
        <Link to="/signup" style={{ textDecoration: 'none' }}>
          <Button variant="text">No account yet? Sign Up</Button>
        </Link>
      </Box>
    </Container>
  )
}

export default Login