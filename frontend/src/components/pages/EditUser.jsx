import { useEffect, useState } from 'react'
import { Button, Box, Container, Typography, TextField, Alert } from '@mui/material'
import { editUser, changeUserPassword, getUser } from '../../services/user'
import { useAuth } from '../../hooks/useAuth'

const EditUser = () => {
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [user, setUser] = useState(null)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [newPasswordError, setNewPasswordError] = useState('')
  const [error, setError] = useState('')
  const { token, handleLogout } = useAuth()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getUser(token, handleLogout)
        setUser(user)
      } catch (error) {
        console.error('Error fetching user:', error)
        setError('Failed to fetch user data. Please try again later.')
      }
    }
    fetchUser()
  }, [token, handleLogout])

  useEffect(() => {
    if (user) {
      setName(user.name)
      setUsername(user.username)
    }
  }, [user])

  if (error) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ mt: 8 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      </Container>
    )
  }

  if (!user) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ mt: 8 }}>
          <Typography variant="h6">Fetching user data...</Typography>
        </Box>
      </Container>
    )
  }

  const handleSave = async () => {
    try {
      setErrorMessage('')
      setNewPasswordError('')
      let passwordChangeReturnMessage = ''
      let newUserData = ''

      if (!currentPassword) {
        setErrorMessage('Please enter your current password when changing user information')
        return
      }

      if (currentPassword && (name !== user.name || username !== user.username)) {
        newUserData = await editUser(currentPassword, { name, username }, token, handleLogout)
        if (newUserData[0] === 'username must be unique') {
          setErrorMessage('username must be unique')
          newUserData = ''
          return
        }

      }

      if (newPassword && newPassword.length < 5) {
        setNewPasswordError('Password must be at least 5 characters long')
        return
      }

      if (newPassword !== confirmNewPassword) {
        setNewPasswordError('New passwords do not match')
        return
      }

      if (currentPassword && newPassword) {
        passwordChangeReturnMessage = await changeUserPassword(currentPassword, newPassword, token, handleLogout)
      }

      if (newUserData || passwordChangeReturnMessage.message === 'Password changed successfully') {
        setSuccessMessage('User information updated successfully!')
        setTimeout(() => setSuccessMessage(''), 3000)
        setCurrentPassword('')
        setNewPassword('')
        setConfirmNewPassword('')
      } else {
        setErrorMessage(`Error updating user`)
      }
    } catch (error) {
      console.error('Error updating user:', error)
      setErrorMessage(`Error updating user: ${error}`)
    }
  }

  return (
    <Container maxWidth="sm">
      <Box>
        <Typography component="h1" variant="h5">
          Change user information
        </Typography>
        {successMessage && (
          <Alert severity="success">{successMessage}</Alert>
        )}
        {errorMessage && (
          <Alert severity="error">{errorMessage}</Alert>
        )}
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
          id="username"
          label="Username"
          name="username"
          autoComplete="username"
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        />
        <TextField
          margin="normal"
          fullWidth
          name="currentPassword"
          label="Current Password"
          type="password"
          id="currentPassword"
          autoComplete="current-password"
          value={currentPassword}
          onChange={({ target }) => setCurrentPassword(target.value)}
        />
        <TextField
          margin="normal"
          fullWidth
          name="newPassword"
          label="New Password"
          type="password"
          id="newPassword"
          autoComplete="new-password"
          value={newPassword}
          error={!!newPasswordError}
          helperText={newPasswordError}
          onChange={({ target }) => setNewPassword(target.value)}
        />
        <TextField
          margin="normal"
          fullWidth
          name="confirmNewPassword"
          label="Confirm New Password"
          type="password"
          id="confirmNewPassword"
          autoComplete="new-password"
          value={confirmNewPassword}
          error={!!newPasswordError}
          helperText={newPasswordError}
          onChange={({ target }) => setConfirmNewPassword(target.value)}
        />
        <Button
          variant="contained"
          onClick={handleSave}
        >
          Save
        </Button>
      </Box>
    </Container>
  )
}

export default EditUser