const User = require('../Models/user');

module.exports.renderRegister = (req,res) => {
    res.render('users/register');
}

module.exports.register = async (req,res) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if(err) next(err);
            req.flash('success', 'Welcome to Nepal Campground');
            res.redirect('/campgrounds');
        })
    }
    catch(err) {
        req.flash('error',err.message);
        return res.redirect('/register');
    }
}

module.exports.renderLogin = (req,res) => {
    res.render('users/login');
}

module.exports.login = (req,res) => {
    req.flash('success', `Welcome back, ${req.body.username}`);
    const redirectUrl= req.session.returnTo || '/campgrounds';
    delete(req.session.returnTo);
    res.redirect(redirectUrl);
}

module.exports.logout = (req,res) => {
    req.logout();
    req.flash('success','GoodBye');
    res.redirect('/campgrounds');
}