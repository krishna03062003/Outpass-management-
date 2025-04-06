const studentmodel = require("../model/usermodel");


const getAllstudent = async (req, res) => {
    try {
 // Get ID from req.user
        const user = await studentmodel.find();

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Internal error occurred", error: error.message });
    }
};

const SingleStudent = async (req, res) => {
    try {
      const studentId = req.student._id; // You get this from your JWT token via authenticate middleware
      const student = await studentmodel.findById(studentId);
  
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }
  
      res.status(200).json(student);
    } catch (error) {
      res.status(500).json({ message: "Internal error occurred", error: error.message });
    }
  };
module.exports={getAllstudent,SingleStudent}