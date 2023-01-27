const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const Campground = require('./models/campground');
const { rmSync } = require('fs');

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
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
});

app.get('/campgrounds/new', async (req, res) => {
    const campgroundInfo = await Campground.findById(req.params.id);
    res.render('campgrounds/new');
});

app.post('/campgrounds', async (req, res) => {
    const fetchCampground = new Campground(req.body.campground);
    await fetchCampground.save();
    res.redirect(`/campgrounds/${fetchCampground._id}`);
});

app.get('/campgrounds/:id', async (req, res) => {
    const campgroundInfo = await Campground.findById(req.params.id);
    res.render('campgrounds/show', { campgroundInfo });
});

app.get('/campgrounds/:id/edit', async (req, res) => {
    const campgroundInfo = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campgroundInfo });
});

app.put('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const campgroundInfo = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${campgroundInfo._id}`);
});

app.delete('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
});


app.listen(3000, (req, res) => {
    console.log('Serving on port 3000!');
});