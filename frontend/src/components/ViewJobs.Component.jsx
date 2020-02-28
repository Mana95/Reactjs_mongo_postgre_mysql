import React , {Component} from 'react';
import { authenticationService } from '../_services';
import { TableSimple } from 'react-pagination-table';


import Pagination from "react-js-pagination";
import  '@fortawesome/react-fontawesome';
import {angleDoubleDown} from '@fortawesome/free-solid-svg-icons';

const pannelFooter = {
  float: 'right'
};

export default class ViewJobs extends Component {
    constructor(props){
        super(props);

        this.state ={
            activePage: 1,
            projectList :[],
            itemPerPage:10,
            originalProjectList: []
            
        }
 
  this.handlePageChange = this.handlePageChange.bind(this);
    }

    handlePageChange(pageNumber) {
      this.setState({ activePage: pageNumber });
      console.log(this.state.projectList);
  }
    componentDidMount() {

    // //Getting Data from Backend
    authenticationService.loadData()
    .then(
      response=>{
      //  console.log(response.data);
        this.setState({
          projectList:response.data,
          originalProjectList: response.data
        })
      
      }
    )
    }

    render() {
      var indexOfLastTodo = this.state.activePage * this.state.itemPerPage;
  var indexOfFirstTodo = indexOfLastTodo - this.state.itemPerPage;
  var renderedProjects = this.state.projectList.slice(indexOfFirstTodo, indexOfLastTodo);
  
      var listItem = renderedProjects.map((item , index)=>{
        return <tr key={index}>
        <td>{item.template}</td>
        <td>{item.jobName}</td>
        <td>{item.fileName}</td>
        <td>{item.today}</td>
        </tr>
      });




  const Header = ["Template Name", "Job Name", "File Name", "Date"];
  const tableColumns = this.state.projectList;
        return (

            <div className="row">
              <div className= "container">
                <br/>
                <h1>

                  <div className="row"  style={{color: '#366b5f'}}>
                  <b><span> </span>  &nbsp;All Job status </b> &nbsp; &nbsp;    
                
                </div>
                </h1>
                <hr  />
                {/* <p>Your role is: <strong>{{currentUser.role}}</strong>.</p> */}
                <br />
 <table className="table table-striped table-hover table-bordered" id="mytable">
                  <caption>
                    <b>View Job Details</b>
                      </caption>
                  <thead>
                    <tr>
                      <th style={{textAlign: 'center'}} scope="col">Template Name</th>
                      <th style={{textAlign: 'center'}} scope="col">Job Name</th>
                      <th style={{textAlign: 'center'}} scope="col">File Name</th>
                       <th style={{textAlign: 'center'}} scope="col">Date</th>
                     
                    </tr>
                  </thead>
                  <tbody>
                  
                    {listItem}
                    </tbody>
                    
                </table>
                <div style={pannelFooter}>
                <Pagination
                  itemClass="page-item"
                    linkClass="page-link"
                     activePage={this.state.activePage}
                     itemsCountPerPage={this.state.itemPerPage}
                     totalItemsCount={this.state.originalProjectList.length}
                     pageRangeDisplayed={5}
                     onChange={this.handlePageChange.bind(this)}
                    />
                    </div>
                {/* <pagination-controls style={{float: 'right'}} /> */}
              </div>
            </div>
          );
    }

}