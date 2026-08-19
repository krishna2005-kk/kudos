import { Bell, Menu, Search } from 'lucide-react'

function Navbar({ onMenuClick }) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex h-20 items-center justify-between px-5 lg:px-8">
        <div className="flex items-center gap-3">
          <button type="button" className="icon-button lg:hidden" onClick={onMenuClick} aria-label="Open navigation">
            <Menu size={20} />
          </button>
          <div className="brand-mark">K</div>
          <div>
            <p className="text-lg font-bold tracking-tight text-slate-950">Kudos</p>
            <p className="hidden text-xs text-slate-500 sm:block">Recognition that matters</p>
          </div>
        </div>
        <div className="hidden max-w-sm flex-1 px-10 md:block">
          <label className="relative block">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
            <input className="field pl-10" placeholder="Search people or kudos" aria-label="Search" />
          </label>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" className="icon-button" aria-label="Notifications"><Bell size={19} /></button>
          <div className="avatar avatar-small">HS</div>
        </div>
      </div>
    </header>
  )
}

export default Navbar