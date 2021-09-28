if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const AppError = require('./utils/AppError');
const userRoutes = require('./routes/users');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const User = require('./Models/user');
const MongoStore = require('connect-mongo')(session);

const dburl = process.env.DB_URL || 'mongodb://localhost:27017/visit-camp';

mongoose.connect(dburl,{useNewUrlParser : true, useUnifiedTopology : true})
    .then(() => {
        console.log('Database Connected Successfully');
    })
    .catch(err => {
        console.log('Sorry We got an error');
        console.log(err);
    })

const app = express();

app.engine('ejs',ejsMate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

const secret = process.env.SECRET || 'thisisnotactualsecret';

const sessionConfig = {
    store: new MongoStore({
        url: dburl,
        secret,
        touchAfter: 24 * 60 * 60
    }),
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() * 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(morgan('dev'));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')));
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/',userRoutes);
app.use('/campgrounds',campgroundRoutes);
app.use('/campgrounds/:id/reviews',reviewRoutes);


app.get('/',(req,res) => {
    res.render('home');
})

app.all('*',(req,res,next) => {
    next(new AppError(404,"Page not found"));
})

//Error Midlleware
app.use((err,req,res,next) => {
    if(err.isJoi === true) {
        err.status = 422;
    }
    const { status = 500 } = err;
    res.status(status).render('error',{ err });
})

const port = process.env.PORT || 8000;
app.listen(port,() => {
    console.log(`Listening on port ${port}`);
})