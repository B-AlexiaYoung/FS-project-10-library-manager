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
// // routing all books
// router.get("/books", (req, res) => {
//     Books.findAll().then(function (books) {
//         //console.log(books);
//         res.render("all_books", {
//             bookinfo: books,
//             pagetitle: "All Books"
//         });
//     })

// });

// //routing to allbooks redirect
// router.get("/books", (req, res) => {
// res.redirect("/books/1")
// });
// // // routing all books  with pagination   just starting to work on this
// //router.get("/books", (req, res) => {
// router.get("/books/:page", (req, res, next) => {
//     let page= req.params.page;

//     let limit= 5;
//     Books.findAndCountAll({

//         limit:limit,
//         offset:limit * ( page -1),
//     })
//         .then((books)=>{
//             let paginate = Math.ceil(books.count / limit);
//         console.log(books.count);
//         console.log(page);
//         console.log(paginate);
//         console.log(books.rows);
//             res.render("all_books", {
//                 bookinfo: books.rows,
//                 pagetitle: "All Books",
//                 paginate: paginate,
//                 count : books.count
//             })  
//     })
// });

//routing searchbooks
router.post("/searchbooks", (req,res,next)=>{
    console.log(req.body.search);
    let limit= 5
    let page = 1
    Books.findAndCountAll({
        
        limit:limit,
        offset:limit * ( page -1),
        
        where:{
            [Op.or]:{
                title:{
                [Op.like]: '%'+ req.body.search +'%',
                },
                author:{
                    [Op.like]: '%'+ req.body.search +'%',
                    },
                genre:{
                    [Op.like]: '%'+ req.body.search +'%',
                    },
                first_published:{
                    [Op.eq]:  req.body.search,
                    },
                id:{
                    [Op.eq]:  req.body.search,
                    }
            } 
        }
    }).then((books)=>{
        let paginate = Math.ceil(books.count / limit);
        // console.log(books.count);
        // console.log(page);
        // console.log(paginate);
        // console.log(books.rows);
        res.render("all_books", {
            bookinfo: books.rows,
            pagetitle: "All Books",
            paginate: paginate,
            count : books.count
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
                [Op.or]: {
                    [Op.gt]: Loans.return_by,
                    [Op.eq]: null
                }
            }
        }
    }).then(function (loans) {
        //console.log(loans);
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
                [Op.ne]: !null
            },
        }
    }).then(function (loans) {
        //console.log(loans[0].book.title);
        res.render("checked_books", {
            checkedout: loans,
        })
    })

});


// routing display all loans
router.get("/books/all_loans", (req, res) => {
    Loans.findAll({
        include: [{
                model: Books
            },
            {
                model: Patrons
            }
        ],
    }).then(function (loans) {
        //console.log(loans)
        //console.log(loans[0].book_id);
        //console.log(loans[1].dataValues.patron.dataValues.first_name);

        res.render("all_loans", {
            loaninfo: loans,
            pagetitle: "All Loans",
            moment
        });
    })

});
//routing new loans
router.get("/new_loan", (req, res) => {
    Books.findAll({
            include:

            {
                model: Loans
            },

        })
        .then(function (books) {
            //console.log(books[0].dataValues.id);
            Patrons.findAll()
                .then(function (patrons) {
                    //console.log(books)
                    //console.log(patrons[0].dataValues.first_name);
                    console.log(books[21].loans);
                    //console.log(patrons)
                    res.render("new_loan", {
                        newloan: books,
                        moment,
                        newloanP: patrons,
                        moment


                    });
                })
        })
});


//routing all patrons redirect
router.get("/patrons", (req, res) => {
    res.redirect("/patrons/1")
})
//routing display all patrons with pagination
router.get("/patrons/:page", (req, res) => {
    let page= req.params.page;

    let limit= 5;
    Patrons.findAndCountAll({

        limit:limit,
        offset:limit * ( page -1),
    })
        .then((patrons)=>{
            let paginate = Math.ceil(patrons.count / limit);
        // console.log(patrons.count);
        // console.log(page);
        // console.log(paginate);
        // console.log(patrons.rows);
            res.render("all_patrons", {
                patroninfo: patrons.rows,
                pagetitle: "All Patrons",
                paginate: paginate,
                count : patrons.count
            })  
    })
})





//routing display all patrons
// router.get("/patrons", (req, res) => {
//     Patrons.findAll().then(function (patrons) {
//         //console.log(patrons);
//         res.render("all_patrons", {
//             patroninfo: patrons,
//             pagetitle: "All Patrons"
//         });
//     })
// });
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



