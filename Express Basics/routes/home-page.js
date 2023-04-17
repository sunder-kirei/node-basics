const path = require("path")

const express = require("express")

const router = express.Router();

router.get('/',(req,res,_)=>{
    res.sendFile(path.join(process.cwd(),'views','home-page.html'))
})

module.exports = router;