import { BehaviorSubject, config } from 'rxjs';

import axios from 'axios';
import { handleResponse } from '../_helpers';



const currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')));

export const authenticationService = {
    login,
    logout,
    InsertJob,
    loadData,
    insertTemplateData,
    insertTemplate,
    getTemplate,
    getByTemplate,
    createNewTemplateTable,
    getById,
    currentUser: currentUserSubject.asObservable(),
    get currentUserValue () { return currentUserSubject.value }
};

function getById(id){
    console.log('authentication setvice')
    console.log(id);
    return axios.get(`http://localhost:4000/jobs/getById/${id}`)
    .then(
        data=>{
            return data;
        }
    )
}

function getByTemplate(template){
    return axios.get(`http://localhost:4000/jobs/getByTemplate/${template}`)
    .then(
        data=>{
            return data;
        }
    )
}


function getTemplate(){
    return axios.get(`http://localhost:4000/jobs/templateValus`)
    .then(
        data=>{
            return data;
        }
    )
}






function insertTemplate(TemplateData ,rowData){
    console.log('sdad')
}




//Createing table for template method;
function createNewTemplateTable(TemplateData ,rowData){
   // console.log('Serives');
   //

    return axios.post(`http://localhost:4000/jobs/insertTemplate`, {TemplateData ,rowData})
    .then(
        response =>{
            console.log(response);
        }
    ).catch(
        error=>{
            console.log(error);
        }
    )
}

function loadData() {
    return axios.get(`http://localhost:4000/jobs/job`)
    .then(
        data=>{
            return data;
        }
    )
}

function insertTemplateData(data ,template ,tempColumns) {
    return axios.post(`http://localhost:4000/jobs/postdata`, {data ,template ,tempColumns})
    .then(
        convertFile=>{
            console.log('convertFile.statusText');
            return convertFile; 
        }
    ).catch(
        data=>{
         //   console.log('Hello');
            console.log(data.error);
        }
    )   
    // return axios.post(`http://localhost:4000/postdata`, {data ,template ,tempColumns})
    // .then(
    //     convertFile=>{
    //         console.log('convertFile.statusText');
    //         return convertFile; 
    //     }
    // ).catch(
    //     data=>{
    //         console.log('Hello');
    //         console.log(data.error);
    //     }
    // )   
}

function InsertJob(data){
 
    // let postData = axios.post(`http://localhost:4000/jobs/jobinsert`, jobData)
        return axios.post(`http://localhost:4000/jobs/jobinsert`, data)
        .then(
            job=>{
                return job; 
            }
        )
}

function login(username, password) {
    
   return axios.post(`http://localhost:4000/users/authenticate`, { username, password })   
   
   .then(user => {
           
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('currentUser', JSON.stringify(user.data));
            currentUserSubject.next(user.data);
        
            return user.data;
              
        });
    

    
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    currentUserSubject.next(null);
}
