export async function listCafes(pool) {
    const result = await pool.query(`
        SELECT
        c.id,
        c.name,
        c.location,
        c.latitude,
        c.longitude,
        c.price_range AS "priceRange",
        c.rating,
        c.tags,
        c.notes,
        COUNT(v.id)::int AS "visitsCount"
        FROM cafes c
        LEFT JOIN visits v ON v.cafe_id = c.id
        GROUP BY c.id
        ORDER BY c.id ASC
    `)

    return result.rows
}

export async function getCafe(pool, id) {
    const cafeResult = await pool.query(`
        SELECT
        id,
        name,
        location,
        latitude,
        longitude,
        price_range AS "priceRange",
        rating,
        tags,
        notes,
        created_at AS "createdAt"
        FROM cafes
        WHERE id = $1
    `, [id])

    const cafe = cafeResult.rows[0]

    if (!cafe) {
        return null
    }

    const visitsResult = await pool.query(`
        SELECT
        v.id,
        TO_CHAR(v.visit_date, 'YYYY-MM-DD') AS date,
        v.notes,
        COALESCE(
            json_agg(
            json_build_object(
                'id', o.id,
                'item', o.item,
                'price', o.price,
                'rating', o.rating
            )
            ORDER BY o.id ASC
            ) FILTER (WHERE o.id IS NOT NULL),
            '[]'::json
        ) AS orders
        FROM visits v
        LEFT JOIN orders o ON o.visit_id = v.id
        WHERE v.cafe_id = $1
        GROUP BY v.id
        ORDER BY v.visit_date DESC, v.id DESC
    `, [id])

    return {
        ...cafe,
        rating: Number(cafe.rating),
        visits: visitsResult.rows.map(visit => ({
        ...visit,
        orders: visit.orders.map(order => ({
            ...order,
            price: Number(order.price),
            rating: Number(order.rating)
        }))
        }))
    }
}

export async function createCafe(pool, input) {
    const client = await pool.connect()

    try {
        await client.query('BEGIN')

        const cafeResult = await client.query(`
        INSERT INTO cafes (
            name,
            location,
            latitude,
            longitude,
            price_range,
            rating,
            tags,
            notes
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING
            id,
            name,
            location,
            latitude,
            longitude,
            price_range AS "priceRange",
            rating,
            tags,
            notes
        `, [
        input.name,
        input.location,
        input.latitude,
        input.longitude,
        input.priceRange,
        input.rating,
        input.tags,
        input.notes ? [input.notes] : []
        ])

        const cafe = cafeResult.rows[0]

        if (input.visit) {
        await insertVisit(client, cafe.id, input.visit)
        }

        await client.query('COMMIT')

        return getCafe(pool, cafe.id)
    } catch (error) {
        await client.query('ROLLBACK')
        throw error
    } finally {
        client.release()
    }
}

export async function addVisit(pool, cafeId, input) {
    const client = await pool.connect()

    try {
        await client.query('BEGIN')

        const cafeResult = await client.query(
        'SELECT id FROM cafes WHERE id = $1',
        [cafeId]
        )

        if (!cafeResult.rows[0]) {
        await client.query('ROLLBACK')
        return null
        }

        const visit = await insertVisit(client, cafeId, input)

        await client.query('COMMIT')

        return visit
    } catch (error) {
        await client.query('ROLLBACK')
        throw error
    } finally {
        client.release()
    }
    }

    async function insertVisit(client, cafeId, input) {
    const visitResult = await client.query(`
        INSERT INTO visits (cafe_id, visit_date, notes)
        VALUES ($1, $2, $3)
        RETURNING id, TO_CHAR(visit_date, 'YYYY-MM-DD') AS date, notes
    `, [
        cafeId,
        input.date,
        input.notes ?? ''
    ])

    const visit = visitResult.rows[0]
    const orders = input.orders || []

    for (const order of orders) {
        await client.query(`
        INSERT INTO orders (visit_id, item, price, rating)
        VALUES ($1, $2, $3, $4)
        `, [
        visit.id,
        order.item,
        order.price,
        order.rating
        ])
    }

    const ordersResult = await client.query(`
        SELECT
        id,
        item,
        price,
        rating
        FROM orders
        WHERE visit_id = $1
        ORDER BY id ASC
    `, [visit.id])

    return {
        ...visit,
        orders: ordersResult.rows.map(order => ({
        ...order,
        price: Number(order.price),
        rating: Number(order.rating)
        }))
    }
}

