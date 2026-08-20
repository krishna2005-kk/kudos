import { useState } from 'react'
import { GoogleLogin } from '@react-oauth/google'
import { Link, useNavigate } from 'react-router-dom'
import Button from '@visa/nova-react/button'

function Login() 
{
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [googleCredential, setGoogleCredential] = useState('')
  const [googleMessage, setGoogleMessage] = useState('')

  function handleLogin(event) 
  {
    event.preventDefault()

    if (!email || !password)
       {
      setError('Enter your email and password to continue.')
      return
    }

    setError('')
    navigate('/dashboard')
  }

  function handleGoogleSuccess(response) 
  {

    setGoogleCredential(response.credential)
    setGoogleMessage('Google authorization successful.')
    console.log('Google authorization result:', response)
  }

  function handleGoogleError() {
    setGoogleCredential('')
    setGoogleMessage('Google login failed. Please try again.')
  }

  return (
    <AuthShell title="Login">
      <form onSubmit={handleLogin}>
        <div className="mb-4">
          <label className="label" htmlFor="email">
            Email
          </label>
          <input
            className="field"
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="label" htmlFor="password">
            Password
          </label>
          <input
            className="field"
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        {error && <p className="danger-text">{error}</p>}

        <Button className="primary-button w-full" type="submit">
          Login
        </Button>
      </form>

      <div className="my-5 text-center">
        <p className="mb-3 text-sm">or</p>
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          text="continue_with"
          shape="rectangular"
          width="320"
        />
      </div>

      {googleMessage && (
        <p className={googleCredential ? 'success-text' : 'danger-text'}>
          {googleMessage}
        </p>
      )}

      <p className="mt-4 text-center">
        <Link to="/forgot-password">Forgot Password?</Link>
      </p>

      <p className="mt-4 text-center">
        Do not have an account? <Link to="/signup">Sign Up</Link>
      </p>
    </AuthShell>
  )
}

export function AuthShell({ title, children }) {
  return (
    <main className="auth-page">
      <section className="auth-card">
        <h1 className="mb-2 text-center text-3xl font-bold">Kudos</h1>
        <h2 className="mb-6 text-center text-xl font-semibold">{title}</h2>
        {children}
      </section>
    </main>
  )
}

export default Login
