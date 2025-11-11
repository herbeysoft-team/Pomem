const express = require("express");
const router = express.Router();

const {
  signup,
  signin,
  alluser,
  allusercount,
  updateuser,
  deleteuser,
  getuser,
  changepassword,
  getuserprofile,
  getuserstats,
  saveExpoPushToken
} = require("../controller/user");

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/alluser", alluser);
router.get("/allusercount", allusercount);
router.put("/updateuser/:id", updateuser);
router.delete("/:id", deleteuser);
router.get("/getuser/:id", getuser);
router.get("/getuserstats/:id", getuserstats);
router.get("/getuserprofile/:id", getuserprofile);
router.post("/changepassword", changepassword);
router.post("/token/:id/:token", saveExpoPushToken)

module.exports = router;
