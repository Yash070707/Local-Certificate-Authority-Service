// routes/index.js
const express = require("express");
const router = express.Router();
const exampleController = require("../controllers/exampleController");
const login = require("../controllers/login");
// Define routes
router.get("/", (req, res) => {
  res.send("Welcome to the API!");
});

router.get("/example", exampleController.getExample);
router.post("/login", login.login);

module.exports = router;
