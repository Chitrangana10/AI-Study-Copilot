import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.user.create({
    data: {
      email: 'test@example.com',
      passwordHash: 'hashed_password',
    },
  })

  console.log('Test user created')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())