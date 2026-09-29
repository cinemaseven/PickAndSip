import express from 'express'
import cors from 'cors'
import { pool } from './db/pool.js'
import * as cafes from './cafesRepo.js'
import * as profile from './profileRepo.js'

const app = express()

const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean)

app.use(cors({ origin: allowedOrigins }))
app.use(express.json({ limit: '100kb' }))

app.get('/healthz', (request, response) => {
  response.json({ ok: true })
})

app.get('/readyz', async (request, response) => {
  try {
    await pool.query('SELECT 1')
    response.json({ ok: true, db: 'up' })
  } catch (error) {
    console.error('readyz failed:', error.message)
    response.status(503).json({ ok: false, db: 'down' })
  }
})

function validateCafe(body) {
  const errors = []
  const name = typeof body.name === 'string' ? body.name.trim() : ''
  const location = typeof body.location === 'string' ? body.location.trim() : ''
  const priceRange = typeof body.priceRange === 'string' ? body.priceRange : ''
  const rating = Number(body.rating)
  const tags = Array.isArray(body.tags) ? body.tags : []
  const notes = typeof body.notes === 'string' ? body.notes.trim() : ''

  if (!name) {
    errors.push('name is required')
  }

  if (name.length > 120) {
    errors.push('name must be 120 characters or fewer')
  }

  if (!location) {
    errors.push('location is required')
  }

  if (location.length > 200) {
    errors.push('location must be 200 characters or fewer')
  }

  if (!['P', 'PP', 'PPP'].includes(priceRange)) {
    errors.push('priceRange must be P, PP, or PPP')
  }

  if (!Number.isFinite(rating) || rating < 0 || rating > 5) {
    errors.push('rating must be between 0 and 5')
  }

  if (tags.some(tag => typeof tag !== 'string' || !tag.trim())) {
    errors.push('tags must contain non-empty strings')
  }

  if (notes.length > 500) {
    errors.push('notes must be 500 characters or fewer')
  }

  const latitude = body.latitude == null || body.latitude === ''
    ? null
    : Number(body.latitude)
  const longitude = body.longitude == null || body.longitude === ''
    ? null
    : Number(body.longitude)

  if (latitude !== null && (!Number.isFinite(latitude) || latitude < -90 || latitude > 90)) {
    errors.push('latitude is invalid')
  }

  if (longitude !== null && (!Number.isFinite(longitude) || longitude < -180 || longitude > 180)) {
    errors.push('longitude is invalid')
  }

  return {
    errors,
    value: {
      name,
      location,
      latitude,
      longitude,
      priceRange,
      rating,
      tags: tags.map(tag => tag.trim()),
      notes
    }
  }
}

function validateVisit(body) {
  const errors = []
  const date = typeof body.date === 'string' ? body.date : ''
  const notes = typeof body.notes === 'string' ? body.notes.trim() : ''
  const orders = Array.isArray(body.orders) ? body.orders : []

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    errors.push('date must use YYYY-MM-DD format')
  }

  if (notes.length > 500) {
    errors.push('notes must be 500 characters or fewer')
  }

  orders.forEach((order, index) => {
    const item = typeof order.item === 'string' ? order.item.trim() : ''
    const price = Number(order.price)
    const rating = Number(order.rating)

    if (!item) {
      errors.push(`orders[${index}].item is required`)
    }

    if (item.length > 120) {
      errors.push(`orders[${index}].item must be 120 characters or fewer`)
    }

    if (!Number.isFinite(price) || price < 0) {
      errors.push(`orders[${index}].price must be zero or greater`)
    }

    if (!Number.isFinite(rating) || rating < 0 || rating > 5) {
      errors.push(`orders[${index}].rating must be between 0 and 5`)
    }
  })

  return {
    errors,
    value: {
      date,
      notes,
      orders: orders.map(order => ({
        item: order.item.trim(),
        price: Number(order.price),
        rating: Number(order.rating)
      }))
    }
  }
}

app.get('/api/dashboard', async (request, response, next) => {
  try {
    const profileData = await profile.getProfile(pool)
    const cafesData = await cafes.listCafes(pool)

    const visitedCafes = cafesData.filter(cafe => cafe.visitsCount > 0)
    const mostVisited = [...visitedCafes]
      .sort((a, b) => b.visitsCount - a.visitsCount || a.id - b.id)[0] || null

    const recentResult = await pool.query(`
      SELECT
        v.id,
        TO_CHAR(v.visit_date, 'YYYY-MM-DD') AS date,
        c.id AS "cafeId",
        c.name,
        c.location,
        c.rating,
        c.price_range AS "priceRange",
        c.tags,
        COUNT(v.id) OVER (PARTITION BY c.id)::int AS "visitsCount"
      FROM visits v
      JOIN cafes c ON c.id = v.cafe_id
      ORDER BY v.visit_date DESC, v.id DESC
      LIMIT 4
    `)

    const drinksResult = await pool.query(`
      SELECT
        o.item AS name,
        COUNT(*)::int AS count
      FROM orders o
      GROUP BY o.item
      ORDER BY count DESC, o.item ASC
      LIMIT 1
    `)

    const recentCafes = recentResult.rows.map(row => ({
      id: row.cafeId,
      name: row.name,
      location: row.location,
      date: new Date(`${row.date}T00:00:00`).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      }),
      rating: Number(row.rating),
      priceRange: row.priceRange,
      tags: row.tags,
      visitsCount: row.visitsCount
    }))

    const mostOrdered = drinksResult.rows[0] || {
      name: 'Iced Seasalt Latte',
      count: 0
    }

    response.json({
      profile: {
        id: profileData.id,
        username: profileData.username
      },
      cafeCount: cafesData.length,
      visitedCount: profileData.visitedCount,
      level: profileData.level,
      mostVisited: mostVisited
        ? {
            ...mostVisited,
            rating: Number(mostVisited.rating)
          }
        : null,
      mostOrderedDrink: {
        name: mostOrdered.name,
        count: Number(mostOrdered.count)
      },
      recentCafes
    })
  } catch (error) {
    next(error)
  }
})

