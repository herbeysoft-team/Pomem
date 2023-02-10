const express = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");

const userRouter = require("./routes/user");
const departmentRouter = require("./routes/department");
const categoryRouter = require("./routes/category");
const memoRouter = require("./routes/memo");
const commentRouter = require("./routes/comment");

require("dotenv").config();
const port = process.env.PORT;
const app = express();

app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use(express.static("./public"));
app.use(bodyParser.urlencoded({ extended: true }));

//Router
app.use("/api/user/", userRouter);
app.use("/api/department/", departmentRouter);
app.use("/api/category/", categoryRouter);
app.use("/api/memo/", memoRouter);
app.use("/api/comment/", commentRouter);

app.listen(port, () => console.log(`Server running on port ${port}`));
