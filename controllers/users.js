const usermodel = require("../models/user.js");

module.exports.renderSignupForm = function(req, res) {
  res.render('users/signup.ejs');
};

module.exports.signup =  async function(req, res) {

  try{
    let {username, email, password} = req.body;
    const newUser = new usermodel({email, username});
    const registeredUser = await usermodel.register(newUser,password);
    console.log(registeredUser);
    req.login(registeredUser, (err) => {
      if(err){
        return next(err);
      }
      req.flash("success", "welcome to Wanderlust");
      res.redirect("/listings");
    })
  
  } catch(e) {
    req.flash("error",e.message);
    res.redirect("/users/signup");
  }

};



module.exports.rederLoginForm = function(req, res) {
  res.render('users/login.ejs');
};

module.exports.login = async function(req, res) {
  req.flash("success", "Welcome back to Wanderlust! you are logged in.");
  let redirectUrl = res.locals.redirectUrl || "/listings"; // agar res.locals.redirectUrl ni value empty hoy to /listings add kari daisu tema.
  res.redirect(redirectUrl);
};

module.exports.logout = function(req, res, next) {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You are Loggedout Now!");
    res.redirect("/listings");
  });
};