[![postgresql][postgresql]][postgresql-url]
[![express][express]][express-url]
[![angularjs][angularjs]][angularjs-url]
[![node][node]][node-url]

# Schoolhouse Yoga Website

Schoolhouse Yoga's website provides the usual visual aspects of a yoga website plus a shopping cart written  (using Braintree's payment gateway including Apple Pay) and administration UI with a dashboard, content management, user, order, and attendance management. User logins can be local or OAuth. Project tooling includes Babel, Webpack, Gulp, browser-sync, pug, Sass, Jest, and Cypress.

## Getting Started

### Prerequisites

- [Git](https://git-scm.com/) (on macOS `brew install git`)
- [Node.js 10.15.2 and npm 6.8.0](nodejs.org) (`brew install node@10`)
- [PostgreSQL 11.2.0](http://postgresql.org) (`brew install postgresql`)
- [pgAdmin4](https://www.postgresql.org/download/)
- [Chrome >= 62] (`brew install Caskroom/versions/google-chrome`) - used for headless testing
- Get a free [Heroku](http://heroku.com) account and install the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
- Get a [Braintree](https://www.braintreepayments.com/sandbox) Sandbox account

### Project setup

1. Make sure prerequisites are installed for your operating system (commands above are mostly for macOS). Remove any Chrome versions older than 59 or client testing will not work.

2. Run `git clone https://github.com/nstuyvesant/shy.git` then connect to the /shy directory.

3. Run `npm install -g gulp` to install Gulp.

4. Run `npm install` to install server dependencies.

5. Copy .env.sample to .env then provide your own credentials. At the moment, the SMTP_ and SEQUELIZE_URI parameters need to be set. If you want to process orders, the BRAINTREE parameters will also need correct values.

6. Start PostgreSQL on your local computer (on macOS `brew services start postgresql`).

7. Open pgAdmin and connect to localhost.

8. In pgAdmin (or via psql), run `server/config/shy-database.sql` to create a database called `shy` then adjust the DATABASE_URL in .env to set the URI with your credentials for this database.

## Running tests, creating builds & deploying to Heroku

1. Run `gulp test` to execute unit and integration tests. E2E tests (`npm run e2e`) in Cypress are still under construction and there are data dependencies in the integration tests that need to be uncoupled.

2. Run `gulp build` to create a build in the /dist directory. Connect to the /dist directory then type `git init` then define Heroku as the remote repo with `heroku git:remote -a APPNAME` where APPNAME is the name of your app as defined on Heroku.

3. Run `gulp serve` to start the server locally. Make sure PostgreSQL is running.

4. Run `gulp deploy` if you are deploying to Heroku and have a Heroku account with the CLI installed. This will push the contents of /dist up to Heroku using git.

[express]: https://img.shields.io/badge/expressjs-4.16.4-blue.svg
[express-url]: http://expressjs.com
[angularjs]: https://img.shields.io/badge/angularjs-1.7.8-red.svg
[angularjs-url]: https://angularjs.org
[node]: https://img.shields.io/badge/nodejs-10.15.2-green.svg
[node-url]: https://nodejs.org
[postgresql]: https://img.shields.io/badge/postgresql-11.2.0-blue.svg
[postgresql-url]: https://www.postgresql.org