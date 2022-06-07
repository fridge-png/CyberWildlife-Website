const { MongoGridFSChunkError } = require("mongodb");
const multer = require("multer");

const storageWay = multer.diskStorage({
    destination: function (req,file,callbackFct){
        callbackFct(null,"../uploads");
    },
    filename: function(req,file,callbackFct){
        callbackFct(null,file.originalname);
    }
});

const upload = multer({storage: storageWay});

module.exports = upload;