'use strict';
import { User } from '../../sqldb';
export default function(sequelize, DataTypes) {
  const attributes = {
    _id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    // userId: {
    //   type: DataTypes.INTEGER,
    //   references: {
    //     model: User,
    //     key: '_id',
    //     deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
    //   }
    // },

    quantity: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: true
      }
    },

    // Intentionally not normalized as a separate table
    // Payment methods change from time to time - too much of an admin hassle
    method: {
      type: DataTypes.STRING(16),
      validate: {
        notEmpty: true
      }
    },

    notes: {
      type: DataTypes.STRING(256)
    }
  };

  const options = {
    indexes: [
      { fields: [/*'userId', */'createdAt'] }
    ]
  };

  let Purchase = sequelize.define('Purchase', attributes, options);
  //Purchase.belongsTo(User);

  return Purchase;
}
