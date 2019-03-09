# Product Backlog
* [Medium] Rename Purchases, Users
* [Bug] Add new Schedule Item - new preselected values and saving with blanks doesn't display errors
* [Bug] Hamburger menu appears in safe area on iPhone 10+ and is not accessible
* [High] Implement Cypress to replace Protractor and Karma for end-to-end testing
* [Low] Change apple-startup-images to be screenshots for devices. Unless images generated on desktop can match devices, give up.

<a name="1.0.18"></a>
* Renamed Attendances table
* Renamed Orders table
* Renamed Announcements table
* [Bug] New Schedule Item defaults Starts and Ends to current time (including seconds)
* Added constraints for location_id, teacher_id, and class_id
* Dropped title, location, and teacher columns from schedules table
* Updated teacher, location, and title after dropdown has changed (scheduleeditor.controller line 28)
* Fixed server/api/schedule/schedule.controller.js:upsert to use location_id and teacher_id
* Fixed client/app/modules/schedulemanager/scheduleeditor.pug, controller and service to use foreign keys
* Added foreign key contraints to schedules.location_id and teacher_id on Heroku and localhost

<a name="1.0.17"></a>
* Renamed "Schedules" to schedules
* [Bug] Gulp task dist:client:assets:images:icons sometimes fails - moved image into render function
* [Bug] class.service:initialize needed to pass true to classesGet() to only display active
* Dropped daytodate filter and account for timezone changes in schedule
* Added CSV download to Teachers Reimbursement
* [Bug] Classes page intermittently gets a flat schedule
* Added Dashboard with angular-chart.js
* Added iCal to Classes and Workshops (ical-generator)
* Added basic Dashboard to Admin
* Removed 8-class pass option
* Fixed issue with class links
* Switched to sharp for generation of most icons
* Replaced gulp-rev-replace with gulp-rev-rewrite
* Add 12 hours before workshops disappear
* Improved spacing of section fields on workshopeditor.pug
* Removed direct references to services in scheduleditor.pug
* Implemented editing of workshop sections in workshopeditor.pug and controller
* Fixed *editor.controller.js to remove extra variable on save
* Replaced angular.extend with Object.assign()
* Fixed tweet button digest cycle issue
* Cleaned up app.module.js to remove components, etc. that don't need to be directly loaded
* Removed upcoming filter
* Implement workshopsmanager with database back-end
* Replace teachers.json with API call
* Remove nosubs filter
* [Bug] If an existing teacher photo is replaced, delete the old photo when saving.
* /server/api/file implementation
* [Bug] Admin/Announcements - invalid times causes 500 error
* Replaced mocha/chai/karma/sinon with jest
* Ported angularjs-toast to project (ES6 conversion) so it's easier to test
* [Bug] Teachers should not be able to get email, phone, or google in user.controller.js:index()
* Improve login page - validation, separate Google and SHY logins
* Add toast after forgotpassword and message (angularjs-toaster)
* [Bug] usereditor.pug - Teachers should not see phone field.
* Add google field to usereditor.pug and usereditor.controller.js
* [Bug] Prevent usereditor.controller.js from including balance in PUT (upset). Teachers should not sent role, provider, passwordNew, or passwordConfirm

<a name="1.0.16"></a>
* [Bug] login.pug needs to check or required fields
* Remove Buffer.from() in user.controller.js:encryptPassword and reset passwords for local accounts
* Refactor user.controller.js updateUser, update, upsert for DRY and prevent teachers from updating restricted fields (password, role, provider, google)
* [Bug] Connection fails if trying to login as user with a null password (no error message)
* Setup nightly run of zero_old_passes() in PostgreSQL on mac-mini
* Remove all sequelize dependencies 
* Create DDL
* Change user.controller.js:upsert to use createUser()
* [Bug] SendInBlue not sending email - switch to axios
* Remove connect-session-sequelize dependency from /server/config/express.js -> connect-pg-simple

<a name="1.0.15"></a>
* [High] Remove Sequelize dependency from server/auth/local/passport.js and google/passport.js

<a name="1.0.14"></a>
* [Low] Added SendInBlue tags to order emails
* [High] Remove Sequelize from /server/auth/auth.service.js

<a name="1.0.13"></a>
* [High] Extend HistoryService for usermanager.component.js (remove $http from the component)

<a name="1.0.12"></a>
* [Medium] Hook up sendinblue's API send contacts

<a name="1.0.11"></a>
* [High] Intrapage links didn't work because anchors with ids loaded asynchronously - changed to synchronous

<a name="1.0.10"></a>
* Revert from pg 7.2.0 to 6.4.2 and switched sequelize to use native=false to sidestep pg-native issues
* Fix all integration tests
* Add return null to /server/api/auth/google/passport to prevent promise warning

<a name="1.0.9"></a>
* Bump AngularJS, braintree-web, jsonwebtoken, lusca, passport, pg, sequelize, babel-core, babel-loader, babel-register, css-loader, eslint, gulp-babel, gulp-sourcemaps, sinon, sinon-chai, webpack, node

<a name="1.0.7"></a>
* [Medium] Replace express-sequelize-session with node-connect-pg-simple or connect-session-sequelize
* Removed cookie-parser as express-session (since 1.5) no longer needs it
* Updates for node and webpack

<a name="1.0.6"></a>
# [1.0.6](https://github.com/nstuyvesant/shy/commit/d40fe19cdf449f33f05104fdc9ae1d2d839b3574) (2017-03-27)
* Add schedule editing with pick lists bound to JSON files
* Have /classes pull from DB
* Locations page now pulls from JSON file
* Built filters for time, day and trusted resources

<a name="1.0.5"></a>
# [1.0.5](https://github.com/nstuyvesant/shy/commit/755fca80b3d4384046c695707c68cea61698ab4d) (2017-03-25)
* Add announcement admin functionality
* Connect main to announcements in DB

<a name="1.0.4"></a>
# [1.0.4] (https://github.com/nstuyvesant/shy/commit/43fe7c1879ae493dc9e50a7c72a9e2b98a0cf523) (2017-03-19)
* Add routes for add to cart buttons in newsletter
* Resolved issues with administratively creating new users
* Removed dead code in User Model (virtual attributes) and GET /api/user/:id

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
