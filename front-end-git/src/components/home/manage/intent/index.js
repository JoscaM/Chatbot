import React, { Component } from 'react';
import '../../../../css/manage_home.css';
import botTraining from '../../../../helper/botTraining';
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import Alert from '../../../../helper/alert'

class IntentManage extends Component {
    constructor(props){
        super(props);
        this.addbotTrainning = new botTraining();
        this.addAlert = new Alert();
        this.state={
            index: -1,
            disabled: true,

            add_intent:'',

            pre_row:'',
            changerow:'',

            posts: [],
            intents : [],
            update : {
                id : '',
                oldId : '',
                value : []
            }
        }
    }

    async componentDidMount(){
        let data = await this.addbotTrainning.getIntents();
        console.log(data);
        
        if (data.status){
            this.setState({
                intents:data.message
            })
        }
        else {
            alert(data.message)
        }
    }

    async update(){
        let data = await this.addbotTrainning.getIntents();
        console.log(data);
        
        if (data.status){
            this.setState({
                intents:data.message
            })
        }
    }


    onEditIntent=(e,index)=>{
        // let prew = this.state.intents[index].value;
        // this.setState({
        //     index:index,
        //     pre_row : prew
        // })    
    }
    onDeleteIntent=(e,value)=>{
        // this.addAlert.alertDeleteConfirm(value)
        
    }
   
    onChangeRow(e,index){
        let array_data = [];        
        let ChangeRow = e.target.value
        array_data = this.state.intents;
        array_data[index].value = e.target.value;        
        this.setState({
            intents: array_data,
            changerow : ChangeRow,
        })
    }
    async onChangeValue(e,index){
        if( this.state.changerow !== this.state.pre_row){
            let update = this.state.update
            update.id = this.state.changerow ;
            update.oldId = this.state.pre_row
            await this.setState({ update : update })
            let current = await this.addbotTrainning.updateIntent(this.state.update);
            if(current.status){
                await this.update(); //update
                this.addAlert.alertSuccess(current.message);
                document.getElementById(index).disabled=true;
                document.getElementById(index+'save').classList.add('d-none')                
            }
            else {
                await this.update();//update
                this.addAlert.alertError('Training fail!')
            }
        }
    }

    onChangeAddIntent=(e)=>{
        this.setState({
            add_intent:e.target.value
        })
    }
    onAddIntent=()=>{
        console.log(this.state.add_intent);
        this.addbotTrainning.postEntitiy(this.state.add_intent)
        document.getElementById('addinput').value=''
    }
    async componentDidUpdate(){
    }


    render() {      
        const columns = [
            {
                Header: 'Value',
                id: 'row',
                accessor: 'value',
                Cell: ({value,index})=>(
                    <form>
                         <input id={index} onChange={(e)=>this.onChangeRow(e,index)} placeholder=""
                                disabled={this.state.index===index ? !this.state.disabled:this.state.disabled} 
                                autoFocus={true}
                                value = {value}
                         ></input>
                        <input  type='Submit' value='Save' id={index+'save'}
                            className={this.state.index===index ? 'btn btn-info btn-xs savebutton' : 'btn btn-info btn-xs savebutton d-none'}    
                            onClick={e=>this.onChangeValue(e,index)}
                        ></input>
                    </form>
                ),

                filterable: true,
                headerStyle:{
                    fontSize: 20,
                    height: '50px',
                    marginTop: '7px'
                },
                style:{
                    fontSize: 18,
                    textAlign: 'center',
                    width: 300 
                },
            },
            {
                Header: 'Action',
                id: 'row',
                accessor : 'value',
                Cell: ({value,index}) =>(
                    <div className='action-col'>
                        <a  class='btn btn-info btn-xs' 
                            href="#top"
                            onClick={e => this.onEditIntent(e,index)}
                ><span class="glyphicon glyphicon-edit"></span>Edit</a>
                        {/* <p>{value}</p>  */}
                        <a  href="#top" 
                            class="btn btn-danger btn-xs"
                            onClick={e=>this.onDeleteIntent(e,value)}
                            ><span class="glyphicon glyphicon-remove"></span> Del</a>
                    </div>
    
                    ),
                    headerStyle:{
                        fontSize: 20,   
                        marginTop: '7px'
                    },
                    style:{
                        fontSize: 18,
                        textAlign: 'center',
                        width: '25%',
                    },  
            }
        ]
        return (
            <div>
                <div className='divhead'>
                    <h1>Intent</h1>
                    <div className="input-container">
                        <input className="input-field" id='addinput' type="text" placeholder="Intent" name="usrnm" onChange={this.onChangeAddEntity}/>
                        <button className='btn btn-info' type='button' value='Add Intent' onClick={this.onAddIntent}>Add Entity</button>
                    </div>
                </div>
                <ReactTable
                columns={columns}
                data={this.state.intents}
                defaultPageSize={10}
                style={{
                     height: "500px" 
                }}
                defaultSorted={[
                ]}
            >
            
            </ReactTable>
            </div>
        )
      }
}
 
export default IntentManage;

