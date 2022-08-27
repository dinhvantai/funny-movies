import { execSync } from 'child_process'
import { join } from 'path'
import { PrismaClient } from '@prisma/client'
import { v4 } from 'uuid'

const generateDatabaseURL = (schema: string) => {
  if (!process.env.DATABASE_URL) {
    throw new Error('please provide a database url')
  }
  const url = process.env.DATABASE_URL

  return `${url}/${schema}.db`
}

const prismaBinary = join(__dirname, '..', 'node_modules', '.bin', 'prisma')

const schemaId = `testing-${v4()}`
const url = generateDatabaseURL(schemaId)
process.env.DATABASE_URL = url

export const prisma = new PrismaClient({
  datasources: { db: { url } },
})

beforeEach(() => {
  execSync(`${prismaBinary} db push --skip-generate`, {
    env: {
      ...process.env,
      DATABASE_URL: url,
    },
  })
})

afterEach(async () => {
  // await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE;`)
  await prisma.$disconnect()
})
