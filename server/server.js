import express from 'express'
import cors from 'cors'
import { readdirSync } from 'fs'
import mongoose from 'mongoose'
import csrf from "csurf"
import cookieParser from 'cookie-parser'
const morgan = require('morgan')
require('dotenv').config()


const csrfProtection = csrf({cookie: true});

//craate express app
const app = express()

//db
const uri = process.env.DATABASE
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })

const connection = mongoose.connection

try {
  connection.once('open', () => {
    console.log('MongoDB database connection established successfully')
  })
} catch (e) {
  console.log(e)
}

//apply middlewares
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))
app.use(cookieParser())

//route
readdirSync('./routes').map(r => {
  app.use('/api', require(`./routes/${r}`))
})
//csrf
app.use(csrfProtection)

app.get('/api/csrf-token',(req, res) => {
  res.json({csrfToken: req.csrfToken()})
})

//port
const port = process.env.PORT || 8000

app.listen(port, () => console.log(`Server is running on port ${port}`))
