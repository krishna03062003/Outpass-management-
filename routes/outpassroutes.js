const express = require("express");
const { createOutpass, getOutpassesByRollNumber} = require("../controller/outpasscontroller");
const authenticate = require("../middleware/authanticate");
const router = express.Router();


router.post('/createoutpass',authenticate,createOutpass);
router.get("/:rollNumber",authenticate,getOutpassesByRollNumber)


module.exports=router