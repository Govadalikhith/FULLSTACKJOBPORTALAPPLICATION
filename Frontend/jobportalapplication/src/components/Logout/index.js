import Cookies from 'js-cookie'
import {useNavigate} from 'react-router-dom'
import './index.css'

const Logout = () => {
  const navigate = useNavigate()

  const onClickLogout = () => {
    Cookies.remove('jwt_token')
    navigate('/login')
  }

  return (
    <button className="logout-button" type="button" onClick={onClickLogout}>
      Logout
    </button>
  )
}

export default Logout
