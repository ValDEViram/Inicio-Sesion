import express from 'express'
import { planRepository } from '../models/task-respository.js'

const router = express.Router()

// Ruta para obtener un plan específico
router.get('/plans/:id', async (req, res) => {
  const { id } = req.params

  try {
    const plan = await planRepository.getPlan(id)
    res.status(200).send(plan)
  } catch (error) {
    res.status(404).send(error.message)
  }
})

// Ruta para obtener los planes registrados actualmente
router.get('/getPlans', async (req, res) => {
  try {
    const tasksPlans = await planRepository.getPlans()
    res.status(200).send(tasksPlans)
  } catch {}
})

// Ruta para agregar un plan a la base de datos
router.post('/addPlan', async (req, res) => {
  const { name, tasks, visibility } = req.body

  try {
    const plan = await planRepository.createPlan({ name, tasks, visibility })
    res.status(201).send(plan)
  } catch (error) {
    res.status(500).send(error.message)
  }
})

// Ruta para agregar una tarea a un plan
router.post('/plans/:id/tasks', async (req, res) => {
  const { id } = req.params
  const { todoTasks } = req.body

  try {
    const plan = await planRepository.addTaskToPlan(id, todoTasks)
    res.status(200).send(plan)
  } catch (error) {
    res.status(500).send(error.message)
  }
})

// Ruta para agregar un logro a un plan
router.post('/plans/:id/rewards', async (req, res) => {
  const { id } = req.params
  const { reward } = req.body

  try {
    const plan = await planRepository.addRewardToPlan(id, reward)
    res.status(200).send(plan)
  } catch (error) {
    res.status(500).send(error.message)
  }
})

export default router
