const mongoose =require('mongoose')
const connectDB=async()=>{
    try{ 
        await mongoose.connect(process.env.MONGO_URI);
        console.log("database connected")

    }catch(error){
        console.error("database connnection failed")
    }
}
module.exports=connectDB