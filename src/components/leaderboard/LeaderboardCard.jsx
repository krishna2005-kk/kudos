function LeaderboardCard({ person }) {
  return <div className="flex items-center gap-4 border-b border-slate-100 px-5 py-4 last:border-0"><span className={`w-7 text-center font-bold ${person.rank < 4 ? 'text-teal-700' : 'text-slate-400'}`}>{String(person.rank).padStart(2, '0')}</span><div className="avatar">{person.avatar}</div><div className="min-w-0 flex-1"><p className="truncate font-semibold text-slate-950">{person.name}</p><p className="text-xs text-slate-500">{person.department}</p></div><strong className="text-slate-950">{person.points} <span className="text-xs font-normal text-slate-500">pts</span></strong></div>
}

export default LeaderboardCard