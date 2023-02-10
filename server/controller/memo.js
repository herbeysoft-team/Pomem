const db = require("../config/database");

//create a memo
exports.creatememo = async (req, res) => {
  const { fromWho, fromDept, toWho, throughWho, category, subject, content } =
    req.body;
  const currentDate = new Date();
  const status = "Pending";

  try {
    const memo = await db.insert(
      "INSERT INTO memos (date_created, date_updated, department_id, category_id, raised_by, toWho, throughWho, status, subject, content) VALUES (?,?,?,?,?,?,?,?,?,?)",
      [
        currentDate.toLocaleString(),
        currentDate.toLocaleString(),
        fromDept,
        category,
        fromWho,
        toWho,
        throughWho,
        status,
        subject,
        content,
      ]
    );
    if (memo) {
      if (toWho) {
        const NotifyToWho = await db.insert(
          "INSERT INTO notifications (memo_id, user_id, date_updated) VALUES (?,?,?)",
          [memo, toWho, currentDate.toLocaleString()]
        );
      }
      if (throughWho) {
        const NotifyThroughWho = await db.insert(
          "INSERT INTO notifications (memo_id, user_id, date_updated) VALUES (?,?,?)",
          [memo, throughWho, currentDate.toLocaleString()]
        );
      }
      res.status(201).json(memo);
    }
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
    console.log(error);
  }
};

//Get one memo
exports.getmemo = async (req, res) => {
  const { id } = req.params;
  try {
    const memo = await db.getall("SELECT * FROM memos WHERE id = ?", [id]);
    const commentsForMemo = await db.getall(
      "SELECT users.firstname, users.lastname, departments.dept_name, comments.comment, comments.comment_date FROM comments, users, staff, departments WHERE users.id = staff.user_id AND staff.dept_id = departments.id AND users.id = comments.user_id AND comments.memo_id = ?",
      [id]
    );
    if (memo) {
      const createdBy = await db.getall(
        "SELECT users.firstname, users.lastname, departments.dept_name FROM users, staff, departments  WHERE users.id = staff.user_id AND staff.dept_id = departments.id AND users.id = ?",
        [memo[0].raised_by]
      );
      const toWho = await db.getall(
        "SELECT users.firstname, users.lastname, departments.dept_name FROM users, staff, departments  WHERE users.id = staff.user_id AND staff.dept_id = departments.id AND users.id = ?",
        [memo[0].toWho]
      );
      const throughWho = await db.getall(
        "SELECT users.firstname, users.lastname, departments.dept_name FROM users, staff, departments  WHERE users.id = staff.user_id AND staff.dept_id = departments.id AND users.id = ?",
        [memo[0].throughWho]
      );
      if (commentsForMemo) {
        res.status(201).json({
          memo: memo[0],
          createdBy: createdBy[0],
          toWho: toWho[0],
          throughWho: throughWho[0],
          comments: commentsForMemo,
        });
      } else {
        console.log({
          memo: memo[0],
          createdBy: createdBy[0],
          toWho: toWho[0],
          throughWho: throughWho[0],
        });
        res.status(201).json({
          memo: memo[0],
          createdBy: createdBy[0],
          toWho: toWho[0],
          throughWho: throughWho[0],
        });
      }
    }
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
    console.log(error);
  }
};

//Get all memos
exports.allmemos = async (req, res) => {
  try {
    const memo = await db.getall(
      "SELECT users.id AS user_id, users.firstname, users.lastname, departments.id AS department_id, departments.dept_name, categories.id AS category_id, categories.cat_name, memos.id as memo_id, memos.date_created, memos.subject, memos.status FROM memos,departments, categories, users WHERE memos.department_id = departments.id AND memos.category_id = categories.id AND memos.raised_by = users.id ORDER BY memos.id DESC"
    );
    if (memo) {
      res.status(201).json(memo);
    }
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
    console.log(error);
  }
};

//Get all memos by search
exports.allmemosbysearch = async (req, res) => {
  const { searchName } = req.body;
  console.log(req.body);
  try {
    const memo = await db.getall(
      "SELECT users.id AS user_id, users.firstname, users.lastname, departments.id AS department_id, departments.dept_name, categories.id AS category_id, categories.cat_name, memos.id as memo_id, memos.date_created, memos.subject, memos.status FROM memos, departments, categories, users WHERE memos.department_id = departments.id AND memos.category_id = categories.id AND memos.raised_by = users.id AND memos.subject LIKE ? ORDER BY memos.id DESC",
      [`%${searchName}%`]
    );
    if (memo) {
      res.status(201).json(memo);
    }
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
    console.log(error);
  }
};

