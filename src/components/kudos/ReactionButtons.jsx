import { useState } from 'react'
import api from '../../lib/api'

const reactionTypes = [
  { key: 'Like', apiType: '+1', emoji: '\u{1F44D}' },
  { key: 'Clap', apiType: '\u{1F44F}', emoji: '\u{1F44F}' },
  { key: 'Fire', apiType: '\u{1F525}', emoji: '\u{1F525}' },
]

function ReactionButtons({ kudos }) {
  const [selectedReaction, setSelectedReaction] = useState('')
  const [counts, setCounts] = useState(getStartingCounts(kudos))

  async function handleReactionClick(reaction) {
    const alreadySelected = selectedReaction === reaction.key
    const oldCounts = counts
    const oldSelectedReaction = selectedReaction

    setCounts({
      ...counts,
      [reaction.key]: counts[reaction.key] + (alreadySelected ? -1 : 1),
    })
    setSelectedReaction(alreadySelected ? '' : reaction.key)

    try {
      if (!kudos._id) {
        return
      }

      if (alreadySelected) {
        await api.delete(`/kudos/${kudos._id}/reactions/${encodeURIComponent(reaction.apiType)}`)
      } else {
        await api.post(`/kudos/${kudos._id}/reactions`, { type: reaction.apiType })
      }
    } catch {
      setCounts(oldCounts)
      setSelectedReaction(oldSelectedReaction)
    }
  }

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {reactionTypes.map((reaction) => (
        <button
          className={selectedReaction === reaction.key ? 'reaction reaction-selected' : 'reaction'}
          key={reaction.key}
          type="button"
          onClick={() => handleReactionClick(reaction)}
        >
          {reaction.emoji} {counts[reaction.key]}
        </button>
      ))}
    </div>
  )
}

function getStartingCounts(kudos) {
  if (kudos.reactions) {
    return kudos.reactions
  }

  return {
    Like: kudos.reactionSummary?.counts?.['+1'] || 0,
    Clap: kudos.reactionSummary?.counts?.['\u{1F44F}'] || 0,
    Fire: kudos.reactionSummary?.counts?.['\u{1F525}'] || 0,
  }
}

export default ReactionButtons
