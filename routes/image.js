const express = require("express");

const router = express.Router();

const axios = require("axios");
const url = process.env.PY_URI

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

        const img =
  response.data.image ||
  response.data.imageUrl ||
  response.data.url ||
  response.data[0]?.url;

res.status(200).json({
  success: true,
  image: img
});

    }catch(err){

        console.log(err);

        res.status(500).json({
            success:false,
            message:"Image generation failed"
        })

    }

})
router.post("/generate-video", async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await axios.post(`${url}/video`, {
      prompt
    });
const vid =
      response.data.video ||
      response.data.videoUrl ||
      response.data.url ||
      response.data[0]?.url;

    return res.status(200).json({
      success: true,
      video: vid
    });
    // return res.json({
    //   video: response.data.video
    // });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Video generation failed" });
  }
});

module.exports = router;
