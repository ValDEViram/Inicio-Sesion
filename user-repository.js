import DBLocal from 'db-local'
import bcrypt from 'bcrypt'

const { Schema } = new DBLocal({ path: './db' })

const User = Schema('User', {
  _id: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  rol: { type: String, required: true }
})

export class userRepository {
  static async create ({ username, email, password, rol }) {
    Validation.username(username)
    Validation.password(password)
    const user = await User.findOne({ email })
    if (user) throw new Error('El usuario ya ha sido creado')

    const id = crypto.randomUUID()
    const hashedPassword = await bcrypt.hash(password, 10)

    User.create({
      _id: id,
      username,
      email,
      password: hashedPassword,
      rol: rol != null ? rol : 'Usuario'
    }).save()

    return id
  }

  static async login ({ email, password }) {
    Validation.password(password)

    const user = await User.findOne({ email })
    if (!user) throw new Error('El usuario no ha sido creado')

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) throw new Error('La contraseña no es la correcta')

    return {
      id: user._id,
      user: user.username,
      email: user.email,
      rol: user.rol
    }
  }

  static async getUsers () {
    const allUsers = await User.find({})

    return allUsers
  }
}

class Validation {
  static username (username) {
    if (typeof username !== 'string') { throw new Error('El usuario debe de ser un string') }
    if (username.length < 5 || username.length > 20) {
      throw new Error(
        'El usuario debe de tener más de 5 caracteres y menos de 20'
      )
    }

    const usernameRegex = /^[a-zA-Z0-9_\-\s]+$/
    if (!usernameRegex.test(username)) {
      throw new Error(
        'El usuario no puede contener caracteres especiales, solo se permiten letras, números, guiones (-) y guiones bajos (_)'
      )
    }
  }

  static password (password) {
    if (typeof password !== 'string') { throw new Error('La contraseña debe de ser un string') }
    if (password.length < 8 || password.length > 20) {
      throw new Error(
        'La contraseña debe de tener más de 8 caracteres y menos de 20'
      )
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    if (!passwordRegex.test(password)) {
      throw new Error(
        'La contraseña debe tener al menos 8 caracteres, incluir al menos una letra mayúscula, una minúscula, un número y un carácter especial'
      )
    }
  }
}
