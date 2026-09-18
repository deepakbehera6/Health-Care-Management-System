const express=require("express");
const router=express.Router();
const Department=require("../models/Department");
const Appointment=require("../models/Appointment");
const { route } = require("./department");
const User = require("../models/User");

router.get("/dashboard",async(req,res)=>{
     if(!req.session.user||req.session.user.role!=="Admin"){
        return res.redirect("auth/login");
    }
    const patientCount=await User.countDocuments({role:"Patient"});
    const doctorCount=await User.countDocuments({role:"Doctor"});
    const appointmentCount=await Appointment.countDocuments();

    const appointments=await Appointment.find().populate("patient doctor department");
res.render("admin/dashboard",{patientCount,
    doctorCount,
    appointmentCount,
    appointments,
    user:req.session.user
});

})

module.exports=router;