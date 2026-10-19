if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");

const User = require("./models/user.js");
const ExpressError = require("./utils/ExpressError.js");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const listingsRouter = require("./routes/listings.js");
const reviewsRouter = require("./routes/reviews.js");

var app = express();

// ================= DATABASE =================

const dbUrl = process.env.ATLASDB_URL;

mongoose
    .connect(dbUrl)
    .then(() => {
        console.log("connected to ATLAS DB");
    })
    .catch((err) => {
        console.log("MongoDB connection error:", err);
    });

// ================= VIEW ENGINE =================

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// ================= MIDDLEWARE =================

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

app.engine("ejs", ejsMate);

// ================= SESSION =================

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error", (err) => {
    console.log("ERROR IN MONGO SESSION STORE", err);
});

const sessionOptions = {
    store: store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

app.use(session(sessionOptions));

app.use(flash());

// ================= PASSPORT =================

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ================= FLASH VARIABLES =================

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// ================= ROUTES =================

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);

// ================= 404 ERROR =================

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

// ================= ERROR HANDLING =================

app.use((err, req, res, next) => {
    let {
        statusCode = 500,
        message = "Something went wrong",
    } = err;

    res.status(statusCode).render("error.ejs", { message });
});

// ================= EXPORT =================

module.exports = app;
