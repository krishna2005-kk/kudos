import { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '@visa/nova-react/button'
import { AuthShell } from './Login'
import api, { getApiError } from '../lib/api'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [resetToken, setResetToken] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    try {
      const response = await api.post('/auth/forgot-password', { email })
      setResetToken(response.data.data?.resetToken || '')
      setError('')
      setSent(true)
    } catch (requestError) {
      setError(getApiError(requestError))
    }
  }

  return (
    <AuthShell title="Forgot Password">
      {sent ? (
        <div className="card">
          <h3>Reset link sent</h3>
          <p>Reset instructions were requested for {email}.</p>
          {resetToken && <p className="mt-3"><Link to={`/reset-password?token=${resetToken}`}>Reset your password</Link> (development only)</p>}
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="label" htmlFor="forgot-email">
              Email
            </label>
            <input
              className="field"
              id="forgot-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <Button className="primary-button w-full" type="submit">
            Send Reset Link
          </Button>
          {error && <p className="danger-text">{error}</p>}
        </form>
      )}

      <p className="mt-4 text-center">
        <Link to="/login">Back to Login</Link>
      </p>
    </AuthShell>
  )
}

export default ForgotPassword
