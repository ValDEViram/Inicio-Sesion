import express from 'express'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'
import { PORT, SECRET_WEB_TOKEN } from './config.js'
import { userRepository } from './user-repository.js'
import { planRepository } from './task-respository.js'

const app = express()

app.use(cors())
app.use(express.json())
app.use(cookieParser())

app.use((req, res, next) => {
  const token = req.cookies.access_token
  req.session = { user: null }

  try {
    const data = jwt.verify(token, SECRET_WEB_TOKEN)
    req.session.user = data
  } catch {}

  next()
})

app.get('/', (req, res) => {
  const { user } = req.session
  res.render('index', user)
})

app.post('/login', async (req, res) => {
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

app.post('/register', async (req, res) => {
  const { username, email, password, rol } = req.body

  try {
    const id = await userRepository.create({ username, email, password, rol })
    res.send({ id })
  } catch (error) {
    res.status(401).json({ error: error.message })
  }
})

app.post('/logout', (req, res) => {
  req.clearCookie('access_token').json({ message: 'Logout succesful' })
})

app.get('/getAllUsers', async (req, res) => {
  try {
    const users = await userRepository.getUsers()
    res.status(200).send(users)
  } catch {}
})

app.get('/protected', (req, res) => {
  const { user } = req.session
  if (!user) return res.status(403).send('Acceso no autorizado')
  res.send(user)
})

app.post('/addActivity', async (req, res) => {
  const { name, tasks } = req.body

  try {
    const plan = await planRepository.createPlan({ name, tasks })
    res.status(201).send(plan)
  } catch (error) {
    res.status(500).send(error.message)
  }
})

// Ruta para obtener un plan específico
app.get('/plans/:id', async (req, res) => {
  const { id } = req.params

  try {
    const plan = await planRepository.getPlan(id)
    res.status(200).send(plan)
  } catch (error) {
    res.status(404).send(error.message)
  }
})

// Ruta para agregar una tarea a un plan
app.post('/plans/:id/tasks', async (req, res) => {
  const { id } = req.params
  const { task } = req.body

  try {
    const plan = await planRepository.addTaskToPlan(id, task)
    res.status(200).send(plan)
  } catch (error) {
    res.status(500).send(error.message)
  }
})

// Ruta para agregar un logro a un plan
app.post('/plans/:id/rewards', async (req, res) => {
  const { id } = req.params
  const { reward } = req.body

  try {
    const plan = await planRepository.addRewardToPlan(id, reward)
    res.status(200).send(plan)
  } catch (error) {
    res.status(500).send(error.message)
  }
})

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`)
})
