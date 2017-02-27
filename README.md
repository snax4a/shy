[![npm][npm]][npm-url]
[![node][node]][node-url]
[![angularjs][angularjs]][angularjs-url]
[![postgresql][postgresql]][postgresql-url]

# Schoolhouse Yoga Website

Schoolhouse Yoga's website is built using AngularJS, Express, Node.js, and PostgreSQL. It provides
a home page, class schedule, workshop information, teachers' page, method to contact
the school and a shopping cart tied to a payment gateway.

## Getting Started

### Prerequisites

- [Git](https://git-scm.com/) (on macOS `brew install git`)
- [Node.js 7.60 and npm 4.3.0](nodejs.org) (`brew install node`)
- [PostgreSQL 9.6.2](http://postgresql.org) (`brew install postgresql`)
- [pgAdmin3](http://postgresql.org) (`brew cask install Caskroom/versions/pgadmin3`)
- Get a free [Heroku](http://heroku.com) account and install the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
- Get a [Braintree](https://www.braintreepayments.com/sandbox) Sandbox account

### Project setup

1. Make sure prerequisites are installed for your operating system (commands above are mostly for macOS)

2. Run `git clone https://github.com/nstuyvesant/shy.git` then connect to the /shy directory.

3. Run `npm install` to install server dependencies.

4. Copy /server/config/local.env.sample.js to local.env.js then provide your own credentials. At the moment, the SMTP_ and SEQUELIZE_URI parameters need to be set. If you want to process orders, the BRAINTREE parameters will also need correct values.

5. Start PostgreSQL on your local computer (on macOS `brew services start postgresql`).

6. Open pgAdmin and connect to localhost.

7. Create a database called `shy` then adjust the DATABASE_URL in local.env.js to set the URI with your credentials for this database.

## Running tests, creating builds & deploying to Heroku

1. Run `gulp test` to execute unit, integration and client tests. The client tests are under construction.

2. Run `gulp build` to create a build in the /dist directory. Connect to the /dist directory then type `git init` then define Heroku as the remote repo with `heroku git:remote -a APPNAME'.

3. Run `gulp serve` to start the server locally. Make sure PostgreSQL is running.

4. Run `npm run deploy` if you are deploying to Heroku and have a Heroku account with the CLI installed. This will push the contents of /dist up to Heroku using git.

[npm]: https://img.shields.io/npm/v/npm.svg
[npm-url]: https://npmjs.com/package/extract-text-webpack-plugin

[node]: https://img.shields.io/npm/v/@cycle/core.svg
[node-url]: https://nodejs.org

[angularjs]: https://img.shields.io/badge/angularjs-1.6.2-blue.svg
[angularjs-url]: https://angularjs.org
[postgresql]: https://img.shields.io/badge/postgresql-9.6.2-blue.svg
[postgresql-url]: https://www.postgresql.org