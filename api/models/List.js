const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const ListSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    items: [
        {
            text: {type: String, required: true},
            checked: {type: Boolean, default: false}
        }
    ]
}, {
    timestamps: true
});

const ListModel = model('List', ListSchema);

module.exports = ListModel;