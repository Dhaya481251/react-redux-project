const express = require('express');
const router = express.Router();
const userController = require('../controllers/user/userController');
const {protect} = require('../middleware/authMiddleware')
const multer = require('multer');
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads")); // points to backend/uploads
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post("/",userController.registerUser);
router.post("/login",userController.loginUser);
router.post("/logout",userController.logoutUser);
router.get('/home',protect,userController.loadHome);
router.post('/profile',protect,upload.single("profileImage"),userController.updateProfileImage);

module.exports = router;
