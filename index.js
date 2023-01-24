const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const argon2 = require("argon2");
const UserModel = require("./model/UserModel");
const cors = require("cors");
const JobsModel = require("./model/JobsModel");
const UserAppliedModel = require("./model/Userapplied");
const port=process.env.PORT || 8080

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.post("/signup", async (req, res) => {
  const { name, email, password, role } = req.body;
  let exist = await UserModel.findOne({ email });

  if (exist) {
    res.send("user already exists please login...");
  } else {
    const admin = email.includes("masaischool.com");
    if (admin) {
      const user = new UserModel({ name, email, password, role: "admin" });
      await user.save();
      res.send("Admin created successfully");
    } else {
      const user = new UserModel({ name, email, password, role });
      await user.save();
      res.send("User created successfully");
    }
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email });

  if (!user) {
    return res.send("Invalid Cridentials");
  }
  if (user.email.includes("masaischool.com")) {
    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name, role: user.role },
      "SECRET1234",
      {
        expiresIn: "1 hours",
      }
    );
    res.send({
      message: "Admin logged in successfull",
      token,
      role: user.role,
    });
  } else {
    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name },
      "SECRET1234",
      {
        expiresIn: "1 hours",
      }
    );
    res.send({ message: "User logged in successfull", token, role: user.role });
  }
});

app.post("/jobsform", async (req, res) => {
  const { name, position, contract, location } = req.body;
  const jobs = new JobsModel({ name, position, contract, location });
  await jobs.save();
  res.send("New Jobs created successfully");
});

app.get("/jobsform", async (req, res) => {
  const jobs = await JobsModel.find();
  //   console.log(jobs);
  res.send(jobs);
});
app.delete("/jobsform/:id", async (req, res) => {
  const { id } = req.params;
  await JobsModel.findByIdAndDelete(id);
  res.send("Items has deleted successfully");
});
app.put("/jobsform/:id", async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const job = await JobsModel.findByIdAndUpdate(
    { _id: id },
    {
      name: data.name,
      position: data.position,
      contract: data.contract,
      location: data.location,
    },
    {
      new: true,
    }
  );
  console.log(job);
  res.send("Items has updated successfully");
});

app.post("/userapplied/:id", async (req, res) => {
  const { id } = req.params;
  const job = await JobsModel.findById(id);

  const userapplied = new UserAppliedModel({
    name: job.name,
    position: job.position,
    contract: job.contract,
    location: job.location,
  });
  console.log(userapplied);
  await userapplied.save();
  res.send("user applied for job successfully");
});

app.get("/userapplied", async (req, res) => {
  const jobs = await JobsModel.find();
  //   console.log(jobs);
  res.send(jobs);
});

mongoose
  .connect(
    "mongodb+srv://jyotipm1999:Jyotipm1999@cluster0.iuqdtyd.mongodb.net/jobapp"
  )
  .then(() => {
    app.listen(port, () => {
      console.log("server started on port 8080");
    });
  });
