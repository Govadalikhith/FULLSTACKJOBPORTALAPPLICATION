import {Component} from 'react'
import {Link, Navigate} from 'react-router-dom'
import Cookies from 'js-cookie'
import API_URL from '../../apiUrl'
import './index.css'

class Login extends Component {
  state = {
    username: '',
    password: '',
    isError: false,
    errorMsg: '',
    isLoading: false,
    isLoggedIn: false,
  }

  submitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    this.setState({isLoading: true, isError: false})

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username, password}),
      })
      const data = await response.json()

      if (response.ok) {
        Cookies.set('jwt_token', data.jwt_token, {expires: 30})
        this.setState({isLoggedIn: true})
      } else {
        this.setState({isError: true, errorMsg: data.error_msg, isLoading: false})
      }
    } catch (err) {
      this.setState({
        isError: true,
        errorMsg: 'Cannot connect to server. Please try again later.',
        isLoading: false,
      })
    }
  }

  onChangeUsername = e => this.setState({username: e.target.value})
  onChangePassword = e => this.setState({password: e.target.value})

  render() {
    const {username, password, isError, errorMsg, isLoading, isLoggedIn} = this.state
    const jwtToken = Cookies.get('jwt_token')

    if (jwtToken || isLoggedIn) {
      return <Navigate to="/" replace />
    }

    return (
      <div className="login-bg-container">
        <form className="form-container" onSubmit={this.submitForm}>
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            className="website-logo"
            alt="website logo"
          />
          <h2 className="form-title">Welcome Back 👋</h2>

          <div className="input-container">
            <label className="label">USERNAME</label>
            <input
              value={username}
              onChange={this.onChangeUsername}
              type="text"
              placeholder="Enter your username"
              className="input-field"
              required
            />
          </div>

          <div className="input-container">
            <label className="label">PASSWORD</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="input-field"
              value={password}
              onChange={this.onChangePassword}
              required
            />
          </div>

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>

          {isError && <p className="error-msg">*{errorMsg}</p>}

          <p className="redirect-text">
            New here?{' '}
            <Link to="/signup" className="redirect-link">
              Create an account
            </Link>
          </p>
        </form>
      </div>
    )
  }
}

export default Login
