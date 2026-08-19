import ReactionButtons from './ReactionButtons'

function KudosCard({ kudos }) {
  return <article className="panel p-5">
    <div className="flex flex-wrap items-center gap-3">
      <div className="avatar">{kudos.sender.avatar}</div>
      <div><p className="font-semibold text-slate-950">{kudos.sender.name}</p><p className="text-xs text-slate-500">{kudos.sender.department}</p></div>
      <span className="text-slate-300">→</span>
      <div className="avatar avatar-warm">{kudos.receiver.avatar}</div>
      <div><p className="font-semibold text-slate-950">{kudos.receiver.name}</p><p className="text-xs text-slate-500">{kudos.receiver.department}</p></div>
      <span className="points-pill ml-auto">{kudos.points} points</span>
    </div>
    <p className="my-5 text-[15px] leading-7 text-slate-700">“{kudos.message}”</p>
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4"><span className="tag">{kudos.value}</span><ReactionButtons reactions={kudos.reactions} /></div>
  </article>
}

export default KudosCard