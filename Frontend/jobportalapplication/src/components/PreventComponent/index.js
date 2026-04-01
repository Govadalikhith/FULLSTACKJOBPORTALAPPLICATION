import Cookies from 'js-cookie'
import {Navigate} from 'react-router-dom'

// This component protects pages from being viewed without login
const ProtectedRoute = ({children}) => {
  const jwtToken = Cookies.get('jwt_token')

  if (!jwtToken) {
    // If not logged in, redirect to login page
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
