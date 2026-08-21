import { useState } from 'react'

const reactionEmojis = {
  Like: '\u{1F44D}',
  Clap: '\u{1F44F}',
  Fire: '\u{1F525}',
}

function ReactionButtons({ reactions }) {
  const [selectedReaction, setSelectedReaction] = useState('')
  const [counts, setCounts] = useState(reactions)

  function handleReactionClick(reaction) {
    const alreadySelected = selectedReaction === reaction

    setCounts((oldCounts) => ({
      ...oldCounts,
      [reaction]: oldCounts[reaction] + (alreadySelected ? -1 : 1),
    }))

    if (alreadySelected) {
      setSelectedReaction('')
    } else {
      setSelectedReaction(reaction)
    }

    // TODO: Send the reaction update to the backend later.
  }

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {Object.keys(counts).map((reaction) => (
        <button
          className={selectedReaction === reaction ? 'reaction reaction-selected' : 'reaction'}
          key={reaction}
          type="button"
          onClick={() => handleReactionClick(reaction)}
        >
          {reactionEmojis[reaction]} {counts[reaction]}
        </button>
      ))}
    </div>
  )
}

export default ReactionButtons
