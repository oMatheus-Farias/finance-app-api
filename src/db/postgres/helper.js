import pg from 'pg'

const { Pool } = pg

export const poll = new Pool({
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT,
    database: process.env.POSTGRES_DB,
})

export const postgresHelper = {
    query: async (query, params) => {
        const client = await poll.connect()

        const results = await client.query(query, params)

        await client.release()

        return results.rows
    },
}
