let LocalStorage = require("node-localstorage").LocalStorage;
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const path = require("path");
let PORT;

const app = express();
const localStorage = new LocalStorage("./data");
const publicPath = path.resolve(__dirname, "views");
let projects = [];
let currentTask = [];
app.locals.projects = JSON.parse(localStorage.getItem("projects"));

app.locals.currentTask = currentTask;

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
    let savedProjects = localStorage.getItem("projects"); // null
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
  
    if (savedProjects === null) {
        projects.push(newProject);
        const projectJSON = JSON.stringify(projects);
        localStorage.setItem("projects", projectJSON);
        console.log(localStorage.getItem("projects"));
    } else {
        let currentProjects = JSON.parse(savedProjects); // null
        currentProjects.push(newProject);
        localStorage.setItem("projects", JSON.stringify(currentProjects));
        console.log(localStorage.getItem("projects"));
    }
    res.redirect("/");
});

app.get("/work-on-project", (req, res) => {
    res.render("taskToWorkOn.ejs");
});

app.post("/work-on-project", (req, res) => {
    if (currentTask.length > 0) {
        currentTask = [];
    }
    currentTask.push(req.body.projects, req.body['study-rounds']);
    console.log("This is the currentTask", currentTask[0], currentTask[1]);
});

app.listen(PORT = process.env.PORT || 3000, () => {
    console.log(`listening at http://localhost:${PORT}`);
    require("open")(`http://localhost:${PORT}`);
}); 
