const express = require("express");
const router = express.Router();

const {
  createcategory,
  getcategory,
  allcategories,
  updatecategory,
  deletecategory,
} = require("../controller/category");

router.post("/createcategory", createcategory);
router.get("/getcategory/:id", getcategory);
router.get("/allcategories", allcategories);
router.put("/updatecategory/:id", updatecategory);
router.delete("/deletecategory/:id", deletecategory);

module.exports = router;
