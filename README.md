# Schoolhouse Yoga Website

This yoga school website is built using angularJS 1.5.x, expressJS, and nodeJS (MEAN minus Mongo).
All JavaScript is ES6 via babel. It includes a shopping cart (loosely based on ngCart) and will be processing
payments via Braintree or PayPal PayFlow Pro (haven't decided yet). In order to keep track
of newsletter subscribers, it uses a Google Docs Spreadsheet. Credit card information is
intentionally not retained.

The website is under construction. Most of the work that remains is around completing the billing and
shipping info on the shopping cart and building the server API.

The Angular Fullstack generator for Yeoman was used to scaffold out the initial project. Most of the angularJS
code is ready to move to 2.0.

## Getting Started

### Prerequisites

- [Git](https://git-scm.com/)
- [Node.js and npm](nodejs.org) Node = 6.9.1, npm = 4.0.1
- [Gulp](http://gulpjs.com/) (`npm install --global gulp`)

### Developing

1. Run `npm install` to install server dependencies.

2. Copy /server/config/local.env.sample.js to local.env.js then provide your own credentials. Note: the project will still run if you provide bogus credentials.

3. Run `gulp serve` to start the development server. It should automatically open the client in your browser when ready.

## Build & development

Run `gulp build` for building and `gulp serve` for preview.

## Testing

Running `npm test` will run the unit tests with karma.
