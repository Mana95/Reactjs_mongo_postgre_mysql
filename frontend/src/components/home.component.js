import React, { Component } from 'react';

import { FileUploader, FileManager } from 'reactjs-file-uploader';
import XLSX from 'xlsx';
import { make_cols } from './MakeColumns';
import '../App.css';

import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import * as moment from 'moment';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, folderOpen } from '@fortawesome/free-solid-svg-icons';
import { authenticationService } from '../_services'


const formValid = ({ formErrors, ...rest }) => {
    let valid = true;
    //Validate Form errors beging empty
    Object.values(formErrors).forEach(val => {
        val.length > 0 && (valid = false);
    });

    //Validate the form was  filled out
    Object.values(rest).forEach(val => {
        val === null && (valid = false);
    });

    return valid;
}


export default class Home extends Component {
    constructor(props) {
        super(props);
        console.log('Home Components');
        this.state = {
            firstName: null,
            description: null,
            selectedFile: null,
            fileName: '',
            columnValue: null,
            columnAlert: false,
            notMatch: false,
            failedAlert: false,
            InvalidAlert: false,
            emptyColumn:false,
            uniqueId: null,
            currentDate: null,
            files: [],
            file: {},
            data: [],
            columns: [],
            cols: [],
            templateId: null,
            TemplateType: [],
            dataTypeColumns: {},
            templateName: null,
            invalid: true,
            template: [],
            TemplateValue: 'Template 1',
            date: new Date(),
            formErrors: {
                firstName: "",
                description: " ",
            }
        };

        this.uploadFiles = this.uploadFiles.bind(this);
        this.uploadFile = this.uploadFile.bind(this);
        this.excelUploadFile = this.excelUploadFile.bind(this);
        this.onChangeFirstName = this.onChangeFirstName.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onchangeTemplate = this.onchangeTemplate.bind(this);
    }

    onchangeTemplate(e) {
        //    alert('Hellow')
        let tempVal = e.target.value;
        authenticationService.getByTemplate(tempVal)
            .then(
                response => {
                    
                    this.setState({
                        TemplateType: response.data[0].columns,
                        templateName: tempVal,
                        templateId: response.data[0].template_id,
                    })

                    //calling method to get data
                    this.getByIDTemplateData(this.state.templateId);
                }
            ).catch(
                error => console.log(error)
            )
        this.setState({
            TemplateValue: e.target.value
        })
        //  console.log(e.target.value);
    }
    //getting the temlate Id data from templateDatatype table
    getByIDTemplateData(id) {
        let idData = id;
        authenticationService.getById(idData)
            .then(
                response => {
                    console.log(response.data[0].data_type);
                    this.setState({
                        dataTypeColumns: response.data[0].data_type
                    })
                }
            ).catch(
                error => {
                    console.log(error);
                }
            )
    }


    componentDidMount() {
        authenticationService.getTemplate()
            .then(
                data => {
                    let arrayData = data.data;
                    let columnArray = [];
                    let tempArray = [];
                    for (var x = 0; x < arrayData.length; x++) {
                        tempArray.push(arrayData[x].template_name);
                        columnArray.push(arrayData[x].columns)
                    }
                    this.setState({
                        template: tempArray, columns: columnArray
                    });
                }
            )
    }
    onChangeFirstName(e) {
        e.preventDefault();
        const { name, value } = e.target;
        let formErrors = this.state.formErrors;
        switch (name) {
            case 'firstName':
                formErrors.firstName = value.length < 6 && value.length > 0
                    ? 'Minimum 6 character required!'
                    : "";
                break;
            case 'description':
                formErrors.description = value.length < 8 && value.length > 0
                    ? 'Minimum 8 character required!'
                    : "";
                break;
        }

        this.setState({ formErrors, [name]: value });
        //  console.log(e.target.value);
    }


    uploadFiles(files) {
        return files.map(this.uploadFile);
    }

    uploadFile(file) {
        return (
            <FileUploader
                key={file.key}
                file={file}
                url='https://api.cloudinary.com/v1_1/dpdenton/upload'
                formData={{
                    file,
                    upload_preset: 'public',
                    tags: 'vanilla',
                }}
                readFile
            >
                {this.fileProgress}
            </FileUploader>
        )
    }
    excelUploadFile(e) {
        const files = e.target.files;
        this.setState({
            selectedFile: e.target.files[0],
            loaded: 0,
        })
        //console.log('joo')

        if (files && files[0]) this.setState({ file: files[0] });

        this.setState({

            files: this.state.files.concat(Array.from(e.target.files)

            )
        })
        this.setState({

            fileName: this.state.file.name
        })
    }


