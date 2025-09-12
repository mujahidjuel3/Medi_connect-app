import multer from "multer";
import path from "path";
import os from "os";

// Temporary folder (system temp dir এ save হবে)
const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, os.tmpdir()); // temp folder
  },
  filename: function (_req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

export default upload;
