const config = require('config.json');
const publicConfig = require('publicConfig.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('_helpers/db');
const User = db.User;

const { Pool, Client } = require('pg');

const Uplds = db.Uplds;
//var connectionString = "postgres://postgres:1qa2ws3ed@localhost:5432/NovaAdmin";
const client = new Client({
    connectionString: publicConfig.connectionString
});
client.connect();

module.exports = {

    authenticate,
    getAll,
    getById,
    create,
    insertUsers,
    update,
    getbyrole,
    delete: _delete,
    getAllq

};
async function insertUsers(data) {
  
}




async function authenticate({ username, password }) {
//     //console.log(username);
//     const userName = 'username'
//     const selectQuery = {
//         text: `SELECT * FROM templates_columns WHERE template_name = ($1);`,
//         values: [username]
//     }
//     return client.query(selectQuery)
//     .then(res => {
//         console.log(res.rows[0])
//         return res.rows;
//     }).catch(e => console.error(e.stack))
//    // console.log(excute);




    const user = await User.findOne({ username });
   // console.log(user);
    if (user && bcrypt.compareSync(password, user.hash)) {
        //  if (user && bcrypt.compareSync(password, user.hash)) {
        const { hash, ...userWithoutHash } = user.toObject();
        const token = jwt.sign({ sub: user.id }, config.secret);
        return {
            ...userWithoutHash,
            token
        };
    }
}

//Get data
async function getAllq() {
    return await Uplds.find({});
}


async function getAll() {
    return await User.find({});
}

async function getById(id) {
    return await User.findById(id).select('-hash');
}

async function getbyrole(role) {
    return await User.findByrole(role);

}

async function create(userParam) {
   // console.log("test");
    // validate
    if (await User.findOne({ username: userParam.username })) {
        throw 'Username "' + userParam.username + '" is already taken';
    }

    const user = new User(userParam);
   // console.log(user);
    // hash password
    if (userParam.password) {
        user.hash = bcrypt.hashSync(userParam.password, 10);
    }

    // save user
    await user.save();
}

async function update(id, userParam) {
    const user = await User.findById(id);

    // validate
    if (!user) throw 'User not found';
    if (user.username !== userParam.username && await User.findOne({ username: userParam.username })) {
        throw 'Username "' + userParam.username + '" is already taken';
    }

    // hash password if it was entered
    if (userParam.password) {

        userParam.hash = bcrypt.hashSync(userParam.password, 10);

    }

    // copy userParam properties to user
    Object.assign(user, userParam);

    await user.save();
    
    
}

async function _delete(id) {
    await User.findByIdAndRemove(id);
}
