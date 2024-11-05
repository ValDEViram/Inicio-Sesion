import express from 'express'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'
import { PORT, SECRET_WEB_TOKEN } from './config.js'
import userRouter from './controllers/user-controller.js'
import taskRouter from './controllers/task-controller.js'

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

app.use('/plans', taskRouter)
app.use('/users', userRouter)

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`)
})
