import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
 
    const safeName = path.basename(file.originalname).replace(/[^a-zA-Z0-9.\-_]/g, '_');
    const uniqueName = Date.now() + "-" + safeName;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/pdf",
    "image/png",
    "image/jpeg",
    "image/jpg"
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF and Images are allowed"), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  
  limits: {
    fileSize: 55 * 1024 * 1024, // 55MB
  }
});