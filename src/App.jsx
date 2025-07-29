import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Singup';
import NotFoundPage from './pages/Auth/NotFound';
import ProtectedRoute from './components/PrivateRoute'
import { createAxiosResponseInterceptor } from './api/interceptor';
import Jobs from './pages/Jobs/Jobs';
import JobApplications from './pages/JobApplications/JobApplications';
import JobSeekers from './pages/User/JobSeekers';
import PostJob from './pages/Jobs/PostJob';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import JobPreferences from './pages/Preferences/JobPreferences';
import AllJobs from './pages/Jobs/AllJobs';
import MyJobApplications from './pages/JobApplications/MyJobApplications';
import EditJob from './pages/Jobs/EditJob';

const App = () => {
  createAxiosResponseInterceptor();

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored" />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="profile" element={<JobPreferences />} />
            <Route path="settings" element={<Settings />} />

            {/* Recruiter-only */}
            <Route element={<ProtectedRoute allowedTo={['recruiter', 'admin']} />}>
              <Route path="JobSeekers" element={<JobSeekers />} />
              <Route path="AllJobs" element={<AllJobs />} />
              <Route path="postjob" element={<PostJob />} />
              <Route path="EditJob/:jobId" element={<EditJob />} />
              <Route path="jobapplications" element={<JobApplications />} />
            </Route>

            {/* Job Seeker-only */}
            <Route element={<ProtectedRoute allowedTo={['jobseeker']} />}>
              <Route path="jobs" element={<Jobs />} />
              <Route path="myApplications" element={<MyJobApplications />} />
            </Route>

            {/* Not Found for authenticated users */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Route>

        {/* Public Not Found */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

    </>
  );
};

export default App;