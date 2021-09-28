const Campground = require('../Models/campground');
const Review = require('../Models/review');

module.exports.createReview = async(req,res) => {
    const { id } = req.params;
    const review = await new Review(req.body);
    review.author = req.user._id;
    console.log('Review ',review);
    const campground = await Campground.findById(id);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    console.log('Campground',campground);
    req.flash('success','Review created successfully');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteReview = async(req,res) => {
    const { id, reviewID } = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewID}});
    await Review.findByIdAndDelete(reviewID);
    req.flash('success','Review deleted successfully');
    res.redirect(`/campgrounds/${id}`);
}