    alertMessageMethod(alertType){
        switch(alertType){
            case 'warningColumns':
                this.setState({
                    emptyColumn: true
                })
                setTimeout(() => {
                    this.setState({
                        emptyColumn: false,
                    })
        
                }, 3000)
            break;
           


        }


    }


    //Checking the Feilds are valid or not
    onSubmit(e) {
        //console.log('hi')
        e.preventDefault(); /* Boilerplate to set up FileReader */
        // alert(this.state.templateId);
        let templateTypeData = this.state.TemplateType
  

        this.state.data.length = null;
        let formdataAll = new FormData();
        //converting the Excel File to Json
        //const reader = new FileReader();
        const reader = new FileReader();
        const rABS = !!reader.readAsBinaryString;
        const convertedFile = '';
        reader.onload = (e) => {
            /* Parse data */
            const bstr = e.target.result;
            const wb = XLSX.read(bstr, { type: rABS ? 'binary' : 'array', cellDates: true, bookVBA: true });
            /* Get first worksheet */
            const wsname = wb.SheetNames[0];
            //console.log(wsname);
            const ws = wb.Sheets[wsname];
            /* Convert array of arrays */
            const data = XLSX.utils.sheet_to_json(ws);
            console.log('Data')
            console.log(data);
             if (!data[0]) {
                this.alertMessageMethod('warningColumns');
            //    alert('Please check whether there have suffient Field');
                return;
            }
            /* Update state */
            this.setState({ data: data, cols: make_cols(ws['!ref']) }, () => {

            });
            this.convertedFile = data;
         
            let columnNames = Object.keys(data[0])

            console.log('ColumnsData');

            console.log(columnNames);

            let arrayObjName = Object.keys(data).join(" ");
            
            if (data[0].Date) {
                var dateString = data[0].Date;
            }

            //Validation of the template data
            if (this.state.TemplateValue == this.state.templateName) {
                //Validation the Datatype
                let dataType = this.state.dataTypeColumns;

                for (var i = 0; i < data.length; i++) {
                   // console.log(columns)
                    // console.log('FOR LOOP EKE ATHULE')
                 console.log(data[i][columnNames[i]]);
                    if (typeof data[i][columnNames[i]] !== dataType[columnNames[i]]) {
                   
                        console.log(templateTypeData.length);
                        console.log(columnNames[x]);
                        console.log(templateTypeData[x]);
                        this.DislayAlertExcelMsg(i);
                        return;
                    }
                }

                //Checking the columns
                for (var x = 0; x < templateTypeData.length; x++) {
                    if (columnNames[x] !== templateTypeData[x]) {
                        console.log('HIHIHIHIHI')
                        console.log(templateTypeData.length);
                        console.log(templateTypeData[x]);
                        this.failedMessage();
                        return;
                    }
                }
            }
            //Save Data method
           this.saveData(this.convertedFile ,this.state.templateName);

            /* Update state */
            this.setState({ data: data, cols: make_cols(ws['!ref']) }, () => {
            });
        };

        console.log('This is the data')
        console.log(this.state.data[0]);
        this.setState({
            fileName: this.state.file.name
        })
        // console.log(JSON.stringify(this.state.data)); 
        if (rABS) {
            reader.readAsBinaryString(this.state.file);
        } else {
            reader.readAsArrayBuffer(this.state.file);
        };
    }

    failedMessage() {
        //shows the alert message
        this.setState({
            failedAlert: true
        })
        //Set up a time out forthe alert message
        setTimeout(() => {
            this.setState({
                failedAlert: false,
            })

        }, 3000);
    }

    notMatching() {
        //shows the alert message
        this.setState({
            InvalidAlert: true
        })
        //Set up a time out forthe alert message
        setTimeout(() => {
            this.setState({
                InvalidAlert: false,
            })

        }, 3000);
    }

    DislayAlertExcelMsg(x) {
        var rowNumber = x + 2;
        console.log(`DidNot MAtch ${rowNumber}`);
        this.setState({
            columnAlert: true,
            columnValue: rowNumber
        })
        setTimeout(() => {
            this.setState({
                columnAlert: false,
            })

        }, 5000);

        return;

    }


