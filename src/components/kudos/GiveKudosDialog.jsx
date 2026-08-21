import { useEffect, useState } from 'react'
import Button from '@visa/nova-react/button'
import api, { getApiError } from '../../lib/api'
import { employees as mockEmployees } from '../../data/mockData'
import { useAuth } from '../../context/useAuth'

const pointOptions = ['10', '20', '50']

function GiveKudosDialog({ open, onClose, onSent }) {
  const [employeeId, setEmployeeId] = useState('')
  const [points, setPoints] = useState('20')
  const [message, setMessage] = useState('')
  const [companyValue, setCompanyValue] = useState('#Teamwork')
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [employees, setEmployees] = useState(mockEmployees)
  const [error, setError] = useState('')
  const { user } = useAuth()

  useEffect(() => {
    if (!open) {
      return
    }

    setError('')

    api.get('/users', { params: { limit: 50 } })
      .then((response) => setEmployees(response.data.data.users))
      .catch(() => setEmployees(mockEmployees))
  }, [open])

  if (!open) {
    return null
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)

    try {
      const response = await api.post('/kudos', {
        receiverId: employeeId,
        points: Number(points),
        message,
        companyValue,
      })

      setError('')
      setSent(true)
      await onSent?.(response.data.data.kudos)
    } catch (requestError) {
      if (requestError.message === 'Backend API is not connected yet.') {
        setError('')
        setSent(true)
      } else {
        setError(getApiError(requestError))
      }
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
    setError('')
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
                  .filter((employee) => employee.id !== user?.id && employee._id !== user?.id && employee.role !== 'admin')
                  .map((employee) => (
                    <option key={employee._id || employee.id} value={employee._id || employee.id}>
                      {employee.name} - {employee.department}
                    </option>
                  ))}
              </select>
            </div>

            <div className="mb-4">
              <p className="label">Points</p>
              <div className="point-options">
                {pointOptions.map((option) => (
                  <button
                    className={points === option ? 'point-option selected-point' : 'point-option'}
                    key={option}
                    type="button"
                    onClick={() => setPoints(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
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
                placeholder="Write your message"
                required
              />
            </div>

            <div className="mb-4">
              <label className="label" htmlFor="company-value">
                Company Value
              </label>
              <select className="field" id="company-value" value={companyValue} onChange={(event) => setCompanyValue(event.target.value)}>
                <option>#Teamwork</option>
                <option>#CustomerObsession</option>
                <option>#Innovation</option>
              </select>
            </div>

            <div className="flex gap-3">
              <Button className="primary-button" type="submit" disabled={submitting}>
                {submitting ? 'Sending...' : 'Send Kudos'}
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
