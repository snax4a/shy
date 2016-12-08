# Schoolhouse Yoga Website

Schoolhouse Yoga's website is built using AngularJS (1.5.x), Express, Node.js, and PostgreSQL. It provides
a home page, class schedule, workshop information, teachers' page, method to contact
the school and a shopping cart tied to a payment gateway.

The website is under construction. What remains is implementing the payment gateway.

## Getting Started

### Prerequisites

- [Git](https://git-scm.com/) (on macOS `brew install git`)
- [Node.js 6.9.1 and npm 4.0.5](nodejs.org) (`brew install node@6`) - Node 7 support will require Gulp 4.0 (because of graceful-fs dependency)
- [PostgreSQL](http://postgresql.org) (`brew install postgresql`)
- [pgAdmin3](http://postgresql.org) (`brew cask install Caskroom/versions/pgadmin3`)
- Get a free [Heroku](http://heroku.com) account and install the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)

### Project setup

1. Make sure prerequisites are installed for your operating system (commands above are mostly for macOS)

2. Run `npm install` to install server dependencies.

3. Copy /server/config/local.env.sample.js to local.env.js then provide your own credentials. At the moment, the SMTP_ and SEQUELIZE_URI parameters need to be set.

4. Start PostgreSQL on your local computer (on macOS `brew services start postgresql`).

4. Open pgAdmin and connect to localhost.

5. Create a database called `shy` then adjust the DATABASE_URL in local.env.js to add your credentials and connect to this database.

## Running tests, creating builds & deploying to Heroku

1. Run `npm test` to execute unit, integration and client tests. Ignore the Error: EACCES: permission denied, mkdir '/client' - Karma seems to be trying to create a directory off of root.

1. Run `gulp build` to create a build in the /dist directory.

2. Run `gulp serve` to start the server locally. Make sure PostgreSQL is running.

3. Run `gulp buildcontrol:heroku` if you are deploying to Heroku and have a Herok account and CLI installed.
