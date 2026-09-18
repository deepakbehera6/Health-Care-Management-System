const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const MedicalRecord = require('../models/MedicalRecord');

router.get("/dashboard",async(req,res)=>{
    if(!req.session.user||req.session.user.role!=="Patient"){
        return res.redirect("auth/login");
    }
    const appointments=await Appointment.find({patient:req.session.user._id}).populate("doctor department");

    const records=await MedicalRecord.find({patient:req.session.user._id}).populate("doctor");

    res.render("patient/dashboard",{
        appointments,records,user:req.session.user
    });
})

module.exports = router;