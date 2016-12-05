# Schoolhouse Yoga Website

This yoga school website is built using angularJS 1.5.9, expressJS, and nodeJS (MEAN minus Mongo plus PostgreSQL).
All JavaScript is ES6 via Babel. It includes a shopping cart (loosely based on ngCart) and will be processing
payments via Braintree or PayPal PayFlow Pro (haven't decided yet). In order to keep track
of newsletter subscribers, it uses PostgreSQL as a database. Credit card information is
intentionally not retained.

The website is under construction. What remains is storing subscriber contact info and implementing the payment
gateway.

The Angular Fullstack generator for Yeoman was used to scaffold out the initial project. The angularJS
components are ready for migration to 2.0. Support for node > 7 is waiting on Gulp 4.0.

## Getting Started

### Prerequisites

- [Git](https://git-scm.com/) (on macOS `brew install git`)
- [Node.js 6.9.1 and npm 4.0.x](nodejs.org) (`brew install homebrew/versions/node6-lts`)
- [Gulp](http://gulpjs.com/) (`npm install --global gulp`)
- [PostgreSQL](http://postgresql.org) (`brew install postgresql`)
- [pgAdmin3](http://postgresql.org) (`brew cask install Caskroom/versions/pgadmin3`)

### Project setup

1. Make sure prerequisites are installed for your operating system (commands above are mostly for macOS)

2. Run `npm install` to install server dependencies.

3. Copy /server/config/local.env.sample.js to local.env.js then provide your own credentials. At the moment, only the SMTP parameters need to be set.

4. Start PostgreSQL on your local computer (on macOS `brew services start postgresql`).

4. Open pgAdmin and connect to localhost.

5. Create a database called `shy` the adjust the SEQUELIZE_URI in local.env.js to connect to this database.

## Running tests, creating builds & deploying to Heroku

1. Run `npm test` to execute unit, integration and client tests. Ignore the Error: EACCES: permission denied, mkdir '/client' - Karma seems to be trying to create a directory off of root.

1. Run `gulp build` to create a build in the /dist directory.

2. Run `gulp serve` to start the server locally. Make sure PostgreSQL is running.

3. Run `gulp buildcontrol:heroku` if you are deploying to Heroku and have the Heroku CLI installed.


