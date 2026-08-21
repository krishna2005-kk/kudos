import { useEffect, useState } from 'react'
import Button from '@visa/nova-react/button'
import GiveKudosDialog from '../components/kudos/GiveKudosDialog'
import KudosCard from '../components/kudos/KudosCard'
import { useAuth } from '../context/AuthContext'
import api, { getApiError } from '../lib/api'

function Dashboard() {
  const [showForm, setShowForm] = useState(false)
  const [feed, setFeed] = useState([])
  const [error, setError] = useState('')
  const { user, refreshUser } = useAuth()

  async function loadFeed() {
    try {
      const response = await api.get('/kudos')
      setFeed(response.data.data.kudos)
      setError('')
    } catch (requestError) {
      setError(getApiError(requestError))
    }
  }

  useEffect(() => { loadFeed() }, [])

  async function handleKudosSent() {
    await Promise.all([loadFeed(), refreshUser()])
  }

  return (
    <div>
      <h1>Kudos Dashboard</h1>
      <p>Welcome, {user?.name}</p>

      <div className="simple-grid mt-4">
        <div className="card">
          <h3>Giving Points</h3>
          <p>
            {user?.givingAllowance ?? 'Not available'} / 100
          </p>
        </div>

        <div className="card">
          <h3>Earned Points</h3>
          <p>{user?.earnedPoints ?? 0}</p>
        </div>
      </div>

      {user?.role === 'employee' && <div className="mt-5">
        <Button className="primary-button" type="button" onClick={() => setShowForm(true)}>
          Give Kudos
        </Button>
      </div>}

      <section className="card mt-5">
        <h2>Recent Kudos</h2>

        {error && <p className="danger-text">{error}</p>}
        {feed.map((kudos) => (
          <KudosCard key={kudos._id} kudos={kudos} />
        ))}
      </section>

      <GiveKudosDialog open={showForm} onClose={() => setShowForm(false)} onSent={handleKudosSent} />
    </div>
  )
}

export default Dashboard
