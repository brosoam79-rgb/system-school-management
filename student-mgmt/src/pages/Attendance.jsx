import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { RiCheckLine, RiCloseLine, RiTimeLine } from 'react-icons/ri'
import { attendanceService } from '../services/api'
import { classOptions } from '../data/mockData'
import { Select } from '../components/common/Input'
import Button from '../components/common/Button'

const today = () => {
  const current = new Date()
  const month = String(current.getMonth() + 1).padStart(2, '0')
  const day = String(current.getDate()).padStart(2, '0')
  return `${current.getFullYear()}-${month}-${day}`
}

export default function Attendance() {
  const [searchParams] = useSearchParams()
  const [date, setDate] = useState(() => searchParams.get('date') || today())
  const [classFilter, setClassFilter] = useState(() => searchParams.get('class') || '')
  const [records, setRecords] = useState([])
  const [history, setHistory] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    setMessage('')
    try {
      const historyPromise = attendanceService.getAll(classFilter ? { class: classFilter } : {})
      if (!classFilter) {
        const allRecords = await attendanceService.getAll({ date })
        setRecords(allRecords)
        setHistory(await historyPromise)
        return
      }

      const [students, todayRecords, allHistory] = await Promise.all([
        attendanceService.getStudentsByClass(classFilter),
        attendanceService.getAll({ date, class: classFilter }),
        historyPromise,
      ])
      const byStudent = new Map(todayRecords.map(record => [record.studentId, record]))
      setRecords(students.map(student => {
        const saved = byStudent.get(student.id)
        return saved || {
          studentId: student.id,
          studentName: student.name,
          class: classFilter,
          date,
          status: 'Present',
          note: '',
          isDraft: true,
        }
      }))
      setHistory(allHistory)
    } catch (err) {
      setError(err.message || 'Could not load attendance. Please try again.')
      setRecords([])
      setHistory([])
    } finally {
      setLoading(false)
    }
  }, [date, classFilter])

  useEffect(() => { load() }, [load])

  const setStatus = (studentId, status) => {
    setRecords(current => current.map(record => record.studentId === studentId ? { ...record, status } : record))
    setMessage('')
  }

  const handleSubmit = async () => {
    if (!classFilter || records.length === 0) return
    setSaving(true)
    setError('')
    setMessage('')
    try {
      const saved = await attendanceService.saveBulk({
        className: classFilter,
        date,
        records: records.map(({ studentId, status, note }) => ({ studentId, status, note: note || '' })),
      })
      setRecords(saved)
      setMessage(`Attendance saved for ${saved.length} students.`)
      const allHistory = await attendanceService.getAll({ class: classFilter })
      setHistory(allHistory)
    } catch (err) {
      setError(err.message || 'Could not save attendance. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const absencesByStudent = useMemo(() => {
    const counts = new Map()
    history.forEach(record => {
      if (record.status?.toLowerCase() === 'absent') {
        counts.set(record.studentId, (counts.get(record.studentId) || 0) + 1)
      }
    })
    return counts
  }, [history])

  const filteredRecords = records.filter(record => {
    const query = search.trim().toLowerCase()
    return !query || record.studentName?.toLowerCase().includes(query) || record.studentId?.toLowerCase().includes(query)
  })
  const counts = {
    Present: records.filter(record => record.status === 'Present').length,
    Absent: records.filter(record => record.status === 'Absent').length,
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Attendance</h1>
        <p className="mt-1 text-sm text-gray-500">Mark each class roster, submit it, and track student absences over time.</p>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <input type="date" value={date} onChange={event => setDate(event.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <Select value={classFilter} onChange={event => setClassFilter(event.target.value)} className="w-40 text-sm">
          <option value="">All classes (view)</option>
          {classOptions.map(name => <option key={name} value={name}>{name}</option>)}
        </Select>
        <input type="search" value={search} onChange={event => setSearch(event.target.value)}
          placeholder="Search student name or ID"
          className="min-w-[220px] flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        {classFilter && <Button onClick={handleSubmit} loading={saving} disabled={loading || records.length === 0}>Submit attendance</Button>}
      </div>

      {error && <div role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      {message && <div role="status" className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { label: 'Present', count: counts.Present, icon: RiCheckLine, color: 'bg-emerald-50 text-emerald-700' },
          { label: 'Absent', count: counts.Absent, icon: RiCloseLine, color: 'bg-red-50 text-red-700' },
        ].map(({ label, count, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}><Icon size={18} /></div>
            <div><p className="text-xl font-bold text-gray-800">{count}</p><p className="text-xs text-gray-500">{label}</p></div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-3.5 border-b border-gray-100">
          <div>
            <p className="text-sm font-medium text-gray-800">{new Date(`${date}T00:00:00`).toLocaleDateString('en', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p className="text-xs text-gray-500 mt-1">{classFilter ? `${records.length} students in ${classFilter}` : 'Select a class to mark attendance'}</p>
          </div>
          {classFilter && <p className="text-xs text-gray-500">Absence patterns use saved records: 0 perfect · 1–2 few · 3+ many</p>}
        </div>

        {loading ? <div className="flex justify-center py-16"><div className="w-8 h-8 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" /></div>
          : filteredRecords.length === 0 ? <p className="text-center text-gray-400 py-16 text-sm">{records.length ? 'No students match your search' : 'No students or attendance records found'}</p>
            : <div className="divide-y divide-gray-100">
              {filteredRecords.map(record => {
                const absences = absencesByStudent.get(record.studentId) || 0
                const pattern = absences === 0 ? 'Perfect attendance' : absences < 3 ? 'Few absences' : 'Many absences'
                return (
                  <div key={record.studentId || record.id} className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-gray-800">{record.studentName}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{record.studentId} · {record.class}</p>
                      {classFilter && <p className={`text-xs mt-1 ${absences === 0 ? 'text-emerald-700' : absences < 3 ? 'text-amber-700' : 'text-red-700'}`}>{pattern} · {absences} {absences === 1 ? 'absence' : 'absences'}</p>}
                    </div>
                    {classFilter ? <div className="flex gap-2">
                      {['Present', 'Absent'].map(status => <button key={status} type="button" onClick={() => setStatus(record.studentId, status)}
                        className={`min-w-24 rounded-lg px-4 py-2 text-sm font-medium ${record.status === status ? status === 'Present' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                        {status === 'Present' ? '✓ ' : '✕ '}{status}
                      </button>)}
                    </div> : <span className={`rounded-full px-3 py-1 text-xs font-medium ${record.status === 'Absent' ? 'bg-red-50 text-red-700' : record.status === 'Present' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{record.status}</span>}
                  </div>
                )
              })}
            </div>}
      </div>
    </div>
  )
}
