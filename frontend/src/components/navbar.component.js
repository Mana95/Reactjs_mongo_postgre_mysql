import React , {Component} from 'react';
import { Router, Route, Link } from 'react-router-dom'; 
import { authenticationService } from '../_services/authentication.service';
import { history, Role } from '../_helpers';


export default class Navbar extends Component {

    constructor(props) {
        super(props);
    
        this.state = {
          currentUser: null,
          isAdmin: false
        }
        //
    
      }
     
      logout() {
        authenticationService.logout();
        history.push('/login')
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

    render() {
        const { currentUser, isAdmin } = this.state;
        return(
            <div>
            {currentUser && <nav className="navbar navbar-expand navbar-dark bg-dark">
            <div className="navbar-nav">
              <Link to="/" className="nav-item nav-link">Home</Link>
              {/* <Link to="/navbar" className="nav-item nav-link">navbar</Link> */}
              {isAdmin && <Link to="/admin" className="nav-item nav-link">Add Job</Link>}
              <a onClick={this.logout} className="nav-item nav-link">Logout</a>
            </div>
          </nav>
          }
          </div>


        );

    }
}

