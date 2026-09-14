"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const BadRequestError_1 = __importDefault(require("../errors/BadRequestError"));
const storageMain = multer_1.default.diskStorage({
    // destination: function (req, file, cb) {
    //   cb(null, "uploads/");
    // },
    filename: function (_req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const extension = file.originalname.split(".")[1];
        cb(null, file.fieldname + "-" + uniqueSuffix + "." + extension);
    },
});
const fileFilter = (_req, file, cb) => {
    // Allow only image MIME types
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    }
    else {
        cb(new BadRequestError_1.default("Only image files are allowed"));
    }
};
const upload = (0, multer_1.default)({
    storage: storageMain,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB
    },
});
exports.default = upload;
