const Campground = require('../Models/campground');
const { cloudinary } = require('../cloudinary');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapBoxToken});

module.exports.index = async (req,res,next) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}

module.exports.renderNewFrom = (req,res) => {
    res.render('campgrounds/new');
}

module.exports.createCampground = async (req,res) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.location,
        limit: 1
    }).send();
    const campground = new Campground(req.body);
    campground.geometry = geoData.body.features[0].geometry;
    campground.images = req.files.map(f => ({url: f.path, filename: f.filename}));
    campground.author = req.user._id;
    await campground.save();
    req.flash('success','Campground created successfully');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.showCampground = async (req,res,next) => {
    console.log(req.session);
    let campground;
    try {
        campground = await Campground.findById(req.params.id).populate({
            path: 'reviews',
            populate: {
                path: 'author'
            }
            }).populate('author');
        console.log(campground);
    }
    catch(err) {
        console.log(err);
        req.flash('error','Cannot find campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
}

module.exports.renderEditForm = async (req,res,next) => {
    let campground;
    try {
        const { id } = req.params;
        campground = await Campground.findById(id);
    }
    catch(err) {
        req.flash('error','Cannot find campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
}

module.exports.updateCampground = async (req,res) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.location,
        limit: 1
    }).send();
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id,req.body);
    campground.geometry = geoData.body.features[0].geometry;
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}));
    campground.images.push(...imgs);
    await campground.save();
    if(req.body.deleteImages) {
        for(let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({$pull: { images: { filename: { $in: req.body.deleteImages }}}});
    }
    req.flash('success','Campground updated successfully');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteCampground = async (req,res,next) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success','Campground deleted successfully');
    res.redirect('/campgrounds');
}