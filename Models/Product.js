const mongoose = require("mongoose")

const productSchema = mongoose.Schema({
    name: {type: String},
    description:{type: String},
    image: {type: String},
    Price: {type: Number}
}, {timestamps: true})

const productModel = mongoose.model("product", productSchema);

module.exports = productModel