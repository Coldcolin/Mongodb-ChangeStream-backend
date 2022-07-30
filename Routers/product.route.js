const express = require("express")
const router = express.Router()
const Product = require("../Models/Product.js")
const multer = require("multer");
const path = require("path")

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "./uploads")
    },
    filename: function(req, file, cb){
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(
        null,
        file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
        );
    }
})

const upload = multer({storage: storage}).single("image")


router.post("/post", upload, async (req, res)=>{
    try{
        const {name, Price, description} = req.body
        const newProduct = await Product.create({
            name,
            Price,
            description,
            image: req.file.path
        })

        res.status(201).json({message: "success", data: newProduct})
    }catch(error){
        res.status(400).json({error: error.message})
    }
})

router.get("/", async (req, res)=>{
    try{
        const products = await Product.find()
        res.status(200).json({message: "success", data:products})
    }catch(error){
        res.status(400).json({error: error.message})
    }
})

module.exports = router