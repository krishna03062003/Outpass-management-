const outpassModel = require("../model/outpassmodel");
const studentmodel = require("../model/usermodel");


const createOutpass = async (req, res) => {
    try {
      const { outDate, inDate, reason, place, address } = req.body;
      const student = req.student;
      const existingOutpass = await outpassModel.findOne({
        student: student._id,
        entry: "Open"
      });
  
      if (existingOutpass) {
        return res.status(400).json({ message: "Please close your previous entry before creating a new one." });
      }
      const newOutpass = new outpassModel({
        student: student._id,
        outDate,
        inDate,
        reason,
        place,
        address,
      
      });
  
      await newOutpass.save();
      return res.status(201).json({ message: 'Outpass created successfully' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error while creating outpass' });
    }
  };

const getOutpassesByRollNumber = async (req, res) => {
    try {
        const { rollNumber } = req.params;

        // Find student by roll number
        const student = await studentmodel.findOne({ rollNumber });
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        // Find outpasses linked to the student (using ObjectId reference)
        const outpasses = await outpassModel.find({ student: student._id }).populate("student", "name rollNumber hostel batchYear  phonenumber parentsnumber ");

        if (outpasses.length === 0) {
            return res.status(404).json({ message: "No outpasses found for this student" });
        }

        return res.status(200).json({ outpasses });
    } catch (error) {
        res.status(500).json({ message: "Error fetching outpasses", error: error.message });
    }
};
const getOutpass=async(req,res)=>{
  try {
    // Get ID from req.user
           const Outpass = await outpassModel.find();
   
           if (!Outpass) {
               return res.status(404).json({ message: "outpass not found" });
           }
   
           res.status(200).json(Outpass);
       } catch (error) {
           res.status(500).json({ message: "Internal error occurred", error: error.message });
       }

}
const reject = async (req, res) => {
  try {
      

     const id = req.params.id;   // Get ID from req.user
      const outpass = await outpassModel.findByIdAndDelete({ _id: id });

      if (!outpass) {
          return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json(outpass);
  } catch (error) {
      res.status(500).json({ message: "Internal error occurred", error: error.message });
  }
};

const approve = async (req, res) => {
  try {
    const id = req.params.id;

    const updatedOutpass = await outpassModel.findByIdAndUpdate(
      id,
      { status: "Approved" },
      { new: true } // Return updated document
    );

    if (!updatedOutpass) {
      return res.status(404).json({ message: "Outpass not found" });
    }

    res.status(200).json({
      message: "Outpass approved successfully",
      outpass: updatedOutpass,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal error occurred",
      error: error.message,
    });
  }
};

const entry = async (req, res) => {
  try {
    const id = req.params.id;

    const updatedOutpass = await outpassModel.findByIdAndUpdate(
      id,
      { entry: "Close" },
      { new: true } // Return updated document
    );

    if (!updatedOutpass) {
      return res.status(404).json({ message: "Outpass not found" });
    }

    res.status(200).json({
      message: "Outpass close successfully",
      outpass: updatedOutpass,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal error occurred",
      error: error.message,
    });
  }
};


module.exports={createOutpass,getOutpassesByRollNumber,getOutpass,reject,approve,entry}