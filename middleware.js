const Campground = require('./Models/campground');
const Review = require('./Models/review');

module.exports.isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        console.log('New Session is ', req.session);
        req.flash('error','You must be login');
        return res.redirect('/login');
    }
    next();
}

module.exports.isReviewAuthor = async(req,res,next) => {
    const { id, reviewID } = req.params;
    const review = await Review.findById(reviewID).populate('author');
    if(!review.author.equals(req.user._id)) {
        req.flash('error','You do not have permission to do that');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.isAuthor = async(req,res,next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if(!campground.author.equals(req.user._id)) {
        req.flash('error','You do not have permission to do that');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}