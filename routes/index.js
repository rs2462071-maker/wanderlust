var express = require('express');
var router = express.Router();

const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");










/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });








// router.all("*", (req, res, next) => {
//   next(new ExpressError(404,"page Not Found"));
// });

module.exports = router;
