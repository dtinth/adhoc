# adhoc-starter

Starter project optimized for building ad-hoc UI applications.

- ~~Separate frontend and backend.~~ Render everything on the server-side. Embrace [server-driven UI](https://www.thoughtworks.com/en-th/radar/techniques/server-driven-ui).

- ~~Separate models, views, controllers.~~ Put all the logic in the endpoint so it’s easier to build and iterate. Views should be generic.

- ~~Develop on dev, deploy to staging and production.~~ [Test safely on production](https://notes.dt.in.th/TestingInProduction) to make feedback loop lowest.

## Prerequisites

You should be somewhat familiar with JavaScript, Bootstrap and Fastify. This project tries to abstract as little as possible, so there’s less abstraction to learn and your code stays close to the underlying technology.
