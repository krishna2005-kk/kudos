import ReactionButtons from './ReactionButtons'

function KudosCard({ kudos }) {
  return (
    <div className="kudos-item">
      <div className="kudos-card-top">
        <p>
          <strong>{kudos.sender}</strong> to <strong>{kudos.receiver}</strong>
        </p>
        <span className="points-badge">Star {kudos.points} points</span>
      </div>
      <p className="kudos-message">{kudos.message}</p>
      <span className="tag">{kudos.value}</span>
      <ReactionButtons reactions={kudos.reactions} />
    </div>
  )
}

export default KudosCard
