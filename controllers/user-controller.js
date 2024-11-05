import express from 'express'
import jwt from 'jsonwebtoken'
import { userRepository } from '../models/user-repository.js'
import { SECRET_WEB_TOKEN } from '../config.js'

const router = express.Router()

router.get('/', (req, res) => {
  const { user } = req.session
  res.send(user)
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await userRepository.login({ email, password })
    const token = jwt.sign(
      { id: user.id, user: user.user, email: user.email, rol: user.rol },
      SECRET_WEB_TOKEN,
      {
        expiresIn: '1h'
      }
    )
    res
      .cookie('access_token', token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60
      })
      .send({ user, token })
  } catch (error) {
    res.status(401).json({ error: error.message })
  }
})

router.post('/register', async (req, res) => {
  const { username, email, password, rol } = req.body

  try {
    const id = await userRepository.create({ username, email, password, rol })
    res.send({ id })
  } catch (error) {
    res.status(401).json({ error: error.message })
  }
})

router.post('/logout', (req, res) => {
  req.clearCookie('access_token').json({ message: 'Logout succesful' })
})

router.get('/getAllUsers', async (req, res) => {
  try {
    const users = await userRepository.getUsers()
    res.status(200).send(users)
  } catch {}
})

router.get('/protected', (req, res) => {
  const { user } = req.session
  if (!user) return res.status(403).send('Acceso no autorizado')
  res.send(user)
})

export default router
