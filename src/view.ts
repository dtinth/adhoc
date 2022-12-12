import { FastifyReply, FastifyRequest } from 'fastify'
import { format } from 'util'
import { html, Html } from 'tagged-hypertext'
export { html, Html } from 'tagged-hypertext'

interface ViewContext {
  /** Access the raw Fastify request object. */
  request: FastifyRequest

  /** Title of the page. Change this property to customize the page title and header. */
  title: string

  /** Display something on the page. */
  add: (...v: Html[]) => void

  /** Add a log message. This will be added to the end of the page for diagnostics. */
  debug: (...p: any[]) => void

  /** Redirect to another page. Should be used with the `return` keyword. */
  redirect: (p: string) => void

  /** Get the parameter from `params`, `body`, and `query` (in that order). */
  param: (name: string) => string | undefined

  /** Get the parameter from `params`, `body`, and `query` (in that order). Throws an error if not found. */
  requiredParam: (name: string) => string
}

export function view(f: (context: ViewContext) => Promise<Html | void>) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    reply.type('text/html')
    const output: Html[] = []
    const log: string[] = []
    let gone = false
    const context: ViewContext = {
      request: request,
      redirect: (p: string) => {
        reply.redirect(p)
        gone = true
      },
      title: request.routerMethod + ' ' + request.routerPath,
      add: (...v: Html[]) => output.push(...v),
      debug: (...a: any[]) => {
        const str = format(...a)
        log.push(str)
        request.log.debug(str)
      },
      param: (name) => {
        return (
          (request.params as any)[name] ||
          ((request.body as any) || {})[name] ||
          (request.query as any)[name] ||
          undefined
        )
      },
      requiredParam: (name) => {
        const value = context.param(name)
        if (value === undefined) {
          throw new Error(`Missing parameter: ${name}`)
        }
        return value
      },
    }
    try {
      output.push(html`${await f(context)}`.toHtml())
    } catch (error: any) {
      output.push(pre(error.stack))
    }

    if (log.length > 0) {
      output.push(
        html`<div class="mt-5 mb-2 text-muted">
            ${icon('codicon:output')} <strong>Logs</strong>
          </div>
          <div class="fs-6">${log.map((l) => pre(l))}</div>`,
      )
    }

    const outputHtml = html`<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <title>${context.title}</title>
          <link
            href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css"
            rel="stylesheet"
            integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65"
            crossorigin="anonymous"
          />
        </head>
        <body style="letter-spacing: 0.05em">
          <div class="container py-4 fs-5">
            <h1>${context.title}</h1>
            ${output}
          </div>
          <script src="https://code.iconify.design/iconify-icon/1.0.2/iconify-icon.min.js"></script>
        </body>
      </html>`
    if (!gone) {
      reply.send(outputHtml.toHtml())
    }
  }
}

export function menu(children: Html) {
  return html`<div class="list-group my-4">${children}</div>`
}

export function menuItem(href: string, children: Html) {
  return html`<a
    href="${href}"
    class="list-group-item list-group-item-action d-flex"
  >
    <span style="flex: 1 0 0">${children}</span>
    <span class="d-flex align-self-center" style="flex: none"
      >${icon('codicon:chevron-right')}</span
    >
  </a>`
}

export function icon(name: string) {
  return html`<iconify-icon icon="${name}" inline></iconify-icon>`
}

export function p(children: Html) {
  return html`<p>${children}</p>`
}

export function pre(children: Html) {
  return html`<pre
    class="p-3 rounded bg-light"
    style="letter-spacing: 0;"
    wrap
  ><code>${children}</code></pre>`
}

export function formPost(action: string, children: Html) {
  return html`<form action="${action}" method="post">${children}</form>`
}

export function inputText(name: string, label: Html = name) {
  return html`<div class="mb-3">
    <label for="${name}" class="form-label fw-bold text-muted">${label}</label>
    <input type="text" class="form-control" id="${name}" name="${name}" />
  </div>`
}

export function buttons(children: Html = submitButton()) {
  return html`<div class="d-flex gap-2">${children}</div>`
}

export function submitButton(children: Html = 'Submit form') {
  return html`<button type="submit" class="btn btn-primary">
    ${children}
  </button>`
}
