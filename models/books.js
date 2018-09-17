'use strict';
module.exports = (sequelize, DataTypes) => {
  const books = sequelize.define('books', {
    id: {type: DataTypes.INTEGER, primaryKey: true},
    title: {DataTypes.STRING},
    author:{DataTypes.STRING},
    genre: {DataTypes.STRING},
    first_published: {DataTypes.INTEGER}
  }, {
    // don't add the timestamp attributes (updatedAt, createdAt)
    timestamps: false}
  );
  books.associate = function(models) {
    // associations can be defined here
  };
  return books;
};