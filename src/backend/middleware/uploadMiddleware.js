import multer from 'multer';
import path from 'path';

// Set up storage engine
const storage = multer.diskStorage({
  destination: './public/uploads/avatars/',
  filename: function (req, file, cb) {
    // Create a unique filename to avoid overwrites
    cb(null, `avatar-${req.user}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

// Check file type
function checkFileType(file, cb) {
  // Allowed extensions
  const filetypes = /jpeg|jpg|png|gif/;
  // Allowed mimetypes
  const mimetypes = /image\/jpeg|image\/jpg|image\/png|image\/gif/;

  // Check mimetype first, as it's more reliable
  const mimetypeCheck = mimetypes.test(file.mimetype);

  // Check extension from originalname, but handle if it's missing
  let extnameCheck = false;
  if (file.originalname) {
    extnameCheck = filetypes.test(path.extname(file.originalname).toLowerCase());
  }

  // If either the mimetype or the extension matches, we're good.
  // This handles the case where the web blob might not have a proper originalname.
  if (mimetypeCheck || extnameCheck) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}

// Init upload variable
export const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // 1MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single('avatar'); // 'avatar' is the name of the form field
