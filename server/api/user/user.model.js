/*eslint no-sync:0 object-shorthand:0 */

import crypto from 'crypto';
import configShared from '../../config/environment/shared';

const validatePresenceOf = value => value && value.length;

let authTypes = configShared.authTypes.slice();
authTypes.push('local');

export default function(sequelize, DataTypes) {
  const attributes = {
    _id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    role: {
      type: DataTypes.ENUM,
      values: configShared.userRoles,
      defaultValue: 'student',
      validate: {
        notEmpty: {
          args: true,
          msg: 'Role must be specified'
        }
      }
    },

    password: {
      type: DataTypes.STRING(88),
      validate: {
        notEmpty: true
      }
    },
    salt: DataTypes.STRING(24),

    lastName: DataTypes.STRING(20), // Maybe add a set: with trim() later
    firstName: DataTypes.STRING(20),

    email: {
      type: DataTypes.STRING(80),
      unique: {
        args: true,
        msg: 'A user with that email address already exists.'
      },
      set: function(val) {
        this.setDataValue('email', val.toLowerCase());
      },
      validate: {
        isEmail: {
          args: true,
          msg: 'Please provide a valid email address'
        }
      }
    },

    optOut: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },

    phone: DataTypes.STRING(23),

    provider: {
      type: DataTypes.ENUM,
      values: authTypes,
      defaultValue: 'local',
      validate: {
        notEmpty: {
          args: true,
          msg: 'The authentication provider is required'
        }
      }
    },
    // facebook: DataTypes.JSON,
    // twitter: DataTypes.JSON,
    google: DataTypes.JSON
  };

  // The only options we're setting are indexes
  const options = {
    classMethods: {
      associate: function(models) {
        User.hasMany(models.Purchase);
        User.hasMany(models.Attendance);
      }
    },
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
    // Pre-save hooks (options param required)
    hooks: {
      beforeBulkCreate: (users, options) => {
        let promises = [];
        users.forEach(user => promises.push(user.updatePassword()));
        return Promise.all(promises);
      },
      beforeCreate: (user, options) => user.updatePassword(),
      beforeUpdate: (user, options) => {
        if(user.changed('password')) {
          return user.updatePassword();
        }
        return Promise.resolve(user);
      }
    },
    indexes: [
      { fields: ['lastName'] },
      { fields: ['firstName'] }
    ]
  };

  let User = sequelize.define('User', attributes, options);

  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} password
   * @param {Function} callback
   * @return {Boolean}
   * @api public
   */
  User.prototype.authenticate = function(password, callback) {
    if(!callback) {
      return this.password === this.encryptPassword(password);
    }

    var _this = this;
    this.encryptPassword(password, function(err, pwdGen) {
      if(err) {
        return callback(err);
      }

      if(_this.password === pwdGen) {
        return callback(null, true);
      } else {
        return callback(null, false);
      }
    });
  };

  /**
   * Make salt
   *
   * @param {Number} [byteSize] - Optional salt byte size, default to 16
   * @param {Function} callback
   * @return {String}
   * @api public
   */
  User.prototype.makeSalt = function(...args) {
    let byteSize;
    let callback;
    let defaultByteSize = 16;

    if(typeof args[0] === 'function') {
      callback = args[0];
      byteSize = defaultByteSize;
    } else if(typeof args[1] === 'function') {
      callback = args[1];
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
  };

  /**
   * Encrypt password
   *
   * @param {String} password
   * @param {Function} callback
   * @return {String}
   * @api public
   */
  User.prototype.encryptPassword = function(password, callback) {
    if(!password || !this.salt) {
      return callback ? callback(null) : null;
    }

    var defaultIterations = 10000;
    var defaultKeyLength = 64;
    var salt = Buffer.from(this.salt, 'base64');

    if(!callback) {
      return crypto.pbkdf2Sync(password, salt, defaultIterations, defaultKeyLength, 'sha256')
        .toString('base64');
    }

    return crypto.pbkdf2(password, salt, defaultIterations, defaultKeyLength, 'sha256',
      function(err, key) {
        if(err) {
          return callback(err);
        }
        return callback(null, key.toString('base64'));
      });
  };

  /**
   * Update password field
   *
   * @param {Function} fn
   * @return {String}
   * @api public
   */
  User.prototype.updatePassword = function() {
    return new Promise((resolve, reject) => {
      if(!this.password) {
        return resolve(this);
      }

      if(!validatePresenceOf(this.password) && authTypes.indexOf(this.provider) === -1) {
        return reject(new Error('Invalid password'));
      }

      // Make salt with a callback
      return this.makeSalt((saltErr, salt) => {
        if(saltErr) {
          return reject(saltErr);
        }
        this.salt = salt;
        return this.encryptPassword(this.password, (encryptErr, hashedPassword) => {
          if(encryptErr) {
            return reject(encryptErr);
          }
          this.password = hashedPassword;
          return resolve(this);
        });
      });
    });
  };

  return User;
}
