const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const animalSchema = new Schema(
    {
        name: {required: true, type: String},
        username: {required: true, type: String},
        fluff: {required: true, type: Number},
        size: {required: true, type: Number},
        img: {required: true, unique: true, type: String},
        type: {required: true, type: String},
        credit: {required: true, type: String}
    }
)

const Animal = mongoose.model('Animal', animalSchema);

module.exports = Animal;