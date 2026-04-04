const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin/adminController');
const { adminProtect, protect } = require('../middleware/authMiddleware');

const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads")); // points to backend/uploads
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({storage});

router.post('/login',adminController.adminLogin);
router.post('/logout',adminController.adminLogout);
router.get('/home',adminProtect,adminController.adminHome);
router.get('/users',adminProtect,adminController.getUsers);
router.put('/users/:id',adminProtect,upload.single("profileImage"),adminController.editUser);
router.delete('/users/:id',adminProtect,adminController.deleteUser);
router.post('/create',adminController.createUser);
module.exports = router;