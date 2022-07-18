const multer=require("multer");
const path=require("path");

module.exports=multer({
    storage:multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './public/images/uploads')
        },
        filename: function (req, file, cb) {
            // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            const uniqueSuffix = Date.now();
            const nameFinal=uniqueSuffix + "-" + file.originalname;
            // const nameFinal=uniqueSuffix + "-" + file.fieldname + '.' + file.originalname.split('.')[file.originalname.split('.').length -1];
            cb(null,nameFinal);
        }
    }),
    fileFilter:(req,file,cb)=>{
        let ext=path.extname(file.originalname);
        if(ext!=='.jpg' && ext!=='.png' && ext!=='.jpeg'){
            cb(new Error("File must be image (.jpg/.jpeg/.png)"))
        }
        cb(null,true);
    },
    limits:{
        fileSize: 1024 * 1024
    }
});