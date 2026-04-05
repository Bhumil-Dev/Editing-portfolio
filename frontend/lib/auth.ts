export function saveToken(token: string) {
  localStorage.setItem('admin_token', token)
}

export function getToken() {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('admin_token')
}

export function removeToken() {
  localStorage.removeItem('admin_token')
}

export function isLoggedIn() {
  const token = getToken()
  if (!token) return false
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.exp * 1000 > Date.now()
  } catch {
    return false
  }
}
