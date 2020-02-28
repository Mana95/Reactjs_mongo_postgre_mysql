const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    template_name: {
        type: String,
        unique: true,
        required: true
    },
    template_id: {
        type: String,
        required: true
    },
    description: {

        type: String,
        required: true

    },
    date: {
        type: String,
        default: Date.now
    },
    column:Array

});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('templates_columns', schema);