import { Elysia, t } from 'elysia'
import { getEnv } from './env'
import { html, ui, view } from './view'

export const app = new Elysia({ aot: false })
  .derive(({ request }) => ({ env: getEnv(request) }))
  .get('/', async () =>
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
        ui.menu([
          ui.menuItem('/quote', 'Get a random quote'),
          ui.menuItem('/form', 'Form demo'),
          ui.menuItem('/crash', 'Test a route that does not work'),
        ]),
      )
    }),
  )
  .get('/quote', async () =>
    view(async (v) => {
      const response = await fetch('https://api.quotable.io/random')
      v.debug(response.status, response.statusText)
      const data = (await response.json()) as {
        content: string
        author: string
      }
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
  .get('/crash', async () =>
    view(async (v) => {
      v.debug(
        'Debug messages are still shown even if the route crashes.',
        'This can be useful when debugging a crashed route!',
      )
      throw new Error('This is an example error.')
    }),
  )
  .get('/form', async () =>
    view(async (v) => {
      v.add(
        ui.formPost('/form', [
          ui.p('Enter some text:'),
          ui.inputText('text'),
          ui.buttons(),
        ]),
      )
    }),
  )
  .post(
    '/form',
    async ({ body: { text } }) =>
      view(async (v) => {
        v.add(ui.p('This is the text you entered:'), ui.pre(text))
      }),
    {
      body: t.Object({ text: t.String() }),
    },
  )
