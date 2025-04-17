// controllers/adminController.js

const RegistrationDateModel =require('../model/RegistrationDate')




const setRegistrationDate = async (req, res) => {
  try {
    const { allowedDate } = req.body; // YYYY-MM-DD format

    const existing = await RegistrationDateModel.findOne();
    if (existing) {
      existing.allowedDate = allowedDate;
      await existing.save();
      return res.json({ message: "Registration date updated" });
    }

    await RegistrationDateModel.create({ allowedDate });
    res.status(201).json({ message: "Registration date set successfully" });

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports={setRegistrationDate}