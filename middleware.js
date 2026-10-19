const listingmodel = require("./models/listing.js");
const reviewmodel = require("./models/review.js");
const {listingSchema,reviewSchema} = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");




module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;  // req.session ni andar j aapne originalurl ne save karavi lidhu redirectUrl naam thi. matalb ke user kaik kaam karva jato hato web site par pn te loggedIn nohto tena lidhe tene login karva vada page pare redirect karva ma aavse. pn login page par mokalta pehala je url parke kaam par jato hato e url ne save kari didhu aapne so login thaay te pachi tene ej url par redirect kari sakaay.
        req.flash("error", "you must be logged in to create listing");
        return res.redirect('/users/login');
  }
  next();
};


module.exports.saveRedirectUrl = (req, res, next) => {  
    // agar amari req.session ma koi redirect url save thayu che to tene locals variable ni andar save karavi laisu.cz login thata ni sathe j req.session ma save karelu aa url delethe thai jase. pn passport ni passe aa locals mathi delete karva no powe nathi. so e url ne aa rte access karsu aapne.
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};


module.exports.isOwner = async (req,res,next) => {
    let {id} = req.params;
    let listing = await listingmodel.findById(id);
    if (!listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the owner of this listing!");
        return res.redirect(`/listings/${id}`);
    }
    next();
      
};
// je users listing na owner nathi e loko maate edit delete na icon to hide kari didha che pn e loko hopscoch ni help thi request mokl sake che. so a rite emno access deny karishu.
      

module.exports.validateListing = (req,res,next) => {
  let {error} = listingSchema.validate(req.body);  //joi use kari ne schema validate karyu je user e form fill karyu te. schema.js ma joi implement kari ne ahi require kari ne aa middeleware banavyu.
  if(error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else{
    next();
  }
};
    


module.exports.validateReview = (req,res,next) => {
  let {error} = reviewSchema.validate(req.body);  //joi use kari ne schema validate karyu je user e form fill karyu te. schema.js ma joi implement kari ne ahi require kari ne aa middeleware banavyu.
  if(error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else{
    next();
  }
};



module.exports.isReviewAuthor = async (req,res,next) => {
    let {id, reviewId} = req.params;
    let review = await reviewmodel.findById(reviewId);
    if (!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the author of this review!");
        return res.redirect(`/listings/${id}`);
    }
    next();
      
};