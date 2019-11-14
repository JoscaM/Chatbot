import React, { Component } from 'react';
import '../../App.css';
// import Menu from '../training/menu/';
import Header from '../header';
import Training from '../training/training';
import IntentManage from './manage/intent';
import EntityManage from './manage/entity';


class Home extends Component {
    constructor(props){
        super(props);
        this.state={
            intent: [],
            entity:[]
        }
    }
    render() { 
        return (  
            <div className='container-fluid main_css'>
                <Header/>               
                <div className='body'>
                    <div className="panel with-nav-tabs panel-primary float-left">
                        <div className="panel-heading">
                                <ul className="nav nav-tabs">
                                    {/* the li co className = 'active */}
                                    <li><a href="#tab1primary" data-toggle="tab">Training</a></li>
                                    <li className="dropdown">
                                        <a href="#top" data-toggle="dropdown">Manage <span className="caret"></span></a>
                                        <ul className="dropdown-menu" role="menu">
                                            <li><a href="#tab4primary" data-toggle="tab">Intent</a></li>
                                            <li><a href="#tab5primary" data-toggle="tab">Entity</a></li>
                                        </ul>
                                    </li>
                                </ul>
                        </div>
                        {/* ==============Body================ */}
                        <div className="panel-body">
                            <div className="tab-content">
                                {/* =================Tab Tranning=============== */}
                                <div className="tab-pane fade" id="tab1primary">
                                    <Training/>
                                </div>                        
                                {/* =================Tab Intent======================== */}
                                <div className="tab-pane fade" id="tab4primary">
                                    <IntentManage/>
                                </div>
                                {/* ====================Tab Entity====================== */}
                                <div className="tab-pane fade" id="tab5primary">
                                    <EntityManage/>
                                </div>

                            </div>
                        </div>
                    </div>    
                </div> 
            </div>
        );
    }
}
 
export default Home;