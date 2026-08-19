import { BarChart3, Gift, Home, LogOut, UserRound, X } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'

const links = [
  { to: '/dashboard', label: 'Overview', icon: Home },
  { to: '/leaderboard', label: 'Leaderboard', icon: BarChart3 },
  { to: '/profile', label: 'My profile', icon: UserRound },
]

function Sidebar({ open, onClose }) {
  const navigate = useNavigate()
  const signOut = () => navigate('/login')
  return (
    <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
      <div className="flex items-center justify-between lg:hidden">
        <span className="font-semibold text-slate-950">Menu</span>
        <button type="button" className="icon-button" onClick={onClose} aria-label="Close navigation"><X size={19} /></button>
      </div>
      <div className="mb-8 rounded-xl bg-teal-50 p-4">
        <Gift className="mb-3 text-teal-700" size={22} />
        <p className="text-sm font-semibold text-slate-950">Make someone’s day</p>
        <p className="mt-1 text-xs leading-5 text-slate-600">A small thank-you can have a big impact.</p>
      </div>
      <nav className="space-y-1" aria-label="Main navigation">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} onClick={onClose} className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}>
            <Icon size={19} />{label}
          </NavLink>
        ))}
      </nav>
      <button type="button" className="nav-link mt-auto w-full" onClick={signOut}><LogOut size={19} />Log out</button>
    </aside>
  )
}

export default Sidebar