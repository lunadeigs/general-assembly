const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema(
    {
        username: {required: true, type: String},
        comment: {required: true, type: String}
    },
    {
        timestamps: true
    }
)

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;