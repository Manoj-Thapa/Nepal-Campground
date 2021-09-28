const express = require('express');
const router = express.Router({mergeParams: true});

const { reviewSchema } = require('../schemas');
const catchAsync = require('../utils/catchAsync');
const reviews = require('../controllers/reviews');
const { isLoggedIn, isReviewAuthor } = require('../middleware');

router.post('/', reviewSchema, isLoggedIn, catchAsync(reviews.createReview));

router.delete('/:reviewID', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;