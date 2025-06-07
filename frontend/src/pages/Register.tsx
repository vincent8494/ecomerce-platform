import { useState, useEffect } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { useRegisterMutation } from '../store/api/apiSlice';
import { Google as GoogleIcon, Facebook as FacebookIcon } from '@mui/icons-material';
import { Button, TextField, Typography, Box, Paper, Divider, Alert } from '@mui/material';
import { styled } from '@mui/material/styles';

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  maxWidth: 500,
  margin: '2rem auto',
  borderRadius: '12px',
  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
}));

const SocialButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1, 0),
  width: '100%',
  padding: '10px',
  textTransform: 'none',
  borderRadius: '8px',
  '&:first-of-type': {
    backgroundColor: '#4285F4',
    '&:hover': {
      backgroundColor: '#357ABD',
    },
  },
  '&:last-of-type': {
    backgroundColor: '#3B5998',
    '&:hover': {
      backgroundColor: '#344E86',
    },
  },
}));

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  address: string;
}

const Register = () => {
  const history = useHistory();
  const [register, { isLoading }] = useRegisterMutation();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      setLoading(true);
      await register(formData).unwrap();
      history.push('/login', { message: 'Registration successful! Please log in.' });
    } catch (err: any) {
      setError(err.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle social login
  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    try {
      setLoading(true);
      
      if (provider === 'google') {
        // For Google, we'll use the Google Identity Services library
        const client = window.google?.accounts.oauth2.initCodeClient({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
          scope: 'email profile',
          ux_mode: 'popup',
          callback: async (response: any) => {
            try {
              const res = await fetch('/api/v1/auth/google', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ tokenId: response.credential }),
              });

              const data = await res.json();

              if (!res.ok) {
                throw new Error(data.message || 'Google authentication failed');
              }

              // Handle successful login (store token, redirect, etc.)
              localStorage.setItem('token', data.token);
              history.push('/dashboard');
            } catch (err: any) {
              setError(err.message || 'Failed to authenticate with Google');
            } finally {
              setLoading(false);
            }
          },
        });

        client.requestCode();
      } 
      else if (provider === 'facebook') {
        // For Facebook, we'll use the Facebook SDK
        window.FB.login(
          async (response) => {
            if (response.authResponse) {
              try {
                const res = await fetch('/api/v1/auth/facebook', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    accessToken: response.authResponse.accessToken,
                    userID: response.authResponse.userID,
                  }),
                });

                const data = await res.json();

                if (!res.ok) {
                  throw new Error(data.message || 'Facebook authentication failed');
                }

                // Handle successful login
                localStorage.setItem('token', data.token);
                history.push('/dashboard');
              } catch (err: any) {
                setError(err.message || 'Failed to authenticate with Facebook');
              } finally {
                setLoading(false);
              }
            } else {
              setError('Facebook login was cancelled');
              setLoading(false);
            }
          },
          { scope: 'public_profile,email' }
        );
      }
    } catch (err: any) {
      setError(`Failed to sign in with ${provider}: ${err.message}`);
      setLoading(false);
    }
  };

  // Load Facebook SDK
  useEffect(() => {
    // Load Google SDK
    const googleScript = document.createElement('script');
    googleScript.src = 'https://accounts.google.com/gsi/client';
    googleScript.async = true;
    googleScript.defer = true;
    document.body.appendChild(googleScript);

    // Load Facebook SDK
    const facebookScript = document.createElement('script');
    facebookScript.src = 'https://connect.facebook.net/en_US/sdk.js';
    facebookScript.async = true;
    facebookScript.defer = true;
    facebookScript.onload = () => {
      if (window.FB) {
        window.FB.init({
          appId: import.meta.env.VITE_FACEBOOK_APP_ID || '',
          cookie: true,
          xfbml: true,
          version: 'v12.0',
        });
      }
    };
    document.body.appendChild(facebookScript);

    return () => {
      document.body.removeChild(googleScript);
      document.body.removeChild(facebookScript);
    };
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <StyledPaper elevation={3}>
        <Typography component="h1" variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
          Create an Account
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Full Name"
            name="name"
            autoComplete="name"
            autoFocus
            value={formData.name}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            id="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="normal"
            fullWidth
            id="phone"
            label="Phone Number"
            name="phone"
            autoComplete="tel"
            value={formData.phone}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="normal"
            fullWidth
            id="address"
            label="Address"
            name="address"
            autoComplete="address-line1"
            value={formData.address}
            onChange={handleChange}
            multiline
            rows={2}
            sx={{ mb: 3 }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={loading || isLoading}
            sx={{ mt: 2, mb: 2, py: 1.5 }}
          >
            {loading || isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>

          <Divider sx={{ my: 3 }}>OR</Divider>

          <SocialButton
            variant="contained"
            startIcon={<GoogleIcon />}
            onClick={() => handleSocialLogin('google')}
            disabled={loading}
          >
            Continue with Google
          </SocialButton>

          <SocialButton
            variant="contained"
            startIcon={<FacebookIcon />}
            onClick={() => handleSocialLogin('facebook')}
            disabled={loading}
          >
            Continue with Facebook
          </SocialButton>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{' '}
              <Link to="/login" style={{ textDecoration: 'none', color: 'primary.main' }}>
                Sign in
              </Link>
            </Typography>
          </Box>
        </Box>
      </StyledPaper>
    </Box>
  );
};

export default Register;
