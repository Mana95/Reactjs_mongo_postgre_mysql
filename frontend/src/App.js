import React, { Component } from 'react';

import { Router, Route, Link } from 'react-router-dom';
import { history, Role } from './_helpers';

import { PrivateRoute } from './_Components';
import { authenticationService } from './_services/authentication.service';

import './css/navbar.css';

import Home from './components/home.component';
import Login from './components/Login.component';
import ViewJobs from './components/ViewJobs.Component';

import Details from './components/Details.Component';
import TemplateComponent from './components/Template.Component';




class App extends Component {
  constructor(props) {
    super(props);
    console.log('Hello')
    this.state = {
      currentUser: null,
      isAdmin: false
    }
    //

  }
 
  componentDidMount() {
    console.log('Hello')
    authenticationService.currentUser
      .subscribe(x => {
        this.setState({
          currentUser: x,
          isAdmin: x && x.role === Role.Admin

        })
      }

      );
      
  }

  logout() {
    authenticationService.logout();
    history.push('/login')
  }
  render() {
    const { currentUser, isAdmin } = this.state;
    return (

      <Router history={history}>
        <div>


        {/* <Navbar/> */}

          {currentUser && <nav className="navbar navbar-expand navbar-dark bg-dark">
            <div className="navbar-nav">
              <Link to="/" className="nav-item nav-link">Home</Link>
              {/* <Link to="/navbar" className="nav-item nav-link">navbar</Link> */}
              {isAdmin && <Link to="/admin" className="nav-item nav-link">Add Job</Link> 
            }
            {isAdmin && <Link to="/view" className="nav-item nav-link">View Job</Link> 
            }
               
            {isAdmin && <Link to="/template" className="nav-item nav-link">View Template</Link> 
            }
              <a onClick={this.logout} className="nav-item nav-link aligntment">Logout</a>
            </div>
          </nav>
          }
           <PrivateRoute exact path="/template" component={TemplateComponent} />
          <PrivateRoute exact path="/" component={Details} />
          <PrivateRoute exact path="/view" component={ViewJobs} />
          {/* <PrivateRoute exact path="/navbar" component={Navbar} /> */}
          <PrivateRoute path="/admin" roles={[Role.Admin]} component={Home} />
          <Route path="/login" component={Login} />

        </div>
      </Router> 

    )




  }


}

export default App;