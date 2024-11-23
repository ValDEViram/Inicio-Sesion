import mongoose from 'mongoose'

const MONGO_URI = 'mongodb://localhost:27017/Progrezy'

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    console.log('Conectado a mongoDB')
  } catch (error) {
    console.log('Error conectandose a MongoDB', error)
    process.exit(1)
  }
}

export default connectDB
