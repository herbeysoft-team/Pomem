const db = require("../config/database");

//create a department
exports.createdepartment = async (req, res) => {
  const { dept_name } = req.body;
  try {
    const result = await db.insert(
      "INSERT INTO departments (dept_name) VALUES (?)",
      [dept_name]
    );
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
    console.log(error);
  }
};

//Get one department
exports.getdepartment = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.getval(
      "SELECT dept_name FROM departments WHERE id = ?",
      [id]
    );
    if (result) {
      res.status(201).json(result);
    }
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
    console.log(error);
  }
};

//Get all departments
exports.alldepartments = async (req, res) => {
  try {
    const result = await db.getall("SELECT * FROM departments");
    if (result) {
      res.status(201).json(result);
    }
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
    console.log(error);
  }
};

//update one department
exports.updatedepartment = async (req, res) => {
  const { id } = req.params;
  const { dept_name } = req.body;
  try {
    const result = await db.update(
      "UPDATE departments SET dept_name = ? WHERE id = ?",
      [dept_name, id]
    );
    if (result) {
      res.status(201).json(result);
    }
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
    console.log(error);
  }
};

//delete one department
exports.deletedepartment = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.delete("DELETE FROM departments WHERE id = ?", [
      id,
    ]);
    if (result) {
      res.status(201).json({ message: "Department Successfully Deleted" });
    }
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
    console.log(error);
  }
};
