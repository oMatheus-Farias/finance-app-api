import 'dotenv/config.js'
import fs from 'fs'
import { poll } from './src/db/postgres/helper.js'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const execMigrations = async () => {
  const client = await poll.connect()
  try {
    const filePath = path.join(
      __dirname,
      './src/db/postgres/migrations/01-init.sql',
    )
    const script = fs.readFileSync(filePath, 'utf-8')

    await client.query(script)

    console.log('Migration executed successfully.')
  } catch (error) {
    console.log('Error in execMigrations', error)
  } finally {
    await client.release()
  }
}

execMigrations()
