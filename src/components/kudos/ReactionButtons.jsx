import { useState } from 'react'
import api from '../../lib/api'

const reactionTypes = ['+1', '\u{1F44F}', '\u{1F525}']

const reactionEmojis = {
  Like: '👍',
  Clap: '👏',
  Fire: '🔥',
}

function ReactionButtons({ kudos }) {
  const [summary, setSummary] = useState(kudos.reactionSummary || { counts: {}, viewerReactions: [] })

  function handleReactionClick(reaction) {
    const selected = summary.viewerReactions.includes(reaction)
    const request = selected ? api.delete(`/kudos/${kudos._id}/reactions/${encodeURIComponent(reaction)}`) : api.post(`/kudos/${kudos._id}/reactions`, { type: reaction })
    request.then((response) => setSummary(response.data.data.reactionSummary))
      .catch(() => {})
  }

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {reactionTypes.map((reaction) => {
        const isSelected = summary.viewerReactions.includes(reaction)

        return (
          <button
            className={isSelected ? 'reaction reaction-selected' : 'reaction'}
            key={reaction}
            type="button"
            onClick={() => handleReactionClick(reaction)}
          >
            {reaction === '+1' ? '👍' : reaction} {summary.counts[reaction] || 0}
          </button>
        )
      })}
    </div>
  )
}

export default ReactionButtons
