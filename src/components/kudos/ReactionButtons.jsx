import { useState } from 'react'

function ReactionButtons({ reactions }) {
  const [counts, setCounts] = useState(reactions)
  const [selected, setSelected] = useState('')
  const toggleReaction = (reaction) => {
    setCounts((current) => ({ ...current, [reaction]: current[reaction] + (selected === reaction ? -1 : 1) }))
    setSelected(selected === reaction ? '' : reaction)
  }
  return <div className="flex flex-wrap gap-2">
    {Object.entries(counts).map(([reaction, count]) => <button key={reaction} type="button" className={`reaction ${selected === reaction ? 'reaction-selected' : ''}`} onClick={() => toggleReaction(reaction)}>{reaction} <span>{count}</span></button>)}
  </div>
}

export default ReactionButtons