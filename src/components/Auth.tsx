import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import './Auth.css'

export const Auth = () => {
  const { signUp, signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [signUpSuccess, setSignUpSuccess] = useState(false)
  const [signUpEmail, setSignUpEmail] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isSignUp) {
        await signUp(email, password)
        setSignUpSuccess(true)
        setSignUpEmail(email)
        setEmail('')
        setPassword('')
      } else {
        await signIn(email, password)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred'
      console.error('Auth error:', message)
      
      // Check for duplicate user error - only during sign up
      if (isSignUp && (
        message.toLowerCase().includes('already registered') || 
        message.toLowerCase().includes('user already exists') ||
        message.toLowerCase().includes('email already exists') ||
        message.toLowerCase().includes('duplicate') ||
        message.toLowerCase().includes('user_already_exists')
      )) {
        setError('This email is already registered. Please sign in instead.')
      } else {
        setError(message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        {signUpSuccess ? (
          <>
            <h1>✉️ Check Your Email</h1>
            <div className="success-message">
              <p>A confirmation email has been sent to:</p>
              <strong>{signUpEmail}</strong>
              <p>Click the link in the email to confirm your account, then you can sign in.</p>
            </div>
            <button 
              type="button"
              onClick={() => {
                setSignUpSuccess(false)
                setIsSignUp(false)
                setSignUpEmail('')
              }}
              className="back-button"
            >
              Back to Login
            </button>
          </>
        ) : (
          <>
            <h1>{isSignUp ? 'Create Account' : 'Login'}</h1>
            
            {error && (
              <div className="error-message">
                <strong>Error:</strong> {error}
                {error.includes('database') || error.includes('relation') && (
                  <p style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
                    💡 Make sure you've set up the database. Check the setup guide for details.
                  </p>
                )}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>

              <button type="submit" disabled={loading}>
                {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
              </button>
            </form>

            <div className="auth-toggle">
              <p>
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(!isSignUp)
                    setError('')
                  }}
                  className="toggle-button"
                >
                  {isSignUp ? 'Sign In' : 'Sign Up'}
                </button>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
