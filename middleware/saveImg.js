const multer = require('multer');

// Set up storage for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log("file", file)
        cb(null, './public/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });
module.exports = upload;