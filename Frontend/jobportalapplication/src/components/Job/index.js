import {Component} from 'react'
import {Link} from 'react-router-dom'
import {ThreeDots} from 'react-loader-spinner'
import Cookies from 'js-cookie'
import Header from '../Header'
import API_URL from '../../apiUrl'
import './index.css'

const employmentTypesList = [
  {label: 'Full Time', employmentTypeId: 'Full Time'},
  {label: 'Part Time', employmentTypeId: 'Part Time'},
  {label: 'Freelance', employmentTypeId: 'Freelance'},
  {label: 'Internship', employmentTypeId: 'Internship'},
]

const salaryRangesList = [
  {salaryRangeId: '1000000', label: '10 LPA and above'},
  {salaryRangeId: '2000000', label: '20 LPA and above'},
  {salaryRangeId: '3000000', label: '30 LPA and above'},
]

class Jobs extends Component {
  state = {
    jobsList: [],
    searchInput: '',
    employmentType: [],
    salaryRange: '',
    apiStatus: 'INITIAL',
  }

  componentDidMount() {
    this.getJobs()
  }

  getJobs = async () => {
    this.setState({apiStatus: 'IN_PROGRESS'})
    const {searchInput, employmentType, salaryRange} = this.state
    const jwtToken = Cookies.get('jwt_token')
    const employmentQuery = employmentType.join(',')
    const url = `${API_URL}/api/jobs?employment_type=${employmentQuery}&minimum_package=${salaryRange}&search=${searchInput}`

    try {
      const response = await fetch(url, {
        headers: {Authorization: `Bearer ${jwtToken}`},
      })

      if (response.ok) {
        const data = await response.json()
        this.setState({jobsList: data.jobs, apiStatus: 'SUCCESS'})
      } else {
        this.setState({apiStatus: 'FAILURE'})
      }
    } catch (err) {
      this.setState({apiStatus: 'FAILURE'})
    }
  }

  onChangeSearchInput = e => this.setState({searchInput: e.target.value})
  onClickSearch = () => this.getJobs()

  onChangeEmployment = e => {
    const {employmentType} = this.state
    const {value, checked} = e.target
    if (checked) {
      this.setState({employmentType: [...employmentType, value]}, this.getJobs)
    } else {
      this.setState(
        {employmentType: employmentType.filter(item => item !== value)},
        this.getJobs,
      )
    }
  }

  onChangeSalary = e => {
    this.setState({salaryRange: e.target.value}, this.getJobs)
  }

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <ThreeDots color="#6366f1" height={50} width={50} />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-view">
      <img src="https://assets.ccbp.in/frontend/react-js/failure-img.png" alt="failure view" className="failure-img" />
      <h1>Oops! Something Went Wrong</h1>
      <p>Could not load jobs. Please check your connection.</p>
      <button type="button" className="retry-btn" onClick={this.getJobs}>Retry</button>
    </div>
  )

  renderJobsList = () => {
    const {jobsList} = this.state

    if (jobsList.length === 0) {
      return (
        <div className="no-jobs-view">
          <img src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png" alt="no jobs" className="no-jobs-img" />
          <h1>No Jobs Found</h1>
          <p>We could not find any jobs. Try other filters.</p>
        </div>
      )
    }

    return (
      <ul className="jobs-list">
        {jobsList.map(job => (
          <li key={job.id} className="job-item">
            <Link to={`/jobs/${job.id}`} className="job-link">
              <div className="job-top-row">
                <img src={job.company_logo_url} alt="company logo" className="company-logo" />
                <div>
                  <h1 className="job-title">{job.title}</h1>
                  <p className="job-rating">⭐ {job.rating}</p>
                </div>
              </div>
              <div className="job-meta-row">
                <p>📍 {job.location}</p>
                <p>💼 {job.employment_type}</p>
                <p>💰 {job.package_per_annum}</p>
              </div>
              <hr />
              <h2 className="desc-heading">Description</h2>
              <p className="job-desc">{job.job_description}</p>
            </Link>
          </li>
        ))}
      </ul>
    )
  }

  renderJobsSection = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case 'IN_PROGRESS': return this.renderLoader()
      case 'SUCCESS': return this.renderJobsList()
      case 'FAILURE': return this.renderFailureView()
      default: return null
    }
  }

  render() {
    const {searchInput} = this.state
    return (
      <>
        <Header />
        <div className="jobs-container">
          <div className="filters-section">
            <h1>Type of Employment</h1>
            <ul>
              {employmentTypesList.map(type => (
                <li key={type.employmentTypeId}>
                  <input
                    type="checkbox"
                    id={type.employmentTypeId}
                    value={type.employmentTypeId}
                    onChange={this.onChangeEmployment}
                  />
                  <label htmlFor={type.employmentTypeId}>{type.label}</label>
                </li>
              ))}
            </ul>
            <hr />
            <h1>Salary Range</h1>
            <ul>
              {salaryRangesList.map(range => (
                <li key={range.salaryRangeId}>
                  <input
                    type="radio"
                    id={range.salaryRangeId}
                    name="salary"
                    value={range.salaryRangeId}
                    onChange={this.onChangeSalary}
                  />
                  <label htmlFor={range.salaryRangeId}>{range.label}</label>
                </li>
              ))}
            </ul>
          </div>

          <div className="jobs-section">
            <div className="search-bar">
              <input
                type="search"
                placeholder="Search jobs..."
                value={searchInput}
                onChange={this.onChangeSearchInput}
                onKeyDown={e => e.key === 'Enter' && this.onClickSearch()}
              />
              <button type="button" data-testid="searchButton" onClick={this.onClickSearch}>
                🔍 Search
              </button>
            </div>
            {this.renderJobsSection()}
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
