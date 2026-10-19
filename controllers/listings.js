const listingmodel = require("../models/listing.js");

module.exports.index = async function(req,res) {
  const allListings = await listingmodel.find({});
  res.render("listings/index.ejs", {allListings});
};

module.exports.renderNewForm = function(req,res) {
  res.render("listings/new.ejs");
};

module.exports.createListing = async function(req,res) {
  let url = req.file.path;
  let filename = req.file.filename;
  console.log(url, "..", filename);
  const newListing = new listingmodel(req.body.listing); //form ma listing nam no javascript object banavyo che e access kari rahya che.
  //listing naam no object banavi ne kaam karva thi let {title,description,image,price,country,location} = req.body; aavu nahi lakhvu pade.
  // have listing object ma key value pairs bani gaya che jemke title is key and ema user je enter karse te value.
  newListing.owner = req.user._id;
  newListing.image = {url, filename};
  await newListing.save();
  req.flash("success", "new listing created!");
  res.redirect("/listings");
};

module.exports.showListings = async function(req,res) {
  let {id} = req.params;
  const listing = await listingmodel.findById(id).populate({path:'reviews',populate:{path: "author",}}).populate('owner');
  if(!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    res.redirect("/listings");
  }
  console.log(listing);
  res.render("listings/show", {listing});
};

module.exports.renderEditForm = async function(req,res) {
  let {id} = req.params;
  const listing = await listingmodel.findById(id);
  if(!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    res.redirect("/listings");
  }

  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_250");
  res.render("listings/edit.ejs", {listing, originalImageUrl});
};

module.exports.updateListing = async function(req,res) {
  let {id} = req.params;
  let listing = await listingmodel.findByIdAndUpdate(id, {...req.body.listing});
  if(typeof req.file !== "undefined"){
  let url = req.file.path;
  let filename = req.file.filename;
  listing.image = {url, filename};
  await listing.save();
  }

  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async function(req,res) {
  let {id} = req.params;
  let deletedListing = await listingmodel.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};