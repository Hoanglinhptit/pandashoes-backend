const path = require("path");
const { model } = require('mongoose'),
Image= model('Image')
exports.upload_img = async (req, res) => {

  if (!req.files) {
      return res.send({ msd: "not found img" })
  }
  const MyFile = req.files.file
  console.log(req.files);
  const newUpload = new Image({ fileName: MyFile.name })

 const newUpload1 = await newUpload.save(MyFile.mv(`assets/image/${MyFile.name}`, function (error) {
  if (error) {
      console.log(error)
      return res.status(500).send({ error });
  }}))
  if(newUpload1&&newUpload1!==null){
    console.log("newUpload1",  newUpload1);
    return res.json({
      newUpload1
    });
  }
  // (err, data) => {
  //   if (err) return res.send(err)
  //   
  //       // returing the response with file path and name
  //       // return res.send(data);
  //       id = data
  //   })

}
  
 

exports.upload_multi2 = async function (req, res) {
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
          if(data){
              await uploadImg.push(data)
              console.log(uploadImg);
          }else{
              throw err;
          }
          if(i+1==req.files.Mfile.length){
              res.json({uploadImg})
          }

      }
  } catch (error) {
      res.json(error)

  }
}
 exports.download = (req, res) => {
    const fileName = req.params.name;
    const directoryPath = __basedir + "/assets/image/";
    res.download(directoryPath + fileName, fileName, (err) => {
      if (err) {
        res.status(500).send({
          message: "Could not download the file. " + err,
        });
      }
    });
  };
  