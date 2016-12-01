# Schoolhouse Yoga Website

This yoga school website is built using angularJS 1.5.8, expressJS, and nodeJS (MEAN w/o Mongo).
All JavaScript is ES6 via Babel. It includes a shopping cart (loosely based on ngCart) and will be processing
payments via Braintree or PayPal PayFlow Pro (haven't decided yet). In order to keep track
of newsletter subscribers, we'll either use PostgreSQL or a Google Docs Spreadsheet. Credit card information is
intentionally not retained.

The website is under construction. What remains is storing subscriber contact info and implementing the payment
gateway.

The Angular Fullstack generator for Yeoman was used to scaffold out the initial project. The angularJS
components are ready for migration to 2.0.

## Getting Started

### Prerequisites

- [Git](https://git-scm.com/) (`brew install git`)
- [Node.js and npm](nodejs.org) Node = 6.9.1, npm = 4.0.1 (`brew install node`)
- [Gulp](http://gulpjs.com/) (`npm install --global gulp`)
- [Sass](http://sass-lang.com) (`gem install sass`)

### Developing

1. Make sure prerequisites are installed for your operating system.

2. Run `npm install` to install server dependencies.

3. Copy /server/config/local.env.sample.js to local.env.js then provide your own credentials. At the moment, only the SMTP parameters need to be set.

4. Run `gulp serve` to start the development server. It should automatically open the client in your browser when ready.

## Build & development

Run `gulp build` for building and `gulp serve` for preview.

## Testing

Running `npm test` will run the unit and integration tests.
