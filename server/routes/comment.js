const express = require("express");
const router = express.Router();

const { createcomment } = require("../controller/comment");

router.post("/createcomment", createcomment);

module.exports = router;
