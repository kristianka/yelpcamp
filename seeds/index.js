const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');

mongoose.set('strictQuery', false);
mongoose.connect('mongodb://127.0.0.1:27017/yelpcamp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'database connection error'));
db.once('open', () => console.log('database connected!'));


const sample = (array) => array[Math.floor(Math.random() * array.length)];

// format db
const seedDB = async () => {
    await Campground.deleteMany({});

    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const randPrice = Math.floor(Math.random() * 20) + 10;
        const newcamp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://random.imagecdn.app/500/150',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam, aut odit magnam debitis possimus reprehenderit, nulla nostrum cupiditate vel illo tempora? Obcaecati consequatur vitae, ipsa dolor id fuga nulla quidem.',
            price: randPrice
        });
        await newcamp.save();
    }
};

seedDB()
    .then(() => {
        mongoose.connection.close();
        console.log('Closing connection');
    })