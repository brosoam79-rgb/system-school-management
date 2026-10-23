export function getSessionUser() {
  try {
    const raw = localStorage.getItem('user')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function getDisplayName(user) {
  return user?.fullName || user?.full_name || user?.name || user?.email?.split('@')[0] || 'School user'
}

export function isAdminUser(user) {
  const role = String(user?.role || user?.userType || '').toLowerCase()
  return role === 'admin' || role === 'administrator'
}
