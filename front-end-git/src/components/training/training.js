import React, { Component } from 'react';
import '../../App.css'

//import component
import Question from './question';
import Intent from './intent';
import Entity from './entity';
import Action from './action';
// import Menu from './menu';

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import BotTraining from '../../helper/botTraining';

class Training extends Component {
    constructor(props){
        super(props)
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleSaveTraining = this.handleSaveTraining.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.addBotTraining = new BotTraining();
        this.state = {
            show: false,
            displayQuestion : [],
            displayIntent: '',
            actionName :'',
            disabled_default_answer : false,
            //du lieu de luu xuong database
            answer : '',
            defaultAnswer : '',
            question : '',
            intent : [],
            params : [],
            tag : []
        }
    }

    handleClose() {
        this.setState({ show: false });
    }

    handleShow() {
        this.setState({ show: true });
    }

    handleChange(e){
        this.setState({[e.target.name] : e.target.value})
    }

    onReciveQuestion=(data)=>{
        let step = [];
        step = [...step,data];
        this.setState({
            question: data,
            displayQuestion : step
        })
    }

    onReceiveKey=(data)=>{
        let step = this.state.params;
        step = [...step,data]
        this.setState({actionName : data})
        this.setState({
            params:step,
            tag : [...this.state.tag,'']
        })
    }

    onReceiveTag=(data,index)=>{
        let step = this.state.tag;
        step[index] = data
        this.setState({tag : step})
    }

    onReceiveIntent=(data)=>{
        let step = this.state.intent;
        step = [...step,data];
        this.setState(
            {
                intent : step
            }
        )
    }
    // Delete intent from data when click close intent form
    onReceiveIndexIntent=(index)=>{
        let step = this.state.intent
        step.splice(index,1)
        this.setState({
            intent: step
        })
    }
    // Delete entity from data when click close entity form
    onReceiveIndexEntity=(data)=>{
        const step_param = this.state.params;
        step_param.splice(data,1);
        console.log(step_param);
        const step_tag = this.state.tag;
        console.log(step_tag);
        step_tag.splice(data,1);
        this.setState({
            params : step_param,
            tag : step_tag
            // tag : step_tag,
        })

    }


    // save database
    handleSaveTraining(){
        var params =this.state.params;
        var intent = this.state.intent;
        var question = this.state.question;
        var answer = this.state.answer;
        var defaultAnswer = this.state.defaultAnswer;
        var tag = this.state.tag;
        var obj = {}
        obj.params = params ;
        obj.intent = intent ;
        obj.question = question;
        obj.answer =answer;
        obj.defaultAnswer = defaultAnswer;
        obj.tag = tag;

        console.log(obj);

        this.addBotTraining.sendData(obj);
        this.handleClose();
    }

    //Show and Hide Menu
    onMouseEnter=()=>{
        document.getElementById('main').style.marginLeft='250px';
    }
    onMouseLeave=()=>{
        document.getElementById('main').style.marginLeft='120px';
    }
    onReceiveMove=(event)=>{
        if(event === 'Enter'){
            this.onMouseEnter();
        }
        else if(event === 'Leave'){
            this.onMouseLeave();
        }

    }
    onReceiveCheckValid=(data)=>{
        console.log(data);

        if(data.status){
            let curr = data.message;
            // console.log(curr);
            // console.log(curr.entities.intent[0].value);
            let step_intent=[];
            step_intent=[...step_intent, curr.entities.intent[0].value];
            // console.log(curr.answer+ '   '+ curr.default_answer);
            this.setState({
                intent: step_intent,
                answer: curr.answer,
                defaultAnswer: curr.default_answer,
                disabled_default_answer : true

            })
            for ( let x in curr.entities){
                if(x !== "intent" && x!== 'msg_id' && x!=='_text'){
                  // console.log(x);
                    for(let i in curr.entities[x]){
                        this.setState({
                            params : [...this.state.params,x],
                            tag : [...this.state.tag,curr.entities[x][i].value]
                        })
                    }
                }
            }


        }
    }


    render() {


        return (
            <div className = 'main-form' id='main' role='tabpanel'aria-labelledby="pills-main-tab">
                <div>
                    <div className="tab-content" id="myTabContent">
                        <div className="main tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                            <div className='main'>
                                <p className="pl-3 pt-3">TEST HOW YOUR APP UNDERSTRANDS A SENTENCE</p>
                                <p className='pl-3'>You can train your app by adding more exemples</p>
                                <Question onReciveQuestion={this.onReciveQuestion}
                                        onReceiveCheckValid={this.onReceiveCheckValid}/>
                                <Intent onShowIntent = {this.state.intent}
                                        onReceiveIntent = {this.onReceiveIntent}
                                        displayAfterQuestion={this.state.displayQuestion}
                                        onReceiveIndexIntent={this.onReceiveIndexIntent}/>
                                <Entity onShowEntity = {this.state.params} //show entity after input data in action form
                                        onShowDataTag = {this.state.tag}
                                        onReceiveTag={this.onReceiveTag}
                                        onReceiveIndexEntity={this.onReceiveIndexEntity}/>
                                <Action onReceiveKey = {this.onReceiveKey}/>

                                <div className="bot float-right">
                                    <button type="button" className="btn btn-primary btn_learn">Learn</button>
                                    <Button variant="warning" onClick={this.handleShow}>
                                        Teach answer now
                                    </Button>
                                    <Modal
                                        show={this.state.show}
                                        onHide={this.handleClose}
                                        className="col-xs-6 modal"
                                        aria-labelledby="example-custom-modal-styling-title"
                                    >
                                        <Modal.Header closeButton>
                                        <Modal.Title id='example-custom-modal-styling-title'>Add answer</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <Form.Group controlId="formBasicPassword">
                                                <Form.Label >Answer</Form.Label>
                                                <Form.Control name='answer' onChange={(e)=>this.handleChange(e)} type="input" value={this.state.answer}/>
                                            </Form.Group>
                                            <Form.Group controlId="formBasicPassword">
                                                <Form.Label >Default Answer</Form.Label>
                                                <Form.Control id='default' name='defaultAnswer' type="text"  onChange={(e)=>this.handleChange(e)} value={this.state.defaultAnswer}
                                                                disabled={this.state.disabled_default_answer}
                                                />
                                            </Form.Group>

                                            </Modal.Body>
                                            <Modal.Footer>
                                            <Button variant="secondary" onClick={this.handleClose}>
                                                Close
                                            </Button>
                                            <Button variant="primary" onClick={this.handleSaveTraining}>
                                                Save Changes
                                            </Button>
                                            </Modal.Footer>
                                        </Modal>
                                </div>
                            </div>
                        </div>
                        <div className="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">b</div>
                    </div>

                </div>
            </div>
        );
    }
}

export default Training;
