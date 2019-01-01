export default {
  // List of user roles - order is important for auth.hasRole() as it looks for roles that are >=
  // Used by server/auth/auth.service.js, server/api/user/user.model.js and client/app/modules/auth/auth.service.js
  userRoles: ['student', 'teacher', 'admin'],

  // List of providers (less local)
  // Used by server/api/user/user.model.js
  authTypes: ['google']
};
