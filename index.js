import 'dotenv/config.js'
import express from 'express'

import { postgresHelper } from './src/db/postgres/helper.js'

const app = express()

app.use(express.json())

app.get('/', async (req, res) => {
  const results = await postgresHelper.query('SELECT * FROM users;')

  res.send(JSON.stringify(results))
})

app.listen(8000, () => console.log('listening on port 8000'))
