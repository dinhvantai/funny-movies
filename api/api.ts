import express from 'express'
import authMiddleware from '../middlewares/auth'

import UserController from '../controllers/UserController'
import ActionController from '../controllers/ActionController'
import MovieController from '../controllers/MovieController'

const app = express()

// eslint-disable-next-line import/no-named-as-default-member
app.use(express.json())

app.use(authMiddleware).get('/me', UserController.me)
app.use(authMiddleware).post('/actions', ActionController.create)
app.use(authMiddleware).post('/actions', MovieController.create)

app.get('/movies', MovieController.index)

app.post('/register', UserController.register)
app.post('/login', UserController.login)

/**
 * logic for our api will go here
 */
export default {
  path: '/api',
  handler: app,
}
