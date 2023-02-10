const express = require("express");
const router = express.Router();

const {
  createdepartment,
  getdepartment,
  alldepartments,
  updatedepartment,
  deletedepartment,
} = require("../controller/department");

router.post("/createdepartment", createdepartment);
router.get("/getdepartment/:id", getdepartment);
router.get("/alldepartments", alldepartments);
router.put("/updatedepartment/:id", updatedepartment);
router.delete("/deletedepartment/:id", deletedepartment);

module.exports = router;
