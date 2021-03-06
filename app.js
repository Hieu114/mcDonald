const express = require('express');
const app = express();
const path = require('path');
const McDonald = require('./models/store');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
var methodOverride = require('method-override');
const passport = require('passport');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const Review = require('./models/review');
const restaurant = require('./routes/stores');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const reviewRoutes = require('./routes/review');

const userRoutes = require('./routes/user');

mongoose.connect('mongodb://localhost:27017/mcDonald', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})

const db = mongoose.connection;
db.on("error", console.error.bind(console,"connection error"));
db.once("open", ()=>{
    console.log("Database connected")
})

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')))

const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    console.log(req.session)
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/stores', restaurant);
app.use('/', userRoutes);
app.use('/stores/:id/review', reviewRoutes)

app.get('/', (req, res)=>{
    res.render('home.ejs',{who:'McDonald Home'})
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

app.listen(3000, ()=> {
    console.log("Listening on port 3000!!")
})