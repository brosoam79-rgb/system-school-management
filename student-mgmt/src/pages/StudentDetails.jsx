import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { RiArrowLeftLine, RiMailLine, RiPhoneLine, RiMapPinLine, RiCalendarLine, RiUserLine, RiEditLine } from 'react-icons/ri'
import Button from '../components/common/Button'
import Modal from '../components/common/Modal'
import StudentForm from '../components/students/StudentForm'
import { studentService } from '../services/api'
import { getSessionUser, isAdminUser } from '../utils/session'

const statusColors = { Active: 'bg-emerald-50 text-emerald-700 border-emerald-200', Inactive: 'bg-amber-50 text-amber-700 border-amber-200', Graduated: 'bg-purple-50 text-purple-700 border-purple-200' }
const avatarBg = ['bg-blue-500', 'bg-violet-500', 'bg-emerald-500', 'bg-rose-500', 'bg-amber-500', 'bg-teal-500']

const gradeFromGpa = (gpa) => {
  const g = parseFloat(gpa)
  if (g >= 3.7) return { label: 'A', color: 'bg-emerald-100 text-emerald-700' }
  if (g >= 3.0) return { label: 'B', color: 'bg-blue-100 text-blue-700' }
  if (g >= 2.0) return { label: 'C', color: 'bg-amber-100 text-amber-700' }
  return { label: 'D', color: 'bg-red-100 text-red-700' }
}

export default function StudentDetails() {
  const canManageStudents = isAdminUser(getSessionUser())
  const { id } = useParams()
  const navigate = useNavigate()
  const [student, setStudent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editOpen, setEditOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    setLoading(true)
    try { setStudent(await studentService.getById(id)) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [id])

  const handleEdit = async (data) => {
    setSaving(true)
    try { await studentService.update(id, data); await load(); setEditOpen(false) }
    finally { setSaving(false) }
  }

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" /></div>
  if (!student) return <div className="text-center py-20 text-gray-400">Student not found</div>

  const ci = student.id.charCodeAt(student.id.length - 1) % avatarBg.length
  const grade = gradeFromGpa(student.gpa)

  return (
    <div className="max-w-3xl">
      <button onClick={() => navigate('/students')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 mb-5 transition-colors">
        <RiArrowLeftLine size={16} /> Back to students
      </button>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-8 flex items-start gap-5">
          <div className={`w-16 h-16 rounded-2xl ${avatarBg[ci]} flex items-center justify-center text-white font-bold text-xl flex-shrink-0`}>
            {student.avatar}
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="text-xl font-bold text-white">{student.name}</h1>
                <p className="text-slate-400 text-sm mt-0.5">{student.id} · {student.class}</p>
              </div>
              <div className="flex gap-2 items-center">
                <span className={`text-xs px-3 py-1 rounded-full font-medium border ${statusColors[student.status]}`}>{student.status}</span>
                <span className={`text-base font-bold w-10 h-10 rounded-xl flex items-center justify-center ${grade.color}`}>{grade.label}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
          {[
            { icon: RiMailLine, label: 'Email', value: student.email },
            { icon: RiPhoneLine, label: 'Phone', value: student.phone || '—' },
            { icon: RiMapPinLine, label: 'Address', value: student.address || '—' },
            { icon: RiCalendarLine, label: 'Date of Birth', value: student.dob ? new Date(student.dob).toLocaleDateString('en', { year: 'numeric', month: 'long', day: 'numeric' }) : '—' },
            { icon: RiUserLine, label: 'Gender', value: student.gender },
            { icon: RiUserLine, label: 'Teacher', value: student.teacher || '—' },
            { icon: RiCalendarLine, label: 'Enrolled', value: student.enrolled ? new Date(student.enrolled).toLocaleDateString('en', { year: 'numeric', month: 'long', day: 'numeric' }) : '—' },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-start gap-3 p-3.5 bg-gray-50 rounded-xl">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-gray-500 shadow-sm flex-shrink-0">
                <Icon size={16} />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">{label}</p>
                <p className="text-sm text-gray-800 mt-0.5 font-medium">{value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="px-6 pb-6">
          <div className="bg-blue-50 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-blue-800">GPA Score</p>
              <p className="text-xs text-blue-500">{student.gpa >= 3.7 ? 'Excellent' : student.gpa >= 3.0 ? 'Good' : 'Satisfactory'} performance</p>
            </div>
            <span className="text-3xl font-bold text-blue-700">{student.gpa || '—'}</span>
          </div>
        </div>

        <div className="px-6 pb-6 flex justify-end">
          {canManageStudents && <Button icon={<RiEditLine size={15} />} onClick={() => setEditOpen(true)}>Edit student</Button>}
        </div>
      </div>

      {canManageStudents && <Modal isOpen={editOpen} onClose={() => setEditOpen(false)} title="Edit student" size="lg">
        <StudentForm initial={student} onSubmit={handleEdit} onCancel={() => setEditOpen(false)} loading={saving} />
      </Modal>}
    </div>
  )
}
