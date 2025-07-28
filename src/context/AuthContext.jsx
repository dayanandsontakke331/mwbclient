import { createContext, useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify';

import axios from 'axios'

import authConfig from '../../src/configs/auth'

import { httpPost } from '../api/dataService'

const defaultProvider = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  registration: () => Promise.resolve()
}

const AuthContext = createContext(defaultProvider);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(defaultProvider.user);
  const [loading, setLoading] = useState(defaultProvider.loading);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const initAuth = async () => {
      console.log("inti call")
      const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName);
      if (storedToken) {
        setLoading(true);
        try {
          let token = window.localStorage.getItem('accessToken')
          await axios.get(`${import.meta.env.VITE_API_BASE_URL}${authConfig.meEndpoint}`, {
            headers: { Authorization: token }
          })

          const userData = window.localStorage.getItem('userData');
          if (userData) {
            setUser(JSON.parse(userData));
          } else {
            throw new Error('User data not found');
          }
        } catch (err) {
          localStorage.clear();
          setUser(null);
          if (authConfig.onTokenExpiration === 'logout') {
            navigate('/login', { replace: true })
          }
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false)
        if (authConfig.onTokenExpiration === 'logout' && !location.pathname.includes('login')) {
          navigate('/login', { replace: true });
        }
      }
    }

    initAuth();
  }, [])

  const handleLogin = async (params, errorCallback, data) => {
    const response = data

    if (response.error) {
      return errorCallback(response.error)
    }

    // toast.success(response?.data?.message);
    
    const { accessToken, refreshToken, user: userData } = response.data.data

    if (params.rememberMe) {
      window.localStorage.setItem(authConfig.storageTokenKeyName, accessToken)
      window.localStorage.setItem('refreshToken', refreshToken)
      window.localStorage.setItem('userData', JSON.stringify(userData))
    }

    setUser(userData)

    const returnUrl = new URLSearchParams(window.location.search).get('returnUrl') || '/Dashboard'
    navigate(returnUrl, { replace: true })
  }

  const handleRegistration = async (params, errorCallback) => {
    const response = await httpPost(authConfig.registerEndpoint, params)

    if (response.error) {
      return errorCallback(response.error);
    }

    const { accessToken, refreshToken } = response.data[0];

    if (params.rememberMe) {
      window.localStorage.setItem(authConfig.storageTokenKeyName, accessToken);
      window.localStorage.setItem('refreshToken', refreshToken);
      window.localStorage.setItem('userData', JSON.stringify(response.data[0]));
    }

    setUser(response.data[0]);
    navigate('/', { replace: true });
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.clear()
    navigate('/login', { replace: true });
  }

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout,
    registration: handleRegistration
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export default AuthProvider;
export { AuthContext };