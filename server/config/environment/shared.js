// Used by ./index.js, server/api/user/user.model.js and client/app/app.constants.js
export default {
  // List of user roles - order is important for auth.hasRole() as it looks for roles that are >=
  userRoles: ['student', 'teacher', 'admin'],

  // List of providers (less local)
  authTypes: ['google']
};
