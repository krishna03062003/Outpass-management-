const express = require("express");

const {  SingleStudent } = require("../controller/Student");
const authenticate = require("../middleware/authanticate");
const router = express.Router();

router.get("/me", authenticate, SingleStudent);

module.exports=router