import { createMiddleware } from 'hono/factory'
import { verifyToken } from '../lib/jwt'

type Variables = {
  userId: string
}

export const authMiddleware = createMiddleware<{
  Variables: Variables
}>(async (c, next) => {
  const authHeader = c.req.header('Authorization')

  if (!authHeader) {
    return c.json(
      { error: 'Unauthorized' },
      401
    )
  }

  const token = authHeader.split(' ')[1]

  if (!token) {
    return c.json(
      { error: 'Unauthorized' },
      401
    )
  }

  try {
    const payload = await verifyToken(token)

    c.set(
      'userId',
      payload.userId as string
    )

    await next()
  } catch {
    return c.json(
      { error: 'Invalid token' },
      401
    )
  }
})