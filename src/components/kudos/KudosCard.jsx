import ReactionButtons from './ReactionButtons'

function KudosCard({ kudos }) {
  const senderName = kudos.sender?.name || kudos.sender
  const receiverName = kudos.receiver?.name || kudos.receiver
  const companyValue = kudos.companyValue || kudos.value

  return (
    <div className="kudos-item">
      <div className="kudos-card-top">
        <p>
          <strong>{senderName}</strong> to <strong>{receiverName}</strong>
        </p>
        <span className="points-badge">Star {kudos.points} points</span>
      </div>
      <p className="kudos-message">{kudos.message}</p>
      <span className="tag">{companyValue}</span>
      <ReactionButtons kudos={kudos} />
    </div>
  )
}

export default KudosCard
