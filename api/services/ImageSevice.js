const path = require("path");
const fs = require('fs')
const { model } = require('mongoose')
const response = require('../common/response')
const makeName = require("../utils/ChangeName"),
  Image = model('Image')
const domain = 'http://localhost:3001/'
imageModel = model('Image')


const upload_img = async (req, res) => {

  if (!req.files) {
    response.error({
      message: "Not foound img"
    })
  }
  const MyFile = req.files.file
  let name = `${makeName.ChangeName(10)}.png`
  let image = {}
  console.log(req.files);
  // if (MyFile.size > 1024 * 1024) {
  //   response.error({ message: "Size too large" })
  // }
  if (MyFile.mimetype !== 'image/jpeg' && MyFile.mimetype !== 'image/png') {
    response.error({ message: "The file is not in the correct format" })
  }
  const newUpload = new Image({ fileName: name })
  console.log(name);
  newUpload.save((error, data) => {
    if (error) return res.json(response.error(error))
    MyFile.mv(`public/image/${name}`, (err) => {
      if (err) return res.json(response.error(err))
      image = {
        id: data._id,
        url: `${domain + data.fileName}`
      }
      return res.json(response.success(image))
    })
  })

}

const upload_multi_img = async function (req, res) {
  try {
    const files = req.files.Mfile

    let uploadImg = []
    for (let i = 0; i < files.length; i++) {
      let nameImg = req.files.Mfile[i].name
      nameImg = nameImg.replace(/\s/g, '')
      let path = `./assets/image/${nameImg}`
      const newImge = new Image({ fileName: nameImg })
      console.log(path);
      await req.files.Mfile[i].mv(path)
      let data = await newImge.save()
      if (data) {
        await uploadImg.push(data)
        console.log(uploadImg);
      } else {
        throw err;
      }
      if (i + 1 == req.files.Mfile.length) {
        res.json({ uploadImg })
      }

    }
  } catch (error) {
    res.json(error)

  }
}
const get_img = async (arrId) => {
  let arrUrl = []
  for (let i = 0; i < arrId.length; i++) {
    let result = await Image.findById({ _id: arrId[i] })
    let url = `${domain + result.fileName}`
    let resultImage = {
      isHot: result.isPriority,
      url
    }
    arrUrl.push(resultImage)

  }
  return arrUrl
}

const delete_image = async (req, res) => {
  const id = req.query.id
  const checkImage = await Image.findByIdAndDelete({ _id: id })
  if (!checkImage || checkImage == null) {
    return res.json(response.error({ message: "not found image" }))
  }
  let nameImage = checkImage.fileName
  fs.unlink(`public/image/${nameImage}`, async (err) => {
    if (err) {
      return res.json(response.error({ message: err }))
    }
    else {
      res.json(response.success({ message: "delete success" }))
    }

  })

}
module.exports = {
  upload_img,
  upload_multi_img,
  delete_image,
  get_img
}