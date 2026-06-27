const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, required: true },
  user: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter product name"],
    trim: true,
    maxlength: [100, "Name cannot exceed 100 characters"],
  },
  price: {
    type: Number,
    required: [true, "Please enter product price"],
    min: [0, "Price cannot be negative"],
  },
  description: {
    type: String,
    required: [true, "Please enter product description"],
    maxlength: [2000, "Description cannot exceed 2000 characters"],
  },
  category: {
    type: String,
    required: [true, "Please select product category"],
  },
  stock: {
    type: Number,
    required: [true, "Please enter product stock"],
    default: 1,
    min: [0, "Stock cannot be negative"],
  },
  images: [
    {
      public_id: { type: String, required: true },
      url: { type: String, required: true },
    },
  ],
  ratings: { type: Number, default: 0, min: 0, max: 5 },
  numOfReviews: { type: Number, default: 0 },
  reviews: [reviewSchema],
  user: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

productSchema.statics.updateStock = async function (productId, quantity) {
  const product = await this.findById(productId);
  if (product) {
    product.stock -= quantity;
    await product.save({ validateBeforeSave: false });
  }
};

module.exports = mongoose.model("Product", productSchema);
