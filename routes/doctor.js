const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const MedicalRecord = require('../models/MedicalRecord');

router.get("/dashboard",async(req,res)=>{
    if(!req.session.user||req.session.user.role!=="Doctor"){
        return res.redirect("/auth/login");
    }
    const appointments=await Appointment.find({
        doctor:req.session.user._id
    }).populate("patient department");

    res.render("doctor/dashboard",{appointments,user:req.session.user});
});

router.post("/dashboard/status/:_id",async(req,res)=>{
    const {status}=req.body;
   await Appointment.findByIdAndUpdate(req.params._id,{status});
   res.redirect("/doctor/dashboard");
})

router.post("/medical-records/add",async(req,res)=>{
    const {patientId,diagnosis,prescription,notes}=req.body;
    await MedicalRecord.create({
        patient:patientId,
        doctor:req.session.user._id,
        diagnosis,
        prescription,
        notes
    });
    res.redirect("/doctor/dashboard");
})


module.exports = router;