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
    attendanceAdd: {
      method: 'PUT',
      params: {
        controller: 'attendance'
      }
    },
    attendanceDelete: {
      method: 'DELETE',
      params: {
        controller: 'attendance'
      }
    },
    classAdd: {
      method: 'PUT',
      params: {
        controller: 'classes'
      }
    },
    history: {
      method: 'GET',
      isArray: true,
      params: {
        controller: 'history'
      }
    },
    historyItemDelete: {
      method: 'DELETE',
      params: {
        controller: 'history'
      }
    }
  });
}
