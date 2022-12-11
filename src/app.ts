import { FastifyInstance } from 'fastify'
import { view, menu, menuItem, html } from './view'

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
          menuItem('Get a random quote', '/quote'),
          menuItem('Test a route that does not work', '/crash'),
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
}
