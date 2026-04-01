import {Component} from 'react'
import {useParams} from 'react-router-dom'
import {ThreeDots} from 'react-loader-spinner'
import Cookies from 'js-cookie'
import Header from '../Header'
import API_URL from '../../apiUrl'
import './index.css'

// Wrapper to inject URL params into class component (React Router v6 style)
const JobItemWrapper = props => {
  const params = useParams()
  return <JobItem {...props} params={params} />
}

class JobItem extends Component {
  state = {
    jobDetails: null,
    similarJobs: [],
    isLoading: true,
    isError: false,
  }

  componentDidMount() {
    this.getJobItem()
  }

  getJobItem = async () => {
    this.setState({isLoading: true, isError: false})
    const jwtToken = Cookies.get('jwt_token')
    const {id} = this.props.params

    try {
      const response = await fetch(`${API_URL}/api/jobs/${id}`, {
        headers: {Authorization: `Bearer ${jwtToken}`},
      })

      if (response.ok) {
        const data = await response.json()
        this.setState({
          jobDetails: data.job_details,
          similarJobs: data.similar_jobs,
          isLoading: false,
        })
      } else {
        this.setState({isLoading: false, isError: true})
      }
    } catch (err) {
      this.setState({isLoading: false, isError: true})
    }
  }

  render() {
    const {jobDetails, similarJobs, isLoading, isError} = this.state

    return (
      <>
        <Header />

        {isLoading && (
          <div className="loader-container" data-testid="loader">
            <ThreeDots color="#6366f1" height={50} width={50} />
          </div>
        )}

        {isError && (
          <div className="failure-view">
            <h1>Oops! Something Went Wrong</h1>
            <p>Could not load job details. Please check your connection.</p>
            <button type="button" className="retry-btn" onClick={this.getJobItem}>Retry</button>
          </div>
        )}

        {!isLoading && !isError && jobDetails && (
          <div className="job-details-container">
            <div className="job-card">
              <div className="job-top-row">
                <img src={jobDetails.company_logo_url} alt="job details company logo" />
                <div>
                  <h1>{jobDetails.title}</h1>
                  <p className="job-rating">⭐ {jobDetails.rating}</p>
                </div>
              </div>
              <div className="job-meta-row">
                <p>📍 {jobDetails.location}</p>
                <p>💼 {jobDetails.employment_type}</p>
                <p>💰 {jobDetails.package_per_annum}</p>
              </div>
              <hr style={{borderColor: '#334155', margin: '16px 0'}} />
              <h2>About the Job</h2>
              <p className="job-desc">{jobDetails.job_description}</p>
              {jobDetails.company_url && (
                <a href={jobDetails.company_url} target="_blank" rel="noreferrer" className="company-url-link">
                  Visit Company Website ↗
                </a>
              )}
            </div>

            {similarJobs.length > 0 && (
              <>
                <h2 className="similar-title">Similar Jobs</h2>
                <ul className="similar-jobs-list">
                  {similarJobs.map(job => (
                    <li key={job.id} className="similar-job-card">
                      <div className="job-top-row">
                        <img src={job.company_logo_url} alt="similar company logo" className="similar-logo" />
                        <div>
                          <h3>{job.title}</h3>
                          <p className="job-rating">⭐ {job.rating}</p>
                        </div>
                      </div>
                      <p>📍 {job.location}</p>
                      <p>💼 {job.employment_type}</p>
                      <p className="similar-desc">{job.job_description}</p>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}
      </>
    )
  }
}

export default JobItemWrapper
