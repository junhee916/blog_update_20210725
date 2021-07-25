require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

// connectd router
const userRouter = require('./router/user')
const boardRouter = require('./router/board')
const commendRouter = require('./router/commend')

// middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended : false}))

app.use(morgan('dev'))
app.use(cors())

app.use('/uploads', express.static('uploads'))

// connected config
const connectDB = require('./config/database')
connectDB()

app.use('/user', userRouter)
app.use('/board', boardRouter)
app.use('/commend', commendRouter)

const PORT = process.env.PORT || 7000

app.listen(PORT, console.log('connected server....'))
