require('dotenv').config();
const express = require('express');
const app = express();
const cors =require("cors");
const database = require("./database/db")
const userRouter =require("./UserManagement/userRouter")
const adminRouter =require("./AdminManagement/AdminRoute")
const userPassReset = require("./UserManagement/Forgotpass")


//Middilewares
app.use(express.json())
app.use(cors());
app.use("/user",userRouter)
app.use("/admin",adminRouter)
app.use("/password",userPassReset)


//Server creation
const port = process.env.PORT || 2020;
app.listen(port, () => console.log(`Listening on port ${port}...`));

