import KudosCard from '../components/kudos/KudosCard'
import RecognitionBadge from '../components/profile/RecognitionBadge'
import { badges, currentUser, kudosFeed } from '../data/mockData'

function Profile() {
  return (
    <div>
      <div className="page-heading">
        <h1>Profile</h1>
        <p>Your recognition summary.</p>
      </div>

      <section className="card mt-4 profile-card">
        <div className="profile-avatar">HS</div>
        <h2>{currentUser.name}</h2>
        <p>{currentUser.department}</p>
        <p>{currentUser.email}</p>
      </section>

      <section className="simple-grid mt-4">
        <div className="card">
          <h3>Giving Allowance</h3>
          <p>{currentUser.givingAllowance} / {currentUser.allowanceTotal}</p>
        </div>
        <div className="card">
          <h3>Earned Points</h3>
          <p>{currentUser.earnedPoints}</p>
        </div>
        <div className="card">
          <h3>Kudos Given</h3>
          <p>{currentUser.kudosGiven}</p>
        </div>
        <div className="card">
          <h3>Kudos Received</h3>
          <p>{currentUser.kudosReceived}</p>
        </div>
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
