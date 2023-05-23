const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const https = require('https');
const io = require("socket.io");
const fs = require("fs");
const AWS = require("aws-sdk");
const bodyParser = require("body-parser");
// require("dotenv").config();
const os = require("os");
const { handleConnection } = require("./api/services/ChatServices");
mongoose.Promise = global.Promise;

const routes = require("./api/routes");
require("./api/models");
const fileUpload = require("express-fileupload");

AWS.config.update({
  accessKeyId: "AKIAQR5LWODMYC2RUX5D",
  secretAccessKey: "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",
});
const options = {
  key: fs.readFileSync("./certificates_ssl/domain.key"),
  cert: fs.readFileSync("./certificates_ssl/domain.crt"),
};
const server = http.createServer(options, app);     
const socket = io(server);
socket.on("connection", handleConnection);
process.env.UV_THREAD_POOL_SIZE = os.cpus().length;
app.use(express.static(path.join(__dirname, "public/image")));
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(fileUpload({ useTempFiles: true, tempFileDir: "/tpm/" }));
routes(app);

mongoose.set("strictQuery", false);
mongoose
  .connect("mongodb://localhost:27017/panda-shoes", { useNewUrlParser: true })
  .then(() => {
    console.log("Connected db");
    server.listen(3001, () => {
      console.log("Connected on Port:", 3001);
    });
  })
  .catch((err) => console.log("err: ", err));
