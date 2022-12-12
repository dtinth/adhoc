import Encrypted from '@dtinth/encrypted'
import { FastifyInstance } from 'fastify'
import {
  view,
  menu,
  menuItem,
  html,
  formPost,
  inputText,
  p,
  buttons,
  pre,
} from './view'

const encrypted = Encrypted()

export async function routes(fastify: FastifyInstance) {
  fastify.get(
    '/',
    view(async (v) => {
      v.debug(
        'This is an example debug message.',
        'They are for diagnostic purposes.',
        'Debug messages are shown at the bottom of the rendered page.',
      )
      v.title = 'Home page'
      v.add(html`<strong>Welcome. </strong>`)
      v.add('This is a demo.')
      v.add(
        menu([
          menuItem('/quote', 'Get a random quote'),
          menuItem('/encrypt', 'Encrypt some text (form demo)'),
          menuItem('/crash', 'Test a route that does not work'),
        ]),
      )
    }),
  )

  fastify.get(
    '/quote',
    view(async (v) => {
      const response = await fetch('https://api.quotable.io/random')
      v.debug(response.status, response.statusText)
      const data = await response.json()
      v.debug(data)
      v.add(html`<figure class="mt-4">
        <blockquote class="blockquote">
          <p class="fs-3">${data.content}</p>
        </blockquote>
        <figcaption class="blockquote-footer">
          <cite>${data.author}</cite>
        </figcaption>
      </figure> `)
    }),
  )

  fastify.get(
    '/crash',
    view(async (v) => {
      v.debug(
        'Debug messages are still shown even if the route crashes.',
        'This can be useful when debugging a crashed route!',
      )
      throw new Error('This is an example error.')
    }),
  )

  fastify.get(
    '/encrypt',
    view(async (v) => {
      v.add(
        formPost('/encrypt', [
          p('Enter the text that you want to encrypt'),
          inputText('text'),
          buttons(),
        ]),
      )
    }),
  )

  fastify.post(
    '/encrypt',
    view(async (v) => {
      const text = v.requiredParam('text')
      const code = 'encrypted`' + encrypted.encrypt(text) + '`'
      v.add(
        p('You can use the following code in your app to access the text:'),
        pre(code),
      )
    }),
  )
}
