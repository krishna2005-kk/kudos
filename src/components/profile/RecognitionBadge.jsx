function RecognitionBadge({ badge }) {
  return <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-amber-50 text-xl">{badge.icon}</span><div><p className="font-semibold text-slate-950">{badge.title}</p><p className="mt-1 text-xs text-slate-500">{badge.detail}</p></div></div>
}

export default RecognitionBadge