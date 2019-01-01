export default function(sequelize, DataTypes) {
  const attributes = {
    _id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    section: {
      type: DataTypes.STRING(100),
      validate: {
        notEmpty: true
      }
    },

    title: {
      type: DataTypes.STRING(100),
      validate: {
        notEmpty: true
      }
    },

    description: {
      type: DataTypes.STRING(512),
      validate: {
        notEmpty: true
      }
    },

    expires: {
      type: DataTypes.DATE,
      validate: {
        notEmpty: true
      }
    }
  };

  const options = {
    indexes: [
      { fields: ['expires'] },
      { fields: ['section', 'title'] }
    ]
  };

  let Announcement = sequelize.define('Announcement', attributes, options);

  return Announcement;
}
