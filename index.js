const express = require("express");
const fs = require("fs");
const users = require("./MOCK_DATA.json");
const mongoose= require("mongoose");


const app = express();
const port = 8000;
//connection
mongoose.connect('mongodb://127.0.0.1:27017/db_demo1')
.then(()=> console.log("Mongobd is connected"))
.catch((err)=> console.log("Not connected",err));

//Schema
const userSchema=new mongoose.Schema
({
    first_name:
    { 
      type:String,
      required :true
    },
     last_name:
     {
        type:String,
    },
    email:
        {
        type:String,
        required:true,
        unique:true,
        },
    job_title:
        {
         type:String,
        },
    gender:
        {
            type:String,
        },
    });

//model
    const User = mongoose.model("User",userSchema);
// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use((req, res, next) => {
    fs.appendFile("log.txt", `\n${Date.now()}: ${req.method}: ${req.path}\n`, (err) => {
        if (err) {
            console.error("Failed to write to log file", err);
        }
        next();
    });
});

// Routes
app.get("/users", (req, res) => {
    const html = `
    <ul>
    ${users.map(user => `<li>${user.first_name}</li>`).join('')}
    </ul>
    `;
    res.send(html);
});

// REST API
app.get('/api/users', (req, res) => {
    res.setHeader("X-Myname", "Lingouda"); // Custom Header
    // Always add X to Custom Headers
    return res.json(users);
});

app.route("/api/users/:id")
    .get((req, res) => {
        const id = Number(req.params.id);
        const user = users.find((user) => user.id === id);
        if (!user) return res.status(404).json({ error: "User not found" });
        return res.json(user);
    })
    .patch((req, res) => {
        // edit the user with id
        return res.json({ status: "Pending" });
    })
    .delete((req, res) => {
        // delete the user with id
        return res.json({ status: "Pending" });
    });

app.post("/api/users", (req, res) => {
    const body = req.body;
    if (
        !body ||
        !body.first_name ||
        !body.last_name ||
        !body.email ||
        !body.gender ||
        !body.job_title
    ) {
        return res.status(400).json({ msg: "All fields are required" });
    }
    users.push({ ...body, id: users.length + 1 });
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err) => {
        if (err) {
            return res.status(500).json({ status: "Error writing to file" });
        }
        return res.status(201).json({ status: "Success", id: users.length });
    });
});

app.listen(port, () => console.log(`Server started at port ${port}`));


