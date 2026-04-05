// Uses NEXT_PUBLIC_API_URL in production (set on Vercel)
// Falls back to localhost:5000 in development
const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

function getToken() {
  if (typeof window === 'undefined') return ''
  return localStorage.getItem('admin_token') || ''
}

function headers(isForm = false) {
  const h: Record<string, string> = { Authorization: `Bearer ${getToken()}` }
  if (!isForm) h['Content-Type'] = 'application/json'
  return h
}

async function req(method: string, path: string, body?: any, isForm = false) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: headers(isForm),
    body: body ? (isForm ? body : JSON.stringify(body)) : undefined,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Request failed')
  return data
}

export const api = {
  // Auth
  login:         (email: string, password: string) => req('POST', '/api/auth/login', { email, password }),
  me:            () => req('GET', '/api/auth/me'),

  // Stats
  stats:         () => req('GET', '/api/admin/stats'),

  // Profile
  getProfile:    () => req('GET', '/api/admin/profile'),
  updateProfile: (data: any) => req('PUT', '/api/admin/profile', data),
  uploadFile:    (file: File, type: 'profile' | 'logo' | 'file' = 'file') => {
    const fd = new FormData(); fd.append('file', file)
    return req('POST', `/api/admin/upload${type === 'file' ? '' : '/' + type}`, fd, true)
  },

  // Skills
  getSkills:     () => req('GET', '/api/admin/skills'),
  createSkill:   (fd: FormData) => req('POST', '/api/admin/skills', fd, true),
  updateSkill:   (id: string, fd: FormData) => req('PUT', `/api/admin/skills/${id}`, fd, true),
  deleteSkill:   (id: string) => req('DELETE', `/api/admin/skills/${id}`),

  // Services
  getServices:   () => req('GET', '/api/admin/services'),
  createService: (data: any) => req('POST', '/api/admin/services', data),
  updateService: (id: string, data: any) => req('PUT', `/api/admin/services/${id}`, data),
  deleteService: (id: string) => req('DELETE', `/api/admin/services/${id}`),

  // Projects
  getProjects:   () => req('GET', '/api/admin/projects'),
  createProject: (fd: FormData) => req('POST', '/api/admin/projects', fd, true),
  updateProject: (id: string, fd: FormData) => req('PUT', `/api/admin/projects/${id}`, fd, true),
  deleteProject: (id: string) => req('DELETE', `/api/admin/projects/${id}`),

  // Messages
  getMessages:   () => req('GET', '/api/admin/messages'),
  deleteMessage: (id: string) => req('DELETE', `/api/admin/messages/${id}`),

  // Public (used by portfolio frontend)
  publicProfile:  () => req('GET', '/api/profile'),
  publicSkills:   () => req('GET', '/api/skills'),
  publicServices: () => req('GET', '/api/services'),
  publicProjects: (category?: string) => req('GET', `/api/projects${category ? `?category=${category}` : ''}`),
  sendMessage:    (data: { name: string; email: string; message: string }) => req('POST', '/api/contact', data),
}
