import ReactionButtons from './ReactionButtons'

function KudosCard({ kudos }) {
  return (
    <div className="kudos-item">
      <p>
        <strong>{kudos.sender}</strong> to <strong>{kudos.receiver}</strong>
      </p>
      <p>{kudos.points} points</p>
      <p>{kudos.message}</p>
      <span className="tag">{kudos.value}</span>
      <ReactionButtons reactions={kudos.reactions} />
    </div>
  )
}

export default KudosCard
