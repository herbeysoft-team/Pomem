const express = require("express");
const router = express.Router();

const {
  creatememo,
  allmemos,
  allmemosbycategory,
  allmemosbyuser,
  allmemostoattend,
  getmemo,
  allmemocount,
  updatememostatus,
  memonotifcation,
  allmemosbysearch,
  deletememo,
} = require("../controller/memo");

router.post("/creatememo", creatememo);
router.post("/memonotification", memonotifcation);
router.post("/allmemosbysearch", allmemosbysearch);
router.get("/allmemos", allmemos);
router.get("/allmemosbycategory/:id", allmemosbycategory);
router.get("/allmemosbyuser/:id", allmemosbyuser);
router.get("/allmemostoattend/:id", allmemostoattend);
router.get("/allmemostoattend/:id", allmemostoattend);
router.get("/getmemo/:id", getmemo);
router.get("/allmemoscount", allmemocount);
router.put("/updatememostatus/:id", updatememostatus);
router.delete("/deletememo/:id", deletememo);

module.exports = router;
