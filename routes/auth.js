require('dotenv').config()
const express = require("express");
const router = express.Router();
const { generateOTP, sendEmail } = require("../middleware/email.js");
const User = require("../models/user.js");
const localstrategy = require("passport-local");
const passport = require("passport")

//passport.use(new localstrategy(User.authenticate()));
passport.use(
  new localstrategy(
    {
      usernameField:"email"
    },
    User.authenticate()
  )
);
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

router.post("/signup", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({ email });
    }

    // Generate OTP
    const otp = generateOTP();

    // Save OTP
    user.otp = otp;
    user.otpExpire = Date.now() + 5 * 60 * 1000;

    await user.save();

    // Send Email
    await sendEmail(email, otp);

    console.log(`OTP sent to ${email}: ${otp}`);

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Error sending OTP",
    });
  }
});
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).send("User not found");
    }

    if (user.otp !== otp) {
      return res.status(400).send("Invalid OTP");
    }

    if (user.otpExpire < Date.now()) {
      return res.status(400).send("OTP expired");
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpire = null;

    await user.save();

    res.send("Email verified successfully");

  } catch (err) {
    console.log(err);
    res.status(500).send("Verification failed");
  }
});

router.post("/set-password", async(req,res)=>{
    try{

        const {email,password} = req.body;

        const user = await User.findOne({email});

        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found"
            })
        }

        if(!user.isVerified){
            return res.status(400).json({
                success:false,
                message:"Please verify email first"
            })
        }
        if(!password){
            return res.status(400).json({
                success:false,
                message:"Password is required"
            })
        }
        await user.setPassword(password);

        await user.save();

        res.status(200).json({
            success:true,
            message:"Password set successfully"
        })

    }catch(err){

        console.log(err);

        res.status(500).json({
            success:false,
            message:"Something went wrong"
        })

    }
})

router.post(
  "/login",
  passport.authenticate("local"),
  (req,res)=>{

    res.status(200).json({
      success:true,
      message:"Login successful",
      user:req.user
    })

  }
)

router.get("/logout",(req,res,next)=>{

    req.logout((err)=>{

        if(err){
            return next(err);
        }

        req.session.destroy((err)=>{

            if(err){
                return next(err);
            }

            res.clearCookie("connect.sid");

            res.status(200).json({
                success:true,
                message:"Logout successful"
            })

        })

    })

})
router.get("/current-user",(req,res)=>{

    if(req.user){

        return res.status(200).json({
            loggedIn:true,
            user:req.user
        })

    }

    res.status(401).json({
        loggedIn:false
    })

})

// router.get("/current-user", (req, res) => {
//   if (!req.isAuthenticated || !req.isAuthenticated()) {
//     return res.status(401).json({ user: null });
//   }

//   res.json({ user: req.user });
// });


module.exports = router;
