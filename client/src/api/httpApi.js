// The real client. Every function here talks to YOUR Express API.
//
// This is the file that matters for your finals project. mockApi.js exists so
// you can build the interface before this has anywhere to point.

const BASE = import.meta.env.VITE_API_BASE_URL || ''

async function request(path, options) {
  const response = await fetch(`${BASE}${path}`, {
    ...options, headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
  })

  if (!response.ok) {
    // Try to use the API's own message; fall back to the status line.
    let message = `${response.status} ${response.statusText}`
    try {
      const body = await response.json()
      if (body?.error) message = body.error
    } catch {
      // The body was not JSON. The status line is all we have.
    }
    throw new Error(message)
  }

  return response.status === 204 ? null : response.json()
}

export const getDashboard = () => request('/api/dashboard')

export const listCafe = () => request(`/api/cafes`)

export const getCafe = id => request(`/api/cafes/${id}`)

export const createCafe = input => request('/api/cafes', { method:'POST', body:JSON.stringify(input) })

export const addVisit = (id, input) => request(`/api/cafes/${id}/visits`, { method:'POST', body:JSON.stringify(input) })

export const updateCafeNotes = (id, noteIndex, value) => request(`/api/cafes/${id}/notes`, { method:'PATCH', body:JSON.stringify({ noteIndex, value }) })

export const deleteCafeNotes = (id, noteIndex) => request(`/api/cafes/${id}/notes`, { method:'DELETE', body:JSON.stringify({ noteIndex }) })

export const getProfile = () => request('/api/profile')

export const updateProfile = input => request('/api/profile', { method:'PATCH', body:JSON.stringify(input) })

export const pickCafe = filters => request(`/api/cafes/pick?${new URLSearchParams({ minRating: filters.minRating ?? '', priceRanges: filters.priceRanges?.join(',') ?? '', tags: filters.tags?.join(',') ?? '' })}`)