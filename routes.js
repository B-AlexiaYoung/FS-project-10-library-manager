const express = require('express');
const router = express.Router();
const Sequelize = require('sequelize');
const moment = require('moment');

const Op = Sequelize.Op;

let Books = require("./models").books;
let Loans = require("./models").loans;
let Patrons = require("./models").patrons;

//render home page
router.get("/", (req, res) => {
    res.render('index');
});
// Books listing
router.get("/books", (req, res) => {
    Books.findAll().then(function (books) {
        //console.log(books);
        res.render("all_books", {
            bookinfo: books,
            pagetitle: "All Books"
        });
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
        // console.log(loans[0].dataValues.book.dataValues.title);
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
                    //console.log(books[0].dataValues.loans);
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

//routing display all patrons
router.get("/patrons", (req, res) => {
    Patrons.findAll().then(function (patrons) {
        //console.log(patrons);
        res.render("all_patrons", {
            patroninfo: patrons,
            pagetitle: "All Patrons"
        });
    })
});
//routing return book
router.get("/return/:id", (req, res) => {
    Loans.findOne({
        include: [{
                model: Books
            },
            {
                model: Patrons
            }
        ],

    }).then(function (loans) {
        //console.log(loans.book.title)

        res.render("return", {
            loanreturn: loans,
            moment,

        })
    });
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
router.get("/books/new", (req, res) => {
    res.render("books_new");
});
// routing checked out books
router.get("/books/checked_books", (req, res) => {
Loans.findAll({
    include: {
        model: Books,
    },
    where: {
        returned_on: {[Op.ne]: !null},
    }
}).then(function (loans) {
        //console.log(loans[0].book.title);
        res.render("checked_books", {
            checkedout: loans,
        })
    })

});
//routing new patron
router.get("/new_patron", (req, res) => {
    res.render("new_patron");
})

// add new book
router.post("/books/create_new_book", function (req, res, next) {
    //console.log(req.body);
    Books.create(req.body)
        .then(res.redirect('/books'))
        .catch(function (err) {
            console.log(err);
            // return res.status(422).send(err.errors);
        })

})
// add new patron
router.post("/patrons/create_new_patron", function (req, res, next) {
    //console.log(req.body);
    Patrons.create(req.body)
        .then(res.redirect('/patrons'))
        .catch(function (err) {
            console.log(err);
            // return res.status(422).send(err.errors);
        })

})


// routing individual books_
router.get("/books/:id", (req, res) => {
    //console.log(req.params); 
    //console.log(req.params.id)
    //console.log(req);
    let bk = req.params.id;

    //console.log(bk);
    // Books.findById(bk, {include:[{
    Books.findOne({

            include: [{
                model: Loans,
                include: [{
                    model: Patrons,
                }]
                //as: "loans"
            }],
            where: {
                id: req.params.id
            },

            //raw:true,

        })
        .then(function (books) {
            //console.log(books.dataValues.loans[0].dataValues.patron.dataValues.first_name)

            res.render("book_details", {
                bkloan: books,
                moment,
                bk
            })
            //res.render("book_details", {bKloan: books});
        });
});


// update 'put' to update book information
router.put("/books/update/:id", (req, res, next) => {
    //console.log(req.body);
    Books.findById(req.params.id).then(function (books) {
        return books.update(req.body);
    }).then(function (books) {
        res.redirect("/books");
    });
});


//routing individual customer details
router.get("/books/patrons/patron_details/:library_id", (req, res, next) => {
    //let singlePatron = req.params.patron_id
    Patrons.findOne({
            include: [{
                model: Loans,
            }],
            where: {
                library_id: req.params.library_id
            },

        })
        .then(function (patrons) {
            //console.log(patrons.dataValues)
            //console.log(patrons.dataValues.loans[0].dataValues.book_id);
            //let loanDetails = patrons.dataValues.loans[0].dataValues

            res.render("patron_details", {
                customer: patrons
            })
        });
});

//return book?
router.put("/books/patrons/patron_details/:library_id", (req, res, next) => {
    //console.log(req.body);
    Patrons.findOne({
        where: {
            library_id: req.params.library_id
        }
    }).then(function (patrons) {
        return patrons.update(req.body);

    }).then(function (patrons) {
        res.redirect("/patrons");
    }).catch(function (err) {
        console.log(err)
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
    }).catch(function (err) {
        console.log(err)
    })
})





// routing update loans table for new loan
router.post("/loans/new_loan_update", (req, res, next) => {
    console.log(req.body);
    
        Loans.create(req.body)

        .then(res.redirect('/books/all_loans'))
        .catch(function (err) {
            console.log(err);
            // return res.status(422).send(err.errors);
        })
})

module.exports = router;