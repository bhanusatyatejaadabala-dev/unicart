import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

// Map Firebase error codes to user-friendly messages
function getAuthErrorMessage(error) {
  const code = error?.code || '';
  switch (code) {
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/operation-not-allowed':
      return 'Account creation is currently disabled. Please try again later.';
    case 'auth/weak-password':
      return 'Password is too weak. Please choose a stronger password.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection and try again.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a moment and try again.';
    default:
      return 'Failed to create an account. Please try again.';
  }
}

// Password strength validation
function validatePasswordStrength(password) {
  const errors = [];
  if (password.length < 8) errors.push('At least 8 characters');
  if (!/[A-Z]/.test(password)) errors.push('One uppercase letter');
  if (!/[a-z]/.test(password)) errors.push('One lowercase letter');
  if (!/[0-9]/.test(password)) errors.push('One number');
  return errors;
}

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState([]);
  
  const { signup } = useAuth();
  const { triggerToast } = useCart();
  const navigate = useNavigate();

  function handlePasswordChange(value) {
    setPassword(value);
    if (value.length > 0) {
      setPasswordErrors(validatePasswordStrength(value));
    } else {
      setPasswordErrors([]);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // Validate password strength
    const strengthErrors = validatePasswordStrength(password);
    if (strengthErrors.length > 0) {
      setPasswordErrors(strengthErrors);
      return triggerToast('Please fix the password requirements below.', 'error');
    }

    if (password !== confirmPassword) {
      return triggerToast('Passwords do not match', 'error');
    }

    try {
      setLoading(true);
      await signup(email, password);
      triggerToast('Account created successfully!', 'success');
      navigate('/');
    } catch (error) {
      console.error('Signup error:', error.code);
      triggerToast(getAuthErrorMessage(error), 'error');
    } finally {
      setLoading(false);
    }
  }

  const passwordStrengthMet = password.length > 0 && passwordErrors.length === 0;

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-surface p-8 rounded-2xl shadow-lg border border-border">
        <div>
          <h2 className="mt-6 text-center text-heading-lg text-text font-bold">
            Create a new account
          </h2>
          <p className="mt-2 text-center text-body-sm text-text-secondary">
            Or{' '}
            <Link to="/login" className="font-semibold text-primary hover:text-primary-hover transition-colors">
              sign in to your existing account
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
                autoComplete="new-password"
                required
                minLength={8}
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-border placeholder-text-muted text-text focus:outline-none focus:ring-4 focus:ring-primary-light focus:border-primary focus:z-10 sm:text-sm transition-all"
                placeholder="Password"
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
              />
              {/* Password strength requirements */}
              {password.length > 0 && (
                <div className="mt-2 space-y-1 text-body-sm">
                  {[
                    { label: 'At least 8 characters', test: password.length >= 8 },
                    { label: 'One uppercase letter', test: /[A-Z]/.test(password) },
                    { label: 'One lowercase letter', test: /[a-z]/.test(password) },
                    { label: 'One number', test: /[0-9]/.test(password) },
                  ].map((req) => (
                    <div key={req.label} className={`flex items-center gap-1.5 ${req.test ? 'text-success' : 'text-text-secondary'}`}>
                      <span className="text-xs">{req.test ? '✓' : '○'}</span>
                      <span>{req.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label htmlFor="confirm-password" className="sr-only">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                className={`appearance-none rounded-lg relative block w-full px-3 py-2 border placeholder-text-muted text-text focus:outline-none focus:ring-4 focus:ring-primary-light focus:border-primary focus:z-10 sm:text-sm transition-all ${
                  confirmPassword.length > 0 && password !== confirmPassword
                    ? 'border-error'
                    : 'border-border'
                }`}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {confirmPassword.length > 0 && password !== confirmPassword && (
                <p className="mt-1 text-body-sm text-error">Passwords do not match</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || (password.length > 0 && !passwordStrengthMet)}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-button font-medium rounded-md text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-4 focus:ring-primary-light transition-colors active:bg-primary-active disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account..." : "Sign up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
