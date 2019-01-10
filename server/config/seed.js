/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

import config from './environment/';
import { createUser, deleteUser } from '../api/user/user.controller';

export default async function seedDatabase() {
  if(config.seedDB) { // Only run if enabled
    try {
      await Promise.all([
        deleteUser('email', config.teacher.email),
        deleteUser('email', config.admin.email)
      ]);
      await Promise.all([
        createUser({
          email: config.teacher.email,
          provider: 'local',
          passwordNew: config.teacher.password,
          passwordConfirm: config.teacher.password,
          role: 'teacher',
          firstName: 'SHY',
          lastName: 'Teacher',
          optOut: true,
          phone: '412-401-4444'
        }),
        createUser({
          email: config.admin.email,
          provider: 'local',
          passwordNew: config.admin.password,
          passwordConfirm: config.admin.password,
          role: 'teacher',
          firstName: 'SHY',
          lastName: 'Admin',
          optOut: true,
          phone: '412-401-4444'
        })
      ]);
    } catch(err) {
      console.error('ERROR: /server/config/seed.js:seedDatabase()', err);
    }
  }
}
