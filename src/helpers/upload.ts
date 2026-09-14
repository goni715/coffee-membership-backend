import multer from "multer"
import BadRequestError from "../errors/BadRequestError";

const storageMain = multer.diskStorage({
  // destination: function (req, file, cb) {
  //   cb(null, "uploads/");
  // },
  filename: function (_req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = file.originalname.split(".")[1];
    cb(null, file.fieldname + "-" + uniqueSuffix + "." + extension);
  },
});



const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  // Allow only image MIME types
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new BadRequestError("Only image files are allowed"));
  }
};

const upload = multer({
  storage: storageMain,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
});

export default upload;