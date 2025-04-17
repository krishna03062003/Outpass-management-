const mongoose = require("mongoose");

const prevmessSettingSchema = new mongoose.Schema({
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  monthlyRate: { type: Number, required: true },
  semfees:{type:Number,require},
  elect:{type:Number,require:true},
  water:{type:Number,require:true},
  serventsalary:{type:Number,require:true},
  
  
  

}, { timestamps: true });

const prevMessModel = mongoose.model("prevMessSetting", prevmessSettingSchema);
module.exports = prevMessModel;
