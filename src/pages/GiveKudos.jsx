import { useState } from 'react'
import Button from '@visa/nova-react/button'
import GiveKudosDialog from '../components/kudos/GiveKudosDialog'

function GiveKudos() {
  const [showForm, setShowForm] = useState(false)

  return (
    <div>
      <div className="page-heading">
        <h1>Give Kudos</h1>
        <p>Send appreciation to a teammate for their good work.</p>
      </div>

      <section className="card mt-4">
        <h2>Recognize someone</h2>
        <p>Select an employee, choose points, add a message, and send kudos.</p>
        <Button className="primary-button" type="button" onClick={() => setShowForm(true)}>
          Open Give Kudos Form
        </Button>
      </section>

      <GiveKudosDialog open={showForm} onClose={() => setShowForm(false)} />
    </div>
  )
}

export default GiveKudos
