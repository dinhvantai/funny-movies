import { faker } from '@faker-js/faker'
import supertest from 'supertest'
import { prisma } from '../../services/PrismaService'
import app from '../../api/api'

describe('Authorization testing', () => {
  const data = {
    username: faker.random.word(),
    password: faker.random.word(),
  }

  test('should create a user', async () => {
    expect(await prisma.user.count()).toEqual(0)
    await supertest(app.handler).post('/register').send(data)
      .expect(200)

    expect(await prisma.user.count()).toBe(1)
  })

  test('should error on the username has an register', async () => {
    const usersCount = await prisma.user.count()
    await supertest(app.handler).post('/register').send(data)
      .expect(400)
    expect(await prisma.user.count()).toEqual(usersCount)
  })

  test('should return token on successful login', async () => {
    const res = await supertest(app.handler).post('/login').send(data)
      .expect(200)
    expect(res.body).toHaveProperty('token')
  })

  test('should return error when login failed', async () => {
    const wrongData = {
      ...data,
      password: faker.random.word(),
    }

    await supertest(app.handler).post('/login').send(wrongData)
      .expect(400)
  })

  test('should return user information when getting profile', async () => {
    const res = await supertest(app.handler).post('/login').send(data)
      .expect(200)
    const profileRes = await supertest(app.handler).get('/me')
      .set('Authorization', res.body.token)
      .expect(200)
    expect(profileRes.body).toHaveProperty('user')
  })

  test('should error when getting user information with wrong token', async () => {
    await supertest(app.handler).get('/me').expect(401)
  })
})
