import React, { useState } from 'react'
import Button from '../components/common/Button'
import Input from '../components/common/Input'

export default function Settings() {
  const [saved, setSaved] = useState(false)
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  return (
    <div className="mx-auto max-w-4xl space-y-5 py-2 sm:py-6">
      {['School Information', 'Administrator Account', 'System Preferences'].map((section, i) => (
        <div key={section} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 sm:p-6">
          <h2 className="font-semibold text-gray-800 mb-4">{section}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {i === 0 && <>
              <Input label="School name" defaultValue="EduManage Academy" />
              <Input label="Phone" defaultValue="+855-23-456-789" />
              <Input label="Email" defaultValue="info@edumanage.edu" className="sm:col-span-2" />
              <Input label="Address" defaultValue="Phnom Penh, Cambodia" className="sm:col-span-2" />
            </>}
            {i === 1 && <>
              <Input label="Full name" defaultValue="Administrator" />
              <Input label="Email" defaultValue="admin@school.edu" />
              <Input label="New password" type="password" placeholder="Leave blank to keep current" />
              <Input label="Confirm password" type="password" placeholder="Repeat new password" />
            </>}
            {i === 2 && <>
              <div className="sm:col-span-2 space-y-3">
                {['Enable email notifications', 'Show attendance alerts', 'Auto-generate student IDs'].map(opt => (
                  <label key={opt} className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-blue-600" />
                    <span className="text-sm text-gray-700">{opt}</span>
                  </label>
                ))}
              </div>
            </>}
          </div>
        </div>
      ))}
      <div className="flex justify-end">
        <Button onClick={handleSave} variant={saved ? 'success' : 'primary'}>{saved ? '✓ Saved!' : 'Save settings'}</Button>
      </div>
    </div>
  )
}
