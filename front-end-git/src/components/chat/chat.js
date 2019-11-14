import React, { Component } from 'react';
// import Menu from '../training/menu';
import '../../css/chat.css'
import Input from './input/';
import MessageList from './mesageList/';
import Header from '../header';

class Chat extends Component {
    constructor(props){
        super(props);
        this.state={
            // messages: [
            //     {id: 1, userId: 0, message: ''}
            // ],
            messages : [{
                user : 0,
                message: ['Hello there!!']
            }]
            // messages: ['Hello! Can I help you?'],
            // user: 0, // 0 is bot and 1 is client
        }
    }
   

    onChange=(event)=>{
        // console.log(event.target.value);
    }

    //Receive message from Input
    onReceiveInput=(data)=>{
        let step = {}
        step.message = data;
        step.user  = 1;
        let current = this.state.messages;
        current = [...current,step]        
        this.setState({
            messages:current
            // user : 1 
        })        
        
    }

    onReceiveAnswer=(data)=>{
        let step = {}
        step.message = data.message;
        step.user  = 0;
        let current = this.state.messages;
        current = [...current,step]   
        this.setState({
            messages: current
        })   
    }


    render() { 
        return (  
            <div className='container-fluid main_css'>
                <Header/>
                
                <div >
                    <div>
                        <div class="chat_window" id='mainchat'>
                            {/* Header */}
                            <div class="top_menu">
                                <div class="buttons">
                                    <div class="button close"></div>
                                    <div class="button minimize"></div>
                                    <div class="button maximize"></div>
                                </div>
                                <div class="title">Chat</div>
                            </div>
                            <MessageList messages={this.state.messages} user={this.state.user}/>
                            <Input onReceiveInput={this.onReceiveInput} onReceiveAnswer={this.onReceiveAnswer}/>
                        </div>
                        

                    </div>
                </div>
            </div>
        );
    }
}
 
export default Chat;