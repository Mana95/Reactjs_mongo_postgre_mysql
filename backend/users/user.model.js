const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    username: { 
        type: String, 
        unique: true, 
        required: true
    },
    hash: { 
        type: String,
         required: true
         },
    firstName: {
        
        type: String,
        required: true 

        },
    lastName: {
        type: String,
        required: true
         },
         //Add the role for the user.model.js
    role: {
        type: String,
        required: true
            },
    createdDate: { 
        type: Date, 
        default: Date.now
      
     },
     //create a field email
     email: {
        type: String,
        required: true
     }

});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('User', schema);