import './env'
import http from 'http'
import { createServer as createViteServer } from 'vite'

const getFastify = (() => {
  if (process.env.EXPERIMENTAL_USE_VITE === 'true') {
    const vitePromise = createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
      build: { rollupOptions: { input: 'src/fastify.ts' } },
    })
    return async () => {
      const vite = await vitePromise
      const { fastifyPromise } = await vite.ssrLoadModule('/src/fastify.ts')
      return fastifyPromise
    }
  } else {
    const { fastifyPromise } = require('./fastify')
    return async () => fastifyPromise
  }
})()

const server = http.createServer(async (req, res) => {
  try {
    const fastify = await getFastify()
    await fastify.ready()
    fastify.server.emit('request', req, res)
  } catch (error: any) {
    console.error(error)
    res.statusCode = 500
    res.setHeader('Content-Type', 'text/plain')
    res.end(String(error?.stack || error))
  }
})

const port = 18023
server.listen(port, '127.0.0.1', () => {
  console.log(`==> http://localhost:${port}`)
})
