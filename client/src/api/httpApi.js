const BASE = import.meta.env.VITE_API_BASE_URL || ''

async function request(path, options = {}) {
  const auth = sessionStorage.getItem("pick-and-sip-auth")
  const headers = {
    'Content-Type': 'application/json',
    ...(auth ? { Authorization: `Basic ${auth}` } : {}),
    ...(options.headers || {}),
  }

  const response = await fetch(`${BASE}${path}`, {
    ...options,
    headers,
  })

  if (response.status === 401) {
    sessionStorage.removeItem("pick-and-sip-auth")
    window.dispatchEvent(new Event("pick-and-sip-auth-expired"))
  }

  if (!response.ok) {
    let message = `${response.status} ${response.statusText}`
    try {
      const body = await response.json()
      if (body?.error) message = body.error
    } catch {
    }
    throw new Error(message)
  }

  return response.status === 204 ? null : response.json()
}

export const getDashboard = () => request('/api/dashboard')

export const listCafes = () => request(`/api/cafes`)

export const getCafe = id => request(`/api/cafes/${id}`)

export const createCafe = input => request('/api/cafes', { method:'POST', body:JSON.stringify(input) })

export const addVisit = (id, input) => request(`/api/cafes/${id}/visits`, { method:'POST', body:JSON.stringify(input) })

export const updateCafeNotes = (id, noteIndex, value) => request(`/api/cafes/${id}/notes`, { method:'PATCH', body:JSON.stringify({ noteIndex, value }) })

export const deleteCafeNotes = (id, noteIndex) => request(`/api/cafes/${id}/notes`, { method:'DELETE', body:JSON.stringify({ noteIndex }) })
export const updateVisitNote = (cafeId, visitId, value) => request(`/api/cafes/${cafeId}/visits/${visitId}/notes`, { method:'PATCH', body:JSON.stringify({ value }) })

export const deleteVisitNote = (cafeId, visitId) => request(`/api/cafes/${cafeId}/visits/${visitId}/notes`, { method:'DELETE' })

export const getProfile = () => request('/api/profile')

export const updateProfile = input => request('/api/profile', { method:'PATCH', body:JSON.stringify(input) })

export const pickCafe = filters => request(`/api/cafes/pick?${new URLSearchParams({ minRating: filters.minRating ?? '', priceRanges: filters.priceRanges?.join(',') ?? '', tags: filters.tags?.join(',') ?? '' })}`)

export async function authenticate(username, password) {
  const credentials = btoa(`${username}:${password}`)

  const response = await fetch(`${BASE}/api/profile`, {
    headers: {
      Authorization: `Basic ${credentials}`,
    },
  })

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`)
  }

  return credentials
}