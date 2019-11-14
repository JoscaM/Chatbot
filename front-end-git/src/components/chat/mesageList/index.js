import React, { Component } from 'react';
import '../../../css/chat.css'
import MessageItem from '../messageItem/'

class MessageList extends Component {
    
    // updateScroll=()=>{
    //     let element = document.getElementById('list');
    //     element.scrollTop = element.scrollHeight; 
    // }
    
    
    render() { 
        
        return (  
            <div className='list'>
                <div className="scrollbar" id="style-1" >
                    <div className="force-overflow" >
                    <ul className="messages" >                  
                        {this.props.messages.map(item =>
                            <MessageItem messages={item.message} user={item.user}/>
                            // {this.scrollToBottom}
                        )}   
                    </ul>
                    </div>
                        
                </div>
                
            </div>
        );
    }
}
 
export default MessageList;
