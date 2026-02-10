const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const auth_checker = require("./middleware/auth_checker");
const app = express();


const mongose = require('mongoose');
const userModel = require('./model/user');

mongose.connect('mongodb://localhost:27017/primetrade').then(()=>{
    console.log('Connected to MongoDB');
}).catch((err)=>{ console.log(err); });

app.use(cors());
app.use(express.json());



app.post("/auth/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
        { id: user._id },
        "SECRET_KEY",
        { expiresIn: "1h" }
    );

    res.json({
        message: "Login successful",
        token,
        user: { name: user.name, email: user.email }
    });
});

app.post("/auth/register", async (req, res) => {
    const { username, email, password } = req.body;

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new userModel({
        name: username,
        email,
        password: hashedPassword,
        tasks: []
    });

    await newUser.save();
    res.json({ message: "User registered successfully" });
});

app.get("/tasks" , auth_checker, async (req, res) => {
  const {userid } = req.body;
  if(!userid){
    return res.status(400).json({ message: "User ID is required" });
  }
    try{
        const user = await userModel.find({ _id: userid });
        if(!user){
            return res.status(404).json({ message: "User not found" });
        }
        return res.json({ tasks: user.tasks });
    }catch(err){
        console.log(err);
        return res.status(500).json({ message: "Internal server error" });
    }
});
app.get("/tasks/:id" , auth_checker, async (req, res) => {
//code
});
app.post("/tasks" , auth_checker, async (req, res) => {
  const {userid, task} = req.body;
  try{

      const user = await userModel.find({ _id: userid });
      if(!user){
        return res.status(404).json({ message: "User not found" });
      }
        user.tasks.push(task);
        await user.save();
        return res.json({ message: "Task added successfully" });
    }catch(err){
        console.log(err);
        
    }

});
app.put("/tasks/:id" , auth_checker, async (req, res) => {
//code
});


app.listen(5000, () => {
    console.log("Server is running on port 5000");
});