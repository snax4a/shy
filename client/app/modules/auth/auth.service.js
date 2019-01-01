/* eslint no-sync:0 */
'use strict';

class _User {
  constructor() {
    this._id = '';
    this.firstName = '';
    this.lastName = '';
    this.email = '';
    this.role = '';
    this.optOut = false;
    this.$promise = undefined;
  }
}

export function AuthService($location, $http, $cookies, $q, appConfig, Util, User) {
  'ngInject';

  let safeCb = Util.safeCb;
  let currentUser = new _User();
  let userRoles = appConfig.userRoles || [];
  /**
   * Check if userRole is >= role
   * @param {String} userRole - role of current user
   * @param {String} role - role to check against
   */
  let hasRole = (userRole, role) => userRoles.indexOf(userRole) >= userRoles.indexOf(role);

  if($cookies.get('token') && $location.path() !== '/logout') {
    currentUser = User.get();
  }

  let Auth = {
    /**
     * Authenticate user and save token
     *
     * @param  {Object}   user     - login info
     * @param  {Function} callback - function(error, user)
     * @return {Promise}
     */
    login({
      email,
      password
    }, callback) {
      return $http.post('/auth/local', {
        email,
        password
      })
        .then(res => {
          $cookies.put('token', res.data.token);
          currentUser = User.get();
          return currentUser.$promise;
        })
        .then(user => {
          safeCb(callback)(null, user);
          return user;
        })
        .catch(err => {
          Auth.logout();
          safeCb(callback)(err.data);
          return $q.reject(err.data);
        });
    },

    /**
     * Delete access token and user info
     */
    logout() {
      $cookies.remove('token');
      currentUser = new _User();
    },

    /**
     * Create a new user
     *
     * @param  {Object}   user     - user info
     * @param  {Function} callback - function(error, user)
     * @return {Promise}
     */
    createUser(user, callback) {
      return User.save(user, data => {
        $cookies.put('token', data.token);
        currentUser = User.get();
        return safeCb(callback)(null, user);
      }, err => {
        Auth.logout();
        return safeCb(callback)(err);
      })
        .$promise;
    },

    /**
     * Update Profile
     *
     * @param  {User}   user
     * @param  {Function} callback - function(error, user) - isn't it the reverse?
     * @return {Promise}
     */
    update(user, callback) {
      return User.update({id: currentUser._id}, user, () => safeCb(callback)(null), err => safeCb(callback)(err))
        .$promise
        .then(() => { // force update
          currentUser = User.get();
        });
    },

    /**
     * Gets all available info on a user
     *
     * @param  {Function} [callback] - function(user)
     * @return {Promise}
     */
    getCurrentUser(callback) {
      // let value = get(currentUser, '$promise') ? currentUser.$promise : currentUser;
      let value = currentUser.$promise ? currentUser.$promise : currentUser;

      return $q.when(value)
        .then(user => {
          safeCb(callback)(user);
          return user;
        }, () => {
          safeCb(callback)({});
          return {};
        });
    },

    /**
     * Gets all available info on a user
     *
     * @return {Object}
     */
    getCurrentUserSync() {
      return currentUser;
    },

    /**
     * Check if a user is logged in
     *
     * @param  {Function} [callback] - function(is)
     * @return {Promise}
     */
    isLoggedIn(callback) {
      return Auth.getCurrentUser(undefined)
        .then(user => {
          //let is = get(user, 'role');
          let is = user.role; // should we return the object or a copy?
          safeCb(callback)(is);
          return is;
        });
    },

    /**
     * Check if a user is logged in
     *
     * @return {Bool}
     */
    isLoggedInSync() {
      //return !!get(currentUser, 'role');
      return !!currentUser.role;
    },

    /**
     * Check if a user has a specified role or higher
     *
     * @param  {String}     role     - the role to check against
     * @param  {Function} [callback] - function(has)
     * @return {Promise}
     */
    hasRole(role, callback) {
      return Auth.getCurrentUser(undefined)
        .then(user => {
          //let has = hasRole(get(user, 'role'), role);
          let has = hasRole(user.role, role);
          safeCb(callback)(has);
          return has;
        });
    },

    /**
     * Check if a user has a specified role or higher
     *
     * @param  {String} role - the role to check against
     * @return {Bool}
     */
    hasRoleSync(role) {
      //return hasRole(get(currentUser, 'role'), role);
      return hasRole(currentUser.role, role);
    },

    /**
     * Check if a user is an admin
     *
     * @return {Bool}
     */
    isAdminSync() {
      return Auth.hasRoleSync('admin');
    },

    isAdminOrTeacherSync() {
      return Auth.hasRoleSync('teacher') || Auth.isAdminSync();
    },

    /**
     * Get auth token
     *
     * @return {String} - a token string used for authenticating
     */
    getToken() {
      return $cookies.get('token');
    }
  };

  return Auth;
}
