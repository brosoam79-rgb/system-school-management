import React, { useState, useEffect } from 'react'
import Input, { Select } from '../common/Input'
import Button from '../common/Button'
import { classOptions, statusOptions, genderOptions } from '../../data/mockData'

const empty = { name: '', gender: '', dob: '', phone: '', email: '', address: '', class: '', teacher: '', status: 'Active', gpa: '' }

export default function StudentForm({ initial, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState(empty)
  const [errors, setErrors] = useState({})

  useEffect(() => { setForm(initial ? { ...empty, ...initial } : empty) }, [initial])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email'
    if (!form.class) e.class = 'Class is required'
    if (!form.gender) e.gender = 'Gender is required'
    if (!form.dob) e.dob = 'Date of birth is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validate()) onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Full Name *" placeholder="e.g. Sokha Chann" value={form.name} onChange={e => set('name', e.target.value)} error={errors.name} />
        <Input label="Email *" type="email" placeholder="student@school.edu" value={form.email} onChange={e => set('email', e.target.value)} error={errors.email} />
        <Select label="Gender *" value={form.gender} onChange={e => set('gender', e.target.value)} error={errors.gender}>
          <option value="">Select gender</option>
          {genderOptions.map(g => <option key={g}>{g}</option>)}
        </Select>
        <Input label="Date of Birth *" type="date" value={form.dob} onChange={e => set('dob', e.target.value)} error={errors.dob} />
        <Input label="Phone" placeholder="012-345-678" value={form.phone} onChange={e => set('phone', e.target.value)} />
        <Select label="Class *" value={form.class} onChange={e => set('class', e.target.value)} error={errors.class}>
          <option value="">Select class</option>
          {classOptions.map(c => <option key={c}>{c}</option>)}
        </Select>
        <Input label="Teacher" placeholder="e.g. Mr. Vanna Sok" value={form.teacher} onChange={e => set('teacher', e.target.value)} />
        <Input label="GPA (0–4.0)" type="number" step="0.1" min="0" max="4" placeholder="3.5" value={form.gpa} onChange={e => set('gpa', e.target.value)} />
        <Select label="Status" value={form.status} onChange={e => set('status', e.target.value)}>
          {statusOptions.map(s => <option key={s}>{s}</option>)}
        </Select>
      </div>
      <Input label="Address" placeholder="City, Province, Country" value={form.address} onChange={e => set('address', e.target.value)} />
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" loading={loading}>{initial ? 'Save changes' : 'Add student'}</Button>
      </div>
    </form>
  )
}