//routing new patron
router.get("/new_patron", (req, res) => {
    res.render("new_patron");
})

//routing post-  add new book
router.post("/books/create_new_book", function (req, res, next) {
    //console.log(req.body);
    Books.create(req.body)
        .then(function (books) {
            res.redirect('/books')
        }).catch(function (error) {
            if (error.name === "SequelizeValidationError") {
                //console.log(Books.build(req.body));


                res.render('books_new', {
                    book: Books.build(req.body),

                    errors: error.errors
                });
            } else {
                throw error;
            }
        })
        .catch(function (error) {
            console.log(error);
            // return res.status(422).send(err.errors);
        })

})
// routing post- add new patron
router.post("/patrons/create_new_patron", function (req, res, next) {
    //console.log(req.body);
    Patrons.create(req.body)
        .then(function(patrons){
            res.redirect('/patrons')
        })
        .catch(function (error) {
            if (error.name === "SequelizeValidationError") {
                res.render('new_patron', {
                    book: Patrons.build(req.body),

                    errors: error.errors
                });

            }//end if
        }).catch(function (error) {
            console.log(error);
        })

})


//routing searchpatrons
router.post("/searchpatrons", function (req,res, next){
    let page= 1;

    let limit= 5;
    Patrons.findAndCountAll({

        limit:limit,
        offset:limit * ( page -1),
        where:{
            [Op.or]:{
                first_name:{
                    [Op.like]: '%'+ req.body.search +'%',
                },
                last_name:{
                    [Op.like]: '%'+ req.body.search +'%',
                    },
                address:{
                    [Op.like]: '%'+ req.body.search +'%',
                    },
                email:{
                     [Op.like]: '%'+ req.body.search +'%',
                    },
                library_id:{
                    [Op.like]: '%'+ req.body.search +'%',
                    },
                zip_code:{
                    [Op.eq]: req.body.search,
                    },
                id:{
                    [Op.eq]:  req.body.search,
                    }
            } 
        }
    })
        .then((patrons)=>{
            let paginate = Math.ceil(patrons.count / limit);
        // console.log(patrons.count);
        // console.log(page);
        // console.log(paginate);
        // console.log(patrons.rows);
            res.render("all_patrons", {
                patroninfo: patrons.rows,
                pagetitle: "All Patrons",
                paginate: paginate,
                count : patrons.count
            })  
    })
})
//routing to allbooks redirect
router.get("/books", (req, res) => {
    res.redirect("/books/1")
    });

// routing individual book - books_detail
// router.get("/books/:id", (req, res) => {
//     //console.log(req.params); 
//     //console.log(req.params.id)
//     //console.log(req);
//     let bk = req.params.id;

//     //console.log(bk);
//     // Books.findById(bk, {include:[{
//     Books.findOne({

//             include: [{
//                 model: Loans,
//                 include: [{
//                     model: Patrons,
//                 }]
//                 //as: "loans"
//             }],
//             where: {
//                 id: req.params.id
//             },

//             //raw:true,

//         })
//         .then(function (books) {
//             //console.log(books.dataValues.loans[0].dataValues.patron.dataValues.first_name)

//             res.render("book_details", {
//                 bkloan: books,
//                 moment,
//                 bk,              
//             })
//             //res.render("book_details", {bKloan: books});
//         })
// });



    // // routing all books  with pagination   just starting to work on this
    //router.get("/books", (req, res) => {
    router.get("/books/:page", (req, res, next) => {
        let page= req.params.page;
    
        let limit= 5;
        Books.findAndCountAll({
    
            limit:limit,
            offset:limit * ( page -1),
        })
            .then((books)=>{
                let paginate = Math.ceil(books.count / limit);
            // console.log(books.count);
            // console.log(page);
            // console.log(paginate);
            // console.log(books.rows);
                res.render("all_books", {
                    bookinfo: books.rows,
                    pagetitle: "All Books",
                    paginate: paginate,
                    count : books.count
                })  
        })
    });
 //routing individual book, book-details
