const path = require("path")

const express = require("express")

const router = express.Router();


router.get('/products',(req,res,_)=>{
    res.sendFile(path.join(process.cwd(),'views','products.html'));
})

module.exports = router;