import { Hono } from 'hono'
import bcrypt from 'bcryptjs'
import { createToken } from '../lib/jwt'
import { getPrisma } from '../lib/prisma'
import { authMiddleware } from '../middleware/auth'

type Bindings = {
  DATABASE_URL: string
}

type Variables = {
  userId: string
}

const auth = new Hono<{
  Bindings: Bindings
  Variables: Variables
}>()

auth.post('/register', async (c) => {
  const { email, password } = await c.req.json()

  const prisma = getPrisma(c.env.DATABASE_URL)

  const existing = await prisma.user.findUnique({
    where: { email },
  })

  if (existing) {
    return c.json(
      { error: 'User already exists' },
      400
    )
  }

  const passwordHash = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
    },
  })

  const token = await createToken(user.id)

  return c.json({
    token,
    user: {
      id: user.id,
      email: user.email,
    },
  })
})

auth.post('/login', async (c) => {
  const { email, password } = await c.req.json()

  const prisma = getPrisma(c.env.DATABASE_URL)

  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user) {
    return c.json(
      { error: 'Invalid credentials' },
      401
    )
  }

  const valid = await bcrypt.compare(
    password,
    user.passwordHash
  )

  if (!valid) {
    return c.json(
      { error: 'Invalid credentials' },
      401
    )
  }

  const token = await createToken(user.id)

  return c.json({
    token,
    user: {
      id: user.id,
      email: user.email,
    },
  })
})

auth.get(
  '/me',
  authMiddleware,
  async (c) => {
    const prisma = getPrisma(
      c.env.DATABASE_URL
    )

    const user = await prisma.user.findUnique({
      where: {
        id: c.get('userId'),
      },
      select: {
        id: true,
        email: true,
        createdAt: true,
      },
    })

    return c.json(user)
  }
)

auth.get(
  '/test',
  authMiddleware,
  async (c) => {
    return c.json({
      userId: c.get('userId'),
    })
  }
)

export default auth