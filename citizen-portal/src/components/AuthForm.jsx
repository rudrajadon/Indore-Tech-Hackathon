import React, { useState } from 'react';
import axios from 'axios';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function AuthForm({ onAuth }) {
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function resetFields() {
    setPassword('');
    setOtp('');
    setName('');
    setPhone('');
    setAddress('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'register') {
        if (step === 1) {
          const payload = {
            email,
            password,
            name,
            phone,
            address,
          };
          await axios.post(BACKEND_URL + '/api/auth/register', payload);
          setStep(2); // Move to OTP step
        } else if (step === 2) {
          await axios.post(BACKEND_URL + '/api/auth/verify-register', { email, otp });
          setMode('login');
          setStep(1);
          resetFields();
          setError('Registration successful! Please login.');
        }
      } else if (mode === 'login') {
        const res = await axios.post(BACKEND_URL + '/api/auth/login', { email, password });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('role', 'user');
        if (onAuth) onAuth('user');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  }

  function handleModeChange(e, newMode) {
    if (newMode) {
      setMode(newMode);
      setStep(1);
      setError('');
      resetFields();
    }
  }

  return (
    <Paper elevation={4} sx={{ p: 4, borderRadius: 3, maxWidth: 450, mx: 'auto' }}>
      <Typography variant="h5" color="primary" gutterBottom align="center">
        {mode === 'login' ? 'User Login' : 'User Registration'}
      </Typography>
      <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 2 }}>
        <ToggleButtonGroup value={mode} exclusive onChange={handleModeChange}>
          <ToggleButton value="login">Login</ToggleButton>
          <ToggleButton value="register">Register</ToggleButton>
        </ToggleButtonGroup>
      </Stack>
      {error && (
        <Alert severity={error.includes('success') ? 'success' : 'error'} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <form onSubmit={handleSubmit} autoComplete="off">
        <Stack spacing={2}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            fullWidth
            disabled={mode === 'register' && step === 2}
          />
          {mode === 'register' && step === 1 && (
            <>
              <TextField
                label="Full Name"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                fullWidth
              />
              <TextField
                label="Phone Number"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                fullWidth
              />
              <TextField
                label="Address"
                value={address}
                onChange={e => setAddress(e.target.value)}
                multiline
                minRows={2}
                fullWidth
              />
            </>
          )}
          {step === 1 && (
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              fullWidth
            />
          )}
          {mode === 'register' && step === 2 && (
            <TextField
              label="OTP"
              value={otp}
              onChange={e => setOtp(e.target.value)}
              required
              fullWidth
            />
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            disabled={loading}
          >
            {loading
              ? 'Please wait...'
              : mode === 'register'
                ? (step === 1 ? 'Register & Send OTP' : 'Verify OTP')
                : 'Login'}
          </Button>
        </Stack>
      </form>
    </Paper>
  );
}