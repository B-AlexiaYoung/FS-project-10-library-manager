'use strict';
module.exports = (sequelize, DataTypes) => {
  const patrons = sequelize.define('patrons', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    first_name:  {
      type: DataTypes.STRING,
      // validate: {
      //   notEmpty: {
      //     msg: "First name is required"
      //   }
      // }
    },
    last_name:{
      type: DataTypes.STRING,
      // validate: {
      //   notEmpty: {
      //     msg: "Last name is required"
      //   }
      // }
    },
    address:{
      type: DataTypes.STRING,
      // validate: {
      //   notEmpty: {
      //     msg: "Address is required"
      //   }
      // }
    },
    email:{
      type: DataTypes.STRING,
      // validate: {
      //   notEmpty: {
      //     msg: "Email is required"
      //   }
      // }
    },
    library_id:{ 
      type:DataTypes.STRING,
      // validate: {
      //   notEmpty: {
      //     msg: "Library id is required"
      //   }
      // }
    },
    zip_code: {
      type:DataTypes.INTEGER,
    //   validate: {
    //     notEmpty: {
    //       msg: "Zipcode is required"
    //     }
    //   }
     }
  }, {
    // don't add the timestamp attributes (updatedAt, createdAt)
    timestamps: false,
    underscored:true,
    


    
    }
  )
    patrons.associate = function(models) {
    // associations can be defined here
    models.patrons.hasMany(models.loans)
    //models.patrons.hasMany(models.books);

  };
  
  return patrons;
};