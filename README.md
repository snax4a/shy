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
- [Node.js 8.2.1 and npm 5.3.0](nodejs.org) (`brew install node`)
- [PostgreSQL 9.6.3](http://postgresql.org) (`brew install postgresql`)
- [pgAdmin4](https://www.postgresql.org/download/)
- [Chrome >= 59] (`brew install Caskroom/versions/google-chrome`) - used for headless testing
- To compile [node-sodium](https://github.com/paixaop/node-sodium), (`brew install libtool autoconf automake`)
- Get a free [Heroku](http://heroku.com) account and install the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
- Get a [Braintree](https://www.braintreepayments.com/sandbox) Sandbox account

### Project setup

1. Make sure prerequisites are installed for your operating system (commands above are mostly for macOS). Remove any Chrome versions older than 59 or client testing will not work.

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

4. Run `gulp deploy` if you are deploying to Heroku and have a Heroku account with the CLI installed. This will push the contents of /dist up to Heroku using git.

[express]: https://img.shields.io/badge/expressjs-4.15.3-blue.svg
[express-url]: http://expressjs.com
[angularjs]: https://img.shields.io/badge/angularjs-1.6.5-red.svg
[angularjs-url]: https://angularjs.org
[node]: https://img.shields.io/badge/nodejs-8.2.1-green.svg
[node-url]: https://nodejs.org
[postgresql]: https://img.shields.io/badge/postgresql-9.6.3-blue.svg
[postgresql-url]: https://www.postgresql.org