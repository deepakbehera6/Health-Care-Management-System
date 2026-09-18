const express=require("express");
const router=express.Router();
const Appointment=require("../models/Appointment");
const Department=require("../models/Department");
const User=require("../models/User");
const session = require("express-session");

//Book a form
router.get("/book",async(req,res)=>{
    const departments=await Department.find();
    const doctors=await User.find({role:"Doctor"});
    res.render("appointment/book.ejs",{departments,doctors});
});
router.post("/book",async(req,res)=>{

    const {doctor,department,appointmentDate,notes}=req.body;

     await Appointment.create({
        patient:req.session.user._id,
        doctor,
        department,
        appointmentDate,
        notes
    });
    res.redirect("/appointments"); 
})


router.get("/",async(req,res)=>{
    const appointments=await Appointment.find().populate("patient  doctor department");
    res.render("appointment/list.ejs",{appointments,user:req.session.user});
})

router.post("/status/:_id",async(req,res)=>{
    const {status}=req.body;
   await Appointment.findByIdAndUpdate(req.params._id,{status});
   res.redirect("/appointments");
})

module.exports=router;