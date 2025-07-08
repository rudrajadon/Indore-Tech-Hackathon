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
  const [role, setRole] = useState('user'); // 'user' or 'admin'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1: email/pass, 2: OTP
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (step === 1) {
        if (mode === 'register') {
          await axios.post(BACKEND_URL + '/api/auth/register', { email, password, role });
        } else {
          await axios.post(BACKEND_URL + '/api/auth/login', { email, password });
        }
        setStep(2);
      } else if (step === 2) {
        if (mode === 'register') {
          await axios.post(BACKEND_URL + '/api/auth/verify-register', { email, otp });
          // After registration, go to login step
          setMode('login');
          setStep(1);
          setPassword('');
          setOtp('');
          setError('Registration successful! Please login.');
        } else {
          const res = await axios.post(BACKEND_URL + '/api/auth/verify-login', { email, otp });
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('role', res.data.role);
          if (onAuth) onAuth(res.data.role);
        }
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
      setPassword('');
      setOtp('');
    }
  }

  function handleRoleChange(e, newRole) {
    if (newRole) setRole(newRole);
  }

  return (
    <Paper elevation={4} sx={{ p: 4, borderRadius: 3, maxWidth: 400, mx: 'auto' }}>
      <Typography variant="h5" color="primary" gutterBottom align="center">
        {mode === 'login' ? 'Login' : 'Register'}
      </Typography>
      <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 2 }}>
        <ToggleButtonGroup value={mode} exclusive onChange={handleModeChange}>
          <ToggleButton value="login">Login</ToggleButton>
          <ToggleButton value="register">Register</ToggleButton>
        </ToggleButtonGroup>
        <ToggleButtonGroup value={role} exclusive onChange={handleRoleChange}>
          <ToggleButton value="user">User</ToggleButton>
          <ToggleButton value="admin">Admin</ToggleButton>
        </ToggleButtonGroup>
      </Stack>
      {error && <Alert severity={error.includes('success') ? 'success' : 'error'} sx={{ mb: 2 }}>{error}</Alert>}
      <form onSubmit={handleSubmit} autoComplete="off">
        <Stack spacing={2}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            fullWidth
            disabled={step === 2}
          />
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
          {step === 2 && (
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
            {loading ? 'Please wait...' : step === 1 ? (mode === 'login' ? 'Send OTP' : 'Register & Send OTP') : 'Verify OTP'}
          </Button>
        </Stack>
      </form>
    </Paper>
  );
} 