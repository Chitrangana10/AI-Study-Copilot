import { Hono } from 'hono'
import { authMiddleware } from '../middleware/auth'
import { GoogleGenerativeAI }
  from '@google/generative-ai'

import { getPrisma }
  from '../lib/prisma'

type Bindings = {
  DATABASE_URL: string
  GEMINI_API_KEY: string
}

type Variables = {
  userId: string
}

const ai = new Hono<{
  Bindings: Bindings
  Variables: Variables
}>()

ai.use('*', authMiddleware)

ai.post('/summary/:id', async (c) => {
  const noteId =
    c.req.param('id')

  const prisma = getPrisma(
    c.env.DATABASE_URL
  )

  const note =
    await prisma.note.findUnique({
      where: {
        id: noteId,
      },
    })

  if (!note) {
    return c.json(
      {
        error: 'Note not found',
      },
      404
    )
  }

  const genAI =
    new GoogleGenerativeAI(
      c.env.GEMINI_API_KEY
    )

  const model =
    genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
    })

  const result =
    await model.generateContent(`
Summarize these study notes in simple student-friendly points.

${note.rawText}
`)

  const summary =
    result.response.text()

  return c.json({
    noteId,
    summary,
  })
})

ai.post('/structure/:id', async (c) => {
  const noteId = c.req.param('id')

  return c.json({
    noteId,
    content: `
Overview

This is a sample overview.

Key Concepts

• Concept 1
• Concept 2

Important Details

Sample details.

Things To Remember

Important exam points.
`,
  })
})

ai.post('/quiz/:id', async (c) => {
  const noteId = c.req.param('id')

  return c.json({
    noteId,
    questions: [
      {
        question:
          'What is Normalization?',
        options: [
          'Database optimization process',
          'Programming language',
          'Operating system',
          'Compiler',
        ],
        correct:
          'Database optimization process',
      },
      {
        question:
          'Why is Normalization used?',
        options: [
          'Reduce redundancy',
          'Increase bugs',
          'Slow queries',
          'Encrypt data',
        ],
        correct:
          'Reduce redundancy',
      },
    ],
  })
})

ai.post('/chat/:id', async (c) => {
  const noteId = c.req.param('id')

  const { message } =
    await c.req.json()

  return c.json({
    noteId,
    answer: `AI Response for: "${message}"`,
  })
})

export default ai