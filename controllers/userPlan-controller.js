import express from 'express'
import { userPlanRepository } from '../models/userPlan-repository.js'

const router = express.Router()

router.post('/addPlanUser', async (req, res) => {
  const { userID, planID } = req.body

  try {
    const newUserPlan = await userPlanRepository.createUserPlan({ userID, planID })
    res.status(200).json({ message: 'Agregado plan con exito al usuario', plan: newUserPlan })
  } catch (error) {
    res.status(401).json({ error: error.message })
  }
})

router.get('/getUserPlans', async (req, res) => {
  const { userID } = req.query

  try {
    const userPlans = await userPlanRepository.getUserPlans({ userID })
    res.status(200).json(userPlans)
  } catch (error) {
    res.status(401).json({ message: 'Error al conseguir los planes del usuario', user: userID })
  }
})

export default router
