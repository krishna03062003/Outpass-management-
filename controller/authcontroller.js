const bcrypt=require('bcryptjs');
const studentmodel = require('../model/usermodel');
const jwt = require("jsonwebtoken");
const adminmodel = require('../model/adminmodel');
const RegistrationDateModel = require('../model/RegistrationDate');




const register = async (req, res) => {
    try {
        const { name, rollNumber, password, phonenumber, parentsnumber, homestate, pincode, batchYear } = req.body;

        const now = new Date();
        const today = now.getFullYear() + "-" + 
                      String(now.getMonth() + 1).padStart(2, '0') + "-" + 
                      String(now.getDate()).padStart(2, '0');

        const dateSetting = await RegistrationDateModel.findOne();
        if (!dateSetting) {
            return res.status(403).json({ message: "Registration date not set by admin." });
        }
        
        const allowedDate = new Date(dateSetting.allowedDate).toISOString().split('T')[0];
        
        console.log("Today:", today);
        console.log("Allowed Date:", allowedDate);
        
        if (today !== allowedDate) {
            return res.status(403).json({ message: "Registration not open yet. Please wait." });
        }
        // Check if roll number is already registered
        const existingStudent = await studentmodel.findOne({ rollNumber });
        if (existingStudent) {
            return res.status(400).json({ message: "Student already registered" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create new student
        const newStudent = new studentmodel({
            name,
            rollNumber,
            password: hashedPassword,
            phonenumber,
            parentsnumber,
            homestate,
            pincode,
       
            batchYear
        });

        await newStudent.save();
        res.status(201).json({ message: "Student registered successfully", student: newStudent });

    } catch (error) {
      console.error("Registration error:", error); // Log it to terminal
      res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

const login = async (req, res) => {
    try {
      const { rollNumber, password } = req.body;
  
      if (!rollNumber || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }
  
      const student = await studentmodel.findOne({ rollNumber });
      if (!student) {
        return res.status(400).json({ message: "Roll number is not registered" });
      }
  
      const match = await bcrypt.compare(password, student.password);
      if (!match) {
        return res.status(400).json({ message: "Invalid password" });
      }
  
      const payload = {
        id: student._id ,
        name: student.name,
        rollNumber: student.rollNumber,
        batchYear: student.batchYear,
        hostel: student.hostel,
      };
  
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
  
      // ✅ Set cookie securely
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // true only in production (https)
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
  
      return res.status(201).json({ message: "Student logged in", student: payload });
    } catch (error) {
      console.error("Login Error:", error.message);
      res.status(500).json({ message: "Internal error occurred", error: error.message });
    }
  };
  const logout = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });
    return res.status(200).json({ message: "Logged out successfully" });
};

const adminLogin = async (req, res) => {
  const { name, password } = req.body;

  if (name === process.env.ADMIN_NAME &&
    password === process.env.ADMIN_PASSWORD) {
    const token = jwt.sign({ name, role: "admin" }, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });

    res.cookie("adminToken", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: false,  
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({ message: "Admin logged in", admin: name });
  } else {
    return res.status(401).json({ message: "Invalid credentials" });
  }
};


const adminlogout = (req, res) => {
  res.clearCookie("adminToken", {
      httpOnly: true,
      secure:true,
      sameSite: "strict",
  });
  return res.status(200).json({ message: "Logged out successfully" });
};


  module.exports={register,login,logout,adminLogin,adminlogout};
