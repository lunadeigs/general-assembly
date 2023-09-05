const express = require('express');
const animals = express.Router();
const Animal = require('../models/animals.js');

const isAuthenticated = (req, res, next) => {
    if(req.session.currentUser) {
        return next();
    } else {
        res.redirect('/sessions/new');
    }
}

//Index
animals.get('/', (req, res) => {
    Animal.find({}, (err, items) => {
        err ? console.log(err) : console.log(items);
        res.render('animals/index.ejs', {
            animals: items,
            pageTitle: 'Index',
            currentUser: req.session.currentUser
        });
    });
});

animals.get('/seed', (req, res) => {
    Animal.create([
        {
            name: 'Bob',
            username: 'kole',
            fluff: 4,
            size: 5,
            img: 'https://i1.wp.com/www.dailycal.org/assets/uploads/2019/10/animals_wikimedia_cc-900x580.jpg',
            type: 'Seal',
            credit: 'https://i1.wp.com/www.dailycal.org/assets/uploads/2019/10/animals_wikimedia_cc-900x580.jpg'
        },
        {
            name: 'Melman',
            username: 'kole',
            fluff: 4,
            size: 5,
            img: 'https://static.boredpanda.com/blog/wp-content/uuuploads/cute-baby-animals/cute-baby-animals-2.jpg',
            type: 'Giraffe',
            credit: 'https://static.boredpanda.com/blog/wp-content/uuuploads/cute-baby-animals/cute-baby-animals-2.jpg'
        },
        {
            name: 'Geoffery',
            username: 'kole',
            fluff: 4,
            size: 5,
            img: 'https://i.pinimg.com/originals/a6/94/c2/a694c2f6dac7497974c391c7ecb0e337.jpg',
            type: 'Deer',
            credit: 'https://i.pinimg.com/originals/a6/94/c2/a694c2f6dac7497974c391c7ecb0e337.jpg'
        },
        {
            name: 'Buff',
            username: 'kole',
            fluff: 4,
            size: 5,
            img: 'https://pbs.twimg.com/profile_images/704447240216051712/mTel0Q49_400x400.jpg',
            type: 'dog',
            credit: 'https://pbs.twimg.com/profile_images/704447240216051712/mTel0Q49_400x400.jpg'
        }
    ]);
    res.redirect('/animals');
});
//New
animals.get('/new', isAuthenticated, (req, res) => {
    res.render('animals/new.ejs', {
        pageTitle: 'New',
        currentUser: req.session.currentUser
    });
});

//Create
animals.post('/', isAuthenticated, (req, res) => {
    req.body.fluff = parseInt(req.body.fluff);
    req.body.size = parseInt(req.body.size);
    req.body.username = req.session.currentUser.username;
    Animal.create(req.body, (err, newItem) => {
        err ? console.log(err) : console.log(newItem);
    });
    res.redirect('/animals');
});

//EditAll

animals.get('/editAll', isAuthenticated, (req, res) => {
    Animal.find({username: req.session.currentUser.username}, (err, userAnimals) => {
        console.log(userAnimals);
        err ? console.log(err) : console.log(userAnimals);
        res.render('animals/editAll.ejs', {
            pageTitle: 'Edit All',
            currentUser: req.session.currentUser,
            animals: userAnimals
        });
    });
});

//Edit
animals.get('/:id/edit', isAuthenticated, (req, res) => {
    Animal.findById(req.params.id, (err, item) => {
        err ? console.log(err) : console.log(item);
        res.render('animals/edit.ejs', {
            animal: item,
            pageTitle: 'Edit',
            currentUser: req.session.currentUser
        });
    });
})

//Update
animals.put('/:id', isAuthenticated, (req, res) => {
    Animal.findByIdAndUpdate(req.params.id, req.body, (err, updated) => {
        err ? console.log(err) : console.log(updated);
        res.redirect(`/${req.params.id}`);
    });
});

//Delete
animals.delete('/:id', isAuthenticated, (req, res) => {
    Animal.findByIdAndDelete(req.params.id, (err, deleted) => {
        err ? console.log(err) : console.log(deleted);
        res.redirect('/animals');
    });
});
//randomShow
animals.get('/randomAnimal', (req, res) => {
    Animal.find({}, 'id', (err, item) => {
        err ? console.log(err) : console.log(item);
        let randomItem = item[Math.floor(Math.random()*item.length)];
        res.redirect(`/animals/${randomItem.id}`);
    });
});

//Show
animals.get('/:id', (req, res) => {
    Animal.findById(req.params.id, (err, item) => {
        err ? console.log(err) : console.log(item);
        res.render('animals/show.ejs', {
            animal: item,
            pageTitle: 'Show',
            currentUser: req.session.currentUser
        });
    });
});

module.exports = animals;