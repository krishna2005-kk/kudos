import { useState } from 'react'
import { ArrowRight, Eye, EyeOff, Gift } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

function Login() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const submit = (event) => { event.preventDefault(); if (!form.email || !form.password) { setError('Enter your email and password to continue.'); return } navigate('/dashboard') }
  return <AuthShell eyebrow="Welcome back" title="Make recognition part of every day." description="Celebrate the people who make your work better, one thoughtful note at a time.">
    <form onSubmit={submit} className="space-y-5">
      <FormField label="Work email" type="email" value={form.email} placeholder="you@company.com" onChange={(value) => setForm({ ...form, email: value })} />
      <div><div className="mb-2 flex items-center justify-between"><label className="label mb-0" htmlFor="password">Password</label><Link className="text-xs font-semibold text-teal-700 hover:text-teal-800" to="/forgot-password">Forgot password?</Link></div><div className="relative"><input id="password" type={showPassword ? 'text' : 'password'} className="field pr-11" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="Enter your password" /><button type="button" className="absolute right-3 top-2.5 text-slate-400" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></div>
      {error && <p className="text-sm text-rose-600">{error}</p>}<button className="primary-button w-full" type="submit">Sign in <ArrowRight size={17} /></button>
    </form><p className="mt-7 text-center text-sm text-slate-500">New to Kudos? <Link className="font-semibold text-teal-700" to="/signup">Create an account</Link></p>
  </AuthShell>
}

function FormField({ label, type = 'text', value, placeholder, onChange }) { const id = label.toLowerCase().replaceAll(' ', '-') ; return <div><label className="label" htmlFor={id}>{label}</label><input id={id} type={type} className="field" value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} required /></div> }

export function AuthShell({ eyebrow, title, description, children }) { return <main className="auth-page"><div className="auth-aside"><div className="brand-mark brand-mark-large"><Gift size={28} /></div><p className="mt-8 text-sm font-semibold uppercase tracking-[0.2em] text-teal-100">{eyebrow}</p><h1 className="mt-4 max-w-lg text-4xl font-bold leading-tight text-white lg:text-6xl">{title}</h1><p className="mt-6 max-w-md text-base leading-7 text-teal-50">{description}</p><div className="mt-12 border-l-2 border-teal-300/50 pl-5 text-sm leading-6 text-teal-100">“Recognition is the simplest way to say: I see the work you do.”</div></div><section className="auth-form-wrap"><div className="w-full max-w-md"><div className="mb-9 lg:hidden"><div className="brand-mark">K</div><p className="mt-3 font-bold text-slate-950">Kudos</p></div><div className="mb-8"><p className="eyebrow">Kudos platform</p><h2 className="mt-2 text-3xl font-bold text-slate-950">{eyebrow}</h2><p className="mt-2 text-sm leading-6 text-slate-500">{description}</p></div>{children}</div></section></main> }

export default Login