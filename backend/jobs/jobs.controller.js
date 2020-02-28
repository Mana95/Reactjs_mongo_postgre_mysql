const express = require('express');
const router = express.Router();
const publicConfig = require('publicConfig.json');
const { Pool, Client } = require('pg');

const client = new Client({
    connectionString: publicConfig.connectionString
});
//this is a service called jobService  and jobMySqlservice this is will creates on the frontend on the project
const jobService = require('./jobPostgreSql.services');
const jobMySqlService = require('./jobMySql.service');
const jobMongoDbService = require('./jobMongoDbService');

//route to the path by exporting the routers
module.exports = router;
const dbType = publicConfig.ConnectionStringType;

//Http reqest in backend
router.get('/job', getJobs);
router.get('/getById/:id', getById);
router.post('/jobinsert', uploadJob);
router.post('/insertTemplate', insertTemplate);
router.post('/postdata', postdata);
router.get('/templateValus', templateValus);
router.get('/getByTemplate/:id', getByTemplate);


//inserting the data to relevent table
function postdata(req, res, next) {
    let templateType = req.body.template;
    const file = req.body.data;
    const columns = req.body.tempColumns;
    switch (dbType) {
        case 'mysql':
            jobMySqlService.postdata(templateType, file, columns)
                .then(temp => { res.json(temp) })
                .catch(err => next(err))
            break;
        case 'postgreSql':
            jobService.postdata(templateType, file, columns)
                .then(temp => { res.json(temp) })
                .catch(err => next(err))
            break;
            case 'mongoDb':
                jobMongoDbService.postdata(templateType, file, columns)
                    .then(temp => { res.json(temp) })
                    .catch(err => next(err))
                break;
    }
}

//get ById data
function getById(req, res, next) {
    switch (dbType) {
        case 'mysql':
            jobMySqlService.getByIdTmp(req.params.id)
                .then(temp => { res.json(temp) })
                .catch(err => next(err))
            break;
        case 'postgreSql':
            jobService.getByIdTmp(req.params.id)
                .then(temp => { res.json(temp) })
                .catch(err => next(err))
            break;
            case 'mongoDb':
                jobService.postdata(templateType, file, columns)
                    .then(temp => { res.json(temp) })
                    .catch(err => next(err))
                break;
    }
}


//getBy Template Data
function getByTemplate(req, res, next) {
    let templateName = req.params.id;
    switch (dbType) {
        case 'postgreSql':
            jobService.getTemplateData(templateName)
                .then(temp => {
                    console.log(temp);
                    res.json(temp)
                }).catch(err => next(err))
            break;
        case 'mysql':
            jobMySqlService.getTemplateData(templateName)
                .then(temp => {
                    console.log(temp);
                    res.json(temp)
                }).catch(err => next(err))
            break;
            case 'mongoDb':
                jobService.postdata(templateType, file, columns)
                    .then(temp => { res.json(temp) })
                    .catch(err => next(err))
                break;
    }
}

function templateValus(req, res, next) {
    switch (dbType) {
        case 'postgreSql':
            jobService.getTemplateAll()
                .then(jobs => { res.json(jobs) })
                .catch(err => next(err));
            break;
        case 'mysql':
            jobMySqlService.getTemplateAll()
                .then(jobs => { res.json(jobs) })
                .catch(err => next(err));
            break;
            case 'mongoDb':
                jobService.postdata(templateType, file, columns)
                    .then(temp => { res.json(temp) })
                    .catch(err => next(err))
                break;
    }
}

function insertTemplate(req, res, next) {
    console.log('CONTROLLER')
    switch (dbType) {
        case 'postgreSql':
            jobService.createTemplateTable(req.body)
                .then(jobs => res.json(jobs))
                .catch(err => next(err));
            break;
        case 'mysql':
            jobMySqlService.createTemplateTable(req.body)
                .then(jobs => res.json(jobs))
                .catch(err => next(err));
            break;
            case 'mongoDb':
                jobMongoDbService.createTemplateTable(req.body)
                    .then(temp => { res.json(temp) })
                    .catch(err => next(err))
                break;
    }
}

//New Job insert method
function uploadJob(req, res, next) {
    switch (dbType) {
        case 'mysql':
            jobMySqlService.insertJob(req.body)
                .then(() => res.json({}))
                .catch(err => next(err));
            break;
        case 'postgreSql':
            jobService.insertJob(req.body)
                .then(() => res.json({}))
                .catch(err => next(err));
            break;
            case 'mongoDb':
                jobMongoDbService.insertJob(req.body)
                .then(() => res.json({}))
                .catch(err => next(err));
                break;
    }
}

//getting the database data
function getJobs(req, res, next) {
    switch (dbType) {
        case 'mysql':
            jobMySqlService.getAll()
                .then(jobs => { res.json(jobs) })
                .catch(err => next(err));
            break;
        case 'postgreSql':
            jobService.getAll()
                .then(jobs => { res.json(jobs) })
                .catch(err => next(err));
            break;
            case 'mongoDb':
                // jobService.getAll(templateType, file, columns)
                //     .then(temp => { res.json(temp) })
                //     .catch(err => next(err))
                break;
    }
}
