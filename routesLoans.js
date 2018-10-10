const express = require('express');
const router = express.Router();
const Sequelize = require('sequelize');
const moment = require('moment');

const Op = Sequelize.Op;

let Books = require("./models").books;
let Loans = require("./models").loans;
let Patrons = require("./models").patrons;

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
            Patrons.findAll()
                .then(function (patrons) {
                    
                    console.log(books[21].loans);
                    res.render("new_loan", {
                        newloan: books,
                        moment,
                        newloanP: patrons,
                        moment


                    });
                })
        })
});
//routing loans overdue
router.get("/overdue_loans", (req, res, next)=>{
    Loans.findAll({
        include: [{
            model: Books
        },
        { model: Patrons

        }],
        where:{
            return_by: {
                [Op.lt]: moment()
            },
            returned_on: {
                    [Op.eq]: null
            }
        }
    }).then(function (loans){
        console.log (loans[0].dataValues.book.dataValues)
        res.render("loans_overdue", {
            overdueLoans:loans,
            moment
        
        })
    })
})

//routing loans checked loans
router.get("/checked_loans", (req, res, next)=>{
    Loans.findAll({
        include: [{
            model: Books
        },
        { model: Patrons

        }],
        where:{
            returned_on: {
                [Op.eq]: null
            }
        }
    }).then(function (loans){
        console.log (loans[0].dataValues.book_id)
        res.render("loans_checked", {
            loansChecked:loans,
            moment
        
        })
    })
})




// routing update loans table for new loan
router.post("/loans/new_loan_update", (req, res, next) => {
    let checkLoan = req.body;
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


//=========================
module.exports = router;