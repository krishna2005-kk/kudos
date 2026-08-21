import { useState } from 'react'
import Button from '@visa/nova-react/button'
import { employees } from '../../data/mockData'

function GiveKudosDialog({ open, onClose }) {
  const [employeeId, setEmployeeId] = useState('')
  const [points, setPoints] = useState('20')
  const [message, setMessage] = useState('')
  const [companyValue, setCompanyValue] = useState('#Teamwork')
  const [sent, setSent] = useState(false)
  const pointOptions = ['10', '20', '50']

  if (!open) {
    return null
  }

  function handleSubmit(event) {
    event.preventDefault()
    setSent(true)
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
                  .filter((employee) => employee.id !== '1')
                  .map((employee) => (
                    <option key={employee.id} value={employee.id}>
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
                <option>#CustomerFocus</option>
                <option>#Innovation</option>
              </select>
            </div>

            <div className="flex gap-3">
              <Button className="primary-button" type="submit">
                Send Kudos
              </Button>
              <Button className="secondary-button" type="button" onClick={closeDialog}>
                Cancel
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default GiveKudosDialog
