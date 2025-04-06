const mongoose=require("mongoose");
const studentSchema=new mongoose.Schema({
    name:{type:String,required:true},
rollNumber:{type:String,unique:true,required:true},
    password:{type:String,required:true},
    phonenumber:{type:String,required:true},
    parentsnumber:{type:String,required:true},
    homestate:{type:String,required:true},
    pincode:{type:String,required:true},
    hostel:{type:String,enum:["nbh","hostelB",'hostelC'],required:true},
    batchYear:{type:String,required:true}
})
const studentmodel=mongoose.model('student',studentSchema);
module.exports=studentmodel