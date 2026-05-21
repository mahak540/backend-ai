const express = require("express")
const app = express();
app.set("trust proxy",1);
const cors = require("cors");
const axios = require("axios");
const mongoose = require("mongoose");
const port =  process.env.PORT || 5000 ;
const mongoStore = require("connect-mongo").default;
// const port = 5000;
const session = require("express-session")
const passport = require("passport")
const authRoutes = require("./routes/auth.js")
const imageRoute = require("./routes/image.js")
mongoose.set('strictQuery', true)
DB = process.env.MONGO
async function main(params) {
      await mongoose.connect(DB)
}

main().then(()=>{
    console.log("connected to the database successfully");
})
.catch((err)=>{
    console.log(err)
})


// app.use(cors());
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://frontend-ai-2ruo.onrender.com"
  ],
  credentials: true
}));

app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.use(session({
    secret:"1234",
    resave:false,
    saveUninitialized:false,
    proxy:true,
    store: mongoStore.create({
      mongoUrl:DB,
    }),
    cookie:{
      httpOnly:true,
      secure:true,
      sameSite:"none",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    }
}));


app.use(passport.initialize());
app.use(passport.session());

app.use("/",authRoutes);
app.use("/",imageRoute);



app.listen(port,function(){
    console.log(`app is listening at the ${port}`)
});
