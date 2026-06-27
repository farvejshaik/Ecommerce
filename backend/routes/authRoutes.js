const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  logout,
  getMe,
  updatePassword,
  updateProfile,
  refreshToken,
} = require("../controllers/authController");
const { isAuthenticatedUser } = require("../middleware/auth");

// Public
router.post("/auth/register", registerUser);
router.post("/auth/login", loginUser);
router.post("/auth/logout", logout);
router.post("/auth/refresh", refreshToken);

// Protected (user)
router.get("/auth/me", isAuthenticatedUser, getMe);
router.put("/auth/update/password", isAuthenticatedUser, updatePassword);
router.put("/auth/update/profile", isAuthenticatedUser, updateProfile);

module.exports = router;
