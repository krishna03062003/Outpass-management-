
const outpassModel = require("../model/outpassmodel");
const prevMessModel = require("../model/prevmeshbill");
const studentModel = require("../model/usermodel");

// Set mess rate and date range
const setMessRate = async (req, res) => {
  try {
    const { startDate, endDate, monthlyRate,semfees,elect,water, serventsalary } = req.body;

    if (!startDate || !endDate  ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let setting = await prevMessModel.findOne().sort({ createdAt: -1 });

    if (setting) {
      setting.startDate = new Date(startDate);
      setting.endDate = new Date(endDate);
      setting.monthlyRate = monthlyRate;
      setting.semfees=semfees;
      setting.elect=elect;
      setting.water=water;
      setting.serventsalary=serventsalary;


      await setting.save();
      return res.status(200).json({ message: "Mess rate updated", setting });
    }

    setting = new prevMessModel({
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      monthlyRate,
      semfees,
      elect,
      water,
      serventsalary,
    });

    await setting.save();
    res.status(201).json({ message: "Mess rate created", setting });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get mess bills
const getAllMessBills = async (req, res) => {
    try {
      const setting = await prevMessModel.findOne().sort({ createdAt: -1 });
      if (!setting) return res.status(404).json({ message: "Mess rate not set" });
  
      const students = await studentModel.find();
      const startRange = new Date(setting.startDate);
      const endRange = new Date(setting.endDate);
      startRange.setHours(0, 0, 0, 0);
      endRange.setHours(0, 0, 0, 0);
  
      const totalDaysInMonth = Math.floor((endRange - startRange) / (1000 * 60 * 60 * 24)) + 1;
  
      const bills = [];
  
      for (const student of students) {
        const outpasses = await outpassModel.find({
          student: student._id,
          place: "Home",
          status: { $in: ["Approved", "entry_closed"] },
          outDate: { $lte: endRange },
          inDate: { $gte: startRange },
        });
  
        let totalDaysAbsent = 0;
  
        for (const op of outpasses) {
          const out = new Date(op.outDate);
          const entry = new Date(op.inDate);
  
          const actualStart = new Date(Math.max(out, startRange));
          const actualEnd = new Date(Math.min(entry, endRange));
          actualStart.setHours(0, 0, 0, 0);
          actualEnd.setHours(0, 0, 0, 0);
  
          if (actualStart <= actualEnd) {
            const daysAbsent = Math.floor((actualEnd - actualStart) / (1000 * 60 * 60 * 24)) + 1;
            totalDaysAbsent += daysAbsent;
          }
        }
       const totalDaysPresent=totalDaysInMonth-totalDaysAbsent;
  
        // ✅ Multiply days absent directly with monthlyRate
        const totalBill = totalDaysPresent * setting.monthlyRate;
        const totalmessbill=totalBill+setting.elect+setting.water+setting.serventsalary;
        
        bills.push({
          name: student.name,
          rollNumber: student.rollNumber,
          hostel: student.hostel,
          totalDaysAbsent,
          totalBill,
          elect:setting.elect,
          water:setting.water,
          semfees:setting.semfees,
          serventsalary:setting.serventsalary,
          totalmessbill,
        });
      }
  
      return res.status(200).json({
        bills,
        monthlyRate: setting.monthlyRate,
        totalDaysInMonth,
        dateRange: {
          from: startRange.toISOString().slice(0, 10),
          to: endRange.toISOString().slice(0, 10),
        },
      });
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  };

module.exports = { setMessRate, getAllMessBills };