app.get('/api/cafes', async (request, response, next) => {
  try {
    const rows = await cafes.listCafes(pool)
    response.json(rows.map(row => ({
      ...row,
      rating: Number(row.rating),
      visitsCount: Number(row.visitsCount)
    })))
  } catch (error) {
    next(error)
  }
})

app.get('/api/cafes/pick', async (request, response, next) => {
  try {
    const filters = {
      minRating: request.query.minRating ?? null,
      priceRanges: request.query.priceRanges
        ? String(request.query.priceRanges).split(',').filter(Boolean)
        : [],
      tags: request.query.tags
        ? String(request.query.tags).split(',').filter(Boolean)
        : []
    }

    response.json(await cafes.pickCafe(pool, filters))
  } catch (error) {
    if (error.message === 'No cafés match those preferences') {
      return response.status(404).json({ error: error.message })
    }

    next(error)
  }
})

app.get('/api/cafes/:id', async (request, response, next) => {
  try {
    const cafe = await cafes.getCafe(pool, request.params.id)

    if (!cafe) {
      return response.status(404).json({ error: 'Café not found' })
    }

    response.json(cafe)
  } catch (error) {
    next(error)
  }
})

app.post('/api/cafes', async (request, response, next) => {
  const { errors, value } = validateCafe(request.body ?? {})
  const visitValidation = request.body?.visit
    ? validateVisit(request.body.visit)
    : { errors: [], value: null }

  const allErrors = [...errors, ...visitValidation.errors]

  if (allErrors.length > 0) {
    return response.status(400).json({ error: allErrors.join('; ') })
  }

  try {
    response.status(201).json(await cafes.createCafe(pool, {
      ...value,
      visit: visitValidation.value
    }))
  } catch (error) {
    next(error)
  }
})

app.post('/api/cafes/:id/visits', async (request, response, next) => {
  const { errors, value } = validateVisit(request.body ?? {})

  if (errors.length > 0) {
    return response.status(400).json({ error: errors.join('; ') })
  }

  try {
    const visit = await cafes.addVisit(pool, request.params.id, value)

    if (!visit) {
      return response.status(404).json({ error: 'Café not found' })
    }

    response.status(201).json(visit)
  } catch (error) {
    next(error)
  }
})

app.patch('/api/cafes/:id/notes', async (request, response, next) => {
  const noteIndex = Number(request.body?.noteIndex)
  const value = typeof request.body?.value === 'string'
    ? request.body.value
    : ''

  if (!Number.isInteger(noteIndex) || noteIndex < 0) {
    return response.status(400).json({ error: 'noteIndex must be a non-negative integer' })
  }

  if (value.trim().length > 500) {
    return response.status(400).json({ error: 'note must be 500 characters or fewer' })
  }

  try {
    const notes = await cafes.updateCafeNotes(
      pool,
      request.params.id,
      noteIndex,
      value
    )

    response.json(notes)
  } catch (error) {
    if (error.message === 'Café not found' || error.message === 'Note not found') {
      return response.status(404).json({ error: error.message })
    }

    next(error)
  }
})

app.delete('/api/cafes/:id/notes', async (request, response, next) => {
  const noteIndex = Number(request.body?.noteIndex)

  if (!Number.isInteger(noteIndex) || noteIndex < 0) {
    return response.status(400).json({ error: 'noteIndex must be a non-negative integer' })
  }

  try {
    await cafes.deleteCafeNote(pool, request.params.id, noteIndex)
    response.status(204).end()
  } catch (error) {
    if (error.message === 'Café not found' || error.message === 'Note not found') {
      return response.status(404).json({ error: error.message })
    }

    next(error)
  }
})

app.get('/api/profile', async (request, response, next) => {
  try {
    response.json(await profile.getProfile(pool))
  } catch (error) {
    next(error)
  }
})

app.patch('/api/profile', async (request, response, next) => {
  const username = typeof request.body?.username === 'string'
    ? request.body.username.trim()
    : ''

  if (!username) {
    return response.status(400).json({ error: 'username is required' })
  }

  if (username.length > 50) {
    return response.status(400).json({ error: 'username must be 50 characters or fewer' })
  }

  try {
    response.json(await profile.updateProfile(pool, username))
  } catch (error) {
    next(error)
  }
})

app.use((request, response) => {
  response.status(404).json({ error: 'No such route' })
})

app.use((error, request, response, next) => {
  console.error(error)
  response.status(500).json({ error: 'Something went wrong on the server' })
})

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`)
  console.log(`CORS allows: ${allowedOrigins.join(', ')}`)
})