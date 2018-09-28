const express = require('express');
const app = express();
var bodyParser = require('body-parser');
app.locals.momemt = require('moment');
const override = require('method-override');

// to be able to use put instead of post
app.use(override('_method'))
//set static routing for css
app.use('/static', express.static('public'));
//use pug templating
app.set('view engine', 'pug');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const routes = require("./routes");
app.use(routes);

// app.use( (err,req,res,next)=>{
//     console.log("error!");
// });
//setup server
app.listen(3000);