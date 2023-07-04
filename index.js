const express = require("express");
const fileUpload = require("express-fileupload");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const https = require("https");
const io = require("socket.io");
const fs = require("fs");
const AWS = require("aws-sdk");
const bodyParser = require("body-parser");
const os = require("os");
const { handleConnection } = require("./api/services/ChatServices");
require("./api/models");
const routes = require("./api/routes");
// require("dotenv").config();
mongoose.Promise = global.Promise;
process.env.UV_THREAD_POOL_SIZE = os.cpus().length;

async function startDB() {
  return new Promise((resolve, reject) => {
    mongoose.set("strictQuery", false);
    mongoose
      .connect(
        "mongodb+srv://lehoanglinhptit:%40mai2022@soyuli.xfjzqwc.mongodb.net/",
        // "mongodb://localhost:27017/panda-shoes", 
        { useNewUrlParser: true }
      )
      .then(() => {
        console.log("Connected db");
        resolve();
      })
      .catch((err) => {
        console.log("err: ", err);
        reject(err);
      });
  });
}
async function startServer() {
  return new Promise((resolve, reject) => {
    const app = express();
    app.use(cors());
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
    app.use(express.static(path.join(__dirname, "public/image")));
    
    app.use(express.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(fileUpload({ useTempFiles: true, tempFileDir: "/tpm/" }));
    routes(app);
    server.listen(3002, () => {
      console.log("Connected on Port:", 3002);
    });
    resolve(server);
  });
}
const startApp = async function (callback) {
  try {
    await startDB();
    await startServer();
    callback();
  } catch (e) {
    console.error(e);
  }
};

startApp(()=>{
  console.log("Connect to server success");
})
