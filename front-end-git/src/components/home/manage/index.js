import React, { Component } from 'react';
import '../../../App.css'
import '../../../css/manage_home.css'
import IntentManage from './intent';
import EntityManage from './entity';

class ManageHome extends Component {  
   
    render() {  
        return (  	
            <div className = 'main-form' id='main'>
                <div className='intent'>
                    <IntentManage/>
                </div>
                <div className='entity'>
                    <EntityManage/>
                </div>    
            </div>
        );
    }
}
 
export default ManageHome;
