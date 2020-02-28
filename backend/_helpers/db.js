const config = require('config.json');
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || config.connectionString, { useCreateIndex: true, useNewUrlParser: true });
mongoose.Promise = global.Promise;

module.exports = {

    User: require('../users/user.model'),
    Uplds: require('../uplds/upload.model'),
    Jobs: require('../jobs/job.model'),
    TempColumn: require('../jobs/templates_columns.model'),
    TempDataType: require('../jobs/tempDataType.model')
    

    
};