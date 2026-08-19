import { useState } from 'react'
import { Check, Search, X } from 'lucide-react'
import { employees, currentUser } from '../../data/mockData'

function GiveKudosDialog({ open, onClose }) {
  const [search, setSearch] = useState('')
  const [recipient, setRecipient] = useState(null)
  const [points, setPoints] = useState('20')
  const [message, setMessage] = useState('')
  const [value, setValue] = useState('#Teamwork')
  const [sent, setSent] = useState(false)
  if (!open) return null
  const matches = employees.filter((employee) => employee.id !== currentUser.id && employee.name.toLowerCase().includes(search.toLowerCase()))
  const submit = (event) => { event.preventDefault(); setSent(true); setTimeout(onClose, 900) }
  return <div className="dialog-backdrop" role="presentation"><div className="dialog-panel" role="dialog" aria-modal="true" aria-labelledby="give-kudos-title">
    <div className="flex items-start justify-between border-b border-slate-100 p-6"><div><p className="eyebrow">Recognition</p><h2 id="give-kudos-title" className="mt-1 text-2xl font-bold text-slate-950">Give Kudos</h2></div><button type="button" className="icon-button" onClick={onClose} aria-label="Close dialog"><X size={19} /></button></div>
    {sent ? <div className="p-10 text-center"><div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-emerald-100 text-emerald-700"><Check /></div><h3 className="mt-4 text-lg font-bold">Kudos sent!</h3><p className="mt-2 text-sm text-slate-500">Your recognition is on its way.</p></div> : <form onSubmit={submit} className="space-y-5 p-6">
      <div><label className="label" htmlFor="recipient-search">Recognize someone</label><div className="relative"><Search className="absolute left-3 top-3 text-slate-400" size={17} /><input id="recipient-search" value={recipient ? recipient.name : search} onChange={(event) => { setRecipient(null); setSearch(event.target.value) }} className="field pl-10" placeholder="Search by name" required /></div>{!recipient && search && <div className="mt-2 overflow-hidden rounded-lg border border-slate-200">{matches.map((employee) => <button type="button" key={employee.id} className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-slate-50" onClick={() => { setRecipient(employee); setSearch('') }}><span className="avatar avatar-tiny">{employee.avatar}</span><span className="text-sm font-medium">{employee.name}</span><span className="ml-auto text-xs text-slate-400">{employee.department}</span></button>)}</div>}</div>
      <fieldset><legend className="label">Points</legend><div className="grid grid-cols-3 gap-2">{['10', '20', '50'].map((option) => <label key={option} className={`choice ${points === option ? 'choice-selected' : ''}`}><input type="radio" name="points" value={option} checked={points === option} onChange={(event) => setPoints(event.target.value)} />{option} points</label>)}</div></fieldset>
      <div><label className="label" htmlFor="kudos-message">Your message</label><textarea id="kudos-message" className="field min-h-24 resize-y" value={message} onChange={(event) => setMessage(event.target.value)} placeholder="What did they do brilliantly?" required /></div>
      <div><label className="label" htmlFor="company-value">Company value</label><select id="company-value" className="field" value={value} onChange={(event) => setValue(event.target.value)}><option>#Teamwork</option><option>#CustomerObsession</option><option>#Innovation</option></select></div>
      <button type="submit" className="primary-button w-full" disabled={!recipient}>Send Kudos</button>
    </form>}
  </div></div>
}

export default GiveKudosDialog