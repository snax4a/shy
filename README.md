[![postgresql][postgresql]][postgresql-url]
[![express][express]][express-url]
[![angularjs][angularjs]][angularjs-url]
[![node][node]][node-url]

# Schoolhouse Yoga Website

Schoolhouse Yoga's website provides a home page, class schedule, workshop information, teachers' page,
method to contact the school and a shopping cart tied to the Braintree payment gateway. This
implementation uses Braintree for credit card and Apple Pay forms of payment.

## Getting Started

### Prerequisites

- [Git](https://git-scm.com/) (on macOS `brew install git`)
- [Node.js 10.15.0 and npm 6.5.0](nodejs.org) (`brew install node@10`)
- [PostgreSQL 11.1.0](http://postgresql.org) (`brew install postgresql`)
- [pgAdmin4](https://www.postgresql.org/download/)
- [Chrome >= 62] (`brew install Caskroom/versions/google-chrome`) - used for headless testing
- Get a free [Heroku](http://heroku.com) account and install the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
- Get a [Braintree](https://www.braintreepayments.com/sandbox) Sandbox account

### Project setup

1. Make sure prerequisites are installed for your operating system (commands above are mostly for macOS). Remove any Chrome versions older than 59 or client testing will not work.

2. Run `git clone https://github.com/nstuyvesant/shy.git` then connect to the /shy directory.

3. Run `npm install -g gulp` to install Gulp.

4. Run `npm install` to install server dependencies.

5. Copy /server/config/local.env.sample.js to local.env.js then provide your own credentials. At the moment, the SMTP_ and SEQUELIZE_URI parameters need to be set. If you want to process orders, the BRAINTREE parameters will also need correct values.

6. Start PostgreSQL on your local computer (on macOS `brew services start postgresql`).

7. Open pgAdmin and connect to localhost.

8. Create a database called `shy` then adjust the DATABASE_URL in local.env.js to set the URI with your credentials for this database.

## Running tests, creating builds & deploying to Heroku

1. Run `gulp coverage:unit` or `gulp coverage:integration` to evaluate testing coverage.

2. Run `gulp test` to execute unit, integration and UI tests. The UI tests still need to be built and there are data dependencies in the integration tests that need to be uncoupled.

3. Run `gulp build` to create a build in the /dist directory. Connect to the /dist directory then type `git init` then define Heroku as the remote repo with `heroku git:remote -a APPNAME'.

4. Run `gulp serve` to start the server locally. Make sure PostgreSQL is running.

5. Run `gulp deploy` if you are deploying to Heroku and have a Heroku account with the CLI installed. This will push the contents of /dist up to Heroku using git.

[express]: https://img.shields.io/badge/expressjs-4.16.4-blue.svg
[express-url]: http://expressjs.com
[angularjs]: https://img.shields.io/badge/angularjs-1.7.5-red.svg
[angularjs-url]: https://angularjs.org
[node]: https://img.shields.io/badge/nodejs-10.15.0-green.svg
[node-url]: https://nodejs.org
[postgresql]: https://img.shields.io/badge/postgresql-11.1.0-blue.svg
[postgresql-url]: https://www.postgresql.org