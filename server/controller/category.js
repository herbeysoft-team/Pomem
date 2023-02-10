const db = require("../config/database");

//create a caterogy
exports.createcategory = async (req, res) => {
  const { cat_name } = req.body;
  try {
    const result = await db.insert(
      "INSERT INTO categories (cat_name) VALUES (?)",
      [cat_name]
    );
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
    console.log(error);
  }
};

//Get one category
exports.getcategory = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.getval(
      "SELECT cat_name FROM categories WHERE id = ?",
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

//Get all categories
exports.allcategories = async (req, res) => {
  try {
    const result = await db.getall("SELECT * FROM categories");
    if (result) {
      res.status(201).json(result);
    }
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
    console.log(error);
  }
};

//update one category
exports.updatecategory = async (req, res) => {
  const { id } = req.params;
  const { cat_name } = req.body;
  try {
    const result = await db.update(
      "UPDATE categories SET cat_name = ? WHERE id = ?",
      [cat_name, id]
    );
    if (result) {
      res.status(201).json(result);
    }
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
    console.log(error);
  }
};

//delete one category
exports.deletecategory = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.delete("DELETE FROM categories WHERE id = ?", [id]);
    if (result) {
      res.status(201).json({ message: "Department Successfully Deleted" });
    }
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
    console.log(error);
  }
};
