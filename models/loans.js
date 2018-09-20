'use strict';
module.exports = (sequelize, DataTypes) => {
  const loans = sequelize.define('loans', {
    id: {type: DataTypes.INTEGER, primaryKey: true,  allowNull:false},
    book_id:{type: DataTypes.INTEGER, allowNull:false},
    patron_id: {type: DataTypes.INTEGER, allowNull:false},
    loaned_on: {type:DataTypes.DATE,  allowNull:false},
    return_by:{type: DataTypes.DATE,  allowNull:false},
    returned_on: {type:DataTypes.DATE,  allowNull:false},
  }, {
    // don't add the timestamp attributes (updatedAt, createdAt)
    timestamps: false}
  );

  loans.associate = function(models) {
    // associations can be defined here
   models.loans.belongsTo(models.books)
  };
  return loans;
};