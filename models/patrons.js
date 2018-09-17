'use strict';
module.exports = (sequelize, DataTypes) => {
  const patrons = sequelize.define('patrons', {
    id: {type: DataTypes.INTEGER, primaryKey: true},
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    address: DataTypes.STRING,
    email: DataTypes.STRING,
    library_id: DataTypes.STRING,
    zip_code: DataTypes.INTEGER
  }, {
    // don't add the timestamp attributes (updatedAt, createdAt)
    timestamps: false}
  );
  patrons.associate = function(models) {
    // associations can be defined here
  };
  return patrons;
};