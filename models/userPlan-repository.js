import DBLocal from 'db-local'
import { planRepository } from './task-respository.js'

const { Schema } = new DBLocal({ path: './db' })

const UserPlan = Schema('UserPlan', {
  _id: { type: String, required: true },
  userID: { type: String, required: true },
  planID: { type: String, required: true },
  tasks: { type: Array, default: [] }, // Cada tarea tiene un estado de completado para este usuario
  startDate: { type: String, default: () => new Date().toISOString() },
  endDate: { type: String } // Fecha opcional si el usuario termina el plan
})

export class userPlanRepository {
  static async createUserPlan ({ userID, planID }) {
    const userPlanRef = UserPlan.findOne({ userID, planID })
    if (userPlanRef) throw new Error('Ya se ha agregado este plan')
    const plan = await planRepository.getPlan(planID)
    if (!plan) throw new Error('Plan no encontrado en la base de datos')

    const newUserPlans = UserPlan.create({
      _id: crypto.randomUUID(),
      userID,
      planID,
      planName: plan.name,
      tasks: plan.tasks.map((task) => (
        {
          task,
          completed: false
        }
      ))
    })

    await newUserPlans.save()
    return newUserPlans
  }

  static async getUserPlans ({ userID }) {
    const userPlans = await UserPlan.find({ userID })
    if (!userPlans) throw new Error('No se encontraron planes para este usuario')

    return userPlans
  }

  static async completeTask (userPlanID, taskIndex) {
    const userPlans = await UserPlan.findOne({ _id: userPlanID })
    if (!userPlans) throw new Error('No se encontro el plan')

    userPlanRepository.tasks[taskIndex].completed = true
    await userPlans.save()

    return userPlans
  }
}
