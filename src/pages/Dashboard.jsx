import { useState } from 'react'
import Button from '@visa/nova-react/button'
import GiveKudosDialog from '../components/kudos/GiveKudosDialog'
import KudosCard from '../components/kudos/KudosCard'
import { currentUser, kudosFeed } from '../data/mockData'

function Dashboard() {
  const [showForm, setShowForm] = useState(false)
  const nextResetDate = getNextResetDate()

  return (
    <div>
      <section className="welcome-card">
        <p className="small-title">Kudos Dashboard</p>
        <h1>Welcome back, Heer</h1>
        <p>Recognize your teammates and appreciate their work.</p>
        <p className="reset-text">Next points reset: {nextResetDate}</p>
      </section>

      <div className="simple-grid mt-4">
        <div className="card">
          <h3>Giving Allowance</h3>
          <p>
            {currentUser.givingAllowance} / {currentUser.allowanceTotal}
          </p>
          <small>Points left this month</small>
        </div>

        <div className="card">
          <h3>Earned Points</h3>
          <p>{currentUser.earnedPoints}</p>
          <small>Total points received</small>
        </div>

        <div className="card">
          <h3>Kudos Received</h3>
          <p>{currentUser.kudosReceived}</p>
          <small>This month</small>
        </div>
      </div>

      <div className="mt-5">
        <Button className="primary-button" type="button" onClick={() => setShowForm(true)}>
          Give Kudos
        </Button>
      </div>

      <section className="card mt-5">
        <h2>My Points</h2>
        <div className="summary-list">
          <p><strong>Giving Allowance:</strong> {currentUser.givingAllowance} / {currentUser.allowanceTotal}</p>
          <p><strong>Earned Points:</strong> {currentUser.earnedPoints}</p>
          <p><strong>Points Given:</strong> {currentUser.pointsGiven}</p>
          <p><strong>Points Received:</strong> {currentUser.pointsReceived}</p>
        </div>
        <p className="help-text">Giving points are points you can give to others. Earned points are points you have received.</p>
      </section>

      <section className="card mt-5">
        <h2>Recent Kudos</h2>
        {kudosFeed.length === 0 && <p className="empty-text">No kudos found.</p>}

        {kudosFeed.map((kudos) => (
          <KudosCard key={kudos.id} kudos={kudos} />
        ))}
      </section>

      <GiveKudosDialog open={showForm} onClose={() => setShowForm(false)} />
    </div>
  )
}

function getNextResetDate() {
  const today = new Date()
  const nextMonth = today.getMonth() + 1
  const nextReset = new Date(today.getFullYear(), nextMonth, 1)

  return nextReset.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default Dashboard
