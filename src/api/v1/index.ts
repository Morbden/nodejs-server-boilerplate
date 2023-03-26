import { Router } from 'express'

export const pathname = '/v1'

export const router = Router({ mergeParams: true })

const getPathsRecursive = (router: Router, path: string = '') => {
  const paths: string[] = []
  router.stack.forEach((layer: RouterStack) => {
    if (layer.route) {
      let p = path + layer.route.path.replace(/\/$/, '')
      p += ' ('
      layer.route.methods.get && (p += 'GET, ')
      layer.route.methods.post && (p += 'POST, ')
      layer.route.methods.put && (p += 'PUT, ')
      layer.route.methods.delete && (p += 'DELETE, ')
      p = p.replace(/, $/, '')
      p += ')'
      paths.push(path + layer.route.path)
    }
  })
  return paths
}

router.get('/', (req, res) => {
  res.json({
    data: getPathsRecursive(router, pathname),
    stack: router.stack,
  })
})
