const express=require("express");
const router=express.Router();
const Department=require("../models/Department");

router.get("/",async(req,res)=>{
const departments=await Department.find();
res.render("department/index",{departments,user:req.session.user});
});
//add new departments
router.post("/",async(req,res)=>{
    const {name,description}=req.body;
    await Department.create({name,description});
    res.redirect("/departments");
})
//Edit page form
router.get("/edit/:id",async(req,res)=>{

    const department=await Department.findById(req.params.id);
    res.render("department/edit.ejs",{department});
}) 
//update route
router.post("/update/:id",async(req,res)=>{
    const {name,description}=req.body;
    console.log(await Department.findByIdAndUpdate(req.params.id,{name,description}));
    res.redirect("/departments");
})
//delete route
router.delete("/:id",async(req,res)=>{
    await Department.findByIdAndDelete(req.params.id);
    res.redirect("/departments");
})
module.exports=router;