import Fastify, { FastifyReply, FastifyRequest } from 'fastify'
import basicAuth from '@fastify/basic-auth'
import formBody from '@fastify/formbody'
import staticPlugin from '@fastify/static'
import path from 'path'
import { routes } from './app'

async function createApp() {
  const fastify = Fastify({
    logger: {
      transport: {
        target: 'pino-pretty',
      },
    },
  })
  await fastify.register(formBody, {})
  await fastify.register(basicAuth, {
    validate: validateBasicAuth,
    authenticate: { realm: 'adhoc' },
  })
  await fastify.register(staticPlugin, {
    root: path.resolve('public'),
    prefix: '/public/',
  })
  fastify.addHook('onRequest', fastify.basicAuth)
  await fastify.register(routes)
  return fastify
}

function validateBasicAuth(
  username: string,
  password: string,
  req: FastifyRequest,
  reply: FastifyReply,
  done: (err?: Error) => void,
) {
  if (password === process.env.BASIC_AUTH_PASSWORD) {
    done()
  } else {
    done(new Error('Winter is coming'))
  }
}

export const fastifyPromise = createApp()
