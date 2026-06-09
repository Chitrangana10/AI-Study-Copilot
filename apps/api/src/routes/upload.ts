import { Hono } from 'hono'
import { authMiddleware } from '../middleware/auth'
import { getPrisma } from '../lib/prisma'

type Bindings = {
  DATABASE_URL: string
}

type Variables = {
  userId: string
}

const upload = new Hono<{
  Bindings: Bindings
  Variables: Variables
}>()

upload.use('*', authMiddleware)

upload.post('/', async (c) => {
  const formData =
    await c.req.formData()

  const file = formData.get('file')

const allowedTypes = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'text/plain',
]

if (
  !(file as any)?.type ||
  !allowedTypes.includes(
    (file as any).type
  )
) {
  return c.json(
    {
      error:
        'Only PDF, PNG, JPG, JPEG and TXT allowed',
    },
    400
  )
}

let text = ''

if ((file as any).type === 'text/plain') {
  text = await (file as any).text()
} else {
  text =
    'Uploaded file. OCR/PDF extraction coming next.'
}

  const prisma = getPrisma(
    c.env.DATABASE_URL
  )

  const note =
  await prisma.note.create({
    data: {
      title: (file as any).name,
      rawText: text,
      fileUrl: (file as any).name,
      userId: c.get('userId'),
    },
  })

  return c.json(note)
})

export default upload