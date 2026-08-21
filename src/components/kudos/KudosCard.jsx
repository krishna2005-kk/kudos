import ReactionButtons from './ReactionButtons'

function KudosCard({ kudos }) {
  return (
    <div className="kudos-item">
      <p>
        <strong>{kudos.sender?.name || kudos.sender}</strong> to <strong>{kudos.receiver?.name || kudos.receiver}</strong>
      </p>
      <p>{kudos.points} points</p>
      <p>{kudos.message}</p>
      <span className="tag">{kudos.companyValue || kudos.value}</span>
      <ReactionButtons kudos={kudos} />
    </div>
  )
}

export default KudosCard
