import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import Home from './components/Home'
import Jobs from './components/Jobs'
import Browse from './components/Browse'
import Profile from './components/Profile'
import JobDescription from './components/JobDescription'
import Companies from './components/admin/Companies'
import CompanyCreate from './components/admin/CompanyCreate'
import CompanySetup from './components/admin/CompanySetup'
import AdminJobs from "./components/admin/AdminJobs";
import PostJob from './components/admin/PostJob'
import Applicants from './components/admin/Applicants'
import ProtectedRoute from './components/admin/ProtectedRoute'
import RequireAuth from './components/auth/RequireAuth'
import RequireRole from './components/auth/RequireRole'

const appRouter = createBrowserRouter([
  // Public routes
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/signup',
    element: <Signup />
  },

  // Student & Auth Protected routes
  {
    path: '/',
    element: (
      <RequireAuth>
        <RequireRole allowedRoles={['student']}>
          <Home />
        </RequireRole>
      </RequireAuth>
    )
  },
  {
    path: "/jobs",
    element: (
      <RequireAuth>
        <RequireRole allowedRoles={['student']}>
          <Jobs />
        </RequireRole>
      </RequireAuth>
    )
  },
  {
    path: "/description/:id",
    element: (
      <RequireAuth>
        <RequireRole allowedRoles={['student']}>
          <JobDescription />
        </RequireRole>
      </RequireAuth>
    )
  },
  {
    path: "/browse",
    element: (
      <RequireAuth>
        <RequireRole allowedRoles={['student']}>
          <Browse />
        </RequireRole>
      </RequireAuth>
    )
  },
  {
    path: "/profile",
    element: (
      <RequireAuth>
        <RequireRole allowedRoles={['student']}>
          <Profile />
        </RequireRole>
      </RequireAuth>
    )
  },

  // Admin / Recruiter routes
  {
    path: "/admin/companies",
    element: <ProtectedRoute><Companies /></ProtectedRoute>
  },
  {
    path: "/admin/companies/create",
    element: <ProtectedRoute><CompanyCreate /></ProtectedRoute>
  },
  {
    path: "/admin/companies/:id",
    element: <ProtectedRoute><CompanySetup /></ProtectedRoute>
  },
  {
    path: "/admin/jobs",
    element: <ProtectedRoute><AdminJobs /></ProtectedRoute>
  },
  {
    path: "/admin/jobs/create",
    element: <ProtectedRoute><PostJob /></ProtectedRoute>
  },
  {
    path: "/admin/jobs/:id/applicants",
    element: <ProtectedRoute><Applicants /></ProtectedRoute>
  },
])

function App() {
  return (
    <div>
      <RouterProvider router={appRouter} />
    </div>
  )
}

export default App
