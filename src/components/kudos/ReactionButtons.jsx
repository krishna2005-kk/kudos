import { useState } from 'react'

const reactionEmojis = {
  Like: '👍',
  Clap: '👏',
  Fire: '🔥',
}

function ReactionButtons({ reactions }) {
  const [selectedReaction, setSelectedReaction] = useState('')

  function handleReactionClick(reaction) {
    if (selectedReaction === reaction) {
      setSelectedReaction('')
    } else {
      setSelectedReaction(reaction)
    }
  }

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {Object.keys(reactions).map((reaction) => {
        const isSelected = selectedReaction === reaction
        const extraPoint = isSelected ? 1 : 0

        return (
          <button
            className={isSelected ? 'reaction reaction-selected' : 'reaction'}
            key={reaction}
            type="button"
            onClick={() => handleReactionClick(reaction)}
          >
            {reactionEmojis[reaction]} {reaction} {reactions[reaction] + extraPoint}
          </button>
        )
      })}
    </div>
  )
}

export default ReactionButtons
