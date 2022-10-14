const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require("path");

const app = express();
const publicPath = path.resolve(__dirname, "views");

app.use(morgan('dev'));
app.use(bodyParser({})) // look up body parser package for settings

app.set("view engine", "ejs");
app.set("views", publicPath);
let projects = [{name: "Read 10 books in a month", startDate: new Date().toLocaleDateString(), milestones: [{name: "read 1 book", startDate: "10/13/22", endDate: "10/15/22"}]}];
app.locals.projects = projects; 

app.get("/", (req, res) => {
  res.render("viewProjects")
});



app.listen(PORT = 3000, () => {
  console.log(`listening at http://localhost:3000`)
});