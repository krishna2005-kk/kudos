import KudosCard from '../components/kudos/KudosCard'
import RecognitionBadge from '../components/profile/RecognitionBadge'
import { badges, currentUser, kudosFeed } from '../data/mockData'

function Profile() {
  return (
    <div>
      <h1>Profile</h1>

      <section className="card mt-4">
        <p>Name: {currentUser.name}</p>
        <p>Email: {currentUser.email}</p>
        <p>Department: {currentUser.department}</p>
      </section>

      <section className="card mt-4">
        <p>Giving Points: {currentUser.givingAllowance}</p>
        <p>Earned Points: {currentUser.earnedPoints}</p>
        <p>Kudos Given: {currentUser.kudosGiven}</p>
        <p>Kudos Received: {currentUser.kudosReceived}</p>
      </section>

      <section className="card mt-4">
        <h2>Badges</h2>
        <ul>
          {badges.map((badge) => (
            <RecognitionBadge key={badge} badge={badge} />
          ))}
        </ul>
      </section>

      <section className="card mt-4">
        <h2>Recent Kudos</h2>
        {kudosFeed.slice(0, 2).map((kudos) => (
          <KudosCard key={kudos.id} kudos={kudos} />
        ))}
      </section>
    </div>
  )
}

export default Profile
