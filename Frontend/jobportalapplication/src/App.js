import {Routes, Route} from 'react-router-dom'
import Login from './components/Login'
import Signup from './components/Signup'
import Home from './components/Home'
import Job from './components/Job'
import JobItem from './components/JobItem'
import NotFound from './components/NotFound'
import ProtectedRoute from './components/PreventComponent'
import './App.css'

const App = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    <Route
      path="/"
      element={
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      }
    />
    <Route
      path="/job"
      element={
        <ProtectedRoute>
          <Job />
        </ProtectedRoute>
      }
    />
    <Route
      path="/jobs/:id"
      element={
        <ProtectedRoute>
          <JobItem />
        </ProtectedRoute>
      }
    />
    <Route path="*" element={<NotFound />} />
  </Routes>
)

export default App
