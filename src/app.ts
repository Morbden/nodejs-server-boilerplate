import './global'

import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { Server } from 'socket.io'

import * as api from './api'

export const app = express()
export const io = new Server({
  path: '/live',
  transports: ['websocket'],
  allowEIO3: true,
  pingInterval: 20000,
  pingTimeout: 5000,
})

// Define middleware parsers
app.use(
  cors({
    origin: '*',
  }),
)
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cookieParser())

// Normalize query object
const recursiveParse = (obj: Record<string, any> = {}) => {
  for (let r in obj) {
    switch (true) {
      case Array.isArray(obj[r]) || typeof obj[r]:
        recursiveParse(obj[r])
        break
      case /^(yes|y|true|t|on)$/i.test(obj[r]):
        obj[r] = true
        break
      case /^(no|n|false|f|off)$/i.test(obj[r]):
        obj[r] = false
        break
      case !isNaN(+obj[r]):
        obj[r] = +obj[r]
        break
    }
  }
}
app.use((req, _, next) => {
  recursiveParse(req.query)
  next()
})

// Define routes
app.use(api.pathname, api.router)

// End load api files
app.get('/', (_, res) => {
  res.status(200).json({
    version: process.env.npm_package_version,
    name: process.env.npm_package_name,
  })
})

app.get('*', (_, res) => {
  res.status(StatusCodes.NOT_FOUND).json({ message: 'Not found' })
})
