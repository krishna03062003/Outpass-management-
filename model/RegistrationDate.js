// models/RegistrationDate.js
const mongoose=require('mongoose')

const registrationDateSchema = new mongoose.Schema({
  allowedDate: {
    type: String, // Format: YYYY-MM-DD
    required: true,
  }
}, { timestamps: true });


const RegistrationDateModel = mongoose.model("RegistrationDate", registrationDateSchema);
module.exports = RegistrationDateModel;
