const express = require('express');
const router = express.Router();
const Sequelize = require('sequelize');
const moment = require('moment');

const Op = Sequelize.Op;

let Books = require("./models").books;
let Loans = require("./models").loans;
let Patrons = require("./models").patrons;

//routing  home page
router.get("/", (req, res) => {
    res.render('index');
});



//routing searchbooks
router.post("/searchbooks", (req, res, next) => {
    console.log(req.body.search);
    let limit = 5
    let page = 1
    Books.findAndCountAll({

        limit: limit,
        offset: limit * (page - 1),

        where: {
            [Op.or]: {
                title: {
                    [Op.like]: '%' + req.body.search + '%',
                },
                author: {
                    [Op.like]: '%' + req.body.search + '%',
                },
                genre: {
                    [Op.like]: '%' + req.body.search + '%',
                },
                first_published: {
                    [Op.eq]: req.body.search,
                },
                id: {
                    [Op.eq]: req.body.search,
                }
            }
        }
    }).then((books) => {
        
        res.render("all_books", {
            bookinfo: books.rows,
            pagetitle: "All Books",
            
        })
    })
})

// routing overdue books
router.get("/books/overdue", (req, res) => {
    Loans.findAll({
        include: {
            model: Books,
        },
        where: {
            return_by: {
                [Op.lt]: moment()
            },  
            returned_on: {
                    [Op.eq]: null
            }
        }
        
    }).then(function (loans) {
        res.render("overdue_books", {
            overdue: loans,
        })
    })

});


// routing create new book
router.get("/books/new", (req, res, next) => {
    res.render("books_new", {
        book: Books.build()
    })

});

// routing checked out books
router.get("/books/checked_books", (req, res) => {
    Loans.findAll({
        include: {
            model: Books,
         },
         where: {        
            returned_on: {
                [Op.eq]: null

            }
            
        }
                
    }).then(function (loans) {
       
    res.render("checked_books", {
        checkedout: loans,
})
})
})



//routing return book
router.get("/return/:book_id", (req, res) => {
    Loans.findOne({
        include: [{
                model: Books
            },
            {
                model: Patrons
            }
        ],

        where: {
            book_id: req.params.book_id,

        }


    }).then(function (loans) {
        //console.log(loans)
        //console.log(req.body)
        res.render("return", {

            loanreturn: loans,
            moment,
            loan: Loans.build()
        })
    });
})



//routing post-  add new book
router.post("/books/create_new_book", function (req, res, next) {
    let newBook =req.body;
    
   Books.create(newBook)

        .then(function (books) {
            res.redirect('/books')
        }).catch(function (error) {
            if (error.name === "SequelizeValidationError") {

                res.render('books_new', {
                    book: Books.build(req.body),

                    errors: error.errors
                });
            } else {
                throw error;
            }
        })
        .catch(function (error) {
            //console.log(error);
        })

})

//routing to allbooks redirect
router.get("/books", (req, res) => {
    res.redirect("/books/1")
});


// // routing all books  with pagination  
router.get("/books/:page", (req, res, next) => {
    let page = req.params.page;

    let limit = 5;
    Books.findAndCountAll({

            limit: limit,
            offset: limit * (page - 1),
        })
        .then((books) => {
            let paginate = Math.ceil(books.count / limit);
           
            res.render("all_books", {
                bookinfo: books.rows,
                pagetitle: "All Books",
                paginate: paginate,
                count: books.count
            })
        })
});

//routing individual book, book-details
router.get("/books/details/:id", (req, res) => {
    let bk = req.params.id;
    Books.findOne({
            where: {
                id: req.params.id
            },
        })
        .then(function (books) {
            Loans.findAll({
                    include: [{
                            model: Books
                        },
                        {
                            model: Patrons
                        }
                    ],
                    where: {
                        book_id: req.params.id,
                    }
                })
                
                .then(function (loans) {
                    res.render("book_details", {
                        bkloan: books,
                        loanHistory: loans,
                        moment,
                        bk,
                    })
                })
        })
});



//routing update 'put' to update individual book information 
router.put("/books/update/:id", (req, res, next) => {
    Books.findById(req.params.id).then(function (books) {
            return books.update(req.body);
        }).then(function (books) {
            res.redirect("/books");
        })
        .catch(function (error) {
            if (error.name === "SequelizeValidationError") {
                Loans.findAll({
                    include: [{
                            model: Books
                        },
                        {
                            model: Patrons
                        },
                    ],
                    where: {
                        book_id: req.params.id,
                    }
                }).then(function (loans) {

                    let bookUpdate = Books.build(req.body);
                    let bookerror = error.errors
                    bookUpdate.id = req.params.id;
                    
                    res.render("book_details", {
                        bkloan: bookUpdate,
                        errors: bookerror,
                        loanHistory: loans,
                        moment
                    })
                })
            } //end if
        }).catch(function (error) {
            console.log(error);
        })

});

// routing  put request for returned book
router.put("/return/returned/:book_id", (req, res, next) => {
    //console.log("whoopi");
    Loans.findOne({
        where: {
            book_id: req.params.book_id
        }
    }).then(function (loans) {
        return loans.update(req.body);

    }).then(function (loans) {
        res.redirect("/books/all_loans");
    }).catch(function (error) {
        if (error.name === "SequelizeValidationError") {
            Loans.findOne({
                include: [{
                    model: Books
                }, {
                    model: Patrons
                }],
                where: {
                    book_id: req.params.book_id,
                }
            }).then(function (loans) {
                res.render('return', {
                    loanreturn: loans,
                    errors: error.errors,
                    moment
                })
            }).catch(function (error) {
                console.log(error);
            })
        } //end if 
    })
})


//=========================
module.exports = router;