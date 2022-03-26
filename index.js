const express = require("express");
const app = express();
const mongoose = require("mongoose")
const cors = require("cors")
mongoose.Promise = global.Promise;
const routes = require("./routes")
require('./models')
const path = require("path");
const fileUpload = require('express-fileupload')

app.use(express.static(path.join(__dirname, "assets")));// let storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, PATH);
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.fieldname + '-' + Date.now() + '.png')
//     }
// });
// const fileFilter = (req, file, cb) => {
//     if (file.mimetype === "image/jpg" ||
//         file.mimetype === "image/jpeg" ||
//         file.mimetype === "image/png") {

//         cb(null, true);
//     } else {
//         cb(new Error("Image uploaded is not of type jpg/jpeg or png"), false);
//     }
// };
// const upload = multer({storage: storage, fileFilter: fileFilter});
app.use(cors())
app.use(express.json())
app.use(fileUpload({useTempFiles: true, tempFileDir: "/tpm/"}))
routes(app);
mongoose.connect('mongodb://localhost:27017/panda-shoes')
    .then(() => {
       
        console.log('Connected db')
        app.listen(3001, () => {
            console.log('Connected on Port:', 3001)
        })

    })
    .catch((err) => console.log('err: ', err))