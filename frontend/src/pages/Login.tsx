import { useState } from 'react';
import {  Link } from 'react-router-dom'
import { useHistory } from 'react-router-dom';
import { useLoginMutation } from '../store/api/apiSlice';

const Login = () => {
  const history = useHistory();
  const [login, { isLoading }] = useLoginMutation();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login(formData).unwrap();
      history.push('/');
    } catch (err: any) {
      setError(err.data?.message || 'Invalid email or password');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="auth-button" disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Login'}
          </button>
        </form>
        <div className="auth-options">
          <Link to="/forgot-password">Forgot Password?</Link>
          <p>
            Don't have an account?{' '}
            <Link to="/register">Register</Link>
          </p>
        </div>
        <div className="social-login">
          <button className="social-button">
            <i className="fab fa-google"></i> Continue with Google
          </button>
          <button className="social-button">
            <i className="fab fa-facebook"></i> Continue with Facebook
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
