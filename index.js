const express = require("express");
const app = express();
const mongoose = require("mongoose")
const cors = require("cors")
const routes = require("./routes")
require('./models')
app.use(cors())
app.use(express.json())
routes(app);
mongoose.connect('mongodb://localhost:27017/panda-shoes')
    .then(() => {
       
        console.log('Connected db')
        app.listen(3001, () => {
            console.log('Connected on Port:', 3001)
        })

    })
    .catch((err) => console.log('err: ', err))