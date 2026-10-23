import React from 'react'
import { mockStudents, mockClasses } from '../data/mockData'

export default function Reports() {
  const byClass = mockClasses.map(c => ({
    name: c.name,
    count: mockStudents.filter(s => s.class === c.name).length,
    active: mockStudents.filter(s => s.class === c.name && s.status === 'Active').length,
    avgGpa: (() => {
      const st = mockStudents.filter(s => s.class === c.name && s.gpa)
      return st.length ? (st.reduce((a, s) => a + parseFloat(s.gpa), 0) / st.length).toFixed(1) : '—'
    })()
  }))

  const byStatus = [
    { label: 'Active', count: mockStudents.filter(s => s.status === 'Active').length, color: 'bg-emerald-500' },
    { label: 'Inactive', count: mockStudents.filter(s => s.status === 'Inactive').length, color: 'bg-amber-500' },
    { label: 'Graduated', count: mockStudents.filter(s => s.status === 'Graduated').length, color: 'bg-purple-500' },
  ]

  const max = Math.max(...byClass.map(c => c.count))

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-semibold text-gray-800 mb-4">Students by class</h2>
          <div className="space-y-3">
            {byClass.map(c => (
              <div key={c.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700 font-medium">{c.name}</span>
                  <span className="text-gray-500">{c.count} students · GPA {c.avgGpa}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${(c.count / max) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-semibold text-gray-800 mb-4">Student status breakdown</h2>
          <div className="space-y-3">
            {byStatus.map(s => (
              <div key={s.label} className="flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full ${s.color} flex-shrink-0`} />
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full ${s.color} rounded-full`} style={{ width: `${(s.count / mockStudents.length) * 100}%` }} />
                </div>
                <div className="text-sm text-right w-28">
                  <span className="font-medium text-gray-700">{s.label}</span>
                  <span className="text-gray-400 ml-2">{s.count} ({Math.round(s.count / mockStudents.length * 100)}%)</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-gray-50">
            <p className="text-sm text-gray-500">Total: <span className="font-semibold text-gray-800">{mockStudents.length}</span> students</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50">
          <h2 className="font-semibold text-gray-800">GPA distribution</h2>
        </div>
        <div className="p-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'A (3.7–4.0)', count: mockStudents.filter(s => s.gpa >= 3.7).length, color: 'text-emerald-700 bg-emerald-50' },
            { label: 'B (3.0–3.6)', count: mockStudents.filter(s => s.gpa >= 3.0 && s.gpa < 3.7).length, color: 'text-blue-700 bg-blue-50' },
            { label: 'C (2.0–2.9)', count: mockStudents.filter(s => s.gpa >= 2.0 && s.gpa < 3.0).length, color: 'text-amber-700 bg-amber-50' },
            { label: 'D (0–1.9)', count: mockStudents.filter(s => s.gpa < 2.0).length, color: 'text-red-700 bg-red-50' },
          ].map(g => (
            <div key={g.label} className={`rounded-xl p-4 text-center ${g.color}`}>
              <p className="text-3xl font-bold">{g.count}</p>
              <p className="text-xs font-medium mt-1">{g.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
