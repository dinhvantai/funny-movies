import { faker } from '@faker-js/faker'
import supertest from 'supertest'
import { prisma } from '../../services/PrismaService'
import app from '../../api/api'

describe('Movie testing', () => {
  const data = {
    username: faker.random.word(),
    password: faker.random.word(),
  }
  const url = 'https://www.youtube.com/watch?v=kqtD5dpn9C8'
  let token: string = ''

  test('should have a token', async () => {
    await supertest(app.handler).post('/register').send(data).expect(200)
    const res = await supertest(app.handler).post('/login').send(data).expect(200)
    expect(res.body).toHaveProperty('token')
    token = res.body.token
  })

  test('should create a movie', async () => {
    expect(await prisma.movie.count()).toEqual(0)
    await supertest(app.handler).post('/movies').send({ url })
      .set('Authorization', token)
      .expect(200)
    expect(await prisma.movie.count()).toEqual(1)
  })

  test('should error when sending wrong url', async () => {
    const wrongUrl = 'https://www.youtube.com/watch'
    const moviesCount = await prisma.movie.count()
    await supertest(app.handler).post('/movies').send({ url: wrongUrl })
      .set('Authorization', token)
      .expect(400)
    expect(await prisma.movie.count()).toEqual(moviesCount)
  })

  test('should error when there is no token to share movie', async () => {
    const moviesCount = await prisma.movie.count()
    await supertest(app.handler).post('/movies').send({ url })
      .expect(401)
    expect(await prisma.movie.count()).toEqual(moviesCount)
  })
})
