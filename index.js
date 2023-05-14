const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");
const io = require("socket.io");
const AWS = require("aws-sdk");
const bodyParser = require("body-parser");
mongoose.Promise = global.Promise;

const routes = require("./api/routes");
require("./api/models");
const fileUpload = require("express-fileupload");

AWS.config.update({
  accessKeyId: "AKIAQR5LWODMYC2RUX5D",
  secretAccessKey: "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",
});

app.use(express.static(path.join(__dirname, "public/image")));
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(fileUpload({ useTempFiles: true, tempFileDir: "/tpm/" }));

routes(app);
mongoose.set('strictQuery', false);
mongoose
  .connect("mongodb://localhost:27017/panda-shoes", { useNewUrlParser: true })
  .then(() => {
    console.log("Connected db");
    app.listen(3001, () => {
      console.log("Connected on Port:", 3001);
    });
  })
  .catch((err) => console.log("err: ", err));
