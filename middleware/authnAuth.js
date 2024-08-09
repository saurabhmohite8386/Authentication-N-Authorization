// 1)authentication-> 1.auth 2)authorization-> 1.isStudent 2.isAdmin
require("dotenv").config();
const jwt = require("jsonwebtoken");


exports.auth = (req,res,next) =>{
    try {
        //import token
        const token = req.body.token;
        //check if token is persent or not
        if(!token){
            return res.status(401).json({
                success:false,
                message:"Token Unavailabel!!!",
            });
        }
        //verify token
        try {
            const payload = jwt.verify(token,process.env.JWT_SECRET);
            console.log(payload);
            //insert the payload into request
            req.user = payload;

        } catch (error) {
            return res.status(401).json({
                success:false,
                message:"Token Invalid!!!",
            });
        }
        next();


    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Something went Wrong!!!",
        });
    }
}


exports.isStudent = (req,res,next) =>{
    try {
        if(req.user.role !== "Student"){
            return res.status(401).json({
                success:false,
                message:"This is Protected route for Students!!!",
            });
        }
        next();
        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"User role is not Matching!!!",
        });
    }
}


exports.isAdmin = (req,res,next) =>{
    try {
        if(req.user.role !== "Admin"){
            return res.status(401).json({
                success:false,
                message:"This is Protected route for Admin!!!",
            });
        }
        next();
        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"User role is not Matching!!!",
        });
    }
}