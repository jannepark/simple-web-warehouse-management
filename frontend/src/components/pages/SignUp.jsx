import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createUser } from '../../services/user'
import {
  TextField,
  Button,
  Box,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material'

const SignUp = () => {
  const [username, setUsername] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [userCreatedOpen, setUserCreatedOpen] = useState(false)
  const navigate = useNavigate()

  const handleSignUp = async (event) => {
    event.preventDefault()
    if (!validateEmail(username)) {
      setEmailError('Please enter a valid email address')
      return
    }
    if (password.length < 5) {
      setError('Password must be at least 5 characters long')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    try {
      const newUser = {
        username,
        name,
        password,
        disabled: false,
        admin: false,
      }
      await createUser(newUser)
      setUserCreatedOpen(true)
    } catch (error) {
      console.error('Error creating new user:', error)
      setError('Error creating new user')
    }
  }

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const handleEmailChange = (event) => {
    const email = event.target.value
    setUsername(email)
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address')
    } else {
      setEmailError('')
    }
  }

  const handleClose = () => {
    setUserCreatedOpen(false)
    navigate('/login')
  }

  return (
    <Container maxWidth="sm">
      <Box
        component="form"
        onSubmit={handleSignUp}
        sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <TextField
          margin="normal"
          required
          fullWidth
          id="username"
          label="Username (Email)"
          name="username"
          autoComplete="email"
          autoFocus
          value={username}
          onChange={handleEmailChange}
          error={!!emailError}
          helperText={emailError}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="name"
          label="Name"
          name="name"
          autoComplete="name"
          value={name}
          onChange={({ target }) => setName(target.value)}
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
          error={!!error && password.length < 5}
          helperText={!!error && password.length < 5 ? 'Password must be at least 5 characters long' : ''}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          id="confirmPassword"
          autoComplete="current-password"
          value={confirmPassword}
          onChange={({ target }) => setConfirmPassword(target.value)}
          error={!!error && password !== confirmPassword}
          helperText={!!error && password !== confirmPassword ? 'Passwords do not match' : ''}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Sign Up
        </Button>
        <Link to="/login" style={{ textDecoration: 'none' }}>
          <Button variant="text">Already have an account? Login</Button>
        </Link>
      </Box>

      {/* Success Dialog */}
      <Dialog open={userCreatedOpen} onClose={handleClose}>
        <DialogTitle>Account Created</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Your account has been created successfully. You can now log in.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Login
          </Button>
          <Button onClick={() => setUserCreatedOpen(false)} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default SignUp