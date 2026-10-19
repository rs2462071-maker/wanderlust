const express = require('express');
const router = express.Router();
const usermodel = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require('passport');
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");





//signup part start
router.get('/signup', userController.renderSignupForm);

router.post('/signup', wrapAsync(userController.signup));
//signup part ends



router.get('/login', userController.rederLoginForm);


router.post('/login', saveRedirectUrl, passport.authenticate("local", {failureRedirect: '/users/login', failureFlash: true}), userController.login);


router.get('/logout', userController.logout);

module.exports = router;