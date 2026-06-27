const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  getProductDetails,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getProductReviews,
  deleteReview,
} = require("../controllers/productController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const upload = require("../middleware/multer");

router.get("/products", getAllProducts);
router.get("/product/:id", getProductDetails);
router.get("/product/reviews", getProductReviews);

router.put("/product/review", isAuthenticatedUser, createProductReview);
router.delete("/product/review", isAuthenticatedUser, deleteReview);

router.post(
  "/admin/product/new",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  upload.array("images", 5),
  createProduct,
);
router.put(
  "/admin/product/:id",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  upload.array("images", 5),
  updateProduct,
);
router.delete(
  "/admin/product/:id",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  deleteProduct,
);

module.exports = router;
