import React, { Component } from 'react';
import '../../../css/Component.css';
import BotTraining from '../../../helper/botTraining'
class Intent extends Component {
    constructor(props){
        super(props);
        this.addBotTraining = new BotTraining(); 
        this.state = {
            option : ['Question', 'aaaa', 'bbbb', 'cccc', 'dddd'],
            display : []
        }
    }
    onClick=(e,index)=>{
        var step = this.state.display
        step.splice(index,1);
        this.setState({display : step});
        this.props.onReceiveIndexIntent(index);
        // console.log(index);
    }
    onHadleOption=(e,index)=>{
        this.props.onReceiveIntent(e.target.value);
        console.log(e.target.value);
        
    }
    async componentDidMount(){
        // let current = this.addBotTraining.getEntities();
        // console.log(current);
        let data = await this.addBotTraining.getIntents()
        console.log(data);
        
        if (data.status){
            this.setState({
                option:data.message
            })
        }
        else {
            alert(data.message)
        }
    }
    // Show Intent after write Question
    componentDidUpdate(prevProps, prevState ){
        if(prevProps.displayAfterQuestion !== this.props.displayAfterQuestion){
            
            this.setState({
                display:[...this.state.display, this.props.displayAfterQuestion]
            })
        }
    }
    render() { 
        //console.log(this.state.option);
        
        var option = this.state.option.map((option,index)=>{
            return (
            <option>{option.value}</option>
            )
        })
        //console.log(this.props.onShowIntent)
        return ( 
            this.state.display.map((item,index)=> {return( 
            <div className="form-group" id='formItent'>
                <label></label>
                
                <div>
                    <div>
                        <i  className="fa fa-window-close float-left col-1" 
                            aria-hidden="true"
                            onClick={(e)=>this.onClick(e,index)}></i>
                        <p className='float-left col-2'>intent</p>
                    </div>
                    <select className="custom-select-sm fc" value={this.props.onShowIntent} name="" id="" onChange={this.onHadleOption}>
                        {option}
                    </select>
                </div>
               
                
                <label></label>
            </div>)})
        );
    }
}
 
export default Intent;