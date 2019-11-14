import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import '../../../App.css'
class Menu extends Component {
    state = {  }
    onMouseEnter=()=>{
        document.getElementById('sideMenu').style.marginLeft='0px';
        this.props.onReceiveMove('Enter');
    }
    onMouseLeave=()=>{
        document.getElementById('sideMenu').style.marginLeft='-170px';
        this.props.onReceiveMove('Leave');
    }
    render() { 
        return (  
            <div    id='sideMenu' 
                    className='sideMenu' 
                    onMouseEnter={this.onMouseEnter}
                    onMouseLeave={this.onMouseLeave}>
                <ul>
                    <li>
                        <Link to="/" className="d-inline">Home cccccccccc</Link>
                        <i className="fa fa-home fa-menu"></i>
                    </li>
                    <li>
                        <Link   to="/training" 
                                className="d-inline"
                                onClick={this.onClickMenu}
                                >Training
                        </Link> 
                        <i className="fa fa-users fa-menu"></i>                        
                    </li>
                    <li>
                        <Link to="/manage" className="d-inline">Manage Q&A</Link>
                        <i className="fa fa-tasks fa-menu"></i>
                    </li>
                    <li>
                        <Link to="/chat" className="d-inline">Chat</Link>
                        <i className="fa fa-comments fa-menu"></i>
                    </li>
                </ul>
            </div>
        );
    }
}
 
export default Menu;