const mongoose = require('mongoose');
const Review = require('./review');

const Schema = mongoose.Schema;

const imageSchema = new Schema({
    url: String, 
    filename: String 
})

imageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload','/upload/w_210,h_200');
})

const campgroundSchema = new Schema({
    title: String,
    price: Number,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    images: [imageSchema],
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId, ref: 'User'
    },
    reviews: [
        { type: Schema.Types.ObjectId, ref: 'Review' }
    ]
})

campgroundSchema.post('findOneAndDelete', async function(campground) {
    if(campground) {
        await Review.deleteMany({_id : {$in : campground.reviews }});
    }
})

module.exports = mongoose.model('Campground',campgroundSchema);
