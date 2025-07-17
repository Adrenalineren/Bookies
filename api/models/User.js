const mongoose = require('mongoose');
const {Schema, model} = mongoose;
const UserSchema = new Schema({
    username : {type:String, required:true, min:4, unique: true},
    password : {type:String, required:true},
    avatar: {type: String, default: "/default-avatar.png"},
    bio : {type:String, default: ""},
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

const UserModel = model('User', UserSchema);

module.exports = UserModel;