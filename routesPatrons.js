const express = require('express');
const router = express.Router();
const Sequelize = require('sequelize');
const moment = require('moment');

const Op = Sequelize.Op;

let Books = require("./models").books;
let Loans = require("./models").loans;
let Patrons = require("./models").patrons;



//routing all patrons redirect
router.get("/patrons", (req, res) => {
    res.redirect("/patrons/1")
})

//routing display all patrons with pagination
router.get("/patrons/:page", (req, res) => {
    let page = req.params.page;

    let limit = 5;
    Patrons.findAndCountAll({

            limit: limit,
            offset: limit * (page - 1),
        })
        .then((patrons) => {
            let paginate = Math.ceil(patrons.count / limit);

            res.render("all_patrons", {
                patroninfo: patrons.rows,
                pagetitle: "All Patrons",
                paginate: paginate,
                count: patrons.count
            })
        })
})

//routing new patron
router.get("/new_patron", (req, res) => {
    res.render("new_patron");
})


// routing post- add new patron
router.post("/patrons/create_new_patron", function (req, res, next) {
    console.log(req.body);
    Patrons.create(req.body)
        .then(function (patrons) {
            res.redirect('/patrons')
        })
        .catch(function (error) {
            if (error.name === "SequelizeValidationError") {
                res.render('new_patron', {
                    patron: Patrons.build(req.body),
                    errors: error.errors
                });

            } //end if
        }).catch(function (error) {
            console.log(error);
        })

})


//routing searchpatrons
router.post("/searchpatrons", function (req, res, next) {
    let page = 1;

    let limit = 5;
    Patrons.findAndCountAll({

            limit: limit,
            offset: limit * (page - 1),
            where: {
                [Op.or]: {
                    first_name: {
                        [Op.like]: '%' + req.body.search + '%',
                    },
                    last_name: {
                        [Op.like]: '%' + req.body.search + '%',
                    },
                    address: {
                        [Op.like]: '%' + req.body.search + '%',
                    },
                    email: {
                        [Op.like]: '%' + req.body.search + '%',
                    },
                    library_id: {
                        [Op.like]: '%' + req.body.search + '%',
                    },
                    zip_code: {
                        [Op.eq]: req.body.search,
                    },
                    id: {
                        [Op.eq]: req.body.search,
                    }
                }
            }
        })
        .then((patrons) => {
            let paginate = Math.ceil(patrons.count / limit);

            res.render("all_patrons", {
                patroninfo: patrons.rows,
                pagetitle: "All Patrons",
                paginate: paginate,
                count: patrons.count
            })
        })
})

//routing get individual customer details  second draft

//router.get("/books/patrons/patron_details/:id", (req, res, next) => {
router.get("/patrons/patron_details/:id", (req, res, next) => {

    let singlePatron = req.params.id
    Patrons.findOne({
        where: {
            id: req.params.id
        },
    }).then(function (patrons) {

        Loans.findAll({
            include: {
                model: Books
            },

            where: {
                patron_id: singlePatron
            }
        }).then(function (loans) {

            res.render("patron_details", {
                customer: patrons,
                custHistory: loans,
                moment
            })
        })
    })
});

//routing   put patron update
router.put("/books/patrons/patron_details/:id", (req, res, next) => {
    let patronId;
    Patrons.findOne({
        where: {
            id: req.params.id
        }
    }).then(function (patrons) {
        patronId = patrons.id;
        return patrons.update(req.body);

    }).then(function (patrons) {
        res.redirect("/patrons");
    }).catch(function (error) {

        if (error.name === "SequelizeValidationError") {
            Loans.findAll({
                include: {
                    model: Books
                },
                where: {
                    patron_id: patronId,
                }

            }).then(function (loans) {

                let customerUpdate = Patrons.build(req.body);
                let customerError = error.errors
                customerUpdate.id = req.params.id;
                res.render("patron_details", {
                    customer: customerUpdate,
                    errors: customerError,
                    custHistory: loans,
                    moment
                })
            })
        } //end if
    })
})


//=========================
module.exports = router;