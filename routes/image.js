const express = require("express");

const router = express.Router();

const axios = require("axios");
const url = process.env.PY_URI
const vidurl=process.env.PY_URL
router.post("/generate-image", async(req,res)=>{
    
    try{

        const {prompt} = req.body;

        if(!prompt){

            return res.status(400).json({
                success:false,
                message:"Prompt is required"
            })

        }

        const response = await axios.post(
            `${url}/generate`,
            {
                prompt
            }
        );

        res.status(200).json({
            success:true,
            image:response.data.image
        })

    }catch(err){

        console.log(err);

        res.status(500).json({
            success:false,
            message:"Image generation failed"
        })

    }

})
router.get("/test", (req, res) => {
  res.send("Backend Working");
});
router.post("/generate-video", async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await axios.post(`${vidurl}/video`, {
      prompt
    });

    return res.json({
      video: response.data.video
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Video generation failed" });
  }
});

module.exports = router;
