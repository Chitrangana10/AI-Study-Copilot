import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import authRoutes from './routes/auth'
import notesRoutes from './routes/notes'
import ai from './routes/ai'
import upload from './routes/upload'

type Bindings = {
  DATABASE_URL: string
}

const app = new Hono<{ Bindings: Bindings }>()

app.use('*', cors())

app.get('/health', (c) => {
  return c.json({ status: 'ok' })
})

app.get('/users', async (c) => {
  const adapter = new PrismaNeon({
    connectionString: c.env.DATABASE_URL,
  })

  const prisma = new PrismaClient({
    adapter,
  })

  const users = await prisma.user.findMany({
  select: {
    id: true,
    email: true,
    createdAt: true,
  },
})

  return c.json(users)
})
app.route('/auth', authRoutes)
app.route('/notes', notesRoutes)
app.route('/ai', ai)
app.route('/upload', upload)
export default app