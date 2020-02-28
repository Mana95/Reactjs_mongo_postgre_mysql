import React , {Component} from 'react';
import '../App.css';

import {authenticationService} from '../_services'
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';


export default class Login extends Component {
  constructor(props){
    super(props);

    if(authenticationService.currentUserValue) {
        //console.log('sdsad0');
        this.props.history.push('/');
    }
  }
    render(){
        return (

            <div className="container-fluid">
              <div className="row no-gutter">
                {/* The image half */}
                <div className="col-md-6 d-none d-md-flex bg-image" />
                {/* The content half */}
                <div className="col-md-6 bg-light">
                  <div className="login d-flex align-items-center py-5">
                    {/* Demo content*/}
                    <div className="container">
                      <div className="row">
                        <div className="col-lg-10 col-xl-7 mx-auto">
                          <h3 className="display-4" style={{color: '#366b5f'}}>React Login Page</h3>
                          {/* <p class="text-muted mb-4"  style="color:darkorange">Papyrus login form</p> */}
                          <br />
                          <Formik
                    initialValues={{
                        username: '',
                        password: ''
                    }}
                    validationSchema={Yup.object().shape({
                        username: Yup.string().required('Username is required'),
                        password: Yup.string().required('Password is required')
                    })}
                    onSubmit={({ username, password }, { setStatus, setSubmitting }) => {
                        setStatus();
                        authenticationService.login(username, password)
                            .then(
                                user => {
                                  console.log(user);
                                    const { from } = this.props.location.state || { from: { pathname: "/" } };
                                    this.props.history.push(from);
                                },
                                error => {
                                 console.log('ERROR');
                                  console.log(error);
                                    setSubmitting(false);
                                    setStatus('Username or password is incorrect');
                                }
                            );
                    }}
                    render={({ errors, status, touched, isSubmitting }) => (
                        <Form>
                            <div className="form-group">
                                <label htmlFor="username" style={{color: '#366b5f'}}>Username</label>
                                <Field name="username" type="text" className={'form-control rounded-pill border-0 shadow-sm px-4 text-success' + (errors.username && touched.username ? ' is-invalid' : '')} />
                                <ErrorMessage name="username" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password" style={{color: '#366b5f'}}>Password</label>
                                <Field name="password" type="password" className={'form-control rounded-pill border-0 shadow-sm px-4 text-success' + (errors.password && touched.password ? ' is-invalid' : '')} />
                                <ErrorMessage name="password" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group">
                                <button type="submit"   className="btn btn-success btn-block text-uppercase mb-2 rounded-pill shadow-sm" disabled={isSubmitting}>Login</button>
                                {isSubmitting &&
                                    <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                                }
                            </div>
                            {status &&
                                <div className={'alert alert-danger'}>{status}</div>
                            }
                        </Form>
                    )}
                /></div>
                      </div>
                    </div>{/* End */}
                  </div>
                </div>{/* End */}
              </div>
            </div>
          );
    }
}