const express = require("express");
const authenticate = require("../middleware/authanticate");
const { getAllstudent } = require("../controller/Student");
const { getOutpass, reject, approve, entry } = require("../controller/outpasscontroller");
const router = express.Router();
router.get('/students',authenticate,getAllstudent)
router.get('/outpasses',authenticate,getOutpass)
router.delete('/reject/:id',authenticate,reject);
router.put('/approve/:id',authenticate,approve);
router.put('/entry/:id',authenticate,entry);

module.exports=router