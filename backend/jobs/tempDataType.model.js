const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    template_id: {
        type: String,
        unique: true,
        required: true
    },
    columns: Array,

    data_type:Array,
    
    date: {
        type: String,
        default: Date.now
    },

});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('tempDataType', schema);