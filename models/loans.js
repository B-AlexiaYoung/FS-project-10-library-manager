'use strict';
module.exports = (sequelize, DataTypes) => {
  const loans = sequelize.define('loans', {
    id: {type: DataTypes.INTEGER,
       primaryKey: true,
      },
    book_id:{type: DataTypes.INTEGER, allowNull:false},
    patron_id: {
      type: DataTypes.INTEGER,
      allowNull:false,


      validate: {
        notEmpty: {
          msg: "Patron id is required"
        }
      }
      
    },
    loaned_on: {
      type:DataTypes.DATE,
      allowNull:false,
      // validate: {
      //   notEmpty: {
      //     msg: "Loaned on  is required"
      //   }
      // }
    },
    return_by:{
      type: DataTypes.DATE,  
      allowNull:false,
      // validate: {
      //   notEmpty: {
      //     msg: "Return by is required"
      //   }
      // }
    },
    returned_on: {
      type:DataTypes.DATE,  
      },
  }, {
    // don't add the timestamp attributes (updatedAt, createdAt)
    timestamps: false,
    underscored:true
  }
  );

  loans.associate = function(models) {
    // associations can be defined here
   models.loans.belongsTo(models.books);
   models.loans.belongsTo(models.patrons);
  };
  return loans;
};