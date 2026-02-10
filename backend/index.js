const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const auth_checker = require("./middleware/auth");
const app = express();


const mongose = require('mongoose');
const userModel = require('./model/user');

mongose.connect('mongodb://localhost:27017/primetrade').then(()=>{
    console.log('Connected to MongoDB');
}).catch((err)=>{ console.log(err); });

app.use(cors({
    origin: '*',
}));
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
        user
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
    res.json({ message: "User registered successfully" , user: newUser});
});

app.get("/tasks", auth_checker, async (req, res) => {
  try {
    const user = await userModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user.tasks);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// app.post("/tasks" , auth_checker, async (req, res) => {
//   const {userid, task} = req.body;
//   try{
// // 
//       const user =await userModel.findByIdAndUpdate(
//   userid,
//   { $push: { tasks: task } },
//   { new: true }
// );

//         // const user = await userModel.findById(userid); 
//       if(!user){
//         return res.status(404).json({ message: "User not found" });
//       }
//         user.tasks.push(task);
//         await user.save();
//         return res.json({ message: "Task added successfully" });
//     }catch(err){
//         console.log(err);
        
//     }

// });


app.post("/tasks", auth_checker, async (req, res) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Task title required" });
  }

  try {
    const user = await userModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.tasks.push({ title });
    await user.save();

    res.json(user.tasks);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
app.delete("/tasks/:id", auth_checker, async (req, res) => {
  try {
    const user = await userModel.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.tasks = user.tasks.filter(
      (task) => task._id.toString() !== req.params.id
    );

    await user.save();
    res.json(user.tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.put("/tasks/:id", auth_checker, async (req, res) => {
  try {
    const user = await userModel.findById(req.userId);
    const task = user.tasks.id(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    task.completed = !task.completed;

    await user.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});



app.listen(5000, () => {
    console.log("Server is running on port 5000");
});