const { localStorage } = require("node-localstorage");
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const path = require("path");
let PORT;

const app = express();
const LocalStorage = new localStorage("./data");
const publicPath = path.resolve(__dirname, "views");
let projects = [];
app.locals.projects = projects;

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false })); // look up body parser package for settings

app.set("view engine", "ejs");
app.set("views", publicPath);

app.get("/", (req, res) => {
    res.render("viewProjects");
}); 

app.get("/new-project", (req, res) => {
    res.render("createProjects");
});

app.post("/new-project", (req, res) => {
    let savedProjects = LocalStorage.getItem("projects"); // null
    let name = req.body.name;
    let milestones = req.body.milestones;
    let projectStartDate = req.body["start-date"];
    let projectEndDate = req.body["end-date"];

    let newProject = { name, startDate: projectStartDate, endDate: projectEndDate, milestones: [] };
    

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
        localStorage.setItem("projects", JSON.stringify(currentProjects));
    }

    res.redirect("/");
});

app.listen(PORT = process.env.PORT || 3000, () => {
    console.log(`listening at http://localhost:${PORT}`);
    require("open")(`http://localhost:${PORT}`);
}); 
