const express = require('express');
const router = express.Router();

let Books = require("./models").books;

//render home page
router.get("/", (req, res) =>{
    res.render('index');
});
// Books listing
router.get("/books", (req, res) => {
    Books.findAll().then( function(books){
        res.render("all_books",{bookinfo:books, pagetitle:"All Books"});
        //console.log(books[0].dataValues);
    })
    //console.log(Books.findAll());
    // res.locals.books=books.get();
    
});
//routing for about patrons
router.get("/patrons", (req, res) => {
    res.render("all_patrons");
    
});
router.get("/loans", (req, res) => {
    res.render("all_loans");
    
});
// routing individual books
router.get("/books/details",(req, res)=>{
    res.render("book_details");
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
    Books.create(req.body);
    res.redirect('/books');
})


module.exports= router;