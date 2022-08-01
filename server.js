const express = require('express')
const mongoose = require('mongoose')
const app = express()
const PORT = 4455
const cors = require("cors")
const path = require("path")
const http = require("http")
const { Server } = require("socket.io")
const server = http.createServer(app)

app.use(express.json())
app.use(cors())
app.use("/uploads",express.static(path.join(__dirname, "uploads")))
const url = "mongodb://localhost/BreadSale"
const uri = ""

const io = new Server(server, {cors:{origin: "*"}})

mongoose.connect(url, {useUnifiedTopology: true, useNewURLParser: true}).then(()=>{
    console.log(`connected to db`)
}).catch((error)=>{
    console.log(error)
})

const db = mongoose.connection;

db.on("open", ()=>{
    const observer = db.collection("orders").watch();
    observer.on("change", (change)=>{
        if (change.operationType === "insert"){
            const newData ={
                name: change.fullDocument.name,
                _id: change.fullDocument._id,
                email: change.fullDocument.email,
                orders: change.fullDocument.items,
                address: change.fullDocument.address,
                token: change.fullDocument.token
            }
            io.emit("order", newData)
        }
        if (change.operationType === "update"){
            // const newData ={
            //     name: change.fullDocument.name,
            //     _id: change.fullDocument._id,
            //     email: change.fullDocument.email,
            //     orders: change.fullDocument.items,
            //     address: change.fullDocument.address,
            //     token: change.fullDocument.token
            // }
            // console.log(change.fullDocument)
            io.emit("dispatch")
        }
    })
})
io.on("connection", (socket)=>{
    console.log("socket connected", socket.id)

    socket.on("disconnect", ()=>{
        console.log("socket disconnected")
    })

    socket.emit("check", (text)=>{
        console.log(text)
    })
})

app.use("/api", require("./Routers/product.route.js"))
app.use("/api", require("./Routers/order.route.js"))

// app.listen(PORT, ()=>{
//     console.log(`Sever running in PORT: ${PORT}!...`)
// })
server.listen(PORT, ()=>{
    console.log(`Server running in PORT: ${PORT}!...`)
})
