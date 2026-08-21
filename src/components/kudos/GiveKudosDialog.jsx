import { useEffect, useState } from 'react'
import Button from '@visa/nova-react/button'
import api, { getApiError } from '../../lib/api'
import { useAuth } from '../../context/AuthContext'

function GiveKudosDialog({ open, onClose, onSent }) {
  const [employeeId, setEmployeeId] = useState('')
  const [points, setPoints] = useState('20')
  const [message, setMessage] = useState('')
  const [companyValue, setCompanyValue] = useState('#Teamwork')
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [employees, setEmployees] = useState([])
  const [error, setError] = useState('')
  const { user } = useAuth()

  useEffect(() => {
    if (!open) return
    setError('')
    api.get('/users', { params: { limit: 50 } })
      .then((response) => setEmployees(response.data.data.users))
      .catch((requestError) => setError(getApiError(requestError)))
  }, [open])

  if (!open) {
    return null
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    try {
      const response = await api.post('/kudos', { receiverId: employeeId, points: Number(points), message, companyValue })
      setError('')
      setSent(true)
      await onSent?.(response.data.data.kudos)
    } catch (requestError) {
      setError(getApiError(requestError))
    } finally {
      setSubmitting(false)
    }
  }

  function closeDialog() {
    setEmployeeId('')
    setPoints('20')
    setMessage('')
    setCompanyValue('#Teamwork')
    setSent(false)
    onClose()
  }

  return (
    <div className="dialog-backdrop">
      <div className="dialog-card">
        <h2>Give Kudos</h2>

        {sent ? (
          <div>
            <p className="success-text">Kudos sent successfully.</p>
            <Button className="primary-button mt-4" type="button" onClick={closeDialog}>
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="label" htmlFor="employee">
                Employee
              </label>
              <select className="field" id="employee" value={employeeId} onChange={(event) => setEmployeeId(event.target.value)} required>
                <option value="">Select Employee</option>
                {employees
                  .filter((employee) => employee.role === 'employee' && employee._id !== user?.id)
                  .map((employee) => (
                    <option key={employee._id} value={employee._id}>
                      {employee.name} - {employee.department}
                    </option>
                  ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="label" htmlFor="points">
                Points
              </label>
              <select className="field" id="points" value={points} onChange={(event) => setPoints(event.target.value)}>
                <option value="10">10 points</option>
                <option value="20">20 points</option>
                <option value="50">50 points</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="label" htmlFor="message">
                Message
              </label>
              <textarea
                className="field"
                id="message"
                rows="4"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label className="label" htmlFor="company-value">
                Company Value
              </label>
              <select className="field" id="company-value" value={companyValue} onChange={(event) => setCompanyValue(event.target.value)}>
                <option>#Teamwork</option>
                <option>#Innovation</option>
                <option>#CustomerObsession</option>
              </select>
            </div>

            <div className="flex gap-3">
              <Button className="primary-button" type="submit" disabled={submitting}>
                {submitting ? 'Sending…' : 'Send Kudos'}
              </Button>
              <Button className="secondary-button" type="button" onClick={closeDialog}>
                Cancel
              </Button>
            </div>
            {error && <p className="danger-text">{error}</p>}
          </form>
        )}
      </div>
    </div>
  )
}

export default GiveKudosDialog
