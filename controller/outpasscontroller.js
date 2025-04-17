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
      
  if(outDate<= inDate){
    await newOutpass.save();
    return res.status(201).json({ message: 'Outpass created successfully' });
  } else{
    return res.status(400).json({message:"wrong date plese enter valid data"})
  }
     
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error while creating outpass' });
    }
  };

  const getOutpassesByRollNumber = async (req, res) => {
    try {
      const { rollNumber } = req.params;
  
      //  Secure check: only allow access to their own outpasses
      if (!req.admin && req.student?.rollNumber !== rollNumber) {
        return res.status(403).json({ message: "Access denied. You cannot view other students' outpasses." });
      }
  
      // Find student by roll number
      const student = await studentmodel.findOne({ rollNumber });
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }
  
      // Find outpasses linked to the student (using ObjectId reference)
      const outpasses = await outpassModel.find({ student: student._id }).populate(
        "student",
        "name rollNumber hostel batchYear phonenumber parentsnumber"
      );
  
      if (outpasses.length === 0) {
        return res.status(404).json({ message: "No outpasses found for this student" });
      }




      return res.status(200).json({ outpasses});
    } catch (error) {
      res.status(500).json({ message: "Error fetching outpasses", error: error.message });
    }
  };
  
const getOutpass=async(req,res)=>{
  try {
    // Get ID from req.user
           const Outpass = await outpassModel.find().populate('student');;
   
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
     const exist=await outpassModel.findOne({status:"Approve"});
     if(exist){
      return res.status(404).json({message:"outpass approved all ready"})
     }
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

const getMessBill = async (req, res) => {
  try {
    const { rollNumber } = req.params;

    // ✅ Fetch per-day mess rate from database
    const messRateSetting = await MessRateModel.findOne();
    const messRate = messRateSetting?.perDayRate || 100;

    // ✅ Get the student
    const student = await studentmodel.findOne({ rollNumber });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // ✅ Get all Approved or entry_closed outpasses of type "Home"
    const outpasses = await outpassModel.find({
      student: student._id,
      type: "Home",
      status: { $in: ["Approved", "entry_closed"] }
    });

    let totalDays = 0;

    outpasses.forEach(outpass => {
      const out = new Date(outpass.outDate);
      const entry = new Date(outpass.inDate);

      if (!isNaN(out) && !isNaN(entry) && out <= entry) {
        // Always use UTC diff to avoid timezone issues
        const timeDiff = entry.setHours(0,0,0,0) - out.setHours(0,0,0,0);
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24)) + 1;
        totalDays += days;
      }
    });

    const totalMessBill = totalDays * messRate;

    res.status(200).json({
      student: {
        name: student.name,
        rollNumber: student.rollNumber,
        hostel: student.hostel,
        batchYear: student.batchYear
      },
      totalOutpasses: outpasses.length,
      totalAbsentDays: totalDays,
      messRatePerDay: messRate,
      totalMessBill: totalMessBill
    });

  } catch (error) {
    console.error("Error calculating mess bill:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
module.exports={createOutpass,getOutpassesByRollNumber,getOutpass,reject,approve,entry,getMessBill }