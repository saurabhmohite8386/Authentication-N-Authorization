const bcrypt = require("bcrypt");
const user = require("../model/userData");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.signup = async (req,res) =>{
    try {
        const {name,email,password,role} = req.body;
        //check if the user has already signed up
        const existingUser = await user.findOne({email});

        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"User already SignedUp!!!",
            })
        }

        //now encrypt the passsword
        let hashedPassword;
        try {
            hashedPassword = await bcrypt.hash(password,10);
        } 
        catch (error) {
            return res.status(500).json({
                success:false,
                message:"Error in Hashing password!!!",
            })
        }

        //Create entry for user in the datbase
        const userdata = await user.create({
            name,email,password:hashedPassword,role
        });

        return res.status(200).json({
            success:true,
            message:"User SignedUp successfully!!!",
        })
    } 
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"User cannot be registered. Try again later!!!",
        })
    }
}

exports.login = async (req,res) =>{
    try {
        //fetch data from req body
        const {email,password} = req.body;
        //validate the data
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"Please fill data carefully!!!",
            });
        }
        //check if the user is registered or not
        let userdetail = await user.findOne({email});
        //if not registered the return responce to register first
        if(!userdetail){
            return res.status(401).json({
                success: false,
                message:"User not registered!!!",
            });
        }

        const payload = {
            email:userdetail.email,
            id:userdetail._id,
            role:userdetail.role,
        };

        //if the user is registered then validate the password
        if(await bcrypt.compare(password,userdetail.password)){
            //if password is correct
            let token = jwt.sign(payload , process.env.JWT_SECRET,
                                    {
                                        expiresIn:"2h",
                                    }
                
            );
            userdetail = userdetail.toObject();
            //add token in userdetail object
            userdetail.token = token;
            //remove password field from userdetail object
            userdetail.password = undefined;
            //send cookie in responce
            const option = {
                expires:new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly:true,
            };
            res.cookie("token",token,option).status(200).json({
                success:true,
                message:"User logged in successfully!!!",
                token,
                userdetail,

            });
        }
        else{
            //if password is incorrect
            return res.status(403).json({
                success:false,
                message:"Password Incorrect!!!",
            });
        }
    } 
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Could not login Try again later!!!",
        });
    }
}