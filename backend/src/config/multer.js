import multer from "multer";
import path from "path";
import fs from "fs";
import CustomError from "../utils/customError.js";

const uploadDir = "/tmp/uploads";

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Save files with a unique timestamp prefix
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  // Allow only images (jpeg, png) and PDFs
  const allowedExtensions = /jpeg|jpg|png|pdf/;
  const mimetype = allowedExtensions.test(file.mimetype);
  const extname = allowedExtensions.test(
    path.extname(file.originalname).toLowerCase(),
  );

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(
    new CustomError("Only .jpg, .jpeg, .png, and .pdf files are allowed", 400),
  );
};

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Limit size to 5MB
  },
  fileFilter,
});
