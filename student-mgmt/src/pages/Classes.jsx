import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { RiBookOpenLine, RiUserLine, RiMapPinLine, RiTimeLine } from 'react-icons/ri'
import { classService } from '../services/api'

const colors = ['bg-red-100', 'bg-violet-500', 'bg-emerald-500', 'bg-rose-500', 'bg-amber-500', 'bg-teal-500']
export default function Classes() {
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    classService.getAll().then(setClasses).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" /></div>

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {classes.map((c, i) => (
          <div key={c.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all">
            <div className={`${colors[i % colors.length]} h-2`} />
            <button type="button" onClick={() => navigate(`/attendance?class=${encodeURIComponent(c.name)}`)} className="w-full text-left">
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-800">{c.name}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">{c.id}</p>
                  </div>
                  <span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-medium">{c.subject}</span>
                </div>
                <div className="space-y-2.5 text-sm text-gray-500">
                  <div className="flex items-center gap-2.5"><RiUserLine size={15} className="text-gray-400" /><span>{c.teacher}</span></div>
                  <div className="flex items-center gap-2.5"><RiMapPinLine size={15} className="text-gray-400" /><span>{c.room}</span></div>
                  <div className="flex items-center gap-2.5"><RiTimeLine size={15} className="text-gray-400" /><span>{c.schedule}</span></div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-1.5">
                      {[...Array(Math.min(3, c.students))].map((_, j) => (
                        <div key={j} className={`w-6 h-6 rounded-full ${colors[(i + j) % colors.length]} border-2 border-white flex items-center justify-center text-white text-xs`} />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">{c.students} students</span>
                  </div>
                  <span className="text-xs text-emerald-600  px-2 py-0.5 rounded font-medium">Active</span>
                </div>
              </div>
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
