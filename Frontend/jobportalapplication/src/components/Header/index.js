import {Link} from 'react-router-dom'
import Logout from '../Logout'
import './index.css'

const Header = () => (
  <nav className="nav-header">
    <Link to="/">
      <img
        src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
        className="nav-logo"
        alt="website logo"
      />
    </Link>

    <div className="containerrowbox">
      <h1 className="heading1">
        <Link to="/" className="nav-link">Home</Link>
      </h1>
      <h1 className="heading1">
        <Link to="/job" className="nav-link">Jobs</Link>
      </h1>
    </div>

    <Logout />
  </nav>
)

export default Header
