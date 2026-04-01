import {useNavigate} from 'react-router-dom'
import Header from '../Header'
import './index.css'

// Home component using React Router v6 hook
const Home = () => {
  const navigate = useNavigate()

  const onClickFindJobs = () => {
    navigate('/job')
  }

  return (
    <>
      <Header />
      <div className="home-container">
        <h1>Find The Job That Fits Your Life</h1>
        <p>
          Millions of people are searching for jobs, salary information, company
          reviews. Find the job that fits your needs.
        </p>
        <button className="find-jobs-button" type="button" onClick={onClickFindJobs}>
          Find Jobs
        </button>
      </div>
    </>
  )
}

export default Home
