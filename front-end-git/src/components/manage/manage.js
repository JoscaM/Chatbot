import React, { Component } from 'react';
import '../../App.css';
import Header from '../header';
import '../../css/manageQuestion.css'
import BotTraining from '../../helper/botTraining'
// import Question_Manage from './question';
// import Question from '../training/question';
import Alert from '../../helper/alert'

class Manage extends Component {
    constructor(props){
        super(props);
        this.addbotTraining = new BotTraining();
        this.update =this.update.bind(this);
        this.alert = new Alert();
        this.state={
            data: []
        }
    }
    async componentDidMount(){
        let data = await this.addbotTraining.getSamples();
        if (data.status){
            console.log(data.message[0]);
            this.setState({
                data: data
            })
        }
    }
    async update(){
        let data = await this.addbotTraining.getSamples();
        if (data.status){
            console.log(data.message[0]);
            this.setState({
                data: data
            })
        }
    }

    renderQuestion=()=>{
        let list_question;
        
        
        if(this.state.data.message!== undefined ){
            console.log(this.state.data.message);
            list_question = this.state.data.message.map((item,index)=>{
                return  <div className="card">
                            <div className="card-header" id="headingOne">
                                <i className="fa fa-plus" aria-hidden="true" onClick={(e)=>{this.onShowContent(e,index)}}></i>
                                <h2>{item.question}</h2>
                                {/* <h5 className="mb-0">
                                    <button className="btn btn-link" data-toggle="collapse" data-target={"#"+ index} aria-expanded="true" aria-controls="collapseOne">
                                    {item.question}
                                    </button>
                                </h5> */}
                                <i className="fa fa-trash" aria-hidden="true" onClick={(e)=>{this.onDeleteQuestion(e,item.question)}}></i>
                            </div>

                            <div id={index} className="collapse" aria-labelledby="headingOne" data-parent="#accordion">
                                <div className="card-body">
                                    <div className='intent'>
                                        <div className='name'>Intent</div>
                                        
                                        <div>{item.intent === '' ?'-':item.intent}</div>
                                    </div>
                                    <div className='entity'>
                                        <div>Entities</div>
                                        <div>
                                            <table class="table">
                                                <thead>
                                                    <tr>
                                                        <th>Name</th>
                                                        <th>Value</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {item.entities.map(element =>
                                                        <tr>
                                                            <td>{element.name}</td>
                                                            <td>{element.value}</td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
            })
        }
        return list_question
    }

    onShowContent(e,index){
        document.getElementById(index).classList.toggle('show')
        console.log(index);
    }
    async onDeleteQuestion(e,question){
        let deleteRes = await this.addbotTraining.deleteSample(question);
        if(deleteRes.status){
            await this.update();
            this.alert.alertSuccess(deleteRes.message)
            
        }
        else{
            await this.update();
            this.alert.alertError(deleteRes.message);
            
        }
        
    }

    // Search Question
    onChange=(e)=>{

    }
    
    render() { 
        console.log(this.state.data);
        
        return (  
            <div className='container-fluid main_css'>
                <Header/>  
                <div className='body'>
                    <div className='body_question'>
                        <h1>Question Manage</h1>
                        <div className="input-container">
                            <input className="input-field" id='addinput' type="text" placeholder="Entity" name="usrnm" onChange={this.onChange}/>
                            <button className='btn btn-info' type='button' value='Add Entity'>Add Question</button>
                        </div>
                        <div className='list_question'>

                            <div id="accordion">
                                {this.renderQuestion()}
                            </div>

                        </div>
                    </div>
                </div>             
               
            </div>
        );
    }
}
 
export default Manage;