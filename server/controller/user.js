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

//Get all user
exports.alluser = async (req, res) => {
  try {
    const getUsers = await db.getall(
      "SELECT *,users.id as id, staff.id as staff_id FROM users, staff, departments WHERE  users.id = staff.user_id AND staff.dept_id = departments.id",
      []
    );
    if (getUsers) {
      res.status(201).json(getUsers);
    }
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
    console.log(error);
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
    if (admin) {
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
