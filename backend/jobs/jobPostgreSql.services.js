const config = require('config.json');
const jwt = require('jsonwebtoken');
const publicConfig = require('publicConfig.json');
const bcrypt = require('bcryptjs');
const db = require('_helpers/db');
const { Pool, Client } = require('pg');
//calling the Job table in database


//in this every function mus export
module.exports = {
    getAll,
    postdata,
    insertJob,
    createTemplateTable,
    getTemplateAll,
    getTemplateData,
    getByIdTmp
};

//var connectionString = "postgres://postgres:1qa2ws3ed@localhost:5432/NovaAdmin";
var nameDumyy = "myCar";
const client = new Client({
    connectionString: publicConfig.connectionString
});

client.connect();

async function postdata(templateType, file, columns){
    var params = [];
    var queryVal = [];
    var columnsData = [];

    for (var x = 0; x < columns.length; x++) {
        columnsData.push(`"` + columns[x] + `"`);
    }
     //Array Values  
     for (var i = 1; i <= columns.length; i++) {
        params.push('$' + i);
    }
    //console.log(params);
    for (var x = 0; x < file.length; x++) {
        let queryData = file[x];
        queryVal.push(queryData);
    }
    for (var x = 0; x < file.length; x++) {
        let queryData = file[x];
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
}
function getData(queryData, columns) {
    // console.log(queryData);
     let ValColumns = [];
     for (var x = 0; x < columns.length; x++) {
 
         ValColumns.push(queryData[columns[x]]);
     }
       //console.log(ValColumns);
     return ValColumns
 }
//Get by id data
async function getByIdTmp(id){
    //console.log('service');
    const getByIdQuery = {
        text:`SELECT * FROM "tempDataType" WHERE template_id = ($1);`,
        values: [id]
    }
    return client.query(getByIdQuery)
    .then(res => {
        // console.log(res.rows[0])
        return res.rows;
    }).catch(e => console.error(e.stack))
}

//Getting the template Value
async function getTemplateData(template) {
    const getQuery = {
        text: `SELECT * FROM templates_columns WHERE template_name = ($1);`,
        values: [template]
    }
    return client.query(getQuery)
        .then(res => {
            // console.log(res.rows[0])
            return res.rows;
        }).catch(e => console.error(e.stack))

}


async function getTemplateAll() {
    const selectQuery = {
        text: `SELECT * from templates_columns`,
    }
    return client.query(selectQuery)
        .then(res => {
            // console.log(res.rows[0])
            return res.rows;
        })
        
        .catch(e => console.error(e.stack))
}


async function createTemplateTable(data) {
    let tempData = data.TemplateData;
    let excelData = data.rowData;
    const fieldNames = tempData.columns
    let valueArray = [];
    const ArrayRowData = Object.values(excelData);

    for (var x = 0; x < fieldNames.length; x++) {
            //console.log(ArrayRowData[0]);
        switch (typeof ArrayRowData[x]) {
            case 'string':
                valueArray.push(fieldNames[x].replace(/\s/g, '') + ` ` + 'text');
                break;
            case 'number':
                valueArray.push(fieldNames[x].replace(/\s/g, '') + ` ` + 'integer');
                break;
            case 'Date':
                valueArray.push(fieldNames[x].replace(/\s/g, '') + ` ` + 'date');
                break;
            case 'boolean':
                valueArray.push(fieldNames[x].replace(/\s/g, '') + ` ` + 'boolean');
                break;
            case 'object':
                valueArray.push(fieldNames[x].replace(/\s/g, '') + ` ` + 'date');
                break;
        }
    }
    var params = [];

    //Array Values

    for (var i = 1; i <= fieldNames.length; i++) {
        params.push('$' + i);
    }
    //console.log(params);
    const createQuery = {
        text: `CREATE TABLE ${tempData.templateName}(` + valueArray.join(',') + `);`,

    }

    //Insert DataType in to templates_dataType

    let dataObject = {}
    // console.log(excelData.ArrayRowData[0]);
    for (var i = 0; i < fieldNames.length; i++) {
        var fieldName = fieldNames[i];
        dataObject[fieldName] = typeof excelData[fieldName]

    }

    let jsonObject = JSON.stringify(dataObject)

    //console.log('TEMPLATE ID');
   // console.log(tempData.templateId)



    const insertDataTypeQuery = {
        text: `INSERT INTO "tempDataType"("template_id" ,"columns" , "data_type") VALUES($1, $2 ,$3)  RETURNING *`,
        // text:`INSERT INTO tempDataType("template_id" , "columns" ,"data_type") VALUES($1, $2 ,$3)  RETURNING *`,
        values: [tempData.templateId, tempData.columns, jsonObject],
    }

    const insertQuery = {
        text: `INSERT INTO templates_columns("template_name" ,"template_id" ,"columns" , "description") VALUES($1, $2 ,$3 ,$4)  RETURNING *`,
        values: [tempData.templateName, tempData.templateId, tempData.columns, tempData.templateDescription],
    }
    //console.log(createQuery);
    //insertDattype
    client.query(insertDataTypeQuery, function (err, result) {
        if (err) {
         //   console.log('ERROR')
            console.log(err)
            return;
        
        } else {
            console.log('insert una');
          
        }
    })
    //insert Query
    client.query(insertQuery, function (err, result) {
        if (err) {
           // console.log('ERROR')
            console.log(err)
            return;
            // res.send('Invalid input Type !'); 
            //console.log(err);
        } else {
            console.log('insert una');
            //res.send('ok'); 
            //this.createTable();
        }
    })

    //Create Table
    client.query(createQuery, function (err, result) {
        if (err) {
          //  console.log('ERROR')
            console.log(err)
            // res.send('Invalid input Type !'); 
            //console.log(err);
        } else {
            console.log('insert una');
            //res.send('ok'); 
            //this.createTable();
        }
    })

}

async function getAll() {
    var jsonData;
    const selectQuery = {
        text: `SELECT * from job ORDER BY today DESC`,

    }
    return client.query(selectQuery)
        .then(res => {
            // console.log(res.rows[0])
            return res.rows;
        })

        .catch(e => console.error(e.stack))

}

///Inserting the job to postgreSql
async function insertJob(userParam) {
    //console.log(userParam)
    console.log('Service')
    const now = new Date()
    let jobData = userParam;
    const insertQuery = {
        text: `INSERT INTO job("jobName" ,"fileName" ,"description" ,"template","uniqueId","today") VALUES($1, $2 ,$3 ,$4 ,$5 ,$6)  RETURNING *`,
        values: [jobData.jobName, jobData.fileName, jobData.description, jobData.template, jobData.uniqueId, jobData.today],
    }
    client.query(insertQuery, function (err, result) {
        if (err) {
            console.log('ERROR')
            console.log(err)
            // res.send('Invalid input Type !'); 
            //console.log(err);
        } else {
            console.log('insert una');
            //res.send('ok'); 
        }
    })


}
