const mongoose = require('mongoose');
const reviewmodel = require("./review");

const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },

    description: String,
    
    image: {
        url: String,
        filename: String,
    },

    price: {
        type: Number,
        required: true
    },
    location: String,
    country: String,
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    // category: {
    //     type: String,
    //     enum: ["mountains", "arctic", "farms", "deserts"]
    // }

});

listingSchema.post("findOneAndDelete", async( listing) => {
    if (listing) {
        await reviewmodel.deleteMany({_id : {$in :listing.reviews}});
    }
});




module.exports = mongoose.model('Listing', listingSchema);