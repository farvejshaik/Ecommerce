const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  logout,
  getMe,
  updatePassword,
  updateProfile,
  getAllUsers,
  getSingleUser,
  updateUserRole,
  deleteUser,
  refreshToken,
} = require("../controllers/authController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

// Public
router.post("/auth/register", registerUser);
router.post("/auth/login", loginUser);
router.post("/auth/logout", logout);
router.post("/auth/refresh", refreshToken);

// Protected (user)
router.get("/auth/me", isAuthenticatedUser, getMe);
router.put("/auth/update/password", isAuthenticatedUser, updatePassword);
router.put("/auth/update/profile", isAuthenticatedUser, updateProfile);

// Admin
router.get(
  "/admin/users",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  getAllUsers,
);
router.get(
  "/admin/user/:id",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  getSingleUser,
);
router.put(
  "/admin/user/:id",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  updateUserRole,
);
router.delete(
  "/admin/user/:id",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  deleteUser,
);

module.exports = router;
