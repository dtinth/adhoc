# adhoc-starter

Starter project optimized for building ad-hoc UI applications.

- ~~Separate frontend and backend.~~ Render everything on the server-side. Embrace [server-driven UI](https://www.thoughtworks.com/en-th/radar/techniques/server-driven-ui).

- ~~Separate models, views, controllers.~~ Put all the logic in the endpoint so it’s easier to build and iterate. Views should be generic.

- ~~Develop on dev, deploy to staging and production.~~ [Test safely on production](https://notes.dt.in.th/TestingInProduction) to make feedback loop as short as possible.

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

- Edit `src/app.ts`. The app is restarted when you change it.

- Go to http://localhost:18023/ to see the app.

## Deployment

You can deploy this anywhere you can run Node.js.

You could deploy this to a PaaS service like Heroku, Fly, or Railway. However, you’ll have to wait for a push/build/deploy cycle to see your changes. In situations where we have to improvise an app live at an event, many bugs are bound to happen, and we cannot afford to wait 2 minutes each time we fix a bug.

In my case, I **run the app on my own laptop** and use a tunneling tool (e.g. Cloudflare Tunnel, ngrok, or localtunnel) to let people access it. This is the fastest way to react to feedback. In my case, I set up [Cloudflare Tunnel to my subdomain](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/routing-to-tunnel/). To let others developers help build the app, collaboration tools such as Visual Studio Live Share can be used. One downside is that when the laptop goes to sleep, the app stops working.

Another possible approach is to **run the app on a VPS.** The Remote - SSH extension in Visual Studio Code can be used to connect to the VPS and edit the code. To let people access via HTTPS, [a reverse proxy can be easily set up using Caddy](https://notes.dt.in.th/CaddyReverseProxy). Alternatively, tunnel tools like Cloudflare Tunnel and ngrok can also be used.

It is important to note that ad-hoc apps that are developed in this way are not meant to be deployed to production and run unattended. While it’s being used, ideally there should be a developer who monitors the app and fixes bugs as they happen. **Crashes and downtimes should be expected, and fallback processes should be put in place in case the app is unable to function.**

In my case, **ad-hoc apps are usually created to streamline the process but not to replace it.** Usually there is a production system that has a UI that can query everything and display all the details. However this flexibility makes the UI clunky, hard to use, and more prone to errors. We can create an ad-hoc app that only shows just the information that we need. We can observe how people use the app and make changes to the UI to make it more usable right at the event. It streamlines the process but does not replace it; should the ad-hoc app go down, we would just fall back to using the production system.
