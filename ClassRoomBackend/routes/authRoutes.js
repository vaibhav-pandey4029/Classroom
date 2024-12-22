const express = require('express');
const User = require('../models/userModel');
const Verification = require('../models/verificationModel');
const responseFunction = require('../utils/responseFunction')
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authTokenHandler = require('../middlewares/checkAuthToken');


// creating mail
const mailer = async (receivermail,code)=>{
//     let transporter = nodemailer.createTransport({
//         host:"smtp.gmail.com",
//         port:587,
//         secure:false,
//         requireTLS:true,
// // above parameters we need to always pass
// auth:{
//     user: process.env.COMPANY_EMAIL,
//     pass: process.env.GMAIL_APP_PASSWORD
// }
//         // above are the is and p[assword of the company now node js app is authorize to send mail do not need to open gmail
//     })

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", // Replace with your SMTP host
    port: 465, // Typically 465 for secure, or 587 for TLS
    secure: true, // true for 465, false for other ports
    auth: {
        user: process.env.COMPANY_EMAIL, // Your email address
        pass: process.env.GMAIL_APP_PASSWORD, // Your email password or app password
    },
    tls: {
        rejectUnauthorized: false, // Ignore self-signed certificate errors
    },
});

        let info = await transporter.sendMail({
            from: "Vaibhav Pandey",
            to: receivermail,
            subject:"OTP from Vaibhav's Classroom",
            text: "Your OTP is "+code,
            html: " <b>Your OTP is "+code+"</b>",
        })
    console.log("Message sent: %s",info.messageId);
    if(info.messageId){
        return true;
    }
    return false;
}


router.get('/',(req,res)=>{
    res.json({
        message:'Auth route home'
    })
})

router.post('/sendotp',async (req,res,next)=>{
    const { email } = req.body;
    if(!email){
        return responseFunction(res,400,"Email is required", null, false)
    }

    try{
        await Verification.deleteMany({email}) // just to delete the earlier otp if any present in database we are not going to store any otp in database
        const code = Math.floor(100000 + Math.random()*900000) // not a recommended approach to generate otp this can be guessed easily so it will be better if we use some built in packages to genrate otp
        const isSent = await mailer(email,code);
        const newVerification = new Verification({
            email,
            code,
        })
        await newVerification.save(); // saving the otp in database for now like when user provide email and otp from frontend to match then we need to match it and authorize the user accordingly.
        if(!isSent){
            return responseFunction(res,500,"Internal server error",null,false)
        }
        return responseFunction(res,200,"OTP sent Successfully",null,false)
    }catch(error){
        return responseFunction(res,400,"Internal Server error", null, false)
    }
})

router.post('/register',async (req,res)=>{
    const {name,email,password,otp,role} = req.body;
    if(!name||!email||!password||!otp||!role){
        return responseFunction(res,400,'All fields are required',null,false);
    }
    if(password.length<6){
        return responseFunction(res,400,'Password should be atleast 6 characters long',null,false);
    }
    try{
        let user = await User.findOne({email});
        const verificationQueue = await Verification.findOne({email});
        if(user){
            return responseFunction(res,400,'User already exists',null,false);
        }
        if(!verificationQueue){
            return responseFunction(res,400,'Please send OTP first',null,false);
        }
        // compare otp sent from frontend and otp in database
        const isMatch = await bcrypt.compare(otp,verificationQueue.code);
        if(!isMatch){
            return responseFunction(res,400,'Invalid OTP',null,false);
        }
        user = new User({
            name,
            email,
            password,
            role
        })
        await user.save(); // we ar̥e hashing password in user model already 
        await Verification.deleteOne({email}); // removing otp
        const authToken = jwt.sign({userId:user._id},process.env.JWT_SECRET_KEY,{expiresIn:'1d'});
        const refreshToken = jwt.sign({userId:user._id},process.env.JWT_REFRESH_SECRET_KEY,{expiresIn:'10d'});
        // These cookies will get set to cookies in frontend so we can set cookies from backend also just we need some permissiopns from frontend
        res.cookie('authToken',authToken,{httpOnly:true,secure:true,sameSite:'none'});
        res.cookie('refreshToken',refreshToken,{httpOnly:true,secure:true,sameSite:'none'})
        user.password =undefined;
        return responseFunction(res,200,'Registered Successful',null,false);
    }catch(error){
        return responseFunction(res,400,'Internal server error',null,false);
    }
})

router.post('/login',async (req,res)=>{
    try{
        const {email,password} =  req.body;
        const user = await User.findOne({email});
        if(!user){
            return responseFunction(res,400,'Invalid credentials',null,false);
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return responseFunction(res,400,'Incorrect credentials',null,false);
        }
        const authToken = jwt.sign({userId:user._id},process.env.JWT_SECRET_KEY,{expiresIn:'1d'});
        const refreshToken = jwt.sign({userId:user._id},process.env.JWT_REFRESH_SECRET_KEY,{expiresIn:'10d'});
        res.cookie('authToken',authToken,{httpOnly:true,secure:true,sameSite:'none'});
        res.cookie('refreshToken',refreshToken,{httpOnly:true,secure:true,sameSite:'none'})
        user.password =undefined;
        return responseFunction(res,200,'Logged in Successfully',{ user, authToken, refreshToken },true);
    }catch(error){
        return responseFunction(res,400,'Internal server error',null,false);
    }
})

router.get('/checklogin',authTokenHandler,async (req,res)=>{
    res.json({
        ok:req.ok,
        message:req.message,
        userId:req.userId
    })
})

router.get('/getuser',authTokenHandler,async (req,res)=>{
    try{
        const user = await User.findById(req.userId).select('-password');
        if(!user){
            return responseFunction(res,400,'User not found',null,false);
        }
        return responseFunction(res,200,'User found',null,false);
    }catch(error){
        return responseFunction(res,500,'Internal server error',null,false);
    }
})

router.get('/logout',authTokenHandler,async (req,res,next)=>{
    res.clearCookie('authToken');
    res.clearCookie('refreshToken');

    res.json({
        ok:true,
        message:'logged out successfully'
    })
})
 

module.exports = router
