import React, { Component } from 'react';
//import '../../../css/chat.css'
import avatar_bot from './bot_avatar.gif'  
import avatar_client from './client.jpg'

class MessageItem extends Component {
    constructor(props){
        super(props);
        this.state={
            display:['']
        }
    }
    scrollToBottom(){
        let step = document.getElementById(this.props.messages);
        if(step !== null){
            step.scrollIntoView();
        }
    }
    componentDidMount(){
        this.scrollToBottom();
    }
    
    componentDidUpdate(){
        this.scrollToBottom();
    }
    render() { 
        console.log(this.props.messages);
        // var date = new Date();
        return (  
            <div>
                <li id={this.props.messages} className={this.props.user === 0 ? 'message left': 'message right'}>
                    <img    className={this.props.user === 0? 'avatar_bot' : 'd-none'}
                            src={avatar_bot} 
                            alt=''></img>
                    <img    className={this.props.user===1? 'avatar_client' : 'd-none'}
                            src={avatar_client} 
                            alt=''></img>
                    {/* <div className="avatar"></div> */}
                    <div className="text_wrapper">
                        <div className="text">{this.props.messages}</div>
                    </div>
                    {/* <div className="time">{date.getHours()}:{date.getMinutes()} </div> */}
                </li> 
                
            </div>
        );
    }
}
 
export default MessageItem;

