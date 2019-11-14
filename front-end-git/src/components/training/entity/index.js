import React, { Component } from 'react';
import '../../../css/Component.css'

class Entity extends Component {
    constructor(props){
        super(props);
        this.state={
            change : 'people',
            input  : '',
            display : [],
            tag : []
        
        }
    }
    componentDidUpdate(prevProps, prevState){
        if(this.props.onShowEntity !== prevProps.onShowEntity){
            this.setState({
                display : this.props.onShowEntity,
                tag     : this.props.onShowDataTag
            })  
            
        }
        //console.log(this.props.onShowEntity);
        
    }
    componentWillMount(){
        this.setState({display : this.props.onShowEntity})            
    }
    onClick=(e,index)=>{   
        // var step = this.state.display
        // step.splice(index,1);
        // this.setState({display : step})    
        this.props.onReceiveIndexEntity(index);
    }

    onPressKey(e,index){
        if(e.keyCode === 13 && e.shiftKey=== false && e.target.value.length !== 0){
            e.preventDefault();
            this.props.onReceiveTag(e.target.value,index);
            document.getElementById(index).disabled = true;
        }
    }
    onChange=(e,index)=>{
        let arr = [];
        arr = this.state.tag;
        arr[index] = e.target.value;
        this.setState({
            tag : arr
        })
    }
    
    render() {        
        return ( 
            this.state.display.map((item,index)=> {return(
            <div>
                <div className="form-group">
                    <label></label>
                    <div>
                        <i  className="fa fa-window-close float-left col-1" 
                            aria-hidden="true"
                            onClick={(e)=>this.onClick(e,index)}></i>
                        <p className='float-left col-2'>{item}</p>
                    </div>
                    <input  type="text" name="place" id={index} className="form-control fc" placeholder="" aria-describedby="helpId"
                            onKeyDown={e=>this.onPressKey(e,index)} value={this.state.tag[index]} onChange={(e)=>this.onChange(e,index)}/>
                    <label></label>
                </div>
            </div> )})
        );
    }
}
 
export default Entity;