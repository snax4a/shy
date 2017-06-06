'use strict';

export function UserResource($resource) {
  'ngInject';

  return $resource('/api/users/:id/:controller', {
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
    },
    addClasses: {
      method: 'PUT',
      params: {
        controller: 'classes'
      }
    }
  });
}
