import {Component} from 'react'
import {Link, Navigate} from 'react-router-dom'
import Cookies from 'js-cookie'
import API_URL from '../../apiUrl'
import './index.css'

class Signup extends Component {
  state = {
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    isError: false,
    errorMsg: '',
    isSuccess: false,
    isLoading: false,
  }

  onChangeName = e => this.setState({name: e.target.value})
  onChangeUsername = e => this.setState({username: e.target.value})
  onChangeEmail = e => this.setState({email: e.target.value})
  onChangePassword = e => this.setState({password: e.target.value})
  onChangeConfirmPassword = e => this.setState({confirmPassword: e.target.value})

  onSubmitForm = async e => {
    e.preventDefault()
    const {name, username, email, password, confirmPassword} = this.state

    if (password !== confirmPassword) {
      this.setState({isError: true, errorMsg: 'Passwords do not match!'})
      return
    }

    this.setState({isLoading: true, isError: false})

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({name, username, email, password}),
      })
      const data = await response.json()

      if (response.ok) {
        this.setState({isSuccess: true, isLoading: false})
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

  render() {
    const {
      name, username, email, password, confirmPassword,
      isError, errorMsg, isSuccess, isLoading,
    } = this.state

    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken) return <Navigate to="/" replace />

    if (isSuccess) {
      return (
        <div className="login-bg-container">
          <div className="form-container">
            <div className="success-box">
              <div className="success-icon">✅</div>
              <h2>Account Created!</h2>
              <p>Your account was created successfully.</p>
              <Link to="/login" className="login-button" style={{textDecoration: 'none', marginTop: '10px', display: 'block', textAlign: 'center'}}>
                Go to Login
              </Link>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="login-bg-container">
        <form className="form-container" onSubmit={this.onSubmitForm}>
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            className="website-logo"
            alt="website logo"
          />
          <h2 className="form-title">Create Account 🚀</h2>

          <div className="input-container">
            <label className="label">FULL NAME</label>
            <input type="text" className="input-field" placeholder="Your full name" value={name} onChange={this.onChangeName} required />
          </div>

          <div className="input-container">
            <label className="label">USERNAME</label>
            <input type="text" className="input-field" placeholder="Choose a username" value={username} onChange={this.onChangeUsername} required />
          </div>

          <div className="input-container">
            <label className="label">EMAIL</label>
            <input type="email" className="input-field" placeholder="your@email.com" value={email} onChange={this.onChangeEmail} required />
          </div>

          <div className="input-container">
            <label className="label">PASSWORD</label>
            <input type="password" className="input-field" placeholder="Create a strong password" value={password} onChange={this.onChangePassword} required />
          </div>

          <div className="input-container">
            <label className="label">CONFIRM PASSWORD</label>
            <input type="password" className="input-field" placeholder="Repeat your password" value={confirmPassword} onChange={this.onChangeConfirmPassword} required />
          </div>

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>

          {isError && <p className="error-msg">*{errorMsg}</p>}

          <p className="redirect-text">
            Already have an account?{' '}
            <Link to="/login" className="redirect-link">Login here</Link>
          </p>
        </form>
      </div>
    )
  }
}

export default Signup
