const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const User = require('../models/User');
const { ensureAuthenticated } = require('../routes/auth');
const { error } = require('console');

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{cb(null,"uploads/");
},
    filename:(req,file,cb)=>{
        const uniqueSuffix=Date.now()+"-"+Math.round(Math.random()*1E9);
        cb(null,"profile-"+ uniqueSuffix+path.extname(file.originalname));
    }
})
const fileFilter=(req,file,cb)=>{
    if(file.mimetype.startsWith("image/")){
        cb(null,true);
    }else{
        cb(new Error("Only Image file"),false);
    }
};
const upload=multer({
    storage:storage,
    fileFilter:fileFilter,
    limits:{fileSize:2*1024*1024}
});
 
router.get("/",async(req,res)=>{
    const user=await User.findById(req.session.user._id);
    res.render("profile/index",{user,message:null,error:null});
})

router.post("/update",upload.single("profilePicture"),async(req,res)=>{
    const {email}=req.body;
    const updateData={email};



    if(req.file){
        updateData.profilePicture=`/uploads/${req.file.filename}`;
    }

    const updateUser=await User.findByIdAndUpdate(req.session.user._id,
        updateData,{new:true}
    );
   
    req.session.user=updateUser;

    res.render("profile/index",{user:updateUser,
        message:"profile Updated successfully!!",
        error:null
    })
})

router.post("/change-password",async(req,res)=>{
    if(!req.session.user){
        return res.redirect("/auth/login");
    }
    const {currentPassword,newPassword,confirmPassword}=req.body;
    const currentUser=await User.findById(req.session.user.id);
    
    if(currentUser.password !== currentPassword){
        return res.render("profile/index",{
            user:currentUser,
            message:null,
            error:"Incorrect Current Password"
        })
    }
    if(newPassword!==confirmPassword){
        return res.render("profile/index",{
            user:currentUser,
            message:null,
            error:"New Password Do Not Match"
        })
    }
    currentUser.password=newPassword;
    await currentUser.save();

    res.render("profile/index",{
        user:currentUser,
        message:"Password Updated Successfully!!",
        error:null
    })
})
module.exports=router;