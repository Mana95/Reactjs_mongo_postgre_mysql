// you have to do this if you use JSX
import React from 'react'
import XLSX from 'xlsx';
import { make_cols } from './MakeColumns';
import { authenticationService } from '../_services'

export default class TemplateComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedFile: null,
            template_name: null,
            uniqueId: null,
            description: null,
            notMatch : false,
            fileName: '',
            file: {},
            files: [],
            columns: {},
            data: [],
            cols: [],
            formErrors: {
                template_name: "",
                description: " ",
            }

        }
        this.excelUploadFile = this.excelUploadFile.bind(this);
        this.onChangeFormData = this.onChangeFormData.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        //this.AutoGenId();

    };


    componentDidMount() {
        this.AutoGenId();
    }

    AutoGenId() {

        //genereating unique Id;
        var chars = "ABCDEFGHIJKLMNOPQRSTUFWXYZ1234567890";
        var string_length = 8;
        var id = "FILE_" + "";
        for (var i = 0; i < string_length; i++) {
            var rnum = Math.floor(Math.random() * chars.length);
            id += chars.substring(rnum, rnum + 1);
        }
        //    console.log(id);
     
        console.log(this.state.uniqueId);

    }

    onSubmit(e) {
        e.preventDefault();
        
        this.state.data.length = null;
        let formdataAll = new FormData();
        //converting the Excel File to Json
        const reader = new FileReader();
        console.log('READER');
        console.log(reader);
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
            let columnNames = Object.keys(data[0])
           // console.log(columnNames);
            //Check there have data inside the columns

            
            const rowData = data[0];
            const ArrayRowData = Object.values(rowData)

             //genereating unique Id;
        var chars = "ABCDEFGHIJKLMNOPQRSTUFWXYZ1234567890";
        var string_length = 8;
        var id = "T_" + "";
        for (var i = 0; i < string_length; i++) {
            var rnum = Math.floor(Math.random() * chars.length);
            id += chars.substring(rnum, rnum + 1);
            this.setState({
                uniqueId: id,
            })
        }
        console.log(this.state.uniqueId);
            console.log('Row Data');
            console.log(rowData);
            console.log(ArrayRowData);
            this.setState({             
                   columns : columnNames 
                       })
            let templateData = {
                templateName: this.state.template_name,
                templateId: this.state.uniqueId,
                templateDescription: this.state.description,
                columns: this.state.columns
            }
            console.log('TEMPLATEDATA')
            console.log(templateData);
            const dummyData = 'Template data somthing';
                const lineSpce = dummyData.replace(/\s/g, '') 
                console.log(lineSpce);

            authenticationService.createNewTemplateTable(templateData , rowData)
                .then(
                    data => {
                        console.log(data);
                        document.getElementById("create-course-form").reset();
                    }
                ).catch(
                    error => {
                        console.log(error);
                    }
                )

         }
        if (rABS) {
            reader.readAsBinaryString(this.state.file);
        } else {
            reader.readAsArrayBuffer(this.state.file);
        };
    }

    onChangeFormData(e) {
        e.preventDefault();
        const { name, value } = e.target;
        let formErrors = this.state.formErrors;
        //   console.log(name);
        switch (name) {
            case 'template_name':
                formErrors.template_name = value.length < 6 && value.length > 0
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

        //   console.log(this.state.description);

    }


    alertMessageMethod(alertType){
        switch(alertType){
            case 'warningColumns':
                this.setState({
                    notMatch: true
                })
                setTimeout(() => {
                    this.setState({
                        notMatch: false,
                    })
        
                }, 3000)
            break;
           


        }


    }



    excelUploadFile(e) {
        const files = e.target.files;
        this.setState({
            selectedFile: e.target.files[0],
            loaded: 0,
        });
        if (files && files[0]) this.setState({ file: files[0] });

        this.setState({

            files: this.state.files.concat(Array.from(e.target.files)

            )
        })

        console.log(this.state.files);
        this.setState({

            fileName: this.state.file.name
        })
        //  console.log(this.state.files);       
    }



    render() {
        const { formErrors } = this.state;

        return (
            <div className="container">
                <br />
                <div className="row" style={{ color: '#366b5f' }}>
                    <h1>    <b><span> </span>  &nbsp;New Template </b> &nbsp; &nbsp;
                </h1>
                </div>

                <hr />
                <form className="form" onSubmit={this.onSubmit} id="create-course-form">
                <div hidden={!(this.state.notMatch)} className="alert alert-warning" role="alert">
                        <strong>Didn't have Any data in the file</strong>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <label htmlFor="inputEmail4">Template Name</label>
                            <input type="text" className="form-control" name="template_name" id="inputEmail4" onChange={this.onChangeFormData} placeholder="Template Name" />
                            {formErrors.template_name.length > 0 && (
                                <span className="errorMessage">{formErrors.template_name}</span>
                            )}
                        </div>
                        <div className="form-group col-md-6">
                            <label htmlFor="inputPassword4">File</label><br />
                            <input type="file" accept=".xlsx"
                                onChange={this.excelUploadFile}
                                multiple />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-12">
                            <label htmlFor="inputEmail4">Templete Description</label>
                            <textarea placeholder="Templete Description" name="description" onChange={this.onChangeFormData} className="form-control " id="exampleFormControlTextarea1" rows="3"></textarea>
                            {formErrors.description.length > 0 && (
                                <span className="errorMessage">{formErrors.description}</span>
                            )}

                        </div>
                    </div>

                    <hr />
                    <br />
                    <div className="form-row">
                        <button disabled={!(this.state.file.name && this.state.description && this.state.template_name)} type="submit" className="btn btn-success"> Submit</button>

                    </div>

                </form>
            </div>
        )
    }

}






   //  let columnNameArray = [];
        // let dataTypeArray = [];
        // for(var x =0 ; ArrayRowData.length ; x++){
        //    columnNameArray.push(ArrayRowData[x]);
        // }
        // console.log(columnNameArray);
    //         convertedFile = data;
    //         console.log(convertedFile);
    //         for(var k= 0 ; k< columnNameArray.length ; k++){
    //             dataTypeArray.push(typeof columnNameArray[k]);
    //         }
    //         console.log('Hello world');
    //         console.log(dataTypeArray);
    //    //     console.log((data[0].Date) instanceof Date);
    //         let columnNames = Object.keys(data[0]);

    //         this.setState({
    //             columns : columnNames
    //         })
    //       //  console.log(data[0]);

    //             let templateData = {
    //                 templateName : this.state.template_name,
    //                 templateId: 'jiji6767',
    //                 templateDescription: this.state.description,
    //                 columns:this.state.columns
    //                }
