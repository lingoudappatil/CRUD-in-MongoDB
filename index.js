const express = require("express");
const fs = require("fs");

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
    },{timestamps: true});

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
app.get("/users",async (req, res) => {
    const alldbUsers= await User.find({});
    const html = `
    <ul>
    ${alldbUsers.map(user => `<li>${user.first_name} - ${user.email}</li>`).join('')}
    </ul>
    `;
    res.send(html);
});

// REST API
app.get('/api/users',async (req, res) => {
    const alldbUsers= await User.find({});

    return res.json(alldbUsers);
});

app.route("/api/users/:id")
    .get(async(req, res) => {
        const alldbUsers=await User.findById(req.params.id);
        if (!alldbUsers) return res.status(404).json({ error: "User not found" });
        return res.json(alldbUsers);
    })

    .patch(async(req, res) => {
        // edit the user with id
        User.findByIdAndUpdate(req.params.id, {last_name: "Changed" })
        return res.json({ status: "success" });
    })

    .delete(async(req, res) => {
        // delete the user with id
        await User.findByIdAndDelete(req.params.id);
        return res.json({ status: "success" });
    });

app.post("/api/users", async(req, res) => {
    const body = req.body;
    if (
        !body ||
        !body.first_name ||
        !body.last_name ||
        !body.email ||
        !body.gender ||
        !body.job_title
    ) 
    {
        return res.status(400).json({ msg: "All fields are required" });
    }
    
   const  result= await User.create({
    first_name:body.first_name,
    last_name:body.last_name,
    email:body.email,
    gender:body.gender,
    job_title:body.job_title,   
});

return res.status(201).json({msg:"Success"});
});


app.listen(port, () => console.log(`Server started at port ${port}`));


