const handleApiError = (error, handleLogout) => {
  if (error.response) {
    if (error.response.status === 401 && error.response.message === 'Token invalid' && handleLogout) {
      handleLogout()
    }
  } else {
    throw new Error('An error occurred')
  }
}

export default handleApiError