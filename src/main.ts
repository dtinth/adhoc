import 'dotenv/config'
import http from 'http'
import { createServer as createViteServer } from 'vite'

const vitePromise = createViteServer({
  server: { middlewareMode: true },
  appType: 'custom',
  build: { rollupOptions: { input: 'src/fastify.ts' } },
})

const server = http.createServer(async (req, res) => {
  try {
    const vite = await vitePromise
    const { fastifyPromise } = await vite.ssrLoadModule('/src/fastify.ts')
    const fastify = await fastifyPromise
    await fastify.ready()
    fastify.server.emit('request', req, res)
  } catch (error: any) {
    console.error(error)
    res.statusCode = 500
    res.setHeader('Content-Type', 'text/plain')
    res.end(String(error?.stack || error))
  }
})

server.listen(18023, () => {
  console.log('Server listening:', server.address())
})