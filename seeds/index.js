const mongoose = require('mongoose');
const Campground = require('../Models/campground');
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/visit-camp',{useNewUrlParser : true,useUnifiedTopology : true})
    .then(() => {
        console.log('Connection Established');
    })
    .catch(err => {
        console.log('Sorry We got an error');
        console.log(err);
    })

let sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for(let i = 0; i < 200; i++) {
        const rand1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '613b2090ba0d5a6b1ec8234f',
            location: `${cities[rand1000].city}, ${cities[rand1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum laborum id vitae fugit placeat consectetur! Ipsum maiores quaerat rerum quibusdam.',
            price,
            geometry: {
                 type: 'Point', 
                 coordinates: [
                     cities[rand1000].longitude,
                     cities[rand1000].latitude
                 ] 
                },
            images: [
                {
                  url: 'https://res.cloudinary.com/manojthapaa/image/upload/v1632040986/visit_camp/mrnrbm8waz2iufxhoxgf.jpg',
                  filename: 'visit_camp/mrnrbm8waz2iufxhoxgf'
                },
                {
                  url: 'https://res.cloudinary.com/manojthapaa/image/upload/v1632031536/visit_camp/pypm7drpx4vuenmbpvei.jpg',
                  filename: 'visit_camp/pypm7drpx4vuenmbpvei'
                }
              ],
        })
        await camp.save();
    }
}

seedDB();