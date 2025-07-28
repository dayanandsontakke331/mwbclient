import React, { useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
  Card,
  CardContent,
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from "../../hooks/useAuth";
import { tempValidateSingUp } from '../../configs/Validation';

const StyledCard = styled(Card)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '28rem' }
}));

const StyledLink = styled(Link)(({ theme }) => ({
  fontSize: '0.875rem',
  textDecoration: 'none',
  color: theme.palette.primary.main
}));

const Singup = () => {
  const navigate = useNavigate();
  // const auth = useAuth();
  const [fieldErr, setFieldErr] = useState({});

  const [values, setValues] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
    showPassword: false,
    recruiter: false
  });

  const [loading, setLoading] = useState(false);

  const handleChange = prop => event => {
    const value = prop === 'recruiter' ? event.target.checked : event.target.value;
    setValues(prev => ({ ...prev, [prop]: value }));
  };

  const handleClickShowPassword = () => {
    setValues(prev => ({ ...prev, showPassword: !prev.showPassword }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
      setFieldErr({});

    const errs = tempValidateSingUp(values);
    if (Object.keys(errs).length > 0) {
      setFieldErr(errs);
      return
    }
    setLoading(true);

    try {
      const payload = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone,
        password: values.password,
        role: values.recruiter ? 'recruiter' : 'jobseeker'
      };

      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/register`, payload);

      if (response.data?.success) {
        alert('Registration successful!');
        navigate('/login');
      } else {
        alert(response.data?.message || 'Registration failed.');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Something went wrong during registration.');
    } finally {
      setLoading(false);
    }
  };

  console.log("field errors", fieldErr)

  return (
    <Box
      className="content-center"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2
      }}
    >
      <StyledCard>
        <CardContent sx={{ p: theme => `${theme.spacing(6)} !important` }}>
          <Box sx={{ mb: 6, textAlign: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 0 }}>
              🚀 This Is Where Futures Catch Fire
            </Typography>
          </Box>
          <form noValidate autoComplete="off" onSubmit={handleSubmit}>
            <TextField
              size='small'
              fullWidth
              label="First Name"
              sx={{ mb: 2 }}
              value={values.firstName}
              onChange={handleChange('firstName')}
              error={!!fieldErr.firstName}
              helperText={fieldErr.firstName}
            />
            <TextField
              size='small'
              fullWidth
              label="Last Name"
              sx={{ mb: 2 }}
              value={values.lastName}
              onChange={handleChange('lastName')}
              error={!!fieldErr.lastName}
              helperText={fieldErr.lastName}
            />

            <TextField
              size='small'
              fullWidth
              label="Phone"
              sx={{ mb: 2 }}
              value={values.phone}
              onChange={handleChange('phone')}
              error={!!fieldErr.phone}
              helperText={fieldErr.phone}
            />

            <TextField
              fullWidth
              size='small'
              type="email"
              label="Email"
              sx={{ mb: 2 }}
              value={values.email}
              onChange={handleChange('email')}
              error={!!fieldErr.email}
              helperText={fieldErr.email}
            />

            <FormControl fullWidth sx={{ mb: 2 }} variant="outlined" size='small'>
              <InputLabel htmlFor="auth-register-password">Password</InputLabel>
              <OutlinedInput
                id="auth-register-password"
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
              control={<Checkbox checked={values.recruiter} onChange={handleChange('recruiter')} />}
              label={
                <Typography variant="body2">
                  Register as recruiter
                </Typography>
              }
              sx={{ mb: 3 }}
            />
            <Button
              fullWidth
              size='small'
              variant="outlined"
              type="submit"
              disabled={loading}
              sx={{ mb: 4 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign Up'}
            </Button>
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Typography variant="body2">
                Already have an account? <StyledLink to="/login">Sign in instead</StyledLink>
              </Typography>
            </Box>

            <Divider sx={{ my: 4 }} />
          </form>
        </CardContent>
      </StyledCard>
    </Box>
  );
};

export default Singup;
