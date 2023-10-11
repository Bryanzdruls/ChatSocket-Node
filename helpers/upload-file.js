const path = require("path");
const { v4:  uuidv4 } = require('uuid');
uuidv4(); // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'

const uploadFile = (files, validExtensions = ["png", "jpg", "jpeg", "gif"], folder = '') => {
  return new Promise((resolve, reject) => {
    const { file } = files;
    const cutName = file.name.split(".");
    const extension = cutName[cutName.length - 1];

    //Validar extension
    if (!validExtensions.includes(extension)) {
      reject(`Extension is not allowed`)
    }
    const temporalName = uuidv4() + "." + extension;

    const uploadPath = path.join(__dirname, "../uploads/",folder, temporalName);
    path;
    file.mv(uploadPath, (err) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      resolve( temporalName );
    });
  });
};

module.exports = {
  uploadFile,
};
