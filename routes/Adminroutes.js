const express = require("express");

const { getAllstudent } = require("../controller/Student");
const { getOutpass, reject, approve, entry, getOutpassesByRollNumber, getMessBill } = require("../controller/outpasscontroller");
const { adminLogin, adminlogout, admin } = require("../controller/authcontroller");
const adminAuth = require("../middleware/admiaunticate");
const { setRegistrationDate } = require("../controller/admincontroller");
const { setMessRate, getAllMessBills } = require("../controller/messSettingController");

const router = express.Router();

router.post('/login',adminLogin);
router.post('/logout',adminlogout);
router.post('/set-date',adminAuth,setRegistrationDate);
router.get("/admin", adminAuth, (req, res) => {
  res.status(200).json({ name: req.admin.name }); 
});
router.get('/check-auth', adminAuth, (req, res) => {
  res.status(200).json({
    message: "Admin authenticated",
    admin: req.admin,  // This will contain the admin info from the decoded token
  });
});

router.get('/mess-bill/:rollNumber', adminAuth,getMessBill);
router.get('/students',adminAuth,getAllstudent)
router.get('/outpasses',adminAuth,getOutpass)
router.delete('/reject/:id',adminAuth,reject);
router.put('/approve/:id',adminAuth,approve);
router.put('/entry/:id',adminAuth,entry);


router.put('/messrate', adminAuth, setMessRate);   // Sets per-day rate
router.get('/messbill', adminAuth, getAllMessBills); // Gets mess bills for all students
router.get("/admin/outpass/:rollNumber", adminAuth, getOutpassesByRollNumber);

module.exports=router