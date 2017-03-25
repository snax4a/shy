# Product Backlog
* [High] Admin page - delete announcement
* [High] Admin page - edit announcement
* [High] Admin page - add announcment
* [Medium] api/announcement/index.js - fix auth
* [High] Build SHYnet page
* [Low] Build order.model.spec.js test
* [Low] Add method to push newsletters from admin
* [Low] Embed images in order confirmations and newsletters using nodemailer
* [Low] Add toast if there's an error sending email from contact modal
* [Low] Braintree subscription payments for Teacher Training's multiple payments option

<a name="1.0.4"></a>
# [1.0.4] (https://github.com/nstuyvesant/shy/commit/43fe7c1879ae493dc9e50a7c72a9e2b98a0cf523) (2017-03-19)
* [High] Add routes for add to cart buttons in newsletter
* Resolved issues with administratively creating new users
* Removed dead code in User Model (virtual attributes) and GET /api/users/:id

<a name="1.0.3"></a>
# [1.0.3](https://github.com/nstuyvesant/shy/commit/7a08eda14c4b45400f5a2eb712d09737b4b0f187) (2017-03-05)
* Updated all forms to use ngMessages
* Turned login, profile and signup into angularJS components, adjusted server API
* For contact form, prefill fields if user is logged in

<a name="1.0.2"></a>
# [1.0.2](https://github.com/nstuyvesant/shy/commit/42be8bdfa3dac68fea081d63cae1c31a05ef1235) (2017-02-26)
* Updated webpack.make.js, gulpfile.babel.js, package.json, karma.conf.js to support Webpack 2.2.1

<a name="1.0.1"></a>
# [1.0.1](https://github.com/nstuyvesant/shy/commit/88924435e32d8d019bebcb837968451e3a0b67e3) (2017-02-05)
* Refactored admin to become a component
* Bumped morgan to 1.8
