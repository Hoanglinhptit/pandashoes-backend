const express = require("express");
const app = express();
const mongoose = require("mongoose")
const cors = require("cors")
mongoose.Promise = global.Promise;
const routes = require("./api/routes")
require('./api/models')
const path = require("path");
const fileUpload = require('express-fileupload')

app.use(express.static(path.join(__dirname, "public/image")));// let storage = multer.diskStorage({

app.use(cors())
app.use(express.json())
app.use(fileUpload({ useTempFiles: true, tempFileDir: "/tpm/" }))
routes(app);
mongoose.connect('mongodb://localhost:27017/panda-shoes')
    .then(() => {

        console.log('Connected db')
        app.listen(3001, () => {
            console.log('Connected on Port:', 3001)
        })

    })
    .catch((err) => console.log('err: ', err))