'use strict';

exports = module.exports = {
  // List of user roles - order is important for auth.hasRole() as it looks for roles that are >=
  userRoles: ['student', 'teacher', 'admin'],

  // List of providers (less local)
  authTypes: ['twitter', 'facebook', 'google']
};
