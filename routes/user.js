const express = require("express");
const router = express.Router();
//import controllers
const {login,signup} = require("../controller/auth");
const {auth,isStudent,isAdmin} = require("../middleware/authnAuth");

router.post("/login" , login);
router.post("/signup" , signup);

//Protected routes
router.get("/test",auth,(req,res) => {
    return res.status(200).json({
        success:true,
        message:"Welcome to the Protected route for Testing!!!",
    });

});

router.get("/student",auth,isStudent,(req,res) => {
                                                    return res.status(200).json({
                                                        success:true,
                                                        message:"Welcome to the Protected route for Students!!!",
                                                    });
                        
});

router.get("/admin",auth,isAdmin,(req,res) => {
    return res.status(200).json({
        success:true,
        message:"Welcome to the Protected route for Admin!!!",
    });

});

module.exports = router;