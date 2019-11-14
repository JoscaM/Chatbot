import React, { Component } from 'react';
import '../../../css/chat.css'
import BotTraining from '../../../helper/botTraining'

class Input extends Component {
    constructor(props){
        super(props);
        this.addBotTraining = new BotTraining();
        this.onClick = this.onClick.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.state={
            input: '',
        }
    }
    async onKeyDown(e){        
        if(e.keyCode === 13 && e.shiftKey=== false && e.target.value.length!== 0){
            e.preventDefault();  
            let data = e.target.value          
            this.props.onReceiveInput(e.target.value);
            document.getElementById('message_send').value='';
            let step = await this.addBotTraining.sendMessage(data);
            console.log(step);
            this.props.onReceiveAnswer(step);
            // document.getElementById('message_send').value='';            
        }
    }
    async onClick(e){
        console.log(e);
        if(this.state.input.length !== 0){
            this.props.onReceiveInput(this.state.input);
            console.log(this.state.input);
            
            let step = await this.addBotTraining.sendMessage(this.state.input);
            this.props.onReceiveAnswer(step);
            document.getElementById('message_send').value=''
        }
    }
    onChange=(e)=>{
            this.setState({
                input : e.target.value,
            })
    }

    render() { 
        return (  
            <div class="bottom_wrapper clearfix">
                <div class="message_input_wrapper">
                    <input  
                            id = "message_send"    
                            class="message_input" 
                            placeholder="Type your message here..."
                            onChange={this.onChange} 
                            onKeyDown={(e)=>this.onKeyDown(e)}
                    />
                </div>
                <button className='send_message' onClick={(e)=>this.onClick(e)}>Send</button>
            </div>
        );
    }
}
 
export default Input;



