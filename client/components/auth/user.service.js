'use strict';

export function UserResource($resource) {
  'ngInject';

  return $resource('/api/users/:id/:controller', {
    id: '@_id'
  }, {
    upsert: {
      method: 'PUT',
      params: {
        controller: 'upsert'
      }
    },
    update: {
      method: 'PUT',
      params: {
        id: 'me'
      }
    },
    get: {
      method: 'GET',
      params: {
        id: 'me'
      }
    }
  });
}
