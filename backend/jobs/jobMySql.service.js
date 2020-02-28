const publicConfig = require('publicConfig.json');
var mysql = require('mysql');
 
module.exports = {
    getAll,
    getByIdTmp,
    postdata,
    createTemplateTable,
    getTemplateData,
    insertJob

}

//creating the mysql conncetion
var con = mysql.createConnection({

    host: publicConfig.host, // ip address of server running mysql
    user:publicConfig.user, // user name to your mysql database
    password: publicConfig.password, // corresponding password
    database: publicConfig.database // use the specified database

  });

  
//Inserting the job value
async function insertJob(data){


}

async function getTemplateData(data){
    const getQuery = {
        text: `SELECT * FROM templates_columns WHERE template_name = ($1);`,
        values: [template]
    }
}

async function createTemplateTable(data) {
    console.log('SERVICE SDSADSDA')
    
    let tempData = data.TemplateData;
    let excelData = data.rowData;
    const fieldNames = tempData.columns
    let valueArray = [];
    const ArrayRowData = Object.values(excelData);

    for (var x = 0; x < fieldNames.length; x++) {
        switch (typeof ArrayRowData[x]) {
            case 'string':
                valueArray.push(fieldNames[x].replace(/\s/g, '') + ` ` + 'varchar(255)');
                break;
            case 'number':
                valueArray.push(fieldNames[x].replace(/\s/g, '') + ` ` + 'int');
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

    const insertDataTypeQuery = {
        text: `INSERT INTO "tempDataType"("template_id" ,"columns" , "data_type") VALUES($1, $2 ,$3)  RETURNING *`,
       values: [tempData.templateId, tempData.columns, jsonObject],
    }

    const insertQuery = {
        text: `INSERT INTO templates_columns("template_name" ,"template_id" ,"columns" , "description") VALUES($1, $2 ,$3 ,$4)  RETURNING *`,
        values: [tempData.templateName, tempData.templateId, tempData.columns, tempData.templateDescription],
    }

    //insertinto temp column
    con.query(`INSERT INTO "templates_columns"("template_name" ,"template_id" ,"columns" , "description") VALUES(`+tempData.templateName + `,` + tempData.templateId +`,`+tempData.columns +`,`+ tempData.templateDescription+`) `, function (err, result) {
        if (err) {
            console.log(err);
            return;
        
        } else {
            console.log('insertinto temp column');
          
        }
    })

    //insert into templateDataType
    con.query(`INSERT INTO "tempDataType"("template_id" ,"columns" , "data_type") VALUES(`+tempData.templateId + `,` + tempData.columns +`,`+jsonObject+`) `, function (err, result) {
        if (err) {
            console.log(err);
            return;
        
        } else {
            console.log('insert into templateDataType');
          
        }
    })

    //wada
    // Create Table
    con.query(`CREATE TABLE ${tempData.templateName}(` + valueArray.join(',') + `);`, function (err, result) {
        if (err) {
            console.log('ERROR')
            console.log(err)
    
        } else {
            console.log('insert una');
            //res.send('ok'); 
            //this.createTable();
        }
    })

}


//insert data into table
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
      

        const insertQ = {
            text: 'INSERT INTO '+ templateType.replace(/\s/g, '')+ '(' + columns.join(', ') + ') VALUES(' + params.join(' ,') + ') RETURNING *',
            values: getData(queryData, columns)
        }

        con.query('INSERT INTO '+ templateType.replace(/\s/g, '')+ '(' + columns.join(', ') + ') VALUES(' + params.join(' ,') + ')', function (err, result) {
            if (err) {
                console.log(err);
                return;
            
            } else {
                console.log('insert into templateDataType');
              
            }
        })


    }
}

async function getByIdTmp(id){
    //console.log('service');
    const getByIdQuery = {
        text:`SELECT * FROM "tempDataType" WHERE template_id = ($1);`,
        values: [id]
    }
    return con.query(`SELECT * FROM "tempDataType" WHERE template_id =`+id+`;`)
    .then(res => {
        // console.log(res.rows[0])
        return res.rows;
    }).catch(e => console.error(e.stack))
}


async function getAll() {
    console.log('SERVICES')
    var jsonData;

    return con.query(`SELECT * from job ORDER BY today DESC`)
        .then(res => {
            // console.log(res.rows[0])
            return res.rows;
        })

        .catch(e => console.error(e.stack))

}