import { faker } from '@faker-js/faker'

import UserService from '~/services/UserService'

describe('User service testing', () => {
  test('should have a value after hashing different form the raw password', async () => {
    const rawPassword = faker.random.words()
    const hash = await UserService.hashPassword(rawPassword)
    expect(rawPassword === hash).toEqual(false)
  })
  test('should have the correct result when compared raw password with hash password', async () => {
    const rawPassword = faker.random.words()
    const hash = await UserService.hashPassword(rawPassword)
    expect(await UserService.checkPassword(rawPassword, hash)).toEqual(true)
  })

  test('should have the incorrect result when compared wrong password with hash password', async () => {
    const rawPassword = faker.random.words()
    const wrongPassword = faker.random.words()
    const hash = await UserService.hashPassword(rawPassword)
    expect(await UserService.checkPassword(wrongPassword, hash)).toEqual(false)
  })
})
