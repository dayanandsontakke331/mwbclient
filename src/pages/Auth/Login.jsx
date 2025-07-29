import React, { useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
  Card,
  CardContent,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import { toast } from 'react-toastify';
import { styled } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';
import { temValidateLogin } from '../../configs/Validation';

const StyledCard = styled(Card)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '28rem' }
}));

const StyledLink = styled(Link)(({ theme }) => ({
  fontSize: '0.875rem',
  textDecoration: 'none',
  color: theme.palette.primary.main
}));

const Login = () => {
  const [values, setValues] = useState({
    username: '',
    loginAs: false,
    password: '',
    showPassword: false
  });
  const [fieldErr, setFieldErr] = useState({})
  const auth = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = prop => event => {
    const value =
      event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setValues({ ...values, [prop]: value });
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const errs = temValidateLogin(values);
    console.log("errs", errs)
    if (Object.keys(errs).length > 0) {
      setFieldErr(errs);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/login`, {
        username: values.username,
        password: values.password,
        loginAs: values.loginAs ? "recruiter" : "jobseeker"
      });

      if(response?.data?.success === false) { 
        alert(response?.data?.message)       
        return
      }

      // if(response.status == 200) {
      //   alert(response?.data?.message || 'Login failed');
      //   return 
      // }

      if (response?.data?.success) {
        alert("Login Success")
        // alert("message");
        const { accessToken, user } = response.data.data;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('userData', JSON.stringify(user));

        auth.login(
          {
            username: user.phone,
            password: "password",
            rememberMe: "rememberMe",
            login: "admin",
          },
          (message) => {
            // alert(message);
            return;
          },
          response
        );

        // alert(response?.data?.message);
        navigate('/');
      } else {
        alert(response?.data?.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert(error?.response?.data?.message || 'Something went wrong!');
    } finally {
      setLoading(false);
    }
  };


  return (
    <Box
      className="content-center"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2
      }}
    >
      <StyledCard>
        <CardContent sx={{ p: theme => `${theme.spacing(6)} !important` }}>
          <Box sx={{ mb: 6, textAlign: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
              Welcome! 👋
            </Typography>
            <Typography variant="body2">
              Please sign-in to your account
            </Typography>
          </Box>

          <form noValidate autoComplete="off" onSubmit={handleSubmit}>
            <TextField
              autoFocus
              fullWidth
              size="small"
              label="Email or phone"
              variant="outlined"
              sx={{ mb: 4 }}
              value={values.username}
              onChange={handleChange('username')}
              error={!!fieldErr.username}
              helperText={fieldErr.username}
            />

            <FormControl fullWidth variant="outlined" sx={{ mb: 1 }} size="small">
              <InputLabel htmlFor="auth-login-password">Password</InputLabel>
              <OutlinedInput
                id="auth-login-password"
                type={values.showPassword ? 'text' : 'password'}
                value={values.password}
                onChange={handleChange('password')}
                error={!!fieldErr.password}
                helperText={fieldErr.password}
                label="Password"
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowPassword}
                      onMouseDown={e => e.preventDefault()}
                      edge="end"
                    >
                      {values.showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>

            <FormControlLabel
              control={<Checkbox checked={values.loginAs} onChange={handleChange('loginAs')} />}
              label={
                <Typography variant="body2">
                  Login as recruiter{' '}
                </Typography>
              }
              sx={{ mb: 1 }}
            />

            <Button
              fullWidth
              variant="outlined"
              size="small"
              type="submit"
              sx={{ mb: 4 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={20} /> : 'Login'}
            </Button>

            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography variant="body2">
                New on our platform? <StyledLink to="/signup">Create an account</StyledLink>
              </Typography>
            </Box>

            <Divider sx={{ mb: 3 }} />
          </form>
        </CardContent>
      </StyledCard>
    </Box>
  );
};

export default Login;
