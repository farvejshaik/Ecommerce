const Product = require("../models/Product");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../utils/catchAsyncErrors");
const ApiFeatures = require("../utils/apiFeatures");
const cloudinary = require("../utils/cloudinary");

exports.getAllProducts = catchAsyncErrors(async (req, res, next) => {
  const resultsPerPage = 8;
  const productsCount = await Product.countDocuments();
  const apiFeature = new ApiFeatures(Product.find(), req.query)

    .search()
    .filter()
    .sort()
    .pagination(resultsPerPage);
  const products = await apiFeature.query;
  res
    .status(200)
    .json({ success: true, products, productsCount, resultsPerPage });
});

exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return next(new ErrorHandler("Product not found", 404));
  res.status(200).json({ success: true, product });
});

exports.createProduct = catchAsyncErrors(async (req, res, next) => {
  req.body.user = req.user.id;
  if (req.files && req.files.length > 0) {
    req.body.images = req.files.map((file) => ({
      public_id: file.filename,
      url: file.path,
    }));
  }
  const product = await Product.create(req.body);
  res.status(201).json({ success: true, product });
});

exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) return next(new ErrorHandler("Product not found", 404));
  if (req.files && req.files.length > 0) {
    for (const image of product.images) {
      await cloudinary.uploader.destroy(image.public_id);
    }
    req.body.images = req.files.map((file) => ({
      public_id: file.filename,
      url: file.path,
    }));
  }
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ success: true, product });
});

exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return next(new ErrorHandler("Product not found", 404));
  for (const image of product.images) {
    await cloudinary.uploader.destroy(image.public_id);
  }
  await product.deleteOne();
  res.status(200).json({ success: true, message: "Product deleted" });
});

exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;
  const product = await Product.findById(productId);
  if (!product) return next(new ErrorHandler("Product not found", 404));

  const existingReview = product.reviews.find(
    (review) => review.user.toString() === req.user.id,
  );
  if (existingReview) {
    existingReview.rating = rating;
    existingReview.comment = comment;
  } else {
    product.reviews.push({
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user.id,
    });
    product.numOfReviews = product.reviews.length;
  }
  product.ratings =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;
  await product.save();
  res.status(200).json({ success: true });
});

exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);
  if (!product) return next(new ErrorHandler("Product not found", 404));
  res.status(200).json({ success: true, reviews: product.reviews });
});

exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);
  if (!product) return next(new ErrorHandler("Product not found", 404));

  const reviews = product.reviews.filter(
    (review) => review._id.toString() !== req.query.reviewId,
  );
  product.ratings =
    reviews.length > 0
      ? reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length
      : 0;
  product.reviews = reviews;
  product.numOfReviews = reviews.length;
  await product.save();
  res.status(200).json({ success: true });
});
