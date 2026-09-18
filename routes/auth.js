const express=require("express");
const router=express.Router();
const User = require("../models/User");

router.get("/login",(req,res)=>{
    res.render("auth/login.ejs",{user:req.session.user});
});
router.post("/login",async(req,res)=>{
    const {email,password}=req.body;
    const user=await User.findOne({email,password});
    if(!user)
        {
        return res.status(404).send("Invalid email Or password");
    } 
    req.session.user=user;
     if(user.role==="Admin"){
        return res.redirect("/admin/dashboard");
    }
    if(user.role==="Doctor"){
        return res.redirect("/doctor/dashboard");
    }
    return res.redirect("/patient/dashboard"); 
});
 
router.get("/register",(req,res)=>{
    res.render("auth/register");
})

router.post("/register",async(req,res)=>{
    const{name,email,password,role}=req.body;
    await User.create({name,email,password,role});
    res.redirect("/auth/login");
}) 

router.get("/logout",(req,res)=>{
    req.session.destroy((err)=>{
        if(err){
            return res.status(500).send("Logout failed");
        }
        res.redirect("/");
    });
});

module.exports=router;