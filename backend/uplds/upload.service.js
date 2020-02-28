const config = require('config.json');
const publicConfig = require('publicConfig.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('_helpers/db');

const Uplds = db.Uplds;

module.exports = {
  
    create,
    getJobsById,
    getAll,
    json
    
};

async function json (excelData) {

    //console.log(excelData);
}

async function create(userParam) {

   // console.log("Awaa" + JSON.stringify(userParam));
    
    const uplds = new Uplds(userParam);


   // console.log(uplds);
    // save user
    await uplds.save();

    
}

async function getAll()
//getting the all data form db
{
    return await Uplds.find({});
}



async function getJobsById(id) {
    //finding the data by id
    //console.log("This is the uploadservice"+ id);
    return await Uplds.find({ "id": id })

}
