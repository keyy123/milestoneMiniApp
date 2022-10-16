const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require("path");
const e = require('express');

const app = express();
const publicPath = path.resolve(__dirname, "views");

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:false})) // look up body parser package for settings

app.set("view engine", "ejs");
app.set("views", publicPath);
let projects = [];
app.locals.projects = projects

app.get("/", (req, res) => {
  res.render("viewProjects")
});

app.get("/new-project", (req, res) => { 
  res.render("createProjects")
})

app.post("/new-project", (req, res) => {
  let savedProjects = localStorage.getItem("projects"); // null
  let name = req.body.name;
  let milestones = req.body.milestones;
  let projectStartDate = req.body['start-date'];
  let projectEndDate = req.body['end-date'];

  let newProject = { name, startDate: projectStartDate, endDate: projectEndDate, milestones: [] }
    

  const milestoneList = milestones.split("\r\n");
  milestoneList.map(item => {
    const goalParts = item.split("-");
    const milestoneName = goalParts[0];
    const startDate = goalParts[1];
    const endDate = goalParts[2];
    newProject.milestones.push({ name: milestoneName, startDate, endDate });
  });
  
  if (savedProjects === null  ) {
    projects.push(newProject);
    const projectJSON = JSON.stringify(projects);
    localStorage.setItem("projects", projectJSON);
  } else {
    let currentProjects = JSON.parse(savedProjects); // null
    currentProjects.push(newProject);
    localStorage.setItem("projects", JSON.stringify(currentProjects))
  }

  res.redirect("/")
});

app.listen(PORT = 3000, () => {
  console.log(`listening at http://localhost:3000`);
  require('open')(`http://localhost:${PORT}`)
}); 
