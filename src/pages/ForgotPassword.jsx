import { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '@visa/nova-react/button'
import { AuthShell } from './Login'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()
    setSent(true)
  }

  return (
    <AuthShell title="Forgot Password">
      {sent ? (
        <div className="card">
          <h3>Reset link sent</h3>
          <p>A simulated reset link was sent to {email}.</p>
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
        </form>
      )}

      <p className="mt-4 text-center">
        <Link to="/login">Back to Login</Link>
      </p>
    </AuthShell>
  )
}

export default ForgotPassword