//Get all memos by category
exports.allmemosbycategory = async (req, res) => {
  const { id } = req.params;
  try {
    const memo = await db.getall(
      "SELECT users.id AS user_id, users.firstname, users.lastname, departments.id AS department_id, departments.dept_name, categories.id AS category_id, categories.cat_name, memos.id as memo_id, memos.date_created, memos.subject, memos.status FROM memos, departments, categories, users WHERE memos.department_id = departments.id AND memos.category_id = categories.id AND memos.raised_by = users.id AND memos.category_id = ? ORDER BY memos.id DESC",
      [id]
    );
    if (memo) {
      res.status(201).json(memo);
    }
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
    console.log(error);
  }
};

//Get all memos created by a particular user
exports.allmemosbyuser = async (req, res) => {
  const { id } = req.params;
  try {
    const memo = await db.getall(
      "SELECT users.id AS user_id, users.firstname, users.lastname, departments.id AS department_id, departments.dept_name, categories.id AS category_id, categories.cat_name, memos.id as memo_id, memos.date_created, memos.subject, memos.status FROM memos, departments, categories, users WHERE memos.department_id = departments.id AND memos.category_id = categories.id AND memos.raised_by = users.id AND memos.raised_by = ? ORDER BY memos.id DESC",
      [id]
    );
    if (memo) {
      res.status(201).json(memo);
    }
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
    console.log(error);
  }
};

//Get all memos created by a particular user
exports.allmemostoattend = async (req, res) => {
  const { id } = req.params;
  const status = "Pending";
  try {
    const memo = await db.getall(
      "SELECT users.id AS user_id, users.firstname, users.lastname, departments.id AS department_id, departments.dept_name, categories.id AS category_id, categories.cat_name, memos.id as memo_id, memos.date_created, memos.subject, memos.status FROM memos, departments, categories, notifications, users WHERE memos.department_id = departments.id AND memos.id = notifications.memo_id AND memos.category_id = categories.id AND memos.raised_by = users.id AND memos.status = ? AND notifications.user_id = ? ORDER BY memos.id DESC",
      [status, id]
    );
    if (memo) {
      res.status(201).json(memo);
    }
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
    console.log(error);
  }
};

//Get all user count
exports.allmemocount = async (req, res) => {
  try {
    const countAll = await db.getall("SELECT id FROM memos");
    const countApproved = await db.getall(
      "SELECT id FROM memos WHERE status = 'Approved'",
      []
    );
    const countPending = await db.getall(
      "SELECT id FROM memos WHERE status = 'Pending'",
      []
    );
    const countRejected = await db.getall(
      "SELECT id FROM memos WHERE status = 'Rejected'",
      []
    );
    if (countApproved || countPending || countRejected) {
      res.status(201).json({
        AllMemos: countAll.length,
        Approved: countApproved.length,
        Pending: countPending.length,
        Rejected: countRejected.length,
      });
    }
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
    console.log(error);
  }
};

//update one memo status
exports.updatememostatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const currentDate = new Date();
  try {
    const memostatus = await db.update(
      "UPDATE memos SET status = ?, date_updated = ? WHERE id = ?",
      [status, currentDate.toLocaleString(), id]
    );
    if (memostatus) {
      res.status(201).json(memostatus);
    }
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
    console.log(error);
  }
};

//send memo notifcation
exports.memonotifcation = async (req, res) => {
  const { memo_id, user_id } = req.body;
  const currentDate = new Date();

  try {
    const SendMemoTo = await db.insert(
      "INSERT INTO notifications (memo_id, user_id, date_updated) VALUES (?,?,?)",
      [memo_id, user_id, currentDate.toLocaleString()]
    );
    if (SendMemoTo) {
      res.status(201).json({ message: "Notification Sent" });
    }
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
    console.log(error);
  }
};

//delete one memo
exports.deletememo = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.delete("DELETE FROM memos WHERE id = ?", [id]);
    if (result) {
      res.status(201).json({ message: "Memo Successfully Deleted" });
    }
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
    console.log(error);
  }
};
