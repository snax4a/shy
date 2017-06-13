/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */
'use strict';
import config from './environment/';
import { User } from '../sqldb';
import Sequelize from 'sequelize';

export default function seedDatabaseIfNeeded() {
  if(config.seedDB) { // Only run if enabled
    return Sequelize.Promise.all([
      User.destroy({
        where: {
          $or: [
            { email: {$eq: config.teacher.email} },
            { email: {$eq: config.admin.email} },
            { email: {$eq: 'leta@schoolhouseyoga.com'} },
            { email: {$eq: 'nstuyvesant@gmail.com'} }
          ]
        }
      })
        .then(() =>
          User.bulkCreate([
            {
              provider: 'local',
              role: 'teacher',
              firstName: 'SHY',
              lastName: 'Teacher',
              email: config.teacher.email,
              optOut: true,
              phone: '412-401-4444',
              password: config.teacher.password
            }, {
              provider: 'local',
              role: 'admin',
              firstName: 'SHY',
              lastName: 'Admin',
              email: config.admin.email,
              optOut: true,
              phone: '412-401-4444',
              password: config.admin.password
            }, {
              provider: 'google',
              role: 'admin',
              firstName: 'Leta',
              lastName: 'Koontz',
              email: 'leta@schoolhouseyoga.com',
              phone: '412-260-5555',
              password: config.secrets.session,
              optOut: true,
              google: {
                kind: 'plus#person',
                etag: '"1qbqD04eP9-SRJUBAhcE_i06Pdo/PmcuXgx7RlklsYiXtyvzemyuT8c"',
                emails: [
                  {
                    value: 'leta@schoolhouseyoga.com',
                    type: 'account'
                  }
                ],
                objectType: 'person',
                id: '118198795421061419948',
                displayName: 'Leta Koontz',
                name: {
                  familyName: 'Koontz',
                  givenName: 'Leta'
                },
                image: {
                  url: 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg?sz=50',
                  isDefault: true
                },
                isPlusUser: false,
                language: 'en',
                verified: false,
                domain: 'schoolhouseyoga.com'
              }
            }, {
              provider: 'google',
              role: 'admin',
              firstName: 'Nate',
              lastName: 'Stuyvesant',
              email: 'nstuyvesant@gmail.com',
              password: config.secrets.session,
              optOut: true,
              phone: '412-486-5555',
              google: {
                kind: 'plus#person',
                etag: '"i9aZP8TD8jXVPIxD0T0PWsMRx6s/_WSI4SrGV82nrOGZg6J-mnmvxng"',
                emails: [
                  {
                    value: 'nstuyvesant@gmail.com',
                    type: 'account'
                  }
                ],
                objectType: 'person',
                id: '112296075205869170151',
                displayName: 'Nate Stuyvesant',
                name: {
                  familyName: 'Stuyvesant',
                  givenName: 'Nate'
                },
                url: 'https://plus.google.com/112296075205869170151',
                image: {
                  url: 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg?sz=50',
                  isDefault: true
                },
                isPlusUser: true,
                language: 'en',
                circledByCount: 3,
                verified: false,
              }
            }
          ])
            .then(() => console.log('Seeded users'))) /*,

      Announcement.destroy({
        where: {
          $and: [
            { section: {$eq: 'Sunday, April 16th Class Schedule'} },
            { title: {$eq: 'East Liberty School'} }
          ]
        }
      })
      .then(() =>
        Announcement.bulkCreate([
          {
            section: 'Sunday, April 16th Class Schedule',
            title: 'East Liberty School',
            description: '- all classes running as scheduled',
            expires: '2017-04-30T00:00:00.000-05:00'
          }
        ])
      )
      .then(() => console.log('Seeded announcements')) */
    ])
      .then(() => console.log('Seeded database.'))
      .catch(err => console.log('Seeding error: ', err));
  }
}
