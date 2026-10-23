import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/common/Button'
import StudentForm from '../components/students/StudentForm'
import { studentService } from '../services/api'

export default function AddStudent() {
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleAdd = async (data) => {
    setSaving(true)
    setError('')
    try {
      await studentService.create(data)
      navigate('/students')
    } catch (err) {
      setError(err.message || 'Could not save the student. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Add Student</h1>
          <p className="text-sm text-gray-500 mt-1">Enter a new student record on a dedicated page.</p>
        </div>
        <Button variant="secondary" onClick={() => navigate('/students')}>Back to student list</Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        {error && <div role="alert" className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
        <StudentForm onSubmit={handleAdd} onCancel={() => navigate('/students')} loading={saving} />
      </div>
    </div>
  )
}
