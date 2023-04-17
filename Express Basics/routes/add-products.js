const path = require("path")

const express = require("express")
const bodyParser = require('body-parser');
const { nextTick } = require("process");

const router = express.Router();

router.use(bodyParser.urlencoded({extended:false,}));

router.get('/add-products',(req,res,_)=>{
    res.sendFile(path.join(process.cwd(),'views','add-products.html'))
})

router.post('/add-products',(req,res,_)=>{
    console.log(req.body.title);
    res.redirect('/products')
})

module.exports = router;