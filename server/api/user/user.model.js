/*eslint no-sync:0*/
'use strict';

import crypto from 'crypto';
import config from '../../config/environment/';
import configShared from '../../config/environment/shared';

let authTypes = configShared.authTypes;
let authTypesEnum = configShared.authTypes.slice();
authTypesEnum.push('local');

let validatePresenceOf = value => value && value.length;

export default function(sequelize, DataTypes) {
  let User = sequelize.define('User', {
    _id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    role: {
      type: DataTypes.ENUM,
      values: configShared.userRoles,
      defaultValue: 'student',
      validate: {
        notEmpty: true
      }
    },
    lastName: DataTypes.STRING(20),
    firstName: DataTypes.STRING(20),
    email: {
      type: DataTypes.STRING(80),
      unique: {
        msg: 'The specified email address is already in use.'
      },
      validate: {
        isEmail: true,
        notEmpty: true
      }
    },
    optOut: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    phone: DataTypes.STRING(23),
    password: {
      type: DataTypes.STRING(684),
      validate: {
        notEmpty: true // when using Google integrated authentication, the password is empty
      }
    },
    salt: DataTypes.STRING(24),
    provider: {
      type: DataTypes.ENUM,
      values: authTypesEnum,
      defaultValue: 'local',
      validate: {
        notEmpty: true
      }
    },
    // facebook: DataTypes.JSON,
    // twitter: DataTypes.JSON,
    google: DataTypes.JSON
  }, {

    indexes: [
      { fields: ['email'] },
      { fields: ['lastName'] },
      { fields: ['firstName'] }
    ],
    /**
     * Virtual Getters
     */
    getterMethods: {
      // Public profile information
      profile() {
        return {
          firstName: this.firstName,
          lastName: this.lastName,
          role: this.role
        };
      },

      // Non-sensitive info we'll be putting in the token
      token() {
        return {
          _id: this._id,
          role: this.role
        };
      }
    },

    /**
     * Pre-save hooks
     */
    hooks: {
      beforeBulkCreate(users, fields, fn) {
        let totalUpdated = 0;
        users.forEach(user => {
          user.updatePassword(err => {
            if(err) {
              return fn(err);
            }
            totalUpdated += 1;
            if(totalUpdated === users.length) {
              return fn();
            }
          });
        });
      },
      beforeCreate(user, fields, fn) {
        user.updatePassword(fn);
      },
      beforeUpdate(user, fields, fn) {
        if(user.changed('password')) {
          return user.updatePassword(fn);
        }
        fn();
      },
      beforeUpsert(user, fields, fn) {
        if(!user.password) {
          user.password = config.secrets.session;
          return user.updatePassword(fn);
        }
        if(user.changed('password')) {
          return user.updatePassword(fn);
        }
        fn();
      }
    },

    /**
     * Instance Methods
     */
    instanceMethods: {
      /**
       * Authenticate - check if the passwords are the same
       *
       * @param {String} password
       * @param {Function} callback
       * @return {Boolean}
       * @api public
       */
      authenticate(password, callback) {
        if(!callback) {
          return this.password === this.encryptPassword(password);
        }

        let that = this;
        this.encryptPassword(password, function(err, pwdGen) {
          if(err) {
            return callback(err);
          }

          if(that.password === pwdGen) {
            return callback(null, true);
          } else {
            return callback(null, false);
          }
        });
      },

      /**
       * Make salt
       *
       * @param {Number} [byteSize] - Optional salt byte size, default to 16
       * @param {Function} callback
       * @return {String}
       * @api public
       */
      makeSalt(byteSize, callback) {
        var defaultByteSize = 16;

        if(typeof arguments[0] === 'function') {
          callback = arguments[0];
          byteSize = defaultByteSize;
        } else if(typeof arguments[1] === 'function') {
          callback = arguments[1];
        } else {
          throw new Error('Missing Callback');
        }

        if(!byteSize) {
          byteSize = defaultByteSize;
        }

        return crypto.randomBytes(byteSize, function(err, salt) {
          if(err) {
            return callback(err);
          }
          return callback(null, salt.toString('base64'));
        });
      },

      /**
       * Encrypt password
       *
       * @param {String} password
       * @param {Function} callback
       * @return {String}
       * @api public
       */
      encryptPassword(password, callback) {
        if(!password || !this.salt) {
          return callback ? callback(null) : null;
        }

        const defaultIterations = 10000;
        const defaultKeyLength = 512;
        const salt = new Buffer(this.salt, 'base64');
        const digest = 'sha512';

        if(!callback) { // Only use synchronous method if no callback
          return crypto.pbkdf2Sync(password, salt, defaultIterations, defaultKeyLength, digest).toString('base64');
        }

        return crypto.pbkdf2(password, salt, defaultIterations, defaultKeyLength, digest,
          (err, key) => {
            if(err) {
              return callback(err);
            }
            return callback(null, key.toString('base64'));
          });
      },

      /**
       * Update password field
       *
       * @param {Function} fn
       * @return {String}
       * @api public
       */
      updatePassword(fn) {
        // Handle new/update passwords
        if(!this.password) return fn(null);

        if(!validatePresenceOf(this.password) && authTypes.indexOf(this.provider) === -1) {
          fn(new Error('Invalid password'));
        }

        // Make salt with a callback
        this.makeSalt((saltErr, salt) => {
          if(saltErr) {
            return fn(saltErr);
          }
          this.salt = salt;
          this.encryptPassword(this.password, (encryptErr, hashedPassword) => {
            if(encryptErr) {
              fn(encryptErr);
            }
            this.password = hashedPassword;
            fn(null);
          });
        });
      }
    }
  });

  return User;
}
