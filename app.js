const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const Campground = require('./models/campground');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');

const { campgroundSchema } = require('./schemas');


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

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    console.log(error);
    if (error) {
        const msg = error.details.map(e => e.message).join(',');
        throw new ExpressError(msg, 400);
    } else next();
}

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/campgrounds', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds, title: 'All campsites' });
}));

app.get('/campgrounds/new', catchAsync(async (req, res) => {
    const campgroundInfo = await Campground.findById(req.params.id);
    res.render('campgrounds/new');
}));

app.post('/campgrounds', validateCampground, catchAsync(async (req, res, next) => {
    // if (!req.body.campground) throw new ExpressError('Invalid Campground data', 400);
    const fetchCampground = new Campground(req.body.campground);
    await fetchCampground.save();
    res.redirect(`/campgrounds/${fetchCampground._id}`);
}));

app.get('/campgrounds/:id', catchAsync(async (req, res) => {
    const campgroundInfo = await Campground.findById(req.params.id);
    res.render('campgrounds/show', { campgroundInfo });
}));

app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
    const campgroundInfo = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campgroundInfo });
}));

app.put('/campgrounds/:id', validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campgroundInfo = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${campgroundInfo._id}`);
}));

app.delete('/campgrounds/:id', validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}));

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Something went wrong!';
    res.status(statusCode).render('error', { err });
});


app.listen(3000, (req, res) => {
    console.log('Serving on port 3000!');
});