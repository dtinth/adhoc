import { app } from './app'
import { Env, envMap } from './env'

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<Response> {
    const expectedAuth = `Basic ${btoa(`admin:${env.BASIC_AUTH_PASSWORD}`)}`
    const pathname = new URL(request.url).pathname
    if (
      request.headers.get('Authorization') !== expectedAuth &&
      !pathname.startsWith('/public/')
    ) {
      return new Response('Unauthorized', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="No access"',
        },
      })
    }

    envMap.set(request, env)
    return await app.fetch(request)
  },
}