export async function updateCafeNotes(pool, cafeId, noteIndex, value) {
    const result = await pool.query(
        'SELECT notes FROM cafes WHERE id = $1',
        [cafeId]
    )

    const cafe = result.rows[0]

    if (!cafe) {
        throw new Error('Café not found')
    }

    const notes = cafe.notes || []

    if (noteIndex < 0 || noteIndex >= notes.length) {
        throw new Error('Note not found')
    }

    notes[noteIndex] = value.trim()

    const updated = await pool.query(`
        UPDATE cafes
        SET notes = $1, updated_at = now()
        WHERE id = $2
        RETURNING notes
    `, [notes, cafeId])

    return updated.rows[0].notes
}

export async function deleteCafeNote(pool, cafeId, noteIndex) {
    const result = await pool.query(
        'SELECT notes FROM cafes WHERE id = $1',
        [cafeId]
    )

    const cafe = result.rows[0]

    if (!cafe) {
        throw new Error('Café not found')
    }

    const notes = cafe.notes || []

    if (noteIndex < 0 || noteIndex >= notes.length) {
        throw new Error('Note not found')
    }

    notes.splice(noteIndex, 1)

    await pool.query(`
        UPDATE cafes
        SET notes = $1, updated_at = now()
        WHERE id = $2
    `, [notes, cafeId])
}

export async function updateVisitNote(pool, cafeId, visitId, value) {
    const result = await pool.query(`
        UPDATE visits
        SET notes = $1
        WHERE id = $2 AND cafe_id = $3
        RETURNING id, TO_CHAR(visit_date, 'YYYY-MM-DD') AS date, notes
    `, [value.trim(), visitId, cafeId])

    if (!result.rows[0]) {
        throw new Error('Visit not found')
    }

    return result.rows[0]
}

export async function deleteVisitNote(pool, cafeId, visitId) {
    const result = await pool.query(`
        UPDATE visits
        SET notes = ''
        WHERE id = $1 AND cafe_id = $2
        RETURNING id
    `, [visitId, cafeId])

    if (!result.rows[0]) {
        throw new Error('Visit not found')
    }
}

export async function pickCafe(pool, filters) {
    const conditions = []
    const values = []

    if (filters.minRating !== null && filters.minRating !== undefined && filters.minRating !== '') {
        values.push(Number(filters.minRating))
        conditions.push(`c.rating >= $${values.length}`)
    }

    if (filters.priceRanges.length > 0) {
        values.push(filters.priceRanges)
        conditions.push(`c.price_range = ANY($${values.length}::varchar[])`)
    }

    if (filters.tags.length > 0) {
        values.push(filters.tags)
        conditions.push(`c.tags && $${values.length}::text[]`)
    }

    const where = conditions.length
        ? `WHERE ${conditions.join(' AND ')}`
        : ''

    const result = await pool.query(`
        SELECT
        c.id,
        c.name,
        c.location,
        c.latitude,
        c.longitude,
        c.price_range AS "priceRange",
        c.rating,
        c.tags,
        c.notes,
        COUNT(v.id)::int AS "visitsCount"
        FROM cafes c
        LEFT JOIN visits v ON v.cafe_id = c.id
        ${where}
        GROUP BY c.id
        ORDER BY random()
        LIMIT 1
    `, values)

    const cafe = result.rows[0]

    if (!cafe) {
        throw new Error('No cafés match those preferences')
    }

    return {
        ...cafe,
        rating: Number(cafe.rating)
    }
}