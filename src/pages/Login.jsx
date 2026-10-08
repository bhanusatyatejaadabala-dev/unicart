import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

// Map Firebase error codes to user-friendly messages
function getAuthErrorMessage(error) {
  const code = error?.code || '';
  switch (code) {
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support.';
    case 'auth/user-not-found':
      return 'No account found with this email. Please sign up first.';
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid email or password. Please try again.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection and try again.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please wait a moment and try again.';
    default:
      return 'Failed to log in. Please check your credentials.';
  }
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const { triggerToast } = useCart();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    // Client-side email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return triggerToast('Please enter a valid email address.', 'error');
    }

    if (password.length < 1) {
      return triggerToast('Please enter your password.', 'error');
    }

    try {
      setLoading(true);
      await login(email, password);
      triggerToast('Successfully logged in!', 'success');
      navigate('/');
    } catch (error) {
      console.error('Login error:', error.code);
      triggerToast(getAuthErrorMessage(error), 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-surface p-8 rounded-2xl shadow-lg border border-border">
        <div>
          <h2 className="mt-6 text-center text-heading-lg text-text font-bold">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-body-sm text-text-secondary">
            Or{' '}
            <Link to="/signup" className="font-semibold text-primary hover:text-primary-hover transition-colors">
              create a new account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-border placeholder-text-muted text-text focus:outline-none focus:ring-4 focus:ring-primary-light focus:border-primary focus:z-10 sm:text-sm transition-all"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-border placeholder-text-muted text-text focus:outline-none focus:ring-4 focus:ring-primary-light focus:border-primary focus:z-10 sm:text-sm transition-all"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-button font-medium rounded-md text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-4 focus:ring-primary-light transition-colors active:bg-primary-active disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
