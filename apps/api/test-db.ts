import { PrismaNeon } from '@prisma/adapter-neon'
import { PrismaClient } from '@prisma/client'

const adapter = new PrismaNeon({
  connectionString: 'postgresql://neondb_owner:npg_R1FWZJzDE9CQ@ep-green-frost-aqlw029h-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
})

const prisma = new PrismaClient({
  adapter,
})

async function main() {
  const users = await prisma.user.findMany()
  console.log(users)
}

main()