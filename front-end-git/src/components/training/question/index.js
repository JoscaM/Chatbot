import React, { Component } from 'react';
import '../../../css/Component.css';
import logo from './image.jpg';
import BotTraining from '../../../helper/botTraining'
class Question extends Component {
    constructor(props){
        super(props);
        this.addBotTraining = new BotTraining();
        this.onEnterPress = this.onEnterPress.bind(this);
        //this.handleChange = this.handleChange.bind(this)
        this.state = {
            display : [],
            lastKeyTime : Date.now()
        }
    }
    async componentDidUpdate(prevProps,prevState){
        if (this.state.display!== prevState.display){
            let checkValid  = await this.addBotTraining.checkValid(this.state.display[0]);
            console.log(checkValid);
            if(checkValid.status){
                this.props.onReceiveCheckValid(checkValid);
            }
            console.log(checkValid);
        }
    }

    async onEnterPress(e){
        if((e.keyCode ===13 && e.shiftKey === false)  ){
            e.preventDefault();
            this.props.onReciveQuestion(e.target.value)
            this.setState({display : [...this.state.display,e.target.value]})
            document.getElementById('question').disabled = true;
        }
    }

    render() {
        return (
            <div className="form-group f1">
                <label/>
                {/* <i className="fa fa-pencil " aria-hidden="true"></i> */}
                <img src={logo} alt='' id='pencil'></img>
                <input  type="text"
                        className="form-control form-control-lg fc1"
                        name=""
                        id="question"
                        aria-describedby="helpId"
                        placeholder="User say..."
                        onKeyDown={this.onEnterPress}

                        />
                <small id="helpId" className="form-text text-muted ml-5">Maximum 255 characters long</small>
                <label/>
            </div>
        );
    }
}

export default Question;
