import { Hono } from 'hono'
import { authMiddleware } from '../middleware/auth'
import { getPrisma } from '../lib/prisma'

type Bindings = {
  DATABASE_URL: string
}

type Variables = {
  userId: string
}

const notes = new Hono<{
  Bindings: Bindings
  Variables: Variables
}>()

notes.use('*', authMiddleware)

notes.post('/', async (c) => {
  const { title, rawText } = await c.req.json()

  const prisma = getPrisma(c.env.DATABASE_URL)

  const note = await prisma.note.create({
    data: {
      title,
      rawText,
      userId: c.get('userId'),
    },
  })

  return c.json(note)
})

notes.get('/', async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL)

  const notes = await prisma.note.findMany({
    where: {
      userId: c.get('userId'),
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return c.json(notes)
})

notes.get('/:id', async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL)

  const note = await prisma.note.findFirst({
    where: {
      id: c.req.param('id'),
      userId: c.get('userId'),
    },
  })

  if (!note) {
    return c.json(
      { error: 'Note not found' },
      404
    )
  }

  return c.json(note)
})

notes.put('/:id', async (c) => {
  const { title, rawText } = await c.req.json()

  const prisma = getPrisma(c.env.DATABASE_URL)

  const note = await prisma.note.findFirst({
    where: {
      id: c.req.param('id'),
      userId: c.get('userId'),
    },
  })

  if (!note) {
    return c.json(
      { error: 'Note not found' },
      404
    )
  }

  const updated = await prisma.note.update({
    where: {
      id: note.id,
    },
    data: {
      title,
      rawText,
    },
  })

  return c.json(updated)
})

notes.delete('/:id', async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL)

  const note = await prisma.note.findFirst({
    where: {
      id: c.req.param('id'),
      userId: c.get('userId'),
    },
  })

  if (!note) {
    return c.json(
      { error: 'Note not found' },
      404
    )
  }

  await prisma.note.delete({
    where: {
      id: note.id,
    },
  })

  return c.json({
    message: 'Note deleted',
  })
})

export default notes