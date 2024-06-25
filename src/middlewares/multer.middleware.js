import multer from "multer";

const storage = multer.diskStorage({
    getDestination: function (req, file, cb) {
      cb(null, './public/temp')
    },
    getFilename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
  
  const upload = multer({ storage })

  console.log(storage);

  export {upload}