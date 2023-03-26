import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const dp = (key: string, o: any) =>
  Object.defineProperty(global, key, {
    value: o,
    writable: false,
    configurable: false,
  })

dp('$dp', dp)

const $$global = {
  __dirname: dirname(resolve(fileURLToPath(import.meta.url))),
  env: process.env,
  get dev() {
    return this.env.NODE_ENV !== 'production'
  },
  join(...args: string[]) {
    return args.join('/').replace(/[\/\\]+/g, '/')
  },
} as const

dp('$$', $$global)

declare global {
  const $dp: typeof dp
  const $$: typeof $$global
}
