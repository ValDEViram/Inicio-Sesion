import DBLocal from 'db-local'

const { Schema } = new DBLocal({ path: './db' })

const Plan = Schema('Plan', {
  _id: { type: String, required: true },
  name: { type: String, required: true },
  tasks: { type: Array, default: [] },
  rewards: { type: Array, default: [] },
  timestamp: { type: String, default: () => new Date().toISOString() }
})

export class planRepository {
  static async createPlan ({ name, tasks, rewards }) {
    const id = crypto.randomUUID()

    // Crear un nuevo plan con un nombre
    const newPlan = Plan.create({
      _id: id,
      name,
      tasks,
      rewards,
      timestamp: new Date().toISOString()
    })
    await newPlan.save()

    return newPlan
  }

  static async getPlan (id) {
    const plan = await Plan.findOne({ _id: id })
    if (!plan) throw new Error('Plan no encontrado')
    return plan
  }

  static async addTaskToPlan (id, task) {
    const plan = await Plan.findOne({ _id: id })
    if (!plan) throw new Error('Plan no encontrado')

    plan.tasks.push(task) // Agregar una nueva tarea
    await plan.save()

    return plan
  }

  static async addRewardToPlan (id, reward) {
    const plan = await Plan.findOne({ _id: id })
    if (!plan) throw new Error('Plan no encontrado')

    plan.rewards.push(reward) // Agregar un nuevo logro
    await plan.save()

    return plan
  }
}
