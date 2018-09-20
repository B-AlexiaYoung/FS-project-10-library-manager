const express = require('express');
const router = express.Router();

let Books = require("./models").books;
let Loans =require("./models").loans;

//render home page
router.get("/", (req, res) =>{
    res.render('index');
});
// Books listing
router.get("/books", (req, res) => {
  Books.findAll().then( function(books){
      console.log(books);
        res.render("all_books",{bookinfo:books, pagetitle:"All Books"});
    })
    
});
//routing for about patrons
router.get("/patrons", (req, res) => {
    res.render("all_patrons");
    
});
router.get("/loans", (req, res) => {
    res.render("all_loans");
    
});
// routing individual books_
router.get("/books/:id",(req, res)=>{
    //console.log(req.params); 
    console.log(req.params.id)
    //console.log(req);
       let bk=req.params.id;

    console.log(bk);
    Books.findById(bk, {include:[{
                        model:loans,
                        required: true}]
                   })
        .then(function (books){
        console.log(books.dataValues)        
    res.render("book_details", {title: books.dataValues.title, author:books.dataValues.author, genre:books.dataValues.genre, first_published:books.dataValues.first_published, loantitle: loans.dataValues.title, patron:loans.dataValues.patron, loaned_on:loans.dataValues.loaned_on, return_by:loans.dataValues.return_by});
});

   
    // Loans.findById(1).then (function(loans){
    //     res.render("book_details", {loantitle: loans.dataValues.title, patron:loans.dataValues.patron, loaned_on:loans.dataValues.loaned_on, return_by:loans.dataValues.return_by })
    // })
});
// routing overdue books
router.get("/books/overdue",(req, res)=>{
    res.render("books_overdue");
});
// routing create new book
router.get("/books/new",(req, res)=>{
    res.render("books_new");
});
// routing checked out books
router.get("/books/checked_out",(req, res)=>{
    res.render("checked_books");
});
//edit routes
// add new book
router.post("/books/create_new_book", function(req, res, next){
    console.log(req.body);
    Books.create(req.body)
    .then ( res.redirect('/books'))
    .catch(function (err) {
        console.log(err);
        // return res.status(422).send(err.errors);
    })

})
   


module.exports= router;