const db = require("../config/database");

//create a comment
exports.createcomment = async (req, res) => {
  const { id, userId, deptId, subject } = req.body;
  const currentDate = new Date();
  try {
    const comment = await db.insert(
      "INSERT INTO comments (memo_id, user_id, depart_id, comment, comment_date) VALUES (?,?,?,?,?)",
      [id, userId, deptId, subject, currentDate.toLocaleString()]
    );
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
    console.log(error);
  }
};
