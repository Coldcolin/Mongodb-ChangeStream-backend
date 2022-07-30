const mongoose = require("mongoose")

const orderSchema = mongoose.Schema({
    name: {type: String},
    email: {type: String},
    address: {type: String},
    items: {type: String},
    seen: {type: Boolean, default: false},
    token: {type: String}
}, {timestamps: true})

const orderModel = mongoose.model("orders", orderSchema)

module.exports = orderModel