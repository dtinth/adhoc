import { Html, html } from '@thai/html'
import { format } from 'node:util'
export { html, type Html } from '@thai/html'

interface ViewContext {
  /** Title of the page. Change this property to customize the page title and header. */
  title: string

  /** HTTP status code. Default is 200. Change this property to set a different status code. */
  status: number

  /** Display something on the page. */
  add: (...v: Html[]) => void

  /** Add a log message. This will be added to the end of the page for diagnostics. */
  debug: (...p: any[]) => void

  /** Redirect to another page. Should be used with the `return` keyword. */
  redirect: (p: string) => void
}

export function view(f: (context: ViewContext) => Promise<Html | void>) {
  return (async () => {
    const output: Html[] = []
    const log: string[] = []

    let redirectTarget: string | undefined

    const context: ViewContext = {
      redirect: (p: string) => {
        redirectTarget = p
      },
      title: 'Adhoc',
      status: 200,
      add: (...v: Html[]) => output.push(...v),
      debug: (...a: any[]) => {
        const str = format(...a)
        log.push(str)
        console.log('debug:', str)
      },
    }
    try {
      const result = await f(context)
      if (result instanceof Response) {
        return result
      }
      output.push(html`${result}`.toHtml())
    } catch (error: any) {
      if (error instanceof Response) {
        return error
      }
      output.push(ui.pre(error.stack))
    }

    if (log.length > 0) {
      output.push(
        html`<div class="mt-5 mb-2 text-muted">
            ${ui.icon('codicon:output')} <strong>Logs</strong>
          </div>
          <div class="fs-6">${log.map((l) => ui.pre(l))}</div>`,
      )
    }

    if (redirectTarget) {
      return new Response(null, {
        status: 302,
        headers: {
          Location: redirectTarget,
        },
      })
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
            href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
            rel="stylesheet"
            integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
            crossorigin="anonymous"
          />
        </head>
        <body style="letter-spacing: 0.05em">
          <div class="container py-4 fs-5">
            <h1>${context.title}</h1>
            ${output}
          </div>
          <script src="https://code.iconify.design/iconify-icon/1.0.2/iconify-icon.min.js"></script>
          <script
            src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
            integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
            crossorigin="anonymous"
          ></script>
        </body>
      </html>`
    return new Response(outputHtml.toHtml(), {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    })
  })()
}

export namespace ui {
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
      <label for="${name}" class="form-label fw-bold text-muted"
        >${label}</label
      >
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
}
