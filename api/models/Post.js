const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const PostSchema = new Schema({
    title: String,
    review: String,
    content: String,
    cover: String,
    genres: [String], 
    rating: {
        type: Number,
        min: 1,
        max: 5,
        default: 1,
    },
    author: {type: Schema.Types.ObjectId, ref: 'User'},
}, {
    timestamps:true,
});

const PostModel = model('Post', PostSchema);

module.exports = PostModel;