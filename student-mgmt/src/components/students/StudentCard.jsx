import React from 'react'
import { useNavigate } from 'react-router-dom'
import { RiMailLine, RiPhoneLine, RiMapPinLine, RiEditLine, RiDeleteBinLine } from 'react-icons/ri'
import Button from '../common/Button'

const statusColors = {
  Active: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
  Inactive: 'bg-amber-50 text-amber-700 border border-amber-100',
  Graduated: 'bg-purple-50 text-purple-700 border border-purple-100',
}

const avatarColors = ['bg-blue-500', 'bg-violet-500', 'bg-emerald-500', 'bg-rose-500', 'bg-amber-500', 'bg-teal-500']

export default function StudentCard({ student, onEdit, onDelete, canManage = false }) {
  const navigate = useNavigate()
  const colorIdx = student.id.charCodeAt(student.id.length - 1) % avatarColors.length

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate(`/students/${student.id}`)}>
          <div className={`w-12 h-12 rounded-xl ${avatarColors[colorIdx]} flex items-center justify-center text-white font-semibold text-base`}>
            {student.avatar}
          </div>
          <div>
            <p className="font-semibold text-gray-800 hover:text-blue-600 transition-colors">{student.name}</p>
            <p className="text-xs text-gray-400">{student.id}</p>
          </div>
        </div>
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[student.status]}`}>{student.status}</span>
      </div>

      <div className="space-y-1.5 text-sm text-gray-500">
        <div className="flex items-center gap-2"><RiMailLine size={14} /><span className="truncate">{student.email}</span></div>
        <div className="flex items-center gap-2"><RiPhoneLine size={14} /><span>{student.phone || '—'}</span></div>
        <div className="flex items-center gap-2"><RiMapPinLine size={14} /><span className="truncate">{student.address || '—'}</span></div>
      </div>

      <div className="flex flex-col gap-2 pt-2 border-t border-gray-50">
        <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-md font-medium">{student.class}</span>
        <span className="text-xs text-gray-500">{student.teacher || 'Teacher not assigned'}</span>
        {canManage && <div className="flex gap-2">
          <Button size="sm" variant="ghost" icon={<RiEditLine size={14} />} onClick={() => onEdit(student)} />
          <Button size="sm" variant="ghost" icon={<RiDeleteBinLine size={14} />} onClick={() => onDelete(student)} className="hover:text-red-500 hover:bg-red-50" />
        </div>}
      </div>
    </div>
  )
}