router.get("/books/details/:id", (req, res) => {
    //console.log(req.params.id)
    let bk = req.params.id;
    Books.findOne({
   where: {
        id: req.params.id
    },
    })
    .then(function (books) {
        //console.log(books.dataValues.loans[0].dataValues.patron.dataValues.first_name)
        //let book=books;
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
        //res.render("book_details", {bKloan: books});
        //})
        .then(function (loans) {
            //console.log(books.dataValues.loans[0].dataValues.patron.dataValues.first_name)
            //console.log(loans);
            res.render("book_details", {
                bkloan: books,
                loanHistory: loans,
                moment,
                bk,
            })
            //res.render("book_details", {bKloan: books});
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

                    // console.log(loans[0]);
                    // console.log(Books.build(req.body));
                    let bookUpdate = Books.build(req.body);
                    let bookerror = error.errors
                    bookUpdate.id = req.params.id;
                    //console.log(bookUpdate);
                    //console.log(bookUpdate.title);
                    //res.redirect("/books/17")
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
            // return res.status(422).send(err.errors);
        })

});


//routing get individual customer details   first draft
// router.get("/books/patrons/patron_details/:library_id", (req, res, next) => {
//     //let singlePatron = req.params.patron_library_id
//     Patrons.findOne({
//         include: [{
//             model: Loans,
//         }],
//         where: {
//            library_id: req.params.library_id
//         },
//         })
//         .then(function (patrons) {
//             console.log(patrons.dataValues)
//             //console.log(patrons.dataValues.loans[0].dataValues.book_id);
//             //let loanDetails = patrons.dataValues.loans[0].dataValues
//             res.render("patron_details", {
//                 customer: patrons
//             })
//         });
// });


//routing get individual customer details  second draft

router.get("/books/patrons/patron_details/:id", (req, res, next) => {
    let singlePatron = req.params.id
    //console.log(singlePatron);
    Patrons.findOne({
            where: {
            id: req.params.id
        },
        }).then(function (patrons){
            
            Loans.findAll({
                include: {
                    model: Books
                },

                where:{
                    patron_id: singlePatron
                }
            }).then(function (loans) {
             //console.log(loans[0].book.title);
            //console.log(patrons.dataValues)
            //console.log(patrons.dataValues.loans[0].dataValues.book_id);
            //let loanDetails = patrons.dataValues.loans[0].dataValues
            res.render("patron_details", {
                customer: patrons,
                custHistory: loans,
                moment
            })
        })
     })
});

// //routing   put patron update
// router.put("/books/patrons/patron_details/:library_id", (req, res, next) => {
//     //console.log(req.body);
//     Patrons.findOne({
//         where: {
//             library_id: req.params.library_id
//         }
//     }).then(function (patrons) {
//         return patrons.update(req.body);

//     }).then(function (patrons) {
//         res.redirect("/patrons");
//     }).catch(function (err) {
//         console.log(err)
//     })

// })

//routing   put patron update
router.put("/books/patrons/patron_details/:id", (req, res, next) => {
    //console.log(req.body);
    let patronId;
    Patrons.findOne({
        where: {
            id: req.params.id
        }
    }).then(function (patrons) {
        //console.log(patrons.id)
         patronId =patrons.id;
        return patrons.update(req.body);
        
    }).then(function (patrons) {
        res.redirect("/patrons");
    }).catch(function(error){

        if (error.name === "SequelizeValidationError") {
            Loans.findAll({
                where: {
                    patron_id: patronId,
                }
            
            }).then(function (loans) {
                    // console.log("wibble");
                    // console.log(loans);
                    // console.log(Patrons.build(req.body));
                    let customerUpdate = Patrons.build(req.body);
                    let customerError = error.errors
                    customerUpdate.id = req.params.id;
                    //console.log(customerUpdate.title);
                    res.render("patron_details", {
                        customer: customerUpdate,
                        errors: customerError,
                        custHistory: loans,
                        moment
                    })
                })
        }//end if
    })
})



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
                //console.log(req.body);
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





// routing update loans table for new loan
router.post("/loans/new_loan_update", (req, res, next) => {
    //console.log(req.body);
    let checkLoan= req.body;
    checkLoan.returned_on = null;
    Loans.create(checkLoan)

        .then(function (loans) {
            res.redirect('/books/all_loans')
        })
        .catch(function (error) {
            let noDate = error.errors
            if (error.name === "SequelizeValidationError") {
                Books.findAll({
                        include:

                        {
                            model: Loans
                        },
                    })
                    .then(function (books) {
                        // console.log(noDate);
                        // console.log(books[0]);
                        Patrons.findAll()
                            .then(function (patrons) {
                                res.render("new_loan", {
                                    newloan: books,
                                    moment,
                                    newloanP: patrons,
                                    moment,
                                    errors: noDate


                                });
                            })
                    })

            } //end if
        })
})


//===============================
module.exports = router;