import React, { Component } from 'react';
import {Link} from 'react-router-dom'
import logo from './logo_white.PNG'
import '../../css/header.css'

class Header extends Component {
    state = {  }
    render() { 
        return (  
            <div className="container-fluid header">
                <div className="logo">
                    <img src={logo} alt='logo'></img>
                </div>
                <div className="menu">
                     <Link to="/" className="d-inline">Home</Link>
                     {/* <Link   to="/training" 
                                className="d-inline"
                                onClick={this.onClickMenu}
                                >Training
                        </Link>  */}
                        <Link to="/manage" className="d-inline">Manage Q&A</Link>
                        <Link to="/chat" className="d-inline">Chat</Link>
                </div>
            </div>
        );
    }
}
 
export default Header;