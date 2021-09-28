const Joi = require('joi');
const catchAsync = require('./utils/catchAsync');

module.exports.campgroundSchema = catchAsync(async(req,res,next) => {
    const campgroundSchema = Joi.object({
        title: Joi.string().required(),
        price: Joi.number().min(0).required(),
        // image: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        deleteImages: Joi.array()
    })
    await campgroundSchema.validateAsync(req.body);
    next();
})

module.exports.reviewSchema = catchAsync(async(req,res,next) => {
    const reviewSchema = Joi.object({
        body: Joi.string().required(),
        rating: Joi.number().min(0).max(5).required()
    })
    await reviewSchema.validateAsync(req.body);
    next();
})