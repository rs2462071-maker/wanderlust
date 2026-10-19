const listingmodel = require("../models/listing.js");
const reviewmodel = require("../models/review.js");

module.exports.createReview = async function(req,res) {
  let listing = await listingmodel.findById(req.params.id);
  let newReview = new reviewmodel(req.body.review);  // review naam nu model banavyu che ema req.body na through review aayu che e save karvanu kaam thase. post request ni method thi form submit thayu tu review nu ema review naam no object hato jeni 2 values hati rating and comment.
  newReview.author = req.user._id;
  listing.reviews.push(newReview);  // listing find kari eni andar review naam ni field na array ni andar newReview ne push/add karse
  await newReview.save();
  await listing.save();
  req.flash("success", "New Review Created!");
  res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyReview = async function(req,res) {
  let {id, reviewId} = req.params;
  await listingmodel.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
  await reviewmodel.findByIdAndDelete(reviewId);
  req.flash("success", "Review Deleted!");
  res.redirect(`/listings/${id}`);
};