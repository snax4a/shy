export function UserResource($resource) {
  'ngInject';

  return $resource('/api/user/:id/:controller', {
    id: '@_id'
  }, {
    forgotPassword: {
      method: 'POST',
      params: {
        controller: 'forgotpassword'
      }
    },
    get: {
      method: 'GET',
      params: {
        id: 'me'
      }
    },
    update: {
      method: 'PUT'
    },
    upsert: {
      method: 'PUT',
      params: {
        controller: 'admin'
      }
    }
  });
}
