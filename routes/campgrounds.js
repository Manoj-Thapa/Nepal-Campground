const express = require('express');
const router = express.Router();

const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

const { campgroundSchema } = require('../schemas');
const catchAsync = require('../utils/catchAsync');
const campgrounds = require('../controllers/campgrounds');
const { isLoggedIn, isAuthor } = require('../middleware');

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('image'), campgroundSchema, catchAsync(campgrounds.createCampground));

router.get('/new', isLoggedIn, campgrounds.renderNewFrom);

router.route('/:id')
    .get(campgrounds.showCampground)
    .put(isLoggedIn, isAuthor, upload.array('image'), campgroundSchema, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));


router.get('/:id/edit', isLoggedIn, isAuthor, campgrounds.renderEditForm);

module.exports = router;