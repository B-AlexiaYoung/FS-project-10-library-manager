const express = require('express');
const app = express();
var bodyParser = require('body-parser');

//set static routing for css
app.use('/static', express.static('public'));
//use pug templating
app.set('view engine', 'pug');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const routes = require("./routes");
app.use(routes);

createNewBook=()=>{
console.log("pressed button");
}
//setup server
app.listen(3000);