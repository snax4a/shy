# Product Backlog
* [High] Fix usage of extract-text-webpack-plugin in webpack.make.js (doesn't generate CSS file)
* [High] Fix new signup component and remove old controller (doesn't create user and test fails)
* [High] Copy Forgot Password functionality from older project
* [High] Add routes for add to cart buttons in newsletter
* [Low] Convert login to component (currently loosely coupled controller)
* [Low] Convert settings to component (ditto)
* [Low] Add method to push newsletters from admin
* [Low] Embed images in order confirmations and newsletters using nodemailer
* [Low] Setup npm start
* [Low] Add toast if there's an error sending email from contact modal
* [Low] Braintree subscription payments for Teacher Training's multiple payments option

<a name="1.0.2"></a>
# [1.0.2](https://github.com/nstuyvesant/shy/commit/42be8bdfa3dac68fea081d63cae1c31a05ef1235) (2017-02-26)
* Updated webpack.make.js, gulpfile.babel.js, package.json, karma.conf.js to support Webpack 2.2.1

<a name="1.0.1"></a>
# [1.0.1](https://github.com/nstuyvesant/shy/commit/88924435e32d8d019bebcb837968451e3a0b67e3) (2017-02-05)
* Refactored admin to become a component
* Bumped morgan to 1.8
