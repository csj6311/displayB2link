/*=========================================================
* 공통사용 Function 정리파일
*========================================================= */

//파일업로드 함수
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/'+req.body.divNo)
    },
    filename: function (req, file, cb) {
        //사용하지않음 확장자 추출함수
        var getFileExt = function(fileName){
            var fileExt = fileName.split(".");
            if( fileExt.length === 1 || ( fileExt[0] === "" && fileExt.length === 2 ) ) {
                return "";
            }
            return fileExt.pop();
        }
        //사용하지않음 확장자 추출함수
        cb(null, Date.now() + '_' + file.originalname)
    }
});

exports.upload = multer({ storage: storage });


