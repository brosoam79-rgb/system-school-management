import React from 'react'
import { useNavigate } from 'react-router-dom'
import { RiEditLine, RiDeleteBinLine, RiEyeLine } from 'react-icons/ri'
import Button from '../common/Button'

const statusColors = {
  Active: 'bg-emerald-50 text-emerald-700',
  Inactive: 'bg-amber-50 text-amber-700',
  Graduated: 'bg-purple-50 text-purple-700',
}
const avatarBg = ['bg-blue-500', 'bg-violet-500', 'bg-emerald-500', 'bg-rose-500', 'bg-amber-500', 'bg-teal-500']

export default function StudentTable({ students, loading, onEdit, onDelete, canManage = false }) {
  const navigate = useNavigate()

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
    </div>
  )

  if (!students.length) return (
    <div className="text-center py-20">
      <p className="text-gray-400 text-sm">No students found</p>
    </div>
  )

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm min-w-[700px]">
        <thead>
          <tr className="border-b border-gray-100">
            {['Student', 'ID', 'Class', 'Teacher', 'GPA', 'Phone', 'Status', ...(canManage ? ['Actions'] : [])].map(h => (
              <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {students.map((s, i) => {
            const ci = s.id.charCodeAt(s.id.length - 1) % avatarBg.length
            return (
              <tr key={s.id} className="hover:bg-gray-50/80 transition-colors group">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate(`/students/${s.id}`)}>
                    <div className={`w-8 h-8 rounded-lg ${avatarBg[ci]} flex items-center justify-center text-white text-xs font-semibold flex-shrink-0`}>
                      {s.avatar}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 group-hover:text-blue-600 transition-colors leading-tight">{s.name}</p>
                      <p className="text-xs text-gray-400">{s.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-500 font-mono text-xs">{s.id}</td>
                <td className="px-4 py-3">
                  <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-medium">{s.class}</span>
                </td>
                <td className="px-4 py-3 text-gray-500">{s.teacher || '—'}</td>
                <td className="px-4 py-3 font-medium text-gray-700">{s.gpa || '—'}</td>
                <td className="px-4 py-3 text-gray-500">{s.phone || '—'}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[s.status]}`}>{s.status}</span>
                </td>
                {canManage && <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" icon={<RiEditLine size={14} />} onClick={() => onEdit(s)} title="Edit" />
                    <Button size="sm" variant="ghost" icon={<RiDeleteBinLine size={14} />} onClick={() => onDelete(s)} title="Delete" className="hover:text-red-500 hover:bg-red-50" />
                  </div>
                </td>}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
