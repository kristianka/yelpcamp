const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Campground = require('./models/campground');

mongoose.set('strictQuery', false);
mongoose.connect('mongodb://127.0.0.1:27017/yelpcamp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'database connection error'));
db.once('open', () => console.log('database connected!'));


const app = express();


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/campgrounds', async (req, res) => {
    // fetch campgrounds from db
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
});

app.get('/campgrounds/new', async (req, res) => {
    // fetch campgrounds from db
    const campgroundInfo = await Campground.findById(req.params.id);
    res.render('campgrounds/new');
});

app.post('/campgrounds', async (req, res) => {
    const fetchCampground = new Campground(req.body.campground);
    await fetchCampground.save();
    res.redirect(`/campgrounds/${fetchCampground._id}`);
});

app.get('/campgrounds/:id', async (req, res) => {
    // fetch campgrounds from db
    const campgroundInfo = await Campground.findById(req.params.id);
    res.render('campgrounds/show', { campgroundInfo });
});

app.listen(3000, (req, res) => {
    console.log('Serving on port 3000!');
});