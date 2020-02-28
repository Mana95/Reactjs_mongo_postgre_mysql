const config = require('config.json');
const publicConfig = require('publicConfig.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('_helpers/db');
var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Jobs = db.Jobs;
const TempColumn = db.TempColumn;
const TempDataType =db.TempDataType;

module.exports = {

    insertJob,
    createTemplateTable,
    postdata

}

async function postdata(templateType, file, columns){

}




async function createTemplateTable(data){
    console.log('MONGODB');
    console.log(data);
    let tempData = data.TemplateData;
    var saveExelData = data.rowData;
    let excelData = data.rowData;
    const fieldNames = tempData.columns;
     let dataObject = {}
    for(var x = 0 ; x<fieldNames.length ; x++){
        dataObject.push(excelData[fieldNames[x]]);
    }

     
     for (var i = 0; i < fieldNames.length; i++) {
                switch(typeof excelData[fieldNames[i]]){
                    case 'string':

                        excelData[fieldNames[i]] = {
                            type: 'String',
                        
                        }      
                    break;
                    case 'number':
                        excelData[fieldNames[i]] = {
                            type:'Number',
                          
                        }
                    break;
                    case 'boolean':
                        excelData[fieldNames[i]] = {
                            type:'Boolean',
                           
                        }
                    break;
                    case 'array':
                        excelData[fieldNames[i]] = {
                            type: 'Array',
                            
                        }
                    break;
                }
     }  
     let datsa = {
        FirstName:'sdadasdasdsa',
        LastName:'sadsdasdas',
        Age:5,
        Address:'asdasdasdasdasdasdas',
        Status:true

     }
       

     console.log(dataObject);
return;
    //compile Schema model
    const schema = new Schema(saveExelData);
    var tempSchema = mongoose.model(tempData.templateName,schema)
   // save model to database
  var book1 = new tempSchema();
     
   book1.save(function(err, result){
       if(err){
           return console.log(err);
       }else {
           console.log('collection is created');
       }
   })





  return;
    let jsonObject = JSON.stringify(dataObject)
    
    //creating dynamic Schema

   //console.log(fieldNames);
    //insert into templatecolumn
    let dataTemplate = {
        template_name: tempData.templateName, 
        template_id: tempData.templateId, 
        column: fieldNames, 
        description: tempData.templateDescription
    }

    let templateData = {
        template_id: tempData.templateId, 
        columns: tempData.columns,
        data_type:jsonObject
    }
    let childArraySchema = {};

    for(var x =0 ; x <fieldNames.length ; x++){

    }

    const templColumn = new TempColumn(dataTemplate);
    const tempDataType = new TempDataType(templateData);

    if(await templColumn.save()){
        await tempDataType.save();
    }



}

async function insertJob(userParam){
    const jobs = new Jobs(userParam);
     await jobs.save();
}
