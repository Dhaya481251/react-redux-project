// const User = require('../models/userModel');
// const jwt = require('jsonwebtoken');

// const protect = async (req, res, next) => {
//   const token = req.cookies.user_jwt;
//   if (!token) {
//     return res.status(401).json({ error: "Not authorized, no token" });
//   }
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findById(decoded.userId).select("-password");
//     if(!user){
//       return res.status(401).json({error:'User no longer exists'});
//     }
//     req.user = user;
//     next();
//   } catch (error) {
//     return res.status(401).json({ error: "Not authorized, invalid token" });
//   }
// };

// const adminProtect = async (req, res, next) => {
//   const token = req.cookies.admin_jwt;
//   if (!token) {
//     return res.status(401).json({ error: "Not authorized, no token" });
//   }
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const admin = await User.findById(decoded.userId).select("-password");
//     if(!admin){
//       return res.status(401).json({error:'Admin no longer exists'});
//     }
//     if(admin.isAdmin){
//       req.admin = admin;
//       next();
//     } else {
//       return res.status(403).json({ error: "Not authorized as admin" });
//     }
//   } catch (error) {
//     return res.status(401).json({ error: "Not authorized, invalid token" });
//   }
// };

// module.exports = {
//     protect,
//     adminProtect
// }

// middleware/authMiddleware.js
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const protect = async (req, res, next) => {
  let token;

  // Check Authorization header first (Bearer token)
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } 
  // Fallback to cookie (in case you use it elsewhere)
  else if (req.cookies?.user_jwt) {
    token = req.cookies.user_jwt;
  }

  if (!token) {
    return res.status(401).json({ error: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({ error: 'User no longer exists' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Not authorized, invalid token" });
  }
};

const adminProtect = async (req, res, next) => {
  let token;

  // Check Authorization header first
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } 
  else if (req.cookies?.admin_jwt) {
    token = req.cookies.admin_jwt;
  }

  if (!token) {
    return res.status(401).json({ error: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await User.findById(decoded.userId).select("-password");

    if (!admin) {
      return res.status(401).json({ error: 'Admin no longer exists' });
    }

    if (admin.isAdmin) {
      req.admin = admin;
      next();
    } else {
      return res.status(403).json({ error: "Not authorized as admin" });
    }
  } catch (error) {
    return res.status(401).json({ error: "Not authorized, invalid token" });
  }
};

module.exports = {
  protect,
  adminProtect
};