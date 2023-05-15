const fs = require("fs");
const { model } = require("mongoose");
const response = require("../common/response");
const resJson = require("../utils/pagination");
const makeName = require("../utils/ChangeName");
const { v4: uuidv4 } = require("uuid");
const AWS = require("aws-sdk");

Image = model("Image");
const domain = "http://localhost:3001/";

const s3 = new AWS.S3({
  accessKeyId: "AKIAQR5LWODMYC2RUX5D",
  secretAccessKey: "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",
});

const upload_img_aws = async (req, res, next) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send("No files were uploaded.");
    }
    let image = {};
    const file = await req.files.file;
    const fileData = await fs.readFileSync(file.tempFilePath);
    const params = {
      Bucket: "soyuli-order-photos",
      Key: `${uuidv4()}_${file.name}`,
      Body: fileData,
      ContentType: file.mimetype,
    };
    const data = await s3.upload(params).promise();
    const newImage = await new Image({
      fileName: data.Key,
      url: data.Location,
    });
    newImage.save((err, data) => {
      if (err) return res.json(response.error(err));
      else {
        image = {
          id: data._id,
          url: data.url,
        };
        return res.json(response.success(image));
      }
    });
  } catch (error) {
    next(error);
  }
};
const delete_img_aws = async (req, res, next) => {
  try {
    const id = req.query.id;
    const checkImage = await Image.findByIdAndDelete({ _id: id });
    if (!checkImage || checkImage == null) {
      return res.json(response.error({ message: "not found image" }));
    }
    await s3
      .deleteObject({
        Bucket: "soyuli-order-photos",
        Key: checkImage.fileName,
      })
      .promise();
    return res.json(response.success({ message: "delete success" }));
  } catch (error) {
    next(error);
  }
};
const upload_multi_img_aws = async (req, res, next) => {
  //note alway set key = files when using api
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send("No files were uploaded.");
    }
    const files = await req.files[""];
    if (files.length > 5) {
      return res.json(response.error("limit 5 images"));
    }
    const images = [];
    const promises = files.map(async (file) => {
      const fileData = fs.readFileSync(file.tempFilePath);
      const params = {
        Bucket: "soyuli-order-photos",
        Key: `${uuidv4()}_${file.name}`,
        Body: fileData,
        ContentType: file.mimetype,
      };
      const data = await s3.upload(params).promise();
      const newImage = new Image({
        fileName: data.Key,
        url: data.Location,
      });
      const savedImage = await newImage.save();
      const image = {
        id: savedImage._id,
        url: savedImage.url,
      };
      images.push(image);
    });
    await Promise.all(promises);
    return res.json(response.success(images));
  } catch (error) {
    next(error);
  }
};

// const upload_img = async (req, res) => {
//   if (!req.files) {
//     response.error({
//       message: "Not foound img",
//     });
//   }
//   const MyFile = await req.files.file;
//   let date = Date.now();
//   let name = `${date}.${makeName.ChangeName(10)}.png`;
//   let image = {};
//   if (MyFile.mimetype !== "image/jpeg" && MyFile.mimetype !== "image/png") {
//     response.error({ message: "The file is not in the correct format" });
//   }
//   const newUpload = await new Image({ fileName: name });

//   newUpload.save((error, data) => {
//     if (error) return res.json(response.error(error));
//     MyFile.mv(`public/image/${name}`, (err) => {
//       if (err) return res.json(response.error(err));
//       image = {
//         id: data._id,
//         url: `${domain + data.fileName}`,
//       };
//       return res.json(response.success(image));
//     });
//   });
// };

// const upload_multi_img = async function (req, res) {
//   try {
//     const files = req.files;
//     if (files.length > 4) {
//       return res.json(response.error("limit 4 image"));
//     }
//     let uploadImg = [];
//     for (let i = 0; i < files.length; i++) {
//       let nameImg = req.files[""][i].name;
//       nameImg = nameImg.replace(/\s/g, "");
//       let path = `./public/image/${nameImg}`;
//       const newImge = new Image({ fileName: nameImg });
//       await req.files[""][i].mv(path);
//       let data = await newImge.save();
//       if (data) {
//         await uploadImg.push(data);
//         console.log(uploadImg);
//       } else {
//         throw err;
//       }
//       if (i + 1 == req.files[""].length) {
//         res.json({ uploadImg });
//       }
//     }
//   } catch (error) {
//     res.json(error);
//   }
// };

const get_img_media = (req, res) => {
  const { keySearch, pageIndex, limit } = req.query;
  if (keySearch !== "") {
    Image.find(
      { keySearch: { $regex: keySearch, $options: "i" } },
      { __v: 0 },
      { skip: resJson.getOffset(pageIndex, limit), limit: parseInt(limit) },
      (err, data) => {
        if (err) return res.json(response.error(err));
        resJson.pagination(data, keySearch, limit, pageIndex, Image, res, {
          keySearch: { $regex: keySearch, $options: "i" },
        });
      }
    );
  } else {
    Image.find(
      {},
      { __v: 0 },
      { skip: resJson.getOffset(pageIndex, limit), limit: parseInt(limit) },
      (err, data) => {
        if (err) return res.json(response.error(err));
        resJson.pagination(data, "", limit, pageIndex, Image, res);
      }
    );
  }
};

// const delete_image = async (req, res) => {
//   const id = req.query.id;
//   const checkImage = await Image.findByIdAndDelete({ _id: id });
//   if (!checkImage || checkImage == null) {
//     return res.json(response.error({ message: "not found image" }));
//   }
//   let nameImage = checkImage.fileName;
//   fs.unlink(`public/image/${nameImage}`, async (err) => {
//     if (err) {
//       return res.json(response.error({ message: err }));
//     } else {
//       res.json(response.success({ message: "delete success" }));
//     }
//   });
// };
module.exports = {
  // upload_img,
  // upload_multi_img,
  // delete_image,
  get_img_media,
  upload_img_aws,
  delete_img_aws,
  upload_multi_img_aws,
};
