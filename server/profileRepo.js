export async function getProfile(pool) {
    const profileResult = await pool.query(`
        SELECT id, username
        FROM profiles
        ORDER BY id ASC
        LIMIT 1
    `)

    const profile = profileResult.rows[0]

    if (!profile) {
        throw new Error('Profile not found')
    }

    const visitedResult = await pool.query(`
        SELECT COUNT(DISTINCT cafe_id)::int AS count
        FROM visits
    `)

    const visitedCount = visitedResult.rows[0].count

    return {
        ...profile,
        visitedCount,
        level: getLevel(visitedCount)
    }
}

export async function updateProfile(pool, username) {
    const result = await pool.query(`
        UPDATE profiles
        SET username = $1,
            updated_at = now()
        WHERE id = (
        SELECT id
        FROM profiles
        ORDER BY id ASC
        LIMIT 1
        )
        RETURNING id, username
    `, [username])

    if (!result.rows[0]) {
        throw new Error('Profile not found')
    }

    return result.rows[0]
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
        next: 5
    }
}
