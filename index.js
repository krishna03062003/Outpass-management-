const express=require('express');
require("dotenv").config();
const cors=require('cors');
const connectDB = require('./config/mongodb');
const connectCloudinary = require('./config/cloudinary');
const cookieParser = require("cookie-parser");

connectDB();
connectCloudinary();
const app = express();
app.use(express.json());  

// Middleware must be before routes
app.use(cors({
  origin: "http://localhost:5173", // Your frontend URL
  credentials: true,
}));


app.use(cookieParser());


app.use('/api/auth', require('./routes/authroutes'));
app.use('/api/outpass',require('./routes/outpassroutes'));
app.use('/api/admin',require('./routes/Adminroutes'));
app.use('/api/student',require('./routes/Studentroutes'))



const PORT = process.env.PORT || 8000;  // Set a fallback port
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});