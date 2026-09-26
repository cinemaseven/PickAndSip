// The simulated backend.
//
// Same function names, same return types, and the same shape of failure as
// httpApi.js, so your components cannot tell the difference. Data lives in the
// visitor's own browser and goes no further.
//
// This exists so the template's GitHub Pages link works on day one and so you
// can build the interface before your API is deployed. It is NOT a finished
// project. See content/extending-your-app page 3.

import seed from './seed.json'

const KEY = 'pick-and-sip:mock-data'
const delay = (ms = 180) => new Promise(resolve => setTimeout(resolve, ms))

function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

function read() {
  const stored = localStorage.getItem(KEY)
  if (stored) {
    try { 
      return JSON.parse(stored) 
    } catch { 
      localStorage.removeItem(KEY) 
    }
  }
  const initial = clone(seed)
  localStorage.setItem(KEY, JSON.stringify(initial))
  return initial
}

function write(data) {
  localStorage.setItem(KEY, JSON.stringify(data))
  return data
}

function nextId(items) {
  return items.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0) + 1
}

export async function getDashboard() {
  await delay()
  const data = read()
  
  const allVisits = data.cafes.flatMap(cafe => cafe.visits.map(v => ({ ...v, cafe })))
  
  const recent = allVisits.sort((a,b) => b.date.localeCompare(a.date)).slice(0,4).map(v => ({
    id: v.cafe.id,
    name: v.cafe.name,
    location: v.cafe.location,
    date: new Date(v.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    rating: v.cafe.rating,
    priceRange: v.cafe.priceRange,
    tags: v.cafe.tags,
    visitsCount: v.cafe.visits.length,
  }))
  
  const visitCounts = data.cafes.map(c => ({ cafe:c, count:c.visits.length })).sort((a,b)=>b.count-a.count)
  
  const drinks = {}
  data.cafes.forEach(c => c.visits.forEach(v => v.orders.forEach(o => { drinks[o.item] = (drinks[o.item] || 0) + 1 })))
  
  const mostOrdered = Object.entries(drinks).sort((a,b)=>b[1]-a[1])[0] || ['Iced Seasalt Latte', 0]
  
  const distinctVisited = data.cafes.filter(c => c.visits.length > 0).length
  return {
    profile: data.profile,
    cafeCount: data.cafes.length,
    visitedCount: distinctVisited,
    level: getLevel(distinctVisited),
    mostVisited: visitCounts[0] ? { ...visitCounts[0].cafe, visitsCount: visitCounts[0].count } : null,
    mostOrderedDrink: { name: mostOrdered[0], count: mostOrdered[1] },
    recentCafes: recent,
  }
}

export async function listCafes() {
  await delay()
  return clone(read().cafes.map(c => ({ ...c, visits: undefined, visitsCount: c.visits.length })))
}

export async function getCafe(id) {
  await delay()
  const cafe = read().cafes.find(c => String(c.id) === String(id))
  if (!cafe) {
    throw new Error('Café not found')
  }
  return clone(cafe)
}

export async function createCafe(input) {
  await delay()
  const data = read()

  const cafe = {
    id: nextId(data.cafes),
    name: input.name.trim(), 
    location: input.location.trim(),
    priceRange: input.priceRange, 
    rating: Number(input.rating),
    tags: input.tags || [], 
    notes: input.notes?.trim() ? [input.notes.trim()] : [], 
    image: null,
    visits: []
  }
  data.cafes.push(cafe)
  if (input.visit) {
    addVisitToCafe(cafe, input.visit)
  }
  write(data)
  return clone(cafe)
}

function addVisitToCafe(cafe, visitInput) {
  const visit = {
    id: Date.now(), 
    date: visitInput.date,
    notes: visitInput.notes?.trim() || '',
    orders: (visitInput.orders || []).map((o, index) => ({ id: Date.now()+index, item:o.item.trim(), 
    price: Number(o.price), 
    rating: Number(o.rating) }))
  }
  cafe.visits.unshift(visit)
  return visit
}

export async function addVisit(cafeId, input) {
  await delay()
  const data = read()
  
  const cafe = data.cafes.find(c => String(c.id) === String(cafeId))
  if (!cafe) {
    throw new Error('Café not found')
  }
  
  const visit = addVisitToCafe(cafe, input)
  write(data)
  return clone(visit)
}

export async function updateCafeNotes(cafeId, noteIndex, value) {
  await delay()
  const data = read()
  
  const cafe = data.cafes.find(c => String(c.id) === String(cafeId))
  if (!cafe) {
    throw new Error('Café not found')
  }
  if (!cafe.notes[noteIndex]) {
    throw new Error('Note not found')
  }
  cafe.notes[noteIndex] = value.trim()
  write(data)
  return clone(cafe.notes)
}

export async function deleteCafeNotes(cafeId, noteIndex) {
  await delay()
  const data = read()
  
  const cafe = data.cafes.find(c => String(c.id) === String(cafeId))
  if (!cafe) {
    throw new Error('Café not found')
  }
  cafe.notes.splice(noteIndex, 1)
  write(data)
  return null
}

export async function getProfile() {
  await delay()
  const data = read()
  
  const visitedCount = data.cafes.filter(c => c.visits.length > 0).length
  return { ...clone(data.profile), visitedCount, level: getLevel(visitedCount) }
}

export async function updateProfile(input) {
  await delay()
  const data = read()
  data.profile.username = input.username.trim()
  write(data)
  return clone(data.profile)
}

export async function pickCafe(filters) {
  await delay()
  const data = read()
  let matches = data.cafes.slice()
  if (filters.minRating != null) {
    matches = matches.filter(c => c.rating >= Number(filters.minRating))
  }
  if (filters.priceRanges?.length) {
    matches = matches.filter(c => filters.priceRanges.includes(c.priceRange))
  }
  if (filters.tags?.length) {
    matches = matches.filter(c => filters.tags.some(tag => c.tags.includes(tag)))
  }
  if (!matches.length) {
    throw new Error('No cafés match those preferences')
  }
  const chosen = matches[Math.floor(Math.random() * matches.length)]
  return clone({ ...chosen, visits: undefined, visitsCount: chosen.visits.length })
}

export function getLevel(count) {
  if (count >= 30) {
    return { 
      number: 5, 
      name: 'Café Hopper', 
      threshold: 30, 
      previous: 20, 
      next: null 
    }
  }
  if (count >= 20) {
    return { 
      number: 4,
      name: 'Café Connoisseur',
      threshold: 20,
      previous: 10,
      next: 30
    }
  }
  if (count >= 10) {
    return { 
      number: 3,
      name: 'Café Enthusiast',
      threshold: 10,
      previous: 5,
      next: 20
    }
  }
  if (count >= 5) {
    return {
      number: 2,
      name: 'Café Explorer',
      threshold: 5,
      previous: 1,
      next: 10
    }
  }
  return { 
    number: 1,
    name: 'Café Starter',
    threshold: 1,
    previous: 0,
    next:5
  }
}
