import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Button from '@visa/nova-react/button'
import { AuthShell } from './Login'
import api, { getApiError } from '../lib/api'
import { useAuth } from '../context/useAuth'

function ResetPassword() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [searchParams] = useSearchParams()
  const { setUser } = useAuth()

  async function handleSubmit(event) {
    event.preventDefault()

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    const token = searchParams.get('token')
    if (!token) {
      setError('The reset link is missing its token.')
      return
    }
    try {
      const response = await api.post('/auth/reset-password', { token, password, confirmPassword })
      localStorage.setItem('kudos_access_token', response.data.data.accessToken)
      setUser(response.data.data.user)
      setError('')
      setDone(true)
    } catch (requestError) {
      setError(getApiError(requestError))
    }
  }

  return (
    <AuthShell title="Reset Password">
      {done ? (
        <div className="card">
          <h3>Password updated</h3>
          <p>Your new password has been saved in this demo.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="label" htmlFor="new-password">
              New Password
            </label>
            <input
              className="field"
              id="new-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength="8"
              required
            />
          </div>

          <div className="mb-4">
            <label className="label" htmlFor="confirm-new-password">
              Confirm Password
            </label>
            <input
              className="field"
              id="confirm-new-password"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
            />
          </div>

          {error && <p className="danger-text">{error}</p>}

          <Button className="primary-button w-full" type="submit">
            Reset Password
          </Button>
        </form>
      )}

      <p className="mt-4 text-center">
        <Link to="/login">Back to Login</Link>
      </p>
    </AuthShell>
  )
}

export default ResetPassword
