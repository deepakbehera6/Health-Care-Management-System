const express=require("express");
const app=express();
const mongoose=require("mongoose");
const methodOverride=require("method-override");
const session = require('express-session');
const Department=require("./models/Department.js");
const User = require("./models/User.js");


const multer=require("multer");
const upload=multer({dest:"uploads/"});

const path=require("path");

const departmentRoutes = require("./routes/department.js");
const appointmentroute=require("./routes/appointment.js");
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const patientRoute=require("./routes/patient");
const doctorRoute=require("./routes/doctor");
const profileRoute=require("./routes/profile");



app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.use(session({
  secret: 'healthcare_secret_key',
  resave: false,
  saveUninitialized: true
})); 

app.use("/uploads",express.static(
    path.join(__dirname,"public/uplodads")
));

app.use("/departments",departmentRoutes);
app.use("/appointments",appointmentroute);
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use("/patient",patientRoute);
app.use("/doctor",doctorRoute);
app.use("/profile",profileRoute);



app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

 const MONGO_URL="mongodb://127.0.0.1:27017/healthCare";
main()
.then(()=>{
    console.log("connected to DB"); 
})
.catch((err)=>{
    console.log(err);
}); 

async function main(){
    await mongoose.connect(MONGO_URL);
} 



app.get("/",async(req,res)=>{
   const department=await Department.find().limit(4);
   const doctorCount=await User.countDocuments({role:"Doctor"});
   res.render("index",{department,doctorCount,user:req.session.user});
});

app.use("/uploads",express.static(path.join(__dirname,"uploads")));
const storage=multer.diskStorage({
    destination:(req,file,cb)=>cb(null,"uploads/"),
    filename:(req,file,cb)=>cb(null,`${Date.now()}-${file.originalname}`),
});

app.listen(3000,()=>{
    console.log("Server is listening to port 3000");
}) 