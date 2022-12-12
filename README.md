# adhoc-starter

Starter project optimized for building ad-hoc UI applications.

- ~~Separate frontend and backend.~~ Render everything on the server-side. Embrace [server-driven UI](https://www.thoughtworks.com/en-th/radar/techniques/server-driven-ui).

- ~~Separate models, views, controllers.~~ Put all the logic in the endpoint so it’s easier to build and iterate. Views should be generic.

- ~~Develop on dev, deploy to staging and production.~~ [Test safely on production](https://notes.dt.in.th/TestingInProduction) to make feedback loop lowest.

- ~~Create a full-fledged framework for [rapid application development](https://en.wikipedia.org/wiki/Rapid_application_development).~~ Add in a minimal set of libraries to reduce the learning curve, so that developers can leverage what they already know. Try to get in the way as little as possible.

## What’s in the box

- [Fastify](https://www.fastify.io/) with logger configured.
- [Bootstrap](https://getbootstrap.com/) v5 with helpers for building UIs.
- Request handler with built-in output buffering, error handling, and diagnostic tools.
- View helpers for building menus and other UI components.

## Prerequisites

Node.js 18. You should be somewhat familiar with JavaScript, Bootstrap and Fastify. This project tries to abstract as little as possible, so there’s less abstraction to learn and your code stays close to the underlying technology.

## Getting started

```bash
# Install dependencies
pnpm install

# Start the server
pnpm start
```

- Edit `src/app.ts`. The app is hot-reloaded when you change it. (Note: you need to restart the server if you change the `.env` file.)

- Go to http://localhost:18023/ to see the app.
