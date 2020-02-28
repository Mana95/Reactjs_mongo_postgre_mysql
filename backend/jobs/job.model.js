const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const schema = new Schema({
    jobName: {
        type: String,
        unique: true,
        required: true
    },
    fileName: {
        type: String,
        required: true
    },
    template: {

        type: String,
        required: true

    },
    uniqueId: {
        type: String,
        required: true
    },
    //Add the role for the user.model.js
    today: {
        type: String,
        default: Date.now
    },
});


schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('jobs', schema);