    saveData(formatData , templateName) {

        //Shows the alert Message
        this.setState({
            notMatch: true
        })
        //Set up a time out forthe alert message
        setTimeout(() => {
            this.setState({
                notMatch: false,
            })

        }, 3000); this.setState({
            notMatch: true
        })
        //Set up a time out forthe alert message
        setTimeout(() => {
            this.setState({
                notMatch: false,
            })

        }, 3000);

        //Setup the formData  
        const data = new FormData()
        data.append('file', this.state.file)

        //Getting the Date 
        let m = moment().format('YYYY MM DD');;
    
        console.log('DATEEEEEEE CURRENT DATE');
        //console.log(today);


        //genereating unique Id;
        var chars = "ABCDEFGHIJKLMNOPQRSTUFWXYZ1234567890";
        var string_length = 8;
        var id = "FILE_" + "";
        for (var i = 0; i < string_length; i++) {
            var rnum = Math.floor(Math.random() * chars.length);
            id += chars.substring(rnum, rnum + 1);
            this.setState({
                uniqueId: id,
                currentDate: m
            })
        }


        let jobData = {
            jobName: this.state.firstName,
            fileName: this.state.file.name,
            description: this.state.description,
            template: this.state.TemplateValue,
            uniqueId: this.state.uniqueId,
            today: this.state.currentDate
        }
        console.log('Save Data');
        console.log(jobData);
        //Save Data to database
        authenticationService.InsertJob(jobData)
        .then(
            response => {
                console.log(response);
                document.getElementById("create-course-form").reset();
                this.setState({
                    firstName: null,
                    file: {},
                    description: null,
                })
            
            },
            error => {
                console.log(error);
            }
        )

        this.SaveConvertFile(formatData, templateName);
      



        axios.post(`http://localhost:4000/upload/${this.state.uniqueId}`, data, {

        })
            .then(res => {
                console.log(res.statusText);
            })
        // return this.http.post<any>(config.PAPYRUS + `/upload/${uniqueId}`, data);
    }

        SaveConvertFile(formatData, template) {
        //insertData into the postgreSql

        authenticationService.insertTemplateData(formatData, template, this.state.TemplateType)
            .then(
                response => {
                    console.log(response);
                }
            )
    }

    render() {
        const { template, formErrors } = this.state;
        let countriesList = template.length > 0
            && template.map((item, i) => {
                return (
                    <option key={i} value={item.id}>{item}</option>
                )
            }, this);


        return (
            <div className="container">
                <br />
                <form className="form" onSubmit={this.onSubmit} id="create-course-form">
                    <h2 style={{ color: '#366b5f' }}><span><FontAwesomeIcon icon={faUpload} /></span> Files Uploader</h2>
                    <hr />
                    <div hidden={!(this.state.emptyColumn)} className="alert alert-warning" role="alert">
                        <strong>File is Empty!</strong>
                    </div>
                    <div hidden={!(this.state.notMatch)} className="alert alert-success" role="alert">
                        <strong>This File Registered Successfully!</strong>
                    </div>
                    <div hidden={!(this.state.columnAlert)} className="alert alert-danger" role="alert">
                        <strong>Invalid Field Type , please check the uploaded Excel</strong>
                    </div>
                    <div hidden={!(this.state.InvalidAlert)} className="alert alert-danger" role="alert">
                        <strong>Template is does not match!</strong>
                    </div>
                    <div hidden={!(this.state.failedAlert)} className="alert alert-warning" role="alert">
                        <strong>Template is does not match!</strong>
                    </div>
                    <input type="file" accept=".xlsx"
                        onChange={this.excelUploadFile}
                        multiple /><br />
                    <hr />
                    <div className="row">
                        <div className="col">
                            <input type="text" name="firstName" onChange={this.onChangeFirstName} className="form-control " placeholder="Job name" />
                            {formErrors.firstName.length > 0 && (
                                <span className="errorMessage">{formErrors.firstName}</span>
                            )}

                        </div>
                        <div className="col">
                            <select className="form-control " value={this.state.TemplateValue} onChange={this.onchangeTemplate}>

                                {countriesList}
                            </select>
                        </div>
                    </div>
                    <br />
                    <div className="row">
                        <div className="col">
                            <textarea placeholder="Job Description" name="description" onChange={this.onChangeFirstName} className="form-control " id="exampleFormControlTextarea1" rows="3"></textarea>
                            {formErrors.description.length > 0 && (
                                <span className="errorMessage">{formErrors.description}</span>
                            )}
                        </div>
                    </div>
                    <hr />

                    <button disabled={!(this.state.firstName && this.state.file.name && this.state.description)} type="submit" className="btn btn-success"><FontAwesomeIcon icon={faUpload} /> Submit</button>
                </form>
            </div>
        );

    }
}