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
    timestamps: false,
    underscored:true,

    // hooks:{ beforeCreate: (patrons)=>{
    //   patrons.full_name = `${patrons.first_name}` `${patrons.last_name}`
    }
  
  
  );
  patrons.associate = function(models) {
    // associations can be defined here
    models.patrons.hasMany(models.loans)
  };
  return patrons;
};