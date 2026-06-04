const express = require("express")
const app = express();
const cors = require("cors");
const axios = require("axios");
const mongoose = require("mongoose");
const port = 5000;
const session = require("express-session")
const passport = require("passport")
const authRoutes = require("./routes/auth.js")
const imageRoute = require("./routes/image.js")

async function main(params) {
        mongoose.connect(process.env.MONGODB_URI)
}

main().then(()=>{
    console.log("connected to the database successfully");
})
.catch((err)=>{
    console.log(err)
})

app.set("trust proxy", 1);
// app.use(cors());
app.use(cors({
  origin: "https://frontend-ai-2ruo.onrender.com",
  credentials: true
}));

app.use(express.urlencoded({extended:true}));
app.use(express.json());

// app.use(session({
//     secret:"1234",
//     resave:false,
//     saveUninitialized:false,
// }))
app.use(session({
  secret: "1234",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000
  }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use("/",authRoutes);
app.use("/",imageRoute);

app.listen(port,function(){
    console.log(`app is listening at the ${port}`)
});
