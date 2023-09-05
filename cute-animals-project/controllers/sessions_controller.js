const bcrypt = require('bcrypt');
const express = require('express');
const sessions = express.Router();
const User = require('../models/users.js');

sessions.get('/new', (req, res) => {
    res.render('sessions/new.ejs', {
        currentUser: req.session.currentUser,
        pageTitle: 'Sign In',
        error: undefined
    });
});

sessions.post('/', (req, res) => {
    User.findOne({username: req.body.username}, (err, foundUser) => {
        if (err) {
            console.log(err);
            res.send('The db had a problem');
        }else if (!foundUser){
            res.send('<a href="/">Sorry, no user found </a>');
        }else {
            if(bcrypt.compareSync(req.body.password, foundUser.password)) {
                req.session.currentUser = foundUser;
                res.redirect('/animals');
            }else{
                res.send('<a href="/">Sorry, password does not match</a>')
            }
        }
    });
});

sessions.delete('/', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

module.exports = sessions;