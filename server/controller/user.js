require("dotenv").config();
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const db = require("../config/database");

const secret = process.env.JWT_KEY;

//register user here
exports.signup = async (req, res) => {
  const {
    firstname,
    lastname,
    middlename,
    email,
    password,
    phone_no,
    username,
    dept_id,
    role,
  } = req.body;

  try {
    const oldUser = await db.getval(
      "SELECT * FROM users WHERE email = ? OR username = ?",
      [email, username]
    );
    if (oldUser) {
      return res.status(400).json({ message: "user already exist" });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const result = await db.insert(
      "INSERT INTO users (firstname, lastname, middlename, email, password, role, phone_no, username) VALUES (?,?,?,?,?,?,?,?)",
      [
        firstname,
        lastname,
        middlename,
        email,
        hashedPassword,
        role,
        phone_no,
        username,
      ]
    );
    if (result) {
      const result2 = await db.insert(
        "INSERT INTO staff (user_id, dept_id) VALUES (?,?)",
        [result, dept_id]
      );
      //console.log(result2);
    }
    const token = jwt.sign(
      { email: result.email, id: result.id, username: result.username },
      secret,
      { expiresIn: "1h" }
    );
    res.status(201).json({ result, token });
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
    console.log(error);
  }
};

//all user login here
exports.signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const oldUser = await db.getrow(
      "SELECT * FROM users  WHERE users.email = ? OR users.username = ? ",
      [email, email]
    );
    if (!oldUser)
      return res.status(404).json({ message: "user does not exist" });
    const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);
    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid Credentials" });
    const token = jwt.sign({ email: oldUser.email, id: oldUser.id }, secret, {
      expiresIn: "1h",
    });
    res.status(200).json({ result: oldUser, token });
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
    console.log(error);
  }
};

//Get all active user
exports.alluser = async (req, res) => {
  try {
    const getUsers = await db.getall(
      "SELECT *, users.id as id, staff.id as staff_id FROM users, staff, departments WHERE users.id = staff.user_id AND staff.dept_id = departments.id AND users.status = 'ACTIVE'",
      []
    );
    if (getUsers) {
      res.status(200).json(getUsers);
    } else {
      res.status(404).json({ message: "No active users found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
    console.error(error);
  }
};

//Get user profile
exports.getuserprofile = async (req, res) => {
  const { id } = req.params;
  try {
    const getUserProfile = await db.getall(
      "SELECT *,users.id as id, staff.id as staff_id FROM users, staff, departments WHERE  users.id = staff.user_id AND staff.dept_id = departments.id AND users.id = ?",
      [id]
    );
    if (getUserProfile) {
      res.status(201).json(getUserProfile[0]);
    }
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
    console.log(error);
  }
};

//Get all user count
exports.allusercount = async (req, res) => {
  try {
    const countAdmin = await db.getall(
      "SELECT id FROM users WHERE role = 'admin'",
      []
    );
    const countManager = await db.getall(
      "SELECT id FROM users WHERE role = 'manager'",
      []
    );
    const countStaff = await db.getall(
      "SELECT id FROM users WHERE role = 'staff'",
      []
    );
    if (countAdmin || countManager || countStaff) {
      res
        .status(201)
        .json({
          Admin: countAdmin.length,
          Manager: countManager.length,
          Staff: countStaff.length,
        });
    }
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
    console.log(error);
  }
};

//Get a user
exports.getuser = async (req, res) => {
  const { id } = req.params;
  try {
    const getUser = await db.getall(
      "SELECT staff.dept_id, departments.dept_name FROM staff, departments WHERE  staff.user_id = ? AND staff.dept_id = departments.id",
      [id]
    );
    if (getUser) {
      res.status(201).json(getUser[0]);
    }
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
    console.log(error);
  }
};

// Get user stats (raised + attend-to)
exports.getuserstats = async (req, res) => {
  const { id } = req.params;
  const status = "Pending"; // We’ll use this to count pending memos to attend to

  try {
    // 1️⃣ Count memos raised by this user
    const raisedResult = await db.getall(
      `SELECT COUNT(*) AS raisedCount 
       FROM memos 
       WHERE raised_by = ?`,
      [id]
    );
    const raisedCount = raisedResult[0]?.raisedCount || 0;

    // 2️⃣ Count memos user needs to attend to
    // Using same logic as your allmemostoattend endpoint
    const attendResult = await db.getall(
      `
      SELECT COUNT(DISTINCT memos.id) AS attendCount
      FROM memos
      JOIN notifications ON memos.id = notifications.memo_id
      WHERE memos.status = ? AND notifications.user_id = ?
      `,
      [status, id]
    );
    const attendCount = attendResult[0]?.attendCount || 0;

    // 3️⃣ (Optional) Count approved/rejected memos raised by user
    const statusBreakdown = await db.getall(
      `
      SELECT status, COUNT(*) AS count
      FROM memos
      WHERE raised_by = ?
      GROUP BY status
      `,
      [id]
    );

    // ✅ Return combined result
    res.status(200).json({
      userId: id,
      raisedCount,
      attendCount,
      statusBreakdown,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

//update user
exports.updateuser = async (req, res) => {
  const { id } = req.params;
  const {
    firstname,
    lastname,
    middlename,
    email,
    password,
    phone_no,
    username,
    dept_id,
    role,
  } = req.body;
  //const hashedPassword = await bcrypt.hash(password, 12);
  try {
    const user = await db.update(
      "UPDATE users SET firstname = ?, lastname = ?, middlename=?, email = ?, password = ?, phone_no = ?, username = ?, role = ? WHERE id = ?",
      [
        firstname,
        lastname,
        middlename,
        email,
        password,
        phone_no,
        username,
        role,
        id,
      ]
    );
    const staff = await db.update(
      "UPDATE staff SET  dept_id = ? WHERE user_id = ?",
      [dept_id, id]
    );

    if (staff) {
      res.status(201).json(staff);
    }
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
    console.log(error);
  }
};

//Delete User
exports.deleteuser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await db.delete("DELETE FROM users WHERE id = ?", [id]);

    if (user) {
      res.status(201).json({ message: "User Successfully Deleted" });
    }
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
    console.log(error);
  }
};

//all user password change
exports.changepassword = async (req, res) => {
  const { id, fpassword } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(fpassword, 12);
    const updatePassword = await db.update(
      "UPDATE users SET password = ? WHERE id = ?",
      [hashedPassword, id]
    );
    if (updatePassword) {
      return res
        .status(201)
        .json({ message: "Password Successsfully Changed" });
    }
  } catch (error) {
    //res.status(500).json({message: "something went wrong"});
    console.log(error);
  }
};

// Save Expo Push Token for a user
exports.saveExpoPushToken = async (req, res) => {
  const { id, token } = req.params;
  try {
    // Check if user exists
    const existingUser = await db.getval("SELECT id FROM users WHERE id = ?", [id]);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user's expo token
    const result = await db.update(
      "UPDATE users SET expo = ? WHERE id = ?",
      [token, id]
    );

    if (result) {
      return res.status(200).json({ message: "Expo push token saved successfully" });
    } else {
      return res.status(400).json({ message: "Failed to save Expo token" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong while saving token" });
  }
};

