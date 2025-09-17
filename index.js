import chalk from "chalk";
import express from "express";
import mongoose from "mongoose";
import { userModel } from "./model/userSchema.js";
import bcrypt from "bcryptjs";

const app = express();

const PORT = 5000;

app.use(express.json());

const MONGODB_URI = `mongodb+srv://admin:admin@cluster0.sqnincp.mongodb.net/`;

mongoose
  .connect(MONGODB_URI)
  .then((res) => {
    console.log("mongodb connected");
  })
  .catch((err) => {
    console.log(err);
  });

// login signup

app.post("/api/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      res.status(400).json({
        message: "Required fields are missing",
        status: false,
      });
    }

    const encryptPassword = await bcrypt.hash(password, 10);

    const userObj = {
      firstName,
      lastName,
      email,
      password: encryptPassword,
    };

    const saveData = await userModel.create(userObj);

    res.status(200).json({
      message: "create user ",
      saveData,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error,
    });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        message: "Required fields are missing",
        status: false,
      });
      return;
    }

    const getData = await userModel.findOne({ email });

    console.log(getData);

    if (!getData) {
      res.json({
        message: "invalid credentials",
      });
      return;
    }

    const comparePassword = await bcrypt.compare(password, getData.password);

    console.log(comparePassword);

    if (!comparePassword) {
      res.json({
        message: "invalid credentials",
      });
      return;
    }

    res.json({
      message: "login successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error,
    });
  }
});

app.get("/", (req, res) => {
  res.json({
    message: "server start",
  });
});

app.listen(PORT, () => {
  console.log(
    chalk.bgCyan.bold.italic(`server is running on http://localhost:${PORT}`)
  );
});
