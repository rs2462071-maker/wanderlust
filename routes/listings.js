const express = require('express');
const router = express.Router();
const listingmodel = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer');
const {storage} = require('../cloudConfig.js');
const upload = multer({ storage });
 


router
    .route('/')
    .get( wrapAsync(listingController.index))//index route
    .post( isLoggedIn, upload.single('image'), validateListing, wrapAsync(listingController.createListing))//create route(create - crud)

//new route(create - crud)
router.get('/new', isLoggedIn, listingController.renderNewForm);

router
    .route('/:id')
    .get( wrapAsync(listingController.showListings))
    .put( isLoggedIn, isOwner,upload.single('image'), validateListing, wrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));


//edit route(update - crud) // edit karva maate edit.ejs ma form banavyu che e madse
router.get('/:id/edit', isLoggedIn , isOwner, wrapAsync(listingController.renderEditForm));



module.exports = router;











// //index route
// router.get('/', wrapAsync(listingController.index));

// //new route(create - crud)
// router.get('/new', isLoggedIn, listingController.renderNewForm);


// //create route(create - crud)
// router.post('/' , isLoggedIn, validateListing, wrapAsync(listingController.createListing));

// //show route(read - crud)
// router.get('/:id', wrapAsync(listingController.showListings));

// //edit route(update - crud) // edit karva maate edit.ejs ma form banavyu che e madse
// router.get('/:id/edit', isLoggedIn , isOwner, wrapAsync(listingController.renderEditForm));

// //update route(update - crud)
// router.put('/:id', isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing));

// //delete route
// router.delete('/:id', isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));


// module.exports = router;


