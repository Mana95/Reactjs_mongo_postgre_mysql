require('rootpath')();
const cors = require('cors');
const publicConfig = require('publicConfig.json');
const { Pool, Client } = require('pg');
const mysql = require('mysql');


var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var multer = require('multer');
const jwt = require('_helpers/jwt');
const path = require('path');
const shell = require('shelljs');

var xlstojson = require("xls-to-json-lc");
var xlsxtojson = require("xlsx-to-json-lc");

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


//http  every controller 
app.use('/users', require('./users/users.controller'));
app.use('/uplds', require('./uplds/upload.controller'));
app.use('/jobs', require('./jobs/jobs.controller'));

/** Serving from the same express Server
No cors required */
app.use(express.static('../client'));


// pools will use environment variables
// for connection information
var connectionString = "postgres://postgres:1qa2ws3ed@localhost:5432/NovaAdmin";

const client = new Client({
    connectionString: connectionString
});

client.connect();


app.post('/postdata', function (req, res, next) {
  //  console.log('dsds');  console.log(req.body);
    let templateType = req.body.template;
    const file = req.body.data;
    const columns = req.body.tempColumns;
    //methini thamai error eka handle karanna wenne 
  //  console.log(columns);

    var params = [];
    var queryVal = [];
    var columnsData = [];

    for (var x = 0; x < columns.length; x++) {
        columnsData.push(`"` + columns[x] + `"`);
        // console.log(columnsData);
    }

    //Array Values  
    for (var i = 1; i <= columns.length; i++) {
        params.push('$' + i);
    }
    //console.log(params);
    for (var x = 0; x < file.length; x++) {
        let queryData = req.body.data[x];
        queryVal.push(queryData);
    }
    for (var x = 0; x < file.length; x++) {
        let queryData = req.body.data[x];
        //  console.log(queryVal);

        const insertQ = {
            text: 'INSERT INTO '+ templateType.replace(/\s/g, '')+ '(' + columns.join(', ') + ') VALUES(' + params.join(' ,') + ') RETURNING *',
            values: getData(queryData, columns)
        }

        // const savwenaeka = {
        //     text: `INSERT INTO Template_02(FirstName, LastName, Subject, Age, School) VALUES($1 ,$2 ,$3 ,$4 ,$5) RETURNING *`,
        //     values: [queryData.FirstName, queryData.LastName, queryData.Subject, queryData.Age, queryData.School],

        // }

      
       // console.log(savwenaeka);
        client.query(insertQ, function (err, result) {
            if (err) {
                console.log(err);
              
            } else {
             /*Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client
             res.send('ok');
             Error will popup
             */ 
               
            }
        })
    }
});

function getData(queryData, columns) {
   // console.log(queryData);
    let ValColumns = [];
    for (var x = 0; x < columns.length; x++) {
        // columnsData.push(`"`+columns[x]+`"`);
        //  ValColumns.push(`"`+queryData[columns[x]]+`"`)
        ValColumns.push(queryData[columns[x]]);
    }
      console.log(ValColumns);
    return ValColumns

}
var storage = multer.diskStorage({ //multers disk storage settings

    //Pass function that will generate destination path
    destination: function (req, file, cb) {

        let destination = path.join(__dirname, './uploads/'); //uploading
        shell.mkdir('-p', './uploads/' + req.params.uniqueId);
        destination = path.join(destination, '', req.params.uniqueId);

        cb(null, destination);
    },

    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.originalname);
    }
});

var upload = multer({ //multer settings
    storage: storage
}).single('file');

/** API path that will upload the files */
app.post('/upload/:uniqueId', function (req, res) {
    var exceltojson;
    upload(req, res, function (err) {
        //console.log("asasasasasasas" + req.file.originalname);
        if (err) {
            res.json({ error_code: 1, err_desc: err });
            return;
        }/** Multer gives us file info in req.file object */
        if (!req.file) {
            res.json({ error_code: 1, err_desc: "No file passed" });
            return;
        }/** Check the extension of the incoming file and
             *  use the appropriate module
             */
        if (req.file.originalname.split('.')[req.file.originalname.split('.').length - 1] === 'xlsx') {
            exceltojson = xlsxtojson;
        } else {
            exceltojson = xlstojson;
        }
        try {
            exceltojson({
                input: req.file.path,
                output: null, //since we don't need output.json
                lowerCaseHeaders: true
            }, function (err, result) {
                if (err) {
                    return res.json({ error_code: 1, err_desc: err, data: null });
                }
                res.json({ error_code: 0, err_desc: null, data: result });
            });
        } catch (e) {
            res.json({ error_code: 1, err_desc: "Corupted excel file" });
        }

        //  console.log("sdasdsadasdasdsadasdsad" + JSON.stringify(req.body.fileSeq));



    });
    app.get('/', function (req, res) {
        console.log("sdasdsadasdasdsadasdsad" + req.body);
    });
});



app.listen('4000', function () {
    console.log('running on 4000...');

});
