const express = require("express");
const { register, login, logout } = require("../controller/authcontroller");
const authenticate = require("../middleware/authanticate");
const RegistrationDateModel = require("../model/RegistrationDate");


const router = express.Router();

router.post("/register", register);


router.get('/check-auth',authenticate, (req, res) => {
    res.status(200).json({
      message: "Authenticated",
      student: req.student
    });
  });
  router.get('/registration-date', async (req, res) => {
    try {
      const setting = await RegistrationDateModel.findOne();
      if (!setting) {
        return res.status(404).json({ message: "Registration date not set" });
      }
      // Ensure the date is in YYYY-MM-DD format
      const allowedDate = setting.allowedDate.toString().split('T')[0]; 
      res.status(200).json({ allowedDate });
    } catch (err) {
      res.status(500).json({ error: "Something went wrong" });
    }
  });
  

router.post('/login',login);
router.post('/logout',logout)
module.exports=router
