/*eslint no-sync:0 object-shorthand:0 */
'use strict';
import { api as sodium } from 'sodium';
import config from '../../config/environment/';
import configShared from '../../config/environment/shared';

let authTypesEnum = configShared.authTypes.slice();
authTypesEnum.push('local');

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

    passwordHash: DataTypes.BLOB, // ByteA - 128 bytes

    password: {
      type: DataTypes.VIRTUAL,
      defaultValue: config.secrets.session,
      set: function(value) {
        if(value.length < 6) throw new Error('Passwords must be between 6 and 20 characters');
        this.setDataValue('passwordHash', this.hashPassword(value));
      },
      validate: {
        len: {
          args: [6, 20],
          msg: 'Passwords must be between 6 and 20 characters'
        }
      }
    },

    lastName: DataTypes.STRING(20), // Maybe add a set: with trim() later
    firstName: DataTypes.STRING(20),

    email: {
      type: DataTypes.STRING(80),
      unique: {
        args: true,
        msg: 'A user with that email address already exists.'
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
      values: authTypesEnum,
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
    indexes: [
      { fields: ['lastName'] },
      { fields: ['firstName'] }
    ]
  };

  let User = sequelize.define('User', attributes, options);

  User.prototype.hashPassword = value => sodium.crypto_pwhash_str(
    Buffer.from(value),
    sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE,
    sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE);

  User.prototype.authenticate = function(passwordToTry, callback) {
    const isValid = sodium.crypto_pwhash_str_verify(
      Buffer.from(this.getDataValue('passwordHash')),
      Buffer.from(passwordToTry));
    return !callback ? isValid : callback(null, isValid);
  };

  return User;
}
