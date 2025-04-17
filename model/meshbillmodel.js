const mongoose = require("mongoose");

const messSettingSchema = new mongoose.Schema({
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  monthlyRate: { type: Number, required: true },
  semfees:{type:Number,require},
  elect:{type:Number,require:true},
  water:{type:Number,require:true},
  serventsalary:{type:Number,require:true},
  
  
  

}, { timestamps: true });

const MessModel = mongoose.model("MessSetting", messSettingSchema);
module.exports = MessModel;
