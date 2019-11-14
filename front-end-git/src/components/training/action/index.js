import React, { Component } from 'react';
class Action extends Component {
    state = {  }
    sendKey = (e) =>{
        if(e.keyCode === 13 && e.shiftKey=== false && e.target.value.length !== 0){
            e.preventDefault();
            this.props.onReceiveKey(e.target.value);
            e.target.value = '';
        }
    }

    render() { 
        return (  
            <div>
                <div className="input-group ac">
                    <div className="input-group-prepend">
                        <div className="input-group-text">
                            <i  className="fa fa-plus" 
                                aria-hidden="true"
                                ></i>
                        </div>
                    </div>
                    <input  type="text" 
                            id = 'action'
                            className="form-control" 
                            name='change'
                            onKeyDown = {this.sendKey}      
                            />
                </div>
                <label/>
            </div>
        );
    }
}
 
export default Action;