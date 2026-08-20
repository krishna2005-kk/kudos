import { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '@visa/nova-react/button'
import { AuthShell } from './Login'

function ResetPassword() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setError('')
    setDone(true)
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
