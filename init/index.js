const mongoose = require('mongoose');
const initData = require("./data.js");
const listingmodel = require("../models/listing.js");

mongoose.connect("mongodb://127.0.0.1:27017/wanderlust")
.then(() => {
    console.log("connected to DB");
  })
  .catch(() => {
    console.log(err);
  });

const initDB = async () => {
    await listingmodel.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner: "68bd39c7e55e3d034819ebd0"}));
    await listingmodel.insertMany(initData.data);
    console.log("data was initialized.");
};


// initDB();