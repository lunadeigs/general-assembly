const express = require('express');
const users = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/users.js');

//Signup
users.get('/signup', (req, res) => {
    res.render('users/signup.ejs', {
        pageTitle: 'Sign Up',
        currentUser: req.session.currentUser,
        error: undefined
    });
});

//Create

users.post('/', (req, res) => {
    req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    User.create(req.body, (err, createdUser) => {
        if(err){
            let newErr;
            if(err.errors != undefined){
                newErr = 'Sorry, Something Went Wrong';
                if(err.errors.username.properties.type === 'required'){
                    newErr = 'Please Input a Username';
                }
            }else if(err.code === 11000){
                newErr = 'Error, this user already exists';
            }else{
                newErr = 'Sorry, Something Went Wrong';
            }
            res.render('users/signup.ejs', {
                pageTitle: 'Sign Up',
                currentUser: req.session.currentUser,
                error: newErr
            });
        }else{
            console.log(createdUser);
            res.redirect('/sessions/new');
        }
        
    });
});

module.exports = users;