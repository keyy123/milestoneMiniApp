let LocalStorage = require("node-localstorage").LocalStorage;
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const path = require("path");
const open = require("open");
let PORT;

const app = express();
const localStorage = new LocalStorage("./data");
const publicPath = path.resolve(__dirname, "views");
let projects = [];
let currentTask = [];

// Shared Data For EJS Tepmlates
app.locals.projects = JSON.parse(localStorage.getItem("projects"));
app.locals.currentTask = currentTask;

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false })); // look up body parser package for settings

app.set("view engine", "ejs");
app.set("views", publicPath);



const index = (req, res) => res.render("viewProjects");

const newProject = (req, res) => res.render("createProjects");

app.get("/", index);

app.get("/new-project", newProject);


const parseProjectData = (req) => {
    const body = req.body
    let { name, milestones, startDate, endDate } = { name: body.name, milestones: body.milestones, startDate: body['start-date'], endDate: body['end-date'] };
    return { name, startDate, endDate, milestones};
}
 
const milestoneSplitter = (str, obj) => {
    const milestoneList = str.split("\r\n"); 
    const storedMilestones = [];
    milestoneList.map(item => {
        const goalParts = item.split("-");
        const { milestoneName, startDate, endDate } = { milestoneName: goalParts[0], startDate: goalParts[1], endDate: goalParts[2] };
        storedMilestones.push({ name: milestoneName, startDate, endDate }); 
    });
    if (obj.hasOwnProperty('milestones')) {
        obj.milestones = storedMilestones;
    }
}
 
const saveProject = (json, keyName, obj) => {
    if (json === null) {
        projects.push(obj);
        localStorage.setItem(keyName, JSON.stringify(projects));
        console.log(localStorage.getItem("projects"), "from saveProject fxn");
    } else {
        let currentProjects = JSON.parse(json);
        currentProjects.push(obj);
        localStorage.setItem("projects", JSON.stringify(currentProjects));
        console.log(localStorage.getItem("projects"), "from save project fxn");
    }
}


app.post("/new-project", (req, res) => {
    let savedProjects = localStorage.getItem("projects"); 
    console.log(JSON.parse(savedProjects))
    let newProject = parseProjectData(req);
    milestoneSplitter(newProject.milestones, newProject);
    
    saveProject(savedProjects, "projects", newProject);

    res.redirect("/");
});



const pickTaskToWorkOn = (req, res) => res.render("taskToWorkOn")

app.get("/work-on-project", pickTaskToWorkOn);

app.post("/work-on-project", (req, res) => {
    console.log(req.body)
    if (currentTask.length > 0) {
        currentTask = [];
    }
    currentTask.push(req.body.projects, req.body['study-rounds']);
    
});

app.listen(PORT = process.env.PORT || 3000, () => {
    console.log(`listening at http://localhost:${PORT}`);
    open(`http://localhost:${PORT}`);
}); 
