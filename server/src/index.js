import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import connectDB from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import movieRoutes from './routes/movieRoutes.js'
import sceneRoutes from './routes/sceneRoutes.js'
import observationRoutes from './routes/observationRoutes.js'
import analysisRoutes from './routes/analysisRoutes.js'

dotenv.config()
connectDB()

const app = express()

app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
app.use(express.json())
app.use(cookieParser())

app.use('/api/auth', authRoutes)
app.use('/api/movies', movieRoutes)
app.use('/api/scenes/', sceneRoutes)
app.use('/api/observations/', observationRoutes)
app.use('/api/analyses/', analysisRoutes)

app.get('/', (req, res) => res.send('API is running'))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
