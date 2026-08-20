function LeaderboardCard({ person }) {
  return (
    <div className="card">
      <p>
        {person.rank}. {person.name}
      </p>
      <p>{person.department}</p>
      <p>{person.points} points</p>
    </div>
  )
}

export default LeaderboardCard
