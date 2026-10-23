import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { RiUserLine, RiBookOpenLine, RiCalendarCheckLine, RiTrophyLine, RiArrowRightLine, RiUserAddLine, RiEditLine, RiAlertLine, RiGroupLine, RiGraduationCapLine } from 'react-icons/ri'
import { mockStudents, mockClasses } from '../data/mockData'
import { activityService, events } from '../services/api'
import { getDisplayName, getSessionUser } from '../utils/session'

const activityIcons = {
  student: RiUserAddLine,
  edit: RiEditLine,
  absent: RiAlertLine,
  class: RiGroupLine,
  graduate: RiGraduationCapLine,
}

const activityColors = {
  student: 'bg-blue-50 text-blue-600',
  edit: 'bg-amber-50 text-amber-600',
  absent: 'bg-red-50 text-red-600',
  class: 'bg-purple-50 text-purple-600',
  graduate: 'bg-emerald-50 text-emerald-600',
}

export default function Dashboard() {
  const navigate = useNavigate()
  const currentUser = getSessionUser()
  const displayName = getDisplayName(currentUser).split(' ')[0]
  const active = mockStudents.filter(s => s.status === 'Active').length
  const graduated = mockStudents.filter(s => s.status === 'Graduated').length
  const avgGpa = (mockStudents.reduce((a, s) => a + (parseFloat(s.gpa) || 0), 0) / mockStudents.length).toFixed(1)

  const stats = [
    { label: 'Total Students', value: mockStudents.length, icon: RiUserLine, color: 'bg-blue-500', light: 'bg-blue-50 text-blue-600', trend: '+3 this month' },
    { label: 'Active Students', value: active, icon: RiCalendarCheckLine, color: 'bg-emerald-500', light: 'bg-emerald-50 text-emerald-600', trend: `${Math.round(active / mockStudents.length * 100)}% of total` },
    { label: 'Total Classes', value: mockClasses.length, icon: RiBookOpenLine, color: 'bg-violet-500', light: 'bg-violet-50 text-violet-600', trend: 'All active' },
    { label: 'Avg GPA', value: avgGpa, icon: RiTrophyLine, color: 'bg-amber-500', light: 'bg-amber-50 text-amber-600', trend: 'Out of 4.0' },
  ]

  const recent = [...mockStudents].slice(0, 5)
  const [activities, setActivities] = useState([])

  useEffect(() => {
    let mounted = true
    const loadActivities = async () => {
      const data = await activityService.getAll()
      if (mounted) setActivities(data)
    }
    loadActivities()

    const unsub = events.on('activity', (a) => {
      setActivities(prev => [{ id: a.id || Date.now(), type: a.type, message: a.message, time: a.time || 'just now', icon: a.icon || 'student' }, ...prev].slice(0, 10))
    })
    return () => { mounted = false; if (typeof unsub === 'function') unsub() }
  }, [])

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-blue-900 to-blue-700 px-5 py-6 text-white shadow-sm sm:px-8 sm:py-8">
        <div className="relative z-10 max-w-2xl">
          <p className="text-sm font-medium text-blue-200">Your school at a glance</p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Welcome, {displayName}</h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-blue-100/80">Keep up with student progress, attendance, and the latest school activity from one place.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button onClick={() => navigate('/students')} className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-blue-800 shadow-sm transition hover:bg-blue-50">Browse students</button>
            <button onClick={() => navigate('/attendance')} className="rounded-lg border border-white/30 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10">View attendance</button>
          </div>
        </div>
        <div aria-hidden="true" className="absolute -right-10 -top-24 h-72 w-72 rounded-full border-[36px] border-white/5 sm:right-4 sm:top-1/2 sm:-translate-y-1/2" />
      </section>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map(s => {
          const Icon = s.icon
          return (
            <div key={s.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-start gap-4">
              <div className={`w-11 h-11 rounded-xl ${s.color} flex items-center justify-center text-white flex-shrink-0`}>
                <Icon size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-bold text-gray-800">{s.value}</p>
                <p className="text-sm text-gray-500 font-medium leading-tight">{s.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{s.trend}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <h2 className="font-semibold text-gray-800">Recent Students</h2>
            <button onClick={() => navigate('/students')} className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 font-medium">
              View all <RiArrowRightLine size={13} />
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {recent.map(s => (
              <div key={s.id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50/70 cursor-pointer transition-colors" onClick={() => navigate(`/students/${s.id}`)}>
                <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-semibold flex-shrink-0">{s.avatar}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{s.name}</p>
                  <p className="text-xs text-gray-400">{s.class} · {s.id}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-semibold text-gray-700">{s.gpa} GPA</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${s.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : s.status === 'Graduated' ? 'bg-purple-50 text-purple-600' : 'bg-amber-50 text-amber-600'}`}>{s.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="px-5 py-4 border-b border-gray-50">
            <h2 className="font-semibold text-gray-800">Recent Activity</h2>
          </div>
          <div className="p-4 space-y-3">
            {activities.map(a => {
              const Icon = activityIcons[a.icon] || RiUserLine
              return (
                <div key={a.id} className="flex gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${activityColors[a.icon]}`}>
                    <Icon size={15} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700 leading-snug">{a.message}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{a.time}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
          <h2 className="font-semibold text-gray-800">Classes Overview</h2>
          <button onClick={() => navigate('/classes')} className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 font-medium">View all <RiArrowRightLine size={13} /></button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-5">
          {mockClasses.map(c => (
            <div key={c.id} className="border border-gray-100 rounded-lg p-4 hover:border-blue-200 hover:bg-blue-50/30 transition-all">
              <div className="flex items-start justify-between mb-2">
                <span className="font-semibold text-gray-800 text-sm">{c.name}</span>
                <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-medium">{c.students} students</span>
              </div>
              <p className="text-xs text-gray-500">{c.teacher}</p>
              <p className="text-xs text-gray-400">{c.room} · {c.subject}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
