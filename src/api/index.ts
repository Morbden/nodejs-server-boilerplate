import { Router } from 'express'
import * as v1 from './v1'

export const pathname = '/'

export const router = Router({ mergeParams: true })

router.use(v1.pathname, v1.router)
