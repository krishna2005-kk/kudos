import { useState } from 'react'
import Button from '@visa/nova-react/button'
import GiveKudosDialog from '../components/kudos/GiveKudosDialog'
import KudosCard from '../components/kudos/KudosCard'
import { currentUser, kudosFeed } from '../data/mockData'

function Dashboard() {
  const [showForm, setShowForm] = useState(false)

  return (
    <div>
      <h1>Kudos Dashboard</h1>
      <p>Welcome, Heer</p>

      <div className="simple-grid mt-4">
        <div className="card">
          <h3>Giving Points</h3>
          <p>
            {currentUser.givingAllowance} / {currentUser.allowanceTotal}
          </p>
        </div>

        <div className="card">
          <h3>Earned Points</h3>
          <p>{currentUser.earnedPoints}</p>
        </div>
      </div>

      <div className="mt-5">
        <Button className="primary-button" type="button" onClick={() => setShowForm(true)}>
          Give Kudos
        </Button>
      </div>

      <section className="card mt-5">
        <h2>Recent Kudos</h2>

        {kudosFeed.map((kudos) => (
          <KudosCard key={kudos.id} kudos={kudos} />
        ))}
      </section>

      <GiveKudosDialog open={showForm} onClose={() => setShowForm(false)} />
    </div>
  )
}

export default Dashboard
