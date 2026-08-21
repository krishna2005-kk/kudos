import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '@visa/nova-react/button'
import { AuthShell } from './Login'
import { useAuth } from '../context/useAuth'
import { getApiError } from '../lib/api'

function Signup() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [department, setDepartment] = useState('')
  const [error, setError] = useState('')
  const { signup } = useAuth()

  async function handleSignup(event) {
    event.preventDefault()

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    try {
      setError('')
      await signup({ name, email, password, confirmPassword, department })
      navigate('/dashboard')
    } catch (requestError) {
      setError(getApiError(requestError))
    }
  }

  return (
    <AuthShell title="Sign Up">
      <form onSubmit={handleSignup}>
        <div className="mb-4">
          <label className="label" htmlFor="name">
            Full Name
          </label>
          <input className="field" id="name" value={name} onChange={(event) => setName(event.target.value)} required />
        </div>

        <div className="mb-4">
          <label className="label" htmlFor="signup-email">
            Email
          </label>
          <input
            className="field"
            id="signup-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="label" htmlFor="department">
            Department
          </label>
          <select className="field" id="department" value={department} onChange={(event) => setDepartment(event.target.value)} required>
            <option value="">Select Department</option>
            <option>Engineering</option>
            <option>Design</option>
            <option>Marketing</option>
            <option>Sales</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="label" htmlFor="signup-password">
            Password
          </label>
          <input
            className="field"
            id="signup-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength="8"
            required
          />
        </div>

        <div className="mb-4">
          <label className="label" htmlFor="confirm-password">
            Confirm Password
          </label>
          <input
            className="field"
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
          />
        </div>

        {error && <p className="danger-text">{error}</p>}

        <Button className="primary-button w-full" type="submit">
          Create Account
        </Button>
      </form>

      <p className="mt-4 text-center">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </AuthShell>
  )
}

export default Signup
