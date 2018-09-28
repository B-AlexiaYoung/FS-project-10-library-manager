'use strict';
module.exports = (sequelize, DataTypes) => {
  const books = sequelize.define('books', {
    id: {type: DataTypes.INTEGER,
         primaryKey: true,
        },

    title: {type:DataTypes.STRING,
            allowNull:false,
            validate:{
              notEmpty:{
                msg: "Title is required"
              }
            }
           },

    author:{type:DataTypes.STRING,
            allowNull:false,
            // validate:{
            //   notEmpty:{
            //     msg: "Author is required"
            //   }
            //  }
           },

    genre: {type:DataTypes.STRING,
           allowNull:false,
          //  validate:{
          //   notEmpty:{
          //     msg: "Genre is required"
          //   }
          // }
           },

    first_published: {type:DataTypes.INTEGER,
                      allowNull:false,
                     }
  }, {
    // don't add the timestamp attributes (updatedAt, createdAt)    
    timestamps: false,
    underscored:true
    }
  );
  books.associate = function(models) {
    // associations can be defined here 
   //models.books.hasMany(models.loans, {foreignKey:"book_id"});
   models.books.hasMany(models.loans);
   //models.books.hasMany(models.patrons);
  };
  return books;
};  