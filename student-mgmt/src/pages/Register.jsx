import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { RiGraduationCapLine, RiMailLine, RiLockLine, RiUserLine } from 'react-icons/ri'
import Button from '../components/common/Button'
import { authService } from '../services/api'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ fullName: '', email: '', password: '' })
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    if (form.password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    setLoading(true)
    try {
      const result = await authService.register(form)
      let session = result
      if (!session?.token) {
        try {
          session = await authService.login({ email: form.email, password: form.password })
        } catch {
          navigate('/login', { state: { message: 'Registration succeeded. Please sign in with your new account.' } })
          return
        }
      }

      localStorage.setItem('token', session.token)
      localStorage.setItem('auth', 'true')
      if (session.user) localStorage.setItem('user', JSON.stringify(session.user))
      else localStorage.setItem('user', JSON.stringify({ fullName: form.fullName, email: form.email }))
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Unable to create your account. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const fieldClass = 'w-full bg-white/10 border border-white/10 text-white placeholder:text-slate-500 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-500 rounded-2xl mb-4 shadow-lg">
            <RiGraduationCapLine size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">EduManage</h1>
          <p className="text-blue-200/70 text-sm mt-1">Student Management System</p>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-7 shadow-2xl">
          <h2 className="text-lg font-semibold text-white mb-1">Create account</h2>
          <p className="text-sm text-slate-400 mb-6">Register to access the school management system.</p>

          {error && <div role="alert" className="bg-red-500/10 border border-red-500/20 text-red-300 text-sm rounded-lg px-4 py-2.5 mb-4">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-slate-300">Full name</span>
              <span className="relative block mt-1"><RiUserLine size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input required maxLength={100} autoComplete="name" className={fieldClass} placeholder="Your full name" value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} /></span>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-300">Email</span>
              <span className="relative block mt-1"><RiMailLine size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input required type="email" maxLength={255} autoComplete="email" className={fieldClass} placeholder="you@school.edu" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></span>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-300">Password</span>
              <span className="relative block mt-1"><RiLockLine size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input required type="password" minLength={6} maxLength={72} autoComplete="new-password" className={fieldClass} placeholder="At least 6 characters" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} /></span>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-300">Confirm password</span>
              <span className="relative block mt-1"><RiLockLine size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input required type="password" minLength={6} maxLength={72} autoComplete="new-password" className={fieldClass} placeholder="Enter your password again" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} /></span>
            </label>
            <Button type="submit" loading={loading} className="w-full justify-center">Create account</Button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-5">Already registered? <Link to="/login" className="text-blue-300 hover:underline">Sign in</Link></p>
        </div>
      </div>
    </div>
  )
}
