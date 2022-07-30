const express = require("express")
const router = express.Router();
const Order = require("../Models/orders")
const crypto = require("crypto")

router.post('/order', async (req, res)=>{
    try{
        const {name, email, address, items} = req.body
        const orderToken = crypto.randomBytes(5).toString("hex");
        const newOrder = await Order.create({
            name, email, address, items,
            token: orderToken
        })
        res.status(201).json({data: newOrder})
    }catch(error){
        res.status(400).json({error: error.message})
    }
})

router.get("/order/:id", async (req, res)=>{
    try{
        const id = req.params.id
        const orderDetails = await Order.findById(id)

        res.status(200).json({order: orderDetails})
    }catch(error){
        res.status(400).json({error: error.message})
    }
})

router.get("/order", async (req, res)=>{
    try{
        const orderDetails = await Order.find()

        res.status(200).json({order: orderDetails})
    }catch(error){
        res.status(400).json({error: error.message})
    }
})

router.patch("/order/:id", async (req, res)=>{
    try{
        const id = req.params.id;
        const order = await Order.findByIdAndUpdate(id, {seen : true})
        res.status(200).json({message: "success", data: order})
    }catch(err){
        res.status(400).json({error: error.message})
    }
})

module.exports